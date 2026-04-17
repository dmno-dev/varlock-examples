import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { ENV } from 'varlock/env'
import { env } from 'cloudflare:workers'

declare const __USE_CF__: boolean

export const Route = createFileRoute('/server-loader')({
  validateSearch: (search: Record<string, unknown>) => ({
    leak: search.leak === 'true' || search.leak === true,
  }),
  loaderDeps: ({ search }) => ({ leak: search.leak }),
  loader: ({ deps }) => deps.leak ? getServerEnvDataWithLeak() : getServerEnvData(),
  component: ServerLoaderPage,
})

function redact(val: string | undefined) {
  if (val === undefined || val === null) return { set: false, length: 0 }
  return { set: true, length: val.length }
}

function getEnvVars() {
  return {
    SENSITIVE_VAR: {
      varlock: redact(ENV.SENSITIVE_VAR),
      processEnv: redact(process.env.SENSITIVE_VAR),
      ...(__USE_CF__ && { cloudflare: redact(env.SENSITIVE_VAR) }),
      importMeta: redact(import.meta.env.SENSITIVE_VAR),
    },
    ANOTHER_SECRET: {
      varlock: redact(ENV.ANOTHER_SECRET),
      processEnv: redact(process.env.ANOTHER_SECRET),
      ...(__USE_CF__ && { cloudflare: redact(env.ANOTHER_SECRET) }),
      importMeta: redact(import.meta.env.ANOTHER_SECRET),
    },
    PUBLIC_ITEM: {
      varlock: redact(ENV.PUBLIC_ITEM),
      processEnv: redact(process.env.PUBLIC_ITEM),
      ...(__USE_CF__ && { cloudflare: redact(env.PUBLIC_ITEM) }),
      importMeta: redact(import.meta.env.PUBLIC_ITEM),
    },
    PUBLIC_OTHER: {
      varlock: redact(ENV.PUBLIC_OTHER),
      processEnv: redact(process.env.PUBLIC_OTHER),
      ...(__USE_CF__ && { cloudflare: redact(env.PUBLIC_OTHER) }),
      importMeta: redact(import.meta.env.PUBLIC_OTHER),
    },
    VITE_PREFIXED_ITEM: {
      varlock: redact(ENV.VITE_PREFIXED_ITEM),
      processEnv: redact(process.env.VITE_PREFIXED_ITEM),
      ...(__USE_CF__ && { cloudflare: redact(env.VITE_PREFIXED_ITEM) }),
      importMeta: redact(import.meta.env.VITE_PREFIXED_ITEM),
    },
  }
}

const getServerEnvData = createServerFn({ method: 'GET' }).handler(() => {
  return { leaked: undefined as string | undefined, vars: getEnvVars() }
})

const getServerEnvDataWithLeak = createServerFn({ method: 'GET' }).handler(() => {
  return { leaked: ENV.SENSITIVE_VAR as string | undefined, vars: getEnvVars() }
})

type RedactedInfo = { set: boolean; length: number }
type VarRow = { varlock: RedactedInfo; processEnv: RedactedInfo; cloudflare?: RedactedInfo; importMeta: RedactedInfo }

function ServerLoaderPage() {
  const data = Route.useLoaderData()
  const { leak } = Route.useSearch()
  const navigate = useNavigate()

  const varNames = ['SENSITIVE_VAR', 'ANOTHER_SECRET', 'PUBLIC_ITEM', 'PUBLIC_OTHER', 'VITE_PREFIXED_ITEM'] as const
  const firstRow = data.vars[varNames[0]] as VarRow
  const showCf = 'cloudflare' in firstRow

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <h1 className="display-title mb-6 text-3xl font-bold text-[var(--sea-ink)]">
        Server Loader Env Vars
      </h1>
      <p className="mb-6 text-[var(--sea-ink-soft)]">
        All env vars (including sensitive) should be accessible in the server
        loader. Values are redacted — only showing whether they are set and their length.
      </p>

      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate({ to: '/server-loader', search: { leak: !leak } })}
          className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 ${
            leak ? 'bg-red-600' : 'bg-[var(--lagoon)]'
          }`}
        >
          {leak ? 'Leak ON — click to disable' : 'Test leak detection'}
        </button>
      </div>

      {data.leaked !== undefined && (
        <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
          <p className="text-sm font-medium text-red-800 dark:text-red-200">
            Leaked SENSITIVE_VAR: <code className="font-mono">{data.leaked}</code>
          </p>
        </div>
      )}

      <section className="island-shell rounded-2xl p-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--line)]">
              <th className="py-2 pr-4">Variable</th>
              <th className="py-2 pr-4 font-mono text-xs"><code>ENV</code> (varlock)</th>
              <th className="py-2 pr-4 font-mono text-xs"><code>process.env</code></th>
              {showCf && <th className="py-2 pr-4 font-mono text-xs"><code>env</code> (cloudflare)</th>}
              <th className="py-2 font-mono text-xs"><code>import.meta.env</code></th>
            </tr>
          </thead>
          <tbody>
            {varNames.map((name) => {
              const row = data.vars[name] as VarRow
              return (
                <tr key={name} className="border-b border-[var(--line)]">
                  <td className="py-2 pr-4 font-mono text-xs font-semibold">
                    {name}
                  </td>
                  <td className="py-2 pr-4"><RedactedCell info={row.varlock} /></td>
                  <td className="py-2 pr-4"><RedactedCell info={row.processEnv} /></td>
                  {showCf && <td className="py-2 pr-4"><RedactedCell info={row.cloudflare} /></td>}
                  <td className="py-2"><RedactedCell info={row.importMeta} /></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </main>
  )
}

function RedactedCell({ info }: { info: RedactedInfo | undefined }) {
  if (!info) return <span className="font-mono text-xs text-gray-400">—</span>
  return (
    <span className="font-mono text-xs">
      {info.set ? (
        <span className="text-green-600 dark:text-green-400">set ({info.length} chars)</span>
      ) : (
        <span className="text-red-600 dark:text-red-400">not set</span>
      )}
    </span>
  )
}
