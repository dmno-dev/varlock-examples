import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import * as path from "node:path";

const MODE: 'local' | 'published' = process.argv[2] === 'published' ? 'published' : 'local';

type WorkspacePackagesInfo = Array<{
  "name": string,
  "version": string,
  "path": string,
  "private": boolean
}>

// first we gather info about our published varlock packages from our local varlock monorepo
// which must live in a folder named `varlock` as a sibling to this examples repo
// COREPACK_ENABLE_STRICT=0 is needed because the varlock repo declares bun as its packageManager
const varlockLsOutput = execSync(`cd ../varlock && COREPACK_ENABLE_STRICT=0 pnpm m ls --json --depth=-1 2>/dev/null`, { encoding: 'utf-8' });
// pnpm outputs multiple JSON arrays (one per workspace package) when the workspace
// uses the "workspaces" field instead of pnpm-workspace.yaml — merge them into one
const varlockPackagesInfo: WorkspacePackagesInfo = Array.prototype.concat(
  ...varlockLsOutput.trim().split(/\n(?=\[)/).map((chunk) => JSON.parse(chunk)),
);
const pulishedPackages = varlockPackagesInfo.filter((pkgInfo) => !pkgInfo.private);
const varlockPackages = pulishedPackages.map((pkgInfo) => ({
  name: pkgInfo.name,
  publishedVersion: pkgInfo.version,
  localPath: pkgInfo.path,
}));
const varlockPackagesByName = Object.fromEntries(varlockPackages.map((pkg) => [pkg.name, pkg]));

// add some settings for how to handle specific dependency overrides
const OVERRIDES: Record<string, string> = {
  '@next/env': '@varlock/nextjs-integration',
  'dotenv': 'varlock',
};



// now we find all the examples and package.json files that must be updated
const workspacePackagesInfo: WorkspacePackagesInfo = JSON.parse(execSync(`pnpm m ls --json --depth=-1`).toString());
for (const workspacePackage of workspacePackagesInfo) {
  const packageDir = workspacePackage.path;
  const packageJsonPath = path.join(packageDir, "package.json");
  const packageJsonContents = JSON.parse(readFileSync(packageJsonPath, "utf-8"));


  function updateDeps(depsObj: Record<string, string> | undefined) {
    if (!depsObj) return;
    for (const [depName, depVersion] of Object.entries(depsObj)) {
      if (!(depName in varlockPackagesByName)) continue;

      const varlockPkg = varlockPackagesByName[depName];
      if (MODE === 'published') {
        depsObj[depName] = `^${varlockPkg.publishedVersion}`;
      } else if (MODE === 'local') {
        depsObj[depName] = `link:${path.relative(packageDir, varlockPkg.localPath)}`;
      }
    }
  }

  updateDeps(packageJsonContents.dependencies);
  updateDeps(packageJsonContents.devDependencies);

  // also need to update overrides
  for (const overrideFrom of Object.keys(packageJsonContents?.pnpm?.overrides as Record<string, string> || {})) {
    if (!(overrideFrom in OVERRIDES)) continue;

    const overrideToVarlockPkgName = OVERRIDES[overrideFrom];
    const varlockPkg = varlockPackagesByName[overrideToVarlockPkgName];
    if (!varlockPkg) throw new Error('Expected to find varlock package for override target: ' + overrideToVarlockPkgName);``
    if (MODE === 'published') {
      packageJsonContents.pnpm.overrides[overrideFrom] = `npm:${overrideToVarlockPkgName}`;
    } else if (MODE === 'local') {
      packageJsonContents.pnpm.overrides[overrideFrom] = `link:${path.relative(packageDir, varlockPkg.localPath)}`;
    }
  }

  // write the updated package.json
  writeFileSync(packageJsonPath, JSON.stringify(packageJsonContents, null, 2) + "\n", "utf-8");
}

// run pnpm install to activate and update lockfile
execSync('pnpm install', { stdio: 'inherit' });
