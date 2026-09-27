import { AlertTriangle, RefreshCw, XCircle, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useDashboardSummary } from '@/lib/queries/useDashboard'
import { StatCards } from './StatCards'
import { RecentMovementsTable } from './RecentMovementsTable'
import { InventoryTrends } from './InventoryTrends'
import { GlassCard } from '@/components/ui/GlassCard'
import { CategoryValueBar } from '@/components/charts/CategoryValueBar'
import { SupplierValueBar } from '@/components/charts/SupplierValueBar'
import { StatusDonut } from '@/components/charts/StatusDonut'
import { ScrollReveal } from '@/components/motion/ScrollReveal'
import { Button } from '@/components/ui/Button'

export default function DashboardPage() {
  const { data: summary, isLoading, isError, refetch } = useDashboardSummary()

  if (isError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-danger-soft text-danger">
          <AlertTriangle className="size-7" />
        </div>
        <div>
          <h2 className="font-semibold text-text">Couldn't load the dashboard</h2>
          <p className="mt-1 text-sm text-text-muted">Check that the API server is running and try again.</p>
        </div>
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCw className="size-4" />
          Retry
        </Button>
      </div>
    )
  }

  const inStock = summary ? summary.totalProducts - summary.lowStockCount - summary.outOfStockCount : 0

  return (
    <div className="flex flex-col gap-6">
      {!isLoading && summary && (summary.lowStockCount > 0 || summary.outOfStockCount > 0) && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="glass-card flex flex-col items-start gap-3 border-warning/25 bg-warning-soft p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-warning-soft text-warning">
              <AlertTriangle className="size-4.5" />
            </span>
            <p className="text-sm text-text">
              <span className="font-semibold">{summary.lowStockCount + summary.outOfStockCount} products</span> need attention —{' '}
              {summary.outOfStockCount > 0 && (
                <span className="inline-flex items-center gap-1 text-danger">
                  <XCircle className="size-3.5" /> {summary.outOfStockCount} out of stock
                </span>
              )}
              {summary.outOfStockCount > 0 && summary.lowStockCount > 0 && <span className="text-text-muted">, </span>}
              {summary.lowStockCount > 0 && (
                <span className="inline-flex items-center gap-1 text-warning">
                  <AlertTriangle className="size-3.5" /> {summary.lowStockCount} running low
                </span>
              )}
              .
            </p>
          </div>
          <Link
            to={`/products?status=${summary.outOfStockCount > 0 ? 'out_of_stock' : 'low_stock'}`}
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border-strong bg-surface-2/60 px-3.5 py-2 text-sm font-medium text-text transition-colors hover:border-accent/50 hover:text-accent"
          >
            Review stock
            <ArrowRight className="size-3.5" />
          </Link>
        </motion.div>
      )}

      <StatCards summary={summary} loading={isLoading} />

      <div className="grid gap-6 lg:grid-cols-5">
        <ScrollReveal className="lg:col-span-3" y={16}>
          <GlassCard className="h-full">
            <h2 className="font-display text-base font-semibold text-text">Category distribution</h2>
            <p className="mt-1 text-xs text-text-muted">Total inventory value grouped by category.</p>
            <div className="mt-6">
              {isLoading || !summary ? (
                <div className="h-64 animate-pulse rounded-lg bg-surface-2/50" />
              ) : (
                <CategoryValueBar data={summary.byCategory} />
              )}
            </div>
          </GlassCard>
        </ScrollReveal>

        <ScrollReveal className="lg:col-span-2" y={16} delay={0.08}>
          <GlassCard className="h-full">
            <h2 className="font-display text-base font-semibold text-text">Stock health</h2>
            <p className="mt-1 text-xs text-text-muted">Distribution of in-stock, low, and out-of-stock items.</p>
            <div className="mt-6">
              {isLoading || !summary ? (
                <div className="h-52 animate-pulse rounded-lg bg-surface-2/50" />
              ) : (
                <StatusDonut inStock={Math.max(inStock, 0)} lowStock={summary.lowStockCount} outOfStock={summary.outOfStockCount} />
              )}
            </div>
          </GlassCard>
        </ScrollReveal>
      </div>

      <ScrollReveal y={16} delay={0.1}>
        <InventoryTrends />
      </ScrollReveal>

      <div className="grid gap-6 lg:grid-cols-5">
        <ScrollReveal className="lg:col-span-2" y={16} delay={0.12}>
          <GlassCard className="h-full">
            <h2 className="font-display text-base font-semibold text-text">Supplier performance</h2>
            <p className="mt-1 text-xs text-text-muted">Inventory value supplied, by supplier.</p>
            <div className="mt-6">
              {isLoading || !summary ? (
                <div className="h-64 animate-pulse rounded-lg bg-surface-2/50" />
              ) : (
                <SupplierValueBar data={summary.bySupplier} />
              )}
            </div>
          </GlassCard>
        </ScrollReveal>

        <ScrollReveal className="lg:col-span-3" y={16} delay={0.16}>
          <div>
            <h2 className="mb-3 font-display text-base font-semibold text-text">Recent activity</h2>
            <RecentMovementsTable movements={summary?.recentMovements ?? []} loading={isLoading} />
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
