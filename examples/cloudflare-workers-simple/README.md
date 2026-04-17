# Varlock + Standalone Cloudflare Worker Example

This example shows how to integrate [Varlock](https://varlock.dev) with a basic [Cloudflare Workers](https://developers.cloudflare.com/workers/) application using wrangler directly (no Vite).

We use the [Varlock Cloudflare integration](https://varlock.dev/integrations/cloudflare/) which provides a `varlock-wrangler` CLI wrapper that resolves your env config and injects it into wrangler's `.dev.vars` system.

```typescript
import { ENV } from 'varlock/env';

console.log(ENV.SOME_VAR); // works, even outside of a request
```

> If you want to use the Vite-based Cloudflare Workers setup, see the `cloudflare-workers-vite` example instead.

## Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Run the dev server:
   ```bash
   pnpm dev
   ```

3. Visit the worker URL (usually `http://localhost:8787`) to see it in action. Add `?leak` to the URL to trigger leak prevention.

## How it works

The `@varlock/cloudflare-integration` package provides:

- **`varlock-wrangler`** — a CLI wrapper around `wrangler` that resolves your `.env.schema` and injects the resolved values as wrangler bindings
- **`@varlock/cloudflare-integration/init`** — an import that enables log redaction and leak prevention in the worker runtime

Your worker entry point should import the init module at the top:

```typescript
import '@varlock/cloudflare-integration/init';
import { ENV } from 'varlock/env';
```

## Deployment

The package.json includes a deploy script that uses `varlock-wrangler deploy` to resolve config and deploy the worker.

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
