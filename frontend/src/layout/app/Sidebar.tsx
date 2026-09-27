import { NavLink, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LayoutDashboard, Package, Tag, Truck, Boxes, X, Home, ChevronsLeft } from 'lucide-react'
import { UserChip } from '@/features/auth/UserChip'
import { Tooltip } from '@/components/ui/Tooltip'
import { cn } from '@/lib/utils/cn'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/categories', label: 'Categories', icon: Tag },
  { to: '/suppliers', label: 'Suppliers', icon: Truck },
]

interface SidebarProps {
  onNavigate?: () => void
  onClose?: () => void
  mobile?: boolean
  collapsed?: boolean
  onToggleCollapse?: () => void
}

export function Sidebar({ onNavigate, onClose, mobile, collapsed, onToggleCollapse }: SidebarProps) {
  const isCollapsed = !mobile && collapsed

  return (
    <div
      className={cn(
        'relative flex h-full flex-col border-r border-border bg-sidebar py-5 transition-[width] duration-250 ease-out',
        isCollapsed ? 'w-[76px] px-2.5' : 'w-66 px-4',
      )}
    >
      <div className={cn('mb-7 flex items-center px-2', isCollapsed ? 'justify-center' : 'justify-between')}>
        <Link to="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-glow-primary">
            <Boxes className="size-5" />
          </div>
          {!isCollapsed && <span className="font-display text-lg font-bold tracking-tight text-text whitespace-nowrap">Velora</span>}
        </Link>
        {mobile && (
          <button onClick={onClose} className="rounded-md p-1.5 text-text-muted hover:bg-white/8 cursor-pointer" aria-label="Close menu">
            <X className="size-5" />
          </button>
        )}
      </div>

      {!isCollapsed && <p className="mb-2 px-3.5 text-[10px] font-semibold uppercase tracking-widest text-text-muted">Menu</p>}
      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const link = (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors',
                  isCollapsed && 'justify-center px-0',
                  isActive ? 'text-white' : 'text-text-secondary hover:bg-white/5 hover:text-text',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-active"
                      className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-primary to-primary/80 shadow-glow-primary"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                  <item.icon className="size-4.5 shrink-0" />
                  {!isCollapsed && item.label}
                </>
              )}
            </NavLink>
          )
          return isCollapsed ? (
            <Tooltip key={item.to} content={item.label} side="right">
              {link}
            </Tooltip>
          ) : (
            link
          )
        })}
      </nav>

      <Link
        to="/"
        className={cn(
          'mb-3 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-text-muted transition-colors hover:bg-white/5 hover:text-text-secondary',
          isCollapsed && 'justify-center px-0',
        )}
      >
        <Home className="size-4.5 shrink-0" />
        {!isCollapsed && 'Back to Home'}
      </Link>

      <div className="border-t border-border pt-3">
        {isCollapsed ? (
          <div className="flex justify-center">
            <UserChip variant="collapsed" />
          </div>
        ) : (
          <UserChip variant="sidebar" />
        )}
      </div>

      {!mobile && onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="absolute top-7 -right-3 flex size-6 items-center justify-center rounded-full border border-border-strong bg-surface-2 text-text-muted shadow-sm transition-colors hover:text-text cursor-pointer"
        >
          <ChevronsLeft className={cn('size-3.5 transition-transform duration-250', isCollapsed && 'rotate-180')} />
        </button>
      )}
    </div>
  )
}
