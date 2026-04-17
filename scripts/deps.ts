import { execSync } from "node:child_process";
import { readFileSync, readdirSync, existsSync, writeFileSync } from "node:fs";
import * as path from "node:path";
import { listWorkspaces } from "../../varlock/scripts/list-workspaces.ts";

const rawArgs = process.argv.slice(2);
const force = rawArgs.includes('--force');
const args = rawArgs.filter((a) => a !== '--force');
const MODE: 'local' | 'published' = args[0] === 'published' ? 'published' : 'local';
// optional filter args - only update matching example dirs (matched by folder name substring)
const filters = args.slice(1);

// first we gather info about our published varlock packages from our local varlock monorepo
// which must live in a folder named `varlock` as a sibling to this examples repo
const varlockMonorepoRoot = path.resolve(import.meta.dirname, '../../varlock');
const varlockPackagesInfo = await listWorkspaces(varlockMonorepoRoot);
const pulishedPackages = varlockPackagesInfo.filter((pkgInfo) => {
  const pkgJson = JSON.parse(readFileSync(path.join(pkgInfo.path, 'package.json'), 'utf-8'));
  return !pkgJson.private;
});
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

// now we find all the example package dirs (examples/* and examples/plugins/*)
const repoRoot = path.resolve(import.meta.dirname, '..');
const examplesDir = path.join(repoRoot, 'examples');
const exampleDirs: Array<string> = [];
for (const entry of readdirSync(examplesDir, { withFileTypes: true })) {
  if (!entry.isDirectory() || entry.name === 'node_modules') continue;
  const dir = path.join(examplesDir, entry.name);
  if (entry.name.startsWith('plugins')) {
    // plugins*/* are nested example packages
    for (const pluginEntry of readdirSync(dir, { withFileTypes: true })) {
      if (!pluginEntry.isDirectory() || pluginEntry.name === 'node_modules') continue;
      const pluginDir = path.join(dir, pluginEntry.name);
      if (existsSync(path.join(pluginDir, 'package.json'))) exampleDirs.push(pluginDir);
    }
  } else {
    if (existsSync(path.join(dir, 'package.json'))) exampleDirs.push(dir);
  }
}
const filteredDirs = filters.length
  ? exampleDirs.filter((dir) => {
    const name = path.basename(dir);
    return filters.some((f) => name.includes(f));
  })
  : exampleDirs;

const changedDirs: Array<string> = [];

for (const packageDir of filteredDirs) {
  const packageJsonPath = path.join(packageDir, "package.json");
  const originalContents = readFileSync(packageJsonPath, "utf-8");
  const packageJsonContents = JSON.parse(originalContents);

  function updateDeps(depsObj: Record<string, string> | undefined) {
    if (!depsObj) return;
    for (const [depName, depVersion] of Object.entries(depsObj)) {
      if (!(depName in varlockPackagesByName)) continue;
      // skip pkg.pr.new preview URLs unless --force is passed
      if (!force && depVersion.includes('pkg.pr.new')) continue;

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
    if (!varlockPkg) throw new Error('Expected to find varlock package for override target: ' + overrideToVarlockPkgName);
    if (MODE === 'published') {
      packageJsonContents.pnpm.overrides[overrideFrom] = `npm:${overrideToVarlockPkgName}`;
    } else if (MODE === 'local') {
      packageJsonContents.pnpm.overrides[overrideFrom] = `link:${path.relative(packageDir, varlockPkg.localPath)}`;
    }
  }

  const newContents = JSON.stringify(packageJsonContents, null, 2) + "\n";
  if (newContents !== originalContents) {
    writeFileSync(packageJsonPath, newContents, "utf-8");
    changedDirs.push(packageDir);
  }
}

// run pnpm install in each changed package to update lockfiles
for (const dir of changedDirs) {
  const name = path.relative(repoRoot, dir);
  console.log(`pnpm install in ${name}...`);
  execSync('pnpm install', { cwd: dir, stdio: 'inherit' });
}
