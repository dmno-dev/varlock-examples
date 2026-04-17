# SvelteKit + Varlock Example

This example demonstrates using [Varlock](https://varlock.dev) with a [SvelteKit](https://svelte.dev/docs/kit/introduction) app. It is set up so the same project can be used for **both a regular (Node/auto adapter) deployment and a Cloudflare Workers deployment** — no need to maintain two separate examples.

The adapter is selected at build/dev time via the `SVELTE_ADAPTER` env var (see [svelte.config.js](svelte.config.js)):

- _default_ → `@sveltejs/adapter-auto` (regular deployment)
- `cloudflare` → `@sveltejs/adapter-cloudflare`


[*DEPLOYED CLOUDFLARE WORKER*](https://sveltekit-varlock-example.dmno.workers.dev/)


## Developing

Install dependencies with `pnpm install`, then start the dev server.

### Regular (adapter-auto)

```sh
pnpm dev
```

### Cloudflare Workers

```sh
pnpm dev:cf
```

## Building

### Regular

```sh
pnpm build
pnpm preview
```

### Cloudflare Workers

```sh
pnpm build:cf
pnpm preview:cf

# deploy via wrangler (wrapped by varlock)
pnpm deploy:cf
```



## Further reading

- [SvelteKit adapters](https://svelte.dev/docs/kit/adapters)
- [Varlock docs](https://varlock.dev)

