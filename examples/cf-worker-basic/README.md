# Varlock + Standalone Cloudflare Worker Example

This example shows how to integrate [Varlock](https://varlock.dev) with a basic [Cloudflare Workers](https://developers.cloudflare.com/workers/) application.

We use the [Workers Vite plugin](https://developers.cloudflare.com/workers/vite-plugin/) along with the [Varlock Vite integration](https://varlock.dev/integrations/vite/) to do so. This may seem strange to use vite in a backend-only project, but Vite's new environments feature is exactly meant to help with this kind of scenario, and is why Cloudflare built their new workers tooling on top of it.

From the docs on choosing wrangler vs the vite plugin:
`Due to Vite's advanced configuration options and large ecosystem of plugins, there is more flexibility to customize your development experience and build output`

Please note - using this setup, config is resolved and injected at build time - similar to how OpenNext works on Cloudflare.

Any env vars and secrets you set in the cloudflare dashboard will be available during the build, and will be injected properly, along with any data that is only defined in your .env files. However, we do not re-inject the resolved config back into Cloudflare's secrets system, so the normal way of accessing env vars in Cloudflare Workers will not work. Instead you should use the `ENV` object from `varlock/env`.

```typescript
import { ENV } from 'varlock/env';

console.log(ENV.SOME_VAR); // works, even outside of a request
```

If you really need to be able to inject the resolved secrets back into cloudlfare's system, please let us know on [Discord](https://chat.dmno.dev).

## Deployment

The package.json script includes a deploy command, which would work if you were manually deploying this worker.

However if you are relying on [Cloudflare's workers builds](https://developers.cloudflare.com/workers/ci-cd/builds/) system, you might want to set your current environment based on the current branch name, injected as `WORKERS_CI_BRANCH`. For example:

```
# @currentEnv=$APP_ENV
# ---

# current branch name as injected via Workers CI system, will be empty running locally
WORKERS_CI_BRANCH=

# current environment flag, set based on current branch passed in from CI
# @type=enum(dev, preview, prod, test)
APP_ENV=if(eq($WORKERS_CI_BRANCH, main), prod, if($WORKERS_CI_BRANCH, preview, dev))
```