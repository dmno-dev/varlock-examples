import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import { ENV } from 'varlock/env'
import { env } from 'cloudflare:workers'

export const Route = createFileRoute('/server-action')({
  component: ServerActionPage,
})

function redact(val: string | undefined) {
  if (val === undefined || val === null) return { set: false, length: 0 }
  return { set: true, length: val.length }
}

function getEnvVars() {
  return {
    SENSITIVE_VAR: {
      varlock: redact(ENV.SENSITIVE_VAR),
      cloudflare: redact(env.SENSITIVE_VAR),
      importMeta: redact(import.meta.env.SENSITIVE_VAR),
    },
    ANOTHER_SECRET: {
      varlock: redact(ENV.ANOTHER_SECRET),
      cloudflare: redact(env.ANOTHER_SECRET),
      importMeta: redact(import.meta.env.ANOTHER_SECRET),
    },
    PUBLIC_ITEM: {
      varlock: redact(ENV.PUBLIC_ITEM),
      cloudflare: redact(env.PUBLIC_ITEM),
      importMeta: redact(import.meta.env.PUBLIC_ITEM),
    },
    PUBLIC_OTHER: {
      varlock: redact(ENV.PUBLIC_OTHER),
      cloudflare: redact(env.PUBLIC_OTHER),
      importMeta: redact(import.meta.env.PUBLIC_OTHER),
    },
    VITE_PREFIXED_ITEM: {
      varlock: redact(ENV.VITE_PREFIXED_ITEM),
      cloudflare: redact(env.VITE_PREFIXED_ITEM),
      importMeta: redact(import.meta.env.VITE_PREFIXED_ITEM),
    },
  }
}

const fetchAllEnv = createServerFn({ method: 'GET' }).handler(() => {
  return { leaked: undefined as string | undefined, vars: getEnvVars() }
})

const fetchAllEnvWithLeak = createServerFn({ method: 'GET' }).handler(() => {
  return { leaked: ENV.SENSITIVE_VAR as string | undefined, vars: getEnvVars() }
})

type RedactedInfo = { set: boolean; length: number }
type EnvResult = {
  leaked: string | undefined
  vars: Record<string, { varlock: RedactedInfo; cloudflare: RedactedInfo; importMeta: RedactedInfo }>
}

function ServerActionPage() {
  const [data, setData] = useState<EnvResult | null>(null)
  const [loading, setLoading] = useState(false)

  const handleFetch = async (leak: boolean) => {
    setLoading(true)
    try {
      setData(leak ? await fetchAllEnvWithLeak() : await fetchAllEnv())
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <h1 className="display-title mb-6 text-3xl font-bold text-[var(--sea-ink)]">
        Server Action Env Vars
      </h1>
      <p className="mb-6 text-[var(--sea-ink-soft)]">
        Fetches all env vars via a <code>createServerFn()</code> server action.
        Values are redacted — only showing whether they are set and their length.
      </p>

      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => handleFetch(false)}
          disabled={loading}
          className="rounded-lg bg-[var(--lagoon)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Fetch Server Env'}
        </button>
        <button
          onClick={() => handleFetch(true)}
          disabled={loading}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Fetch with leak'}
        </button>
      </div>

      {data?.leaked !== undefined && (
        <div className="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
          <p className="text-sm font-medium text-red-800 dark:text-red-200">
            Leaked SENSITIVE_VAR: <code className="font-mono">{data.leaked}</code>
          </p>
        </div>
      )}

      {data && (
        <section className="island-shell rounded-2xl p-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--line)]">
                <th className="py-2 pr-4">Variable</th>
                <th className="py-2 pr-4 font-mono text-xs">ENV.xx</th>
                <th className="py-2 pr-4 font-mono text-xs">env.xx</th>
                <th className="py-2 font-mono text-xs">import.meta.env.xx</th>
              </tr>
            </thead>
            <tbody>
              {(['SENSITIVE_VAR', 'ANOTHER_SECRET', 'PUBLIC_ITEM', 'PUBLIC_OTHER', 'VITE_PREFIXED_ITEM'] as const).map((name) => {
                const row = data.vars[name]
                if (!row) return null
                return (
                  <tr key={name} className="border-b border-[var(--line)]">
                    <td className="py-2 pr-4 font-mono text-xs font-semibold">
                      {name}
                    </td>
                    <td className="py-2 pr-4"><RedactedCell info={row.varlock} /></td>
                    <td className="py-2 pr-4"><RedactedCell info={row.cloudflare} /></td>
                    <td className="py-2"><RedactedCell info={row.importMeta} /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </section>
      )}
    </main>
  )
}

function RedactedCell({ info }: { info: RedactedInfo }) {
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
