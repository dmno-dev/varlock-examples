# Varlock + Cloudflare Workers (Vite) Example

This example shows how to integrate [Varlock](https://varlock.dev) with a [Cloudflare Workers](https://developers.cloudflare.com/workers/) application using the [Workers Vite plugin](https://developers.cloudflare.com/workers/vite-plugin/).

This may seem strange to use Vite in a backend-only project, but Vite's environments feature is exactly meant to help with this kind of scenario, and is why Cloudflare built their new workers tooling on top of it.

From the docs on choosing wrangler vs the vite plugin:
> Due to Vite's advanced configuration options and large ecosystem of plugins, there is more flexibility to customize your development experience and build output

> For the simpler wrangler-only approach (no Vite), see the [`cloudflare-workers-simple`](../cloudflare-workers-simple) example instead.

## Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Run the dev server:
   ```bash
   pnpm dev
   ```

3. Visit the worker URL to see it in action. Add `?leak` to the URL to trigger leak prevention.

## How it works

The `vite.config.ts` uses `varlockCloudflareVitePlugin()` from `@varlock/cloudflare-integration`. This plugin wraps Cloudflare's Vite plugin internally, so you don't need to add it separately. Config is resolved and injected at build time.

```typescript
import { varlockCloudflareVitePlugin } from "@varlock/cloudflare-integration";

export default defineConfig({
  plugins: [
    varlockCloudflareVitePlugin(),
  ],
});
```

You can even use env vars in the Vite config itself:

```typescript
import { ENV } from 'varlock/env';
console.log(ENV.SOME_VAR); // works in vite.config.ts
```

## Deployment

The package.json includes build and deploy scripts. Config is resolved at build time, so any env vars and secrets set in the Cloudflare dashboard will be available during the build.

If you are relying on [Cloudflare's workers builds](https://developers.cloudflare.com/workers/ci-cd/builds/) system, you might want to set your current environment based on the current branch name, injected as `WORKERS_CI_BRANCH`. For example:

```
# @currentEnv=$APP_ENV
# ---

# current branch name as injected via Workers CI system, will be empty running locally
WORKERS_CI_BRANCH=

# current environment flag, set based on current branch passed in from CI
# @type=enum(dev, preview, prod, test)
APP_ENV=if(eq($WORKERS_CI_BRANCH, main), prod, if($WORKERS_CI_BRANCH, preview, dev))
```
