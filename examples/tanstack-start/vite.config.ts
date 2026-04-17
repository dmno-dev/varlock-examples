import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import tsconfigPaths from 'vite-tsconfig-paths'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { varlockCloudflareVitePlugin, resolvedEnvVars } from '@varlock/cloudflare-integration';
import { ENV } from 'varlock/env'

console.log('vite.config.ts log sensitive var:', ENV.SENSITIVE_VAR);


const config = defineConfig({
  plugins: [
    // varlockVitePlugin() as any,
    varlockCloudflareVitePlugin({
      viteEnvironment: { name: "ssr" },
    }) as any,
    tanstackStart(),
    // devtools(),
    tailwindcss(),
    viteReact(),
    tsconfigPaths({ projects: ['./tsconfig.json'] }),
  ],
})

export default config
