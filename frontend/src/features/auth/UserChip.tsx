import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, ShieldCheck, User, ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/components/ui/Toast'
import { Button } from '@/components/ui/Button'
import { Tooltip } from '@/components/ui/Tooltip'
import { LoginModal } from './LoginModal'
import { cn } from '@/lib/utils/cn'

interface UserChipProps {
  variant?: 'sidebar' | 'navbar' | 'collapsed'
}

export function UserChip({ variant = 'sidebar' }: UserChipProps) {
  const { user, logout } = useAuthStore()
  const [loginOpen, setLoginOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  const handleLogout = () => {
    setMenuOpen(false)
    logout()
    toast.info('Signed out.')
    navigate('/')
  }

  const initials = user?.username.slice(0, 2).toUpperCase()

  if (!user) {
    if (variant === 'collapsed') {
      return (
        <>
          <Tooltip content="Sign in" side="right">
            <button
              onClick={() => setLoginOpen(true)}
              aria-label="Sign in"
              className="flex size-9 items-center justify-center rounded-lg border border-border-strong text-text-secondary transition-colors hover:border-accent/50 hover:text-text cursor-pointer"
            >
              <User className="size-4" />
            </button>
          </Tooltip>
          <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
        </>
      )
    }
    return (
      <>
        <Button
          variant={variant === 'navbar' ? 'primary' : 'outline'}
          size={variant === 'navbar' ? 'sm' : 'sm'}
          className={variant === 'sidebar' ? 'w-full' : ''}
          onClick={() => setLoginOpen(true)}
        >
          <User className="size-4" />
          Sign in
        </Button>
        <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      </>
    )
  }

  if (variant === 'collapsed') {
    return (
      <Tooltip content={user.username} side="right">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-semibold text-white">
          {initials}
        </div>
      </Tooltip>
    )
  }

  if (variant === 'navbar') {
    return (
      <div className="relative">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2 rounded-full border border-border-strong bg-surface-2/60 py-1 pl-1 pr-2.5 transition-colors hover:border-border-strong hover:bg-surface-3 cursor-pointer"
        >
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-[11px] font-semibold text-white">
            {initials}
          </div>
          <span className="hidden text-sm font-medium text-text sm:inline">{user.username}</span>
          <ChevronDown className={cn('size-3.5 text-text-muted transition-transform', menuOpen && 'rotate-180')} />
        </button>
        <AnimatePresence>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -6 }}
                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="glass-card absolute right-0 top-[calc(100%+8px)] z-50 w-56 p-1.5"
              >
                <div className="flex items-center gap-3 rounded-md px-3 py-2.5">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-semibold text-white">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-text">{user.username}</p>
                    <p className="flex items-center gap-1 text-xs text-text-muted">
                      {user.role === 'ADMIN' && <ShieldCheck className="size-3 text-accent" />}
                      {user.role === 'ADMIN' ? 'Administrator' : 'Staff'}
                    </p>
                  </div>
                </div>
                <div className="my-1 h-px bg-border" />
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-danger-soft hover:text-danger cursor-pointer"
                >
                  <LogOut className="size-4" />
                  Sign out
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-3', variant === 'sidebar' && 'rounded-lg border border-border bg-surface-2/50 p-3')}>
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-semibold text-white">
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-text">{user.username}</p>
        <p className="flex items-center gap-1 text-xs text-text-muted">
          {user.role === 'ADMIN' && <ShieldCheck className="size-3 text-accent" />}
          {user.role === 'ADMIN' ? 'Administrator' : 'Staff'}
        </p>
      </div>
      <button
        onClick={handleLogout}
        aria-label="Sign out"
        className="flex size-8 shrink-0 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-white/8 hover:text-danger cursor-pointer"
      >
        <LogOut className="size-4" />
      </button>
    </div>
  )
}
