import type { GatsbyNode } from 'gatsby';
import fs from 'node:fs';
import path from 'node:path';
import { scanForLeaks, varlockSettings } from 'varlock/env';

// Scan all static build output for leaked sensitive env vars.
// Gatsby is a static site generator, so all output lands in public/ as
// HTML and JS files. If any sensitive value appears, the build is aborted.
export const onPostBuild: GatsbyNode['onPostBuild'] = async () => {
  if (varlockSettings.preventLeaks === false) return;

  const outDir = path.resolve('public');
  const leakedFiles: string[] = [];

  for await (const file of fs.promises.glob(`${outDir}/**/*.{html,js}`)) {
    const contents = await fs.promises.readFile(file, 'utf8');
    try {
      scanForLeaks(contents, { method: 'gatsby post-build scan', file });
    } catch (_err) {
      leakedFiles.push(file);
    }
  }

  if (leakedFiles.length > 0) {
    throw new Error(
      `Build aborted: ${leakedFiles.length} file(s) contain leaked sensitive config`,
    );
  }
};
