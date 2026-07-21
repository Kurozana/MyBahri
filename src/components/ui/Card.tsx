import type { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'

type CardProps = {
  children: ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <section
      className={cn(
        'rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,41,0.04),0_8px_24px_-16px_rgba(15,23,41,0.18)]',
        className,
      )}
    >
      {children}
    </section>
  )
}

type CardHeaderProps = {
  icon?: ReactNode
  title: string
  subtitle?: string
  action?: ReactNode
  showChevron?: boolean
  className?: string
}

export function CardHeader({
  icon,
  title,
  subtitle,
  action,
  showChevron,
  className,
}: CardHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between gap-3', className)}>
      <div className="flex items-center gap-2.5">
        {icon && (
          <span className="grid size-9 place-items-center rounded-xl bg-primary-50 text-primary-600">
            {icon}
          </span>
        )}
        <div className="flex items-center gap-1.5">
          <div>
            <h2 className="text-[17px] font-bold leading-tight text-ink">{title}</h2>
            {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
          </div>
          {showChevron && <ChevronRight className="size-4 text-slate-400" />}
        </div>
      </div>
      {action}
    </div>
  )
}
