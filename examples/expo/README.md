# Varlock + Expo Example

A minimal [Expo](https://expo.dev) app demonstrating [varlock](https://varlock.dev) integration with:

- **Babel plugin** — replaces non-sensitive `ENV.xxx` references at compile time
- **Metro config wrapper** — initializes the `ENV` proxy for server routes (`+api` files)
- **Sensitive value protection** — `@sensitive` values are only accessible in server routes, never inlined into the client bundle
- **Console log redaction** — sensitive values are automatically redacted from logs

## Setup

```bash
npm install
npx expo start --web
```

> **Note:** Expo's Metro bundler does not work well with pnpm's default `isolated` linker. If using pnpm, add `node-linker=hoisted` to your `.npmrc`. See the [Expo docs on monorepos](https://docs.expo.dev/guides/monorepos/) for details.

## What's inside

| File | Purpose |
|---|---|
| `.env.schema` | Defines `APP_NAME`, `API_URL` (non-sensitive) and `SECRET_KEY` (sensitive) |
| `babel.config.js` | Registers the varlock Babel plugin |
| `metro.config.js` | Wraps Metro config with `withVarlockMetroConfig` |
| `app/index.tsx` | Home screen showing inlined values and interactive demos |
| `app/env+api.ts` | Server route that accesses sensitive values via the `ENV` proxy |

## Learn more

- [Varlock Expo integration docs](https://varlock.dev/integrations/expo/)
- [Expo Router API routes](https://docs.expo.dev/router/reference/api-routes/)
