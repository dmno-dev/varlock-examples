import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

const tests = [
  {
    to: '/client-env' as const,
    title: 'Client-Side Env',
    description:
      'Public vars statically replaced on the client, sensitive vars blocked.',
  },
  {
    to: '/server-loader' as const,
    title: 'Server Loader',
    description:
      'All env vars available in server loaders via varlock ENV, cloudflare env, and import.meta.env.',
  },
  {
    to: '/server-action' as const,
    title: 'Server Actions',
    description:
      'Env var access via createServerFn() server actions.',
  },
  {
    to: '/api-route' as const,
    title: 'API Route Handlers',
    description:
      'Env var access via GET route handlers.',
  },
]

function HomePage() {
  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <h1 className="display-title mb-3 text-3xl font-bold text-[var(--sea-ink)]">
        Varlock + Cloudflare Integration Tests
      </h1>
      <p className="mb-8 text-[var(--sea-ink-soft)]">
        Test env var behavior across different TanStack Start contexts.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {tests.map((test) => (
          <Link
            key={test.to}
            to={test.to}
            className="island-shell block rounded-2xl p-6 no-underline transition hover:shadow-md"
          >
            <h2 className="mb-2 text-lg font-semibold text-[var(--sea-ink)]">
              {test.title}
            </h2>
            <p className="m-0 text-sm text-[var(--sea-ink-soft)]">
              {test.description}
            </p>
          </Link>
        ))}
      </div>
    </main>
  )
}
