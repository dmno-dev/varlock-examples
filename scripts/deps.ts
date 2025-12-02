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
const varlockPackagesInfo: WorkspacePackagesInfo = JSON.parse(execSync(`cd ../varlock && pnpm m ls --json --depth=-1`).toString());
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
