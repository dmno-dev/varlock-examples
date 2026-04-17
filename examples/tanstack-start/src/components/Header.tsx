import { Link } from '@tanstack/react-router'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--header-bg)] px-4 backdrop-blur-lg">
      <nav className="page-wrap flex items-center gap-x-4 py-3">
        <h2 className="m-0 text-base font-semibold tracking-tight">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1.5 text-sm text-[var(--sea-ink)] no-underline"
          >
            <span className="h-2 w-2 rounded-full bg-[linear-gradient(90deg,#56c6be,#7ed3bf)]" />
            Varlock Test
          </Link>
        </h2>

        <div className="flex items-center gap-x-4 text-sm font-semibold">
          <Link to="/" className="nav-link" activeProps={{ className: 'nav-link is-active' }}>
            Home
          </Link>
          <Link to="/client-env" className="nav-link" activeProps={{ className: 'nav-link is-active' }}>
            Client Env
          </Link>
          <Link to="/server-loader" className="nav-link" activeProps={{ className: 'nav-link is-active' }}>
            Server Loader
          </Link>
          <Link to="/server-action" className="nav-link" activeProps={{ className: 'nav-link is-active' }}>
            Server Action
          </Link>
          <Link to="/api-route" className="nav-link" activeProps={{ className: 'nav-link is-active' }}>
            API Route
          </Link>
        </div>
      </nav>
    </header>
  )
}
