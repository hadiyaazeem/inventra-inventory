import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { StatCounter } from '@/components/ui/StatCounter'
import { useDashboardSummary } from '@/lib/queries/useDashboard'
import { formatCurrency } from '@/lib/utils/format'
import heroImage from '@/assets/hero-warehouse.jpg'

const HEADLINE = 'Inventory intelligence, engineered for scale.'
const SUBCOPY = 'Products, categories, suppliers and stock movements in one system — built to keep every count honest.'

const FALLBACK_STATS = { totalProducts: 240, totalStockValue: 186400, categoryCount: 12, supplierCount: 18 }

export function Hero() {
  const { data } = useDashboardSummary()
  const stats = data ?? FALLBACK_STATS
  const words = HEADLINE.split(' ')

  return (
    <section id="top" className="relative isolate overflow-hidden pb-20 pt-32">
      <img
        src={heroImage}
        alt="Warehouse shelving with organized inventory"
        className="absolute inset-0 h-full w-full object-cover brightness-[0.32] saturate-[0.45] contrast-[1.05]"
      />
      <div className="absolute inset-0 bg-bg/55" />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 70% 55% at 50% 40%, var(--color-bg) 0%, transparent 75%)' }}
      />
      <div className="dot-grid-bg absolute inset-0 opacity-70" />

      <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
        <span className="font-mono text-xs font-medium uppercase tracking-widest text-accent">Product inventory management</span>

        <h1 className="mt-4 font-display text-4xl font-bold leading-[1.08] text-text sm:text-5xl lg:text-6xl">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className={word === 'scale.' ? 'text-accent inline-block' : 'inline-block'}
            >
              {word}&nbsp;
            </motion.span>
          ))}
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base text-text-secondary sm:text-lg">{SUBCOPY}</p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/dashboard"
            className="btn-glow inline-flex h-11 items-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-white transition-[filter] hover:brightness-110"
          >
            Go to dashboard
            <ArrowRight className="size-4" />
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex h-11 items-center rounded-md border border-border-strong px-5 text-sm font-medium text-text transition-colors hover:border-accent/60 hover:bg-accent-soft"
          >
            See how it works
          </a>
        </div>

        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
          <MiniStat value={stats.totalProducts} label="Products" />
          <MiniStat value={stats.totalStockValue} label="Stock value" format={(n) => formatCurrency(n)} />
          <MiniStat value={stats.categoryCount} label="Categories" />
          <MiniStat value={stats.supplierCount} label="Suppliers" />
        </div>
      </div>
    </section>
  )
}

function MiniStat({ value, label, format }: { value: number; label: string; format?: (n: number) => string }) {
  return (
    <div className="rounded-md border border-border-strong bg-surface px-3 py-2.5">
      <div className="font-mono text-lg font-semibold text-text">
        <StatCounter value={value} format={format} />
      </div>
      <p className="mt-0.5 text-[11px] text-text-muted">{label}</p>
    </div>
  )
}
