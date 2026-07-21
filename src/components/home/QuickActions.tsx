import { Card, CardHeader } from '@/components/ui/Card'
import { quickActions } from '@core/content/home'
import { iconMap } from '@/lib/icons'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/cn'

export function QuickActions() {
  const toast = useToast()

  return (
    <Card>
      <CardHeader title="Quick Actions" />
      <div className="mt-4 grid grid-cols-2 gap-3">
        {quickActions.map(({ label, desc, iconKey, variant }) => {
          const Icon = iconMap[iconKey]
          return (
          <button
            key={label}
            onClick={() => toast(`Opening ${label}…`, 'info')}
            className="group flex flex-col items-start gap-3 rounded-xl border border-line p-3.5 text-left transition hover:border-primary-300 hover:bg-surface-2"
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
              <span className="block text-sm font-semibold text-content">{label}</span>
              <span className="block text-xs leading-tight text-subtle">{desc}</span>
            </span>
          </button>
          )
        })}
      </div>
    </Card>
  )
}
