# TanStack Start + Varlock Example

This example demonstrates [Varlock](https://varlock.dev) integration with [TanStack Start](https://tanstack.com/start), showing type-safe env var access, sensitive value leak detection, and support for both Node.js and Cloudflare Workers deployment.

## Quick Start

```bash
pnpm install
pnpm dev        # Node.js mode
pnpm dev:cf     # Cloudflare Workers mode
```

## Varlock Setup

### Node.js / generic Vite

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { varlockVitePlugin } from '@varlock/vite-integration'
import viteReact from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    varlockVitePlugin(),
    tanstackStart(),
    viteReact(),
  ],
})
```

### Cloudflare Workers

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { varlockCloudflareVitePlugin } from '@varlock/cloudflare-integration'
import viteReact from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    varlockCloudflareVitePlugin({ viteEnvironment: { name: 'ssr' } }),
    tanstackStart(),
    viteReact(),
  ],
})
```

### Accessing env vars

```ts
import { ENV } from 'varlock/env'

// server-side — all vars available (including sensitive)
console.log(ENV.SENSITIVE_VAR)

// client-side — only public vars, sensitive access causes a build error
console.log(ENV.PUBLIC_ITEM)
```

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Dev server (Node.js) |
| `pnpm build` | Production build (Node.js) |
| `pnpm preview` | Preview production build |
| `pnpm dev:cf` | Dev server (Cloudflare Workers) |
| `pnpm build:cf` | Production build (Cloudflare Workers) |
| `pnpm deploy:cf` | Deploy to Cloudflare Workers |

## What the example demonstrates

- **Client-side env** — public vars inlined at build time, sensitive vars blocked with build errors
- **Server loader** — all env vars accessible in route loaders
- **Server action** — env var access via `createServerFn()`
- **API route** — env var access in GET route handlers
- **Leak detection** — each server page has a "test leak" button that intentionally returns a sensitive value, caught by varlock's response leak scanner
