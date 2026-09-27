import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { MobileDrawer } from './MobileDrawer'
import { PageTransition } from '@/components/motion/PageTransition'
import { cn } from '@/lib/utils/cn'

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  return (
    <div className="relative flex min-h-screen bg-bg">
      <div
        aria-hidden
        className="dot-grid-bg pointer-events-none fixed inset-0 z-0 opacity-60"
        style={{ maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed -top-40 left-1/3 z-0 size-[560px] rounded-full border opacity-[0.08]"
        style={{ borderColor: 'var(--color-primary)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed -bottom-52 -right-24 z-0 size-[520px] rounded-full opacity-[0.10] blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--color-secondary) 0%, transparent 70%)' }}
      />

      <div className="hidden lg:block">
        <div className="fixed inset-y-0 left-0 z-20">
          <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed((v) => !v)} />
        </div>
      </div>
      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className={cn('relative z-10 flex min-h-screen flex-1 flex-col transition-[padding] duration-250 ease-out', collapsed ? 'lg:pl-[76px]' : 'lg:pl-66')}>
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 px-5 py-6 sm:px-8 sm:py-8">
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
