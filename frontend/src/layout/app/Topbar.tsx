import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Menu, Search, Bell, AlertTriangle, XCircle } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { ConnectionPill } from './ConnectionPill'
import { UserChip } from '@/features/auth/UserChip'
import { useDashboardSummary } from '@/lib/queries/useDashboard'
import { cn } from '@/lib/utils/cn'

const TITLES: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Live overview of your inventory' },
  '/products': { title: 'Products', subtitle: 'Manage your product catalog' },
  '/categories': { title: 'Categories', subtitle: 'Organize products by category' },
  '/suppliers': { title: 'Suppliers', subtitle: 'Manage supplier relationships' },
}

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)

  // Reuses the existing dashboard summary query (react-query dedupes/caches
  // this against the same query key the Dashboard page uses) — no new API.
  const { data: summary } = useDashboardSummary({ refetchInterval: 60_000 })
  const alertCount = (summary?.lowStockCount ?? 0) + (summary?.outOfStockCount ?? 0)

  const meta =
    TITLES[location.pathname] ??
    (location.pathname.startsWith('/suppliers/') ? { title: 'Supplier', subtitle: 'Supplier details' } : { title: '', subtitle: '' })

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    navigate(`/products?search=${encodeURIComponent(query.trim())}`)
  }

  const goToAlerts = (status: 'low_stock' | 'out_of_stock') => {
    setNotifOpen(false)
    navigate(`/products?status=${status}`)
  }

  return (
    <header className="glass-panel sticky top-0 z-30 flex items-center gap-3 rounded-none border-x-0 border-t-0 px-5 py-3.5 sm:gap-4 sm:px-8">
      <button onClick={onMenuClick} className="rounded-md p-1.5 text-text-secondary hover:bg-white/8 lg:hidden cursor-pointer" aria-label="Open menu">
        <Menu className="size-5" />
      </button>

      <div className="hidden shrink-0 lg:block">
        <h1 className="font-display text-lg font-bold tracking-tight text-text">{meta.title}</h1>
        <p className="text-xs text-text-muted">{meta.subtitle}</p>
      </div>

      <form onSubmit={handleSearchSubmit} className="mx-auto flex w-full max-w-md flex-1 items-center lg:mx-0 lg:ml-6">
        <div className="relative w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search products by name or SKU…"
            className="h-9.5 w-full rounded-lg border border-border-strong bg-surface-2/60 pl-9 pr-3 text-sm text-text outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-text-muted focus:border-accent focus:shadow-[0_0_0_3px_rgba(6,182,212,0.2)]"
          />
        </div>
      </form>

      <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
        <ConnectionPill />

        <div className="relative">
          <button
            onClick={() => setNotifOpen((v) => !v)}
            aria-label="Notifications"
            className="relative flex size-9.5 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-white/8 hover:text-text cursor-pointer"
          >
            <Bell className="size-4.5" />
            {alertCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex size-2 items-center justify-center rounded-full bg-danger ring-2 ring-surface" />
            )}
          </button>
          <AnimatePresence>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: -6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -6 }}
                  transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="glass-card absolute right-0 top-[calc(100%+8px)] z-50 w-72 p-1.5"
                >
                  <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-text-muted">Stock alerts</p>
                  {alertCount === 0 ? (
                    <p className="px-3 py-4 text-center text-sm text-text-muted">All products are healthy — nothing needs attention.</p>
                  ) : (
                    <div className="flex flex-col gap-1">
                      {(summary?.outOfStockCount ?? 0) > 0 && (
                        <button
                          onClick={() => goToAlerts('out_of_stock')}
                          className={cn('flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors hover:bg-white/5 cursor-pointer')}
                        >
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-danger-soft text-danger">
                            <XCircle className="size-4" />
                          </span>
                          <span>
                            <span className="font-medium text-text">{summary?.outOfStockCount} out of stock</span>
                            <span className="block text-xs text-text-muted">Zero quantity — needs restocking</span>
                          </span>
                        </button>
                      )}
                      {(summary?.lowStockCount ?? 0) > 0 && (
                        <button
                          onClick={() => goToAlerts('low_stock')}
                          className={cn('flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors hover:bg-white/5 cursor-pointer')}
                        >
                          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-warning-soft text-warning">
                            <AlertTriangle className="size-4" />
                          </span>
                          <span>
                            <span className="font-medium text-text">{summary?.lowStockCount} low stock</span>
                            <span className="block text-xs text-text-muted">Below the 10-unit threshold</span>
                          </span>
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <div className="hidden h-6 w-px bg-border sm:block" />
        <div className="hidden sm:block">
          <UserChip variant="navbar" />
        </div>
      </div>
    </header>
  )
}
