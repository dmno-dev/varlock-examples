import { createFileRoute } from '@tanstack/react-router'
import { ENV } from 'varlock/env'

export const Route = createFileRoute('/client-env')({
  component: ClientEnvPage,
})

function ClientEnvPage() {
  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <h1 className="display-title mb-6 text-3xl font-bold text-[var(--sea-ink)]">
        Client-Side Env Vars
      </h1>
      <p className="mb-6 text-[var(--sea-ink-soft)]">
        Comparison of how env vars behave on the client across different access methods.
        Cells marked with a comment icon have commented-out code that would cause a build error if uncommented.
      </p>

      <section className="island-shell rounded-2xl p-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--line)]">
              <th className="py-2 pr-4">Variable</th>
              <th className="py-2 pr-4 font-mono text-xs">
                <code>ENV</code> (varlock)
              </th>
              <th className="py-2 pr-4 font-mono text-xs">
                <code>process.env</code>
              </th>
              <th className="py-2 font-mono text-xs">
                <code>import.meta.env</code>
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Public vars */}
            <tr className="border-b border-[var(--line)]">
              <td className="py-2 pr-4 font-mono text-xs font-semibold">
                PUBLIC_ITEM
              </td>
              <td className="py-2 pr-4 font-mono text-xs">{ENV.PUBLIC_ITEM}</td>
              <td className="py-2 pr-4 text-xs">
                <div>{process.env.PUBLIC_ITEM}</div>
                <span className="text-amber-600 dark:text-amber-400 italic">
                  flashes value from server, hydration error
                </span>
              </td>
              <td className="py-2 text-xs">
                <span className="text-gray-400 dark:text-gray-500 italic">
                  not set by design
                </span>
              </td>
            </tr>
            <tr className="border-b border-[var(--line)]">
              <td className="py-2 pr-4 font-mono text-xs font-semibold">
                VITE_PREFIXED_ITEM
              </td>
              <td className="py-2 pr-4 font-mono text-xs">{ENV.VITE_PREFIXED_ITEM}</td>
              <td className="py-2 pr-4 text-xs">
                <div>{process.env.VITE_PREFIXED_ITEM}</div>
                <span className="text-amber-600 dark:text-amber-400 italic">
                  flashes value from server, hydration error
                </span>
              </td>
              <td className="py-2 font-mono text-xs">{import.meta.env.VITE_PREFIXED_ITEM}</td>
            </tr>

            {/* Sensitive var — varlock blocks, others silently leak or return undefined */}
            <tr className="border-b border-[var(--line)]">
              <td className="py-2 pr-4 font-mono text-xs font-semibold">
                SENSITIVE_VAR
                <span className="ml-1 text-[10px] text-red-500">sensitive</span>
              </td>
              <td className="py-2 pr-4 text-xs">
                <span className="text-green-600 dark:text-green-400 font-medium">
                  varlock detects leak
                </span>
                {/* ENV.SENSITIVE_VAR — would cause a build error */}
              </td>
              <td className="py-2 pr-4 text-xs">
                <span className="text-red-600 dark:text-red-400 italic">
                  would leak without varlock
                  {/* ENV.SENSITIVE_VAR */}
                </span>
              </td>
              <td className="py-2 text-xs">
                <span className="text-gray-400 dark:text-gray-500 italic">
                  not set by design
                </span>
              </td>
            </tr>

            {/* Undefined var — varlock catches, others silently return undefined */}
            <tr className="border-b border-[var(--line)]">
              <td className="py-2 pr-4 font-mono text-xs font-semibold">
                BAD_VAR
                <span className="ml-1 text-[10px] text-red-500">not in schema</span>
              </td>
              <td className="py-2 pr-4 text-xs">
                <span className="text-green-600 dark:text-green-400 font-medium">
                  varlock triggers error
                </span>
                {/* ENV.BAD_VAR — would cause a build error */}
              </td>
              <td className="py-2 pr-4 text-xs">
                <span className="text-amber-600 dark:text-amber-400 italic">
                  silently returns undefined
                </span>
              </td>
              <td className="py-2 text-xs">
                <span className="text-amber-600 dark:text-amber-400 italic">
                  silently returns undefined
                </span>
                {import.meta.env.BAD_VAR}
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  )
}
