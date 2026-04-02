import { useState } from 'react'
import Header from './Header'

function SidebarLink({ label, isActive, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
          : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
      ].join(' ')}
    >
      <span
        aria-hidden="true"
        className={[
          'inline-flex h-2.5 w-2.5 rounded-full transition-colors',
          isActive ? 'bg-indigo-600 dark:bg-indigo-400' : 'bg-slate-300 dark:bg-slate-600',
        ].join(' ')}
      />
      {label}
    </button>
  )
}

export default function Layout({ children, activePage, onNavigate }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const closeSidebar = () => setSidebarOpen(false)

  const onNavClick = (page) => {
    onNavigate?.(page)
    closeSidebar()
  }

  return (
    <div className="min-h-svh bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="flex min-h-svh">
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="h-full border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 px-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Navigation
              </p>
            </div>

            <div className="space-y-1">
              <SidebarLink
                label="Dashboard"
                isActive={activePage === 'Dashboard'}
                onClick={() => onNavClick('Dashboard')}
              />
              <SidebarLink
                label="Transactions"
                isActive={activePage === 'Transactions'}
                onClick={() => onNavClick('Transactions')}
              />
            </div>
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 lg:hidden"
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              className="absolute inset-0 bg-slate-900/40 dark:bg-black/60"
              onClick={closeSidebar}
              aria-label="Close sidebar"
            />
            <div className="absolute inset-y-0 left-0 w-72 border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Navigation
                </p>
                <button
                  type="button"
                  onClick={closeSidebar}
                  className="rounded-lg px-2 py-1 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Close
                </button>
              </div>

              <div className="space-y-1">
                <SidebarLink
                  label="Dashboard"
                  isActive={activePage === 'Dashboard'}
                  onClick={() => onNavClick('Dashboard')}
                />
                <SidebarLink
                  label="Transactions"
                  isActive={activePage === 'Transactions'}
                  onClick={() => onNavClick('Transactions')}
                />
              </div>
            </div>
          </div>
        )}

        <div className="min-w-0 flex-1">
          <Header onOpenMenu={() => setSidebarOpen(true)} />

          <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        </div>
      </div>
    </div>
  )
}
