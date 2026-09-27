import { useState } from 'react'
import { motion } from 'framer-motion'
import { Package, DollarSign, TrendingDown, XCircle, ChevronDown, type LucideIcon } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { StatCounter } from '@/components/ui/StatCounter'
import { StatCardSkeleton } from '@/components/ui/Skeleton'
import { formatCurrency } from '@/lib/utils/format'
import { cn } from '@/lib/utils/cn'
import type { DashboardSummary } from '@/lib/api/types'

interface StatDef {
  key: string
  label: string
  value: number
  format?: (n: number) => string
  icon: LucideIcon
  tone: 'primary' | 'secondary' | 'warning' | 'danger'
  detail: string
}

function buildStats(summary: DashboardSummary): StatDef[] {
  return [
    { key: 'total', label: 'Total products', value: summary.totalProducts, icon: Package, tone: 'primary', detail: `Across ${summary.categoryCount} categories and ${summary.supplierCount} suppliers.` },
    { key: 'value', label: 'Total stock value', value: summary.totalStockValue, format: formatCurrency, icon: DollarSign, tone: 'secondary', detail: `${summary.totalUnits.toLocaleString()} units currently on hand.` },
    { key: 'low', label: 'Low stock items', value: summary.lowStockCount, icon: TrendingDown, tone: 'warning', detail: 'Products with fewer than 10 units remaining.' },
    { key: 'out', label: 'Out of stock', value: summary.outOfStockCount, icon: XCircle, tone: 'danger', detail: 'Products at zero quantity — restock to avoid missed orders.' },
  ]
}

const toneClasses = {
  primary: { chip: 'bg-gradient-to-br from-primary to-primary/60 text-white', glow: 'primary' as const },
  secondary: { chip: 'bg-gradient-to-br from-secondary to-secondary/60 text-white', glow: 'secondary' as const },
  warning: { chip: 'bg-warning-soft text-warning', glow: 'accent' as const },
  danger: { chip: 'bg-danger-soft text-danger', glow: 'accent' as const },
}

export function StatCards({ summary, loading }: { summary?: DashboardSummary; loading?: boolean }) {
  const [expanded, setExpanded] = useState<string | null>(null)

  if (loading || !summary) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  const stats = buildStats(summary)

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat, i) => {
        const isOpen = expanded === stat.key
        const tone = toneClasses[stat.tone]
        return (
          <motion.div
            key={stat.key}
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
          >
            <GlassCard
              hoverLift
              glow={tone.glow}
              layout
              role="button"
              tabIndex={0}
              aria-expanded={isOpen}
              onClick={() => setExpanded(isOpen ? null : stat.key)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setExpanded(isOpen ? null : stat.key)
                }
              }}
              className="group relative cursor-pointer select-none overflow-hidden"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full border-2 opacity-[0.35] transition-opacity duration-300 group-hover:opacity-60"
                style={{ borderColor: stat.tone === 'primary' ? 'var(--color-primary)' : stat.tone === 'secondary' ? 'var(--color-secondary)' : stat.tone === 'warning' ? 'var(--color-warning)' : 'var(--color-danger)' }}
              />
              <div className="flex items-start justify-between">
                <div className={cn('flex size-11 items-center justify-center rounded-xl shadow-sm transition-transform duration-300 group-hover:scale-105', tone.chip)}>
                  <stat.icon className="size-5" />
                </div>
                <ChevronDown className={cn('size-4 text-text-muted transition-transform duration-200', isOpen && 'rotate-180')} />
              </div>
              <p className="mt-4 text-xs font-medium uppercase tracking-wide text-text-muted">{stat.label}</p>
              <p className="mt-1.5 font-display text-2xl font-bold tracking-tight text-text sm:text-3xl">
                <StatCounter value={stat.value} format={stat.format} />
              </p>
              {isOpen && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 border-t border-border pt-3 text-xs text-text-muted"
                >
                  {stat.detail}
                </motion.p>
              )}
            </GlassCard>
          </motion.div>
        )
      })}
    </div>
  )
}
