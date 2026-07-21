import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

const tones = {
  neutral: 'bg-slate-100 text-slate-600',
  warning: 'bg-amber-100 text-amber-700',
  success: 'bg-emerald-100 text-emerald-700',
  info: 'bg-primary-50 text-primary-700',
} as const

export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: ReactNode
  tone?: keyof typeof tones
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
