import { cn } from '@/lib/utils/cn'

interface GlowOrbProps {
  color?: 'primary' | 'secondary' | 'accent'
  size?: number
  className?: string
  delay?: number
}

const colorMap = {
  primary: 'var(--color-primary)',
  secondary: 'var(--color-secondary)',
  accent: 'var(--color-accent)',
}

/** A faint, static schematic ring — a blueprint/technical-drawing accent.
 * Deliberately no blur/gradient fill here (unlike a typical glassmorphism
 * "glow orb"), to match the flat, hard-edged look used across this app. */
export function GlowOrb({ color = 'primary', size = 420, className, delay = 0 }: GlowOrbProps) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute rounded-full border opacity-[0.14] animate-orb-drift', className)}
      style={{
        width: size,
        height: size,
        borderColor: colorMap[color],
        borderWidth: 1,
        animationDelay: `${delay}s`,
      }}
    />
  )
}
