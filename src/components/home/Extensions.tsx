import { Card, CardHeader } from '@/components/ui/Card'
import { extensions } from '@/data/home'
import { cn } from '@/lib/cn'

export function Extensions() {
  return (
    <Card>
      <CardHeader title="Extensions" />
      <div className="mt-4 grid grid-cols-2 gap-3">
        {extensions.map(({ label, icon: Icon, variant }) => (
          <button
            key={label}
            className="group flex flex-col items-center gap-2.5 rounded-xl border border-slate-200/80 p-4 text-center transition hover:border-primary-200 hover:bg-slate-50"
          >
            <span
              className={cn(
                'grid size-11 place-items-center rounded-xl text-white shadow-sm transition group-hover:scale-105',
                variant === 'primary'
                  ? 'bg-gradient-to-br from-primary-500 to-primary-700'
                  : 'bg-gradient-to-br from-brand-mint to-primary-500',
              )}
            >
              <Icon className="size-5" />
            </span>
            <span className="text-xs font-semibold text-ink">{label}</span>
          </button>
        ))}
      </div>
    </Card>
  )
}
