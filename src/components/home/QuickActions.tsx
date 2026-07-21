import { Card, CardHeader } from '@/components/ui/Card'
import { quickActions } from '@/data/home'
import { cn } from '@/lib/cn'

export function QuickActions() {
  return (
    <Card>
      <CardHeader title="Quick Actions" />
      <div className="mt-4 grid grid-cols-2 gap-3">
        {quickActions.map(({ label, desc, icon: Icon, variant }) => (
          <button
            key={label}
            className="group flex flex-col items-start gap-3 rounded-xl border border-slate-200/80 p-3.5 text-left transition hover:border-primary-200 hover:bg-slate-50"
          >
            <span
              className={cn(
                'grid size-10 place-items-center rounded-xl text-white shadow-sm transition group-hover:scale-105',
                variant === 'primary'
                  ? 'bg-gradient-to-br from-primary-500 to-primary-700'
                  : 'bg-gradient-to-br from-brand-mint to-primary-500',
              )}
            >
              <Icon className="size-5" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-ink">{label}</span>
              <span className="block text-xs leading-tight text-slate-400">{desc}</span>
            </span>
          </button>
        ))}
      </div>
    </Card>
  )
}
