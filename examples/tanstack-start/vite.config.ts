import path from 'node:path'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// you wont need both of these imported
import { varlockVitePlugin } from '@varlock/vite-integration'
import { varlockCloudflareVitePlugin } from '@varlock/cloudflare-integration'


import { ENV } from 'varlock/env'

const useCloudflare = process.env.USE_CF === '1';

// env vars are available here in your vite.config
console.log('vite.config.ts log sensitive var:', ENV.SENSITIVE_VAR);
console.log('deploy target:', useCloudflare ? 'cloudflare' : 'node');

export default defineConfig({
  plugins: [
    (useCloudflare
      // 🟠 USE THIS FOR CLOUDFLARE
      ? varlockCloudflareVitePlugin({ viteEnvironment: { name: 'ssr' } })
      // 🟢 OR THIS OTHERWISE
      : varlockVitePlugin()),
    tanstackStart(),
    tailwindcss(),
    viteReact(),
    tsconfigPaths({ projects: ['./tsconfig.json'] }),
  ],

  // ⬇️ You don't need any of this...
  // its supports the example working for both Cloudflare and Node.js
  define: {
    __USE_CF__: useCloudflare,
  },
  resolve: {
    alias: {
      // stub out cloudflare:workers imports when not targeting Cloudflare
      ...(!useCloudflare && {
        'cloudflare:workers': path.resolve(__dirname, 'src/cf-stub.ts'),
      }),
    },
  },
})
