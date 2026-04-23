import type { NextConfig } from "next";
import path from "node:path";
import { varlockNextConfigPlugin } from '@varlock/nextjs-integration/plugin';

import { ENV } from "varlock/env";

console.log('log from next.config.ts', ENV.SECRET_FOO);

console.log(require.resolve('varlock/env'));

const nextConfig: NextConfig = {
  /* config options here */
  // output: 'export',
  // output: 'standalone',

  turbopack: {
    // YOU WONT NORMALLY NEED THIS
    root: path.resolve(__dirname, '../../..'), // needed when using symlinked varlock
    // root: __dirname // otherwise use this - because we are within nested repos
  }
};

// export default nextConfig;
export default varlockNextConfigPlugin()(nextConfig);
