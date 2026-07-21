import { ChevronRight } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/Card'
import { mostUsedServices } from '@/data/home'

export function MostUsedServices() {
  return (
    <Card>
      <CardHeader title="Most Used Services" />
      <div className="mt-4 space-y-3">
        {mostUsedServices.map(({ label, desc, icon: Icon }) => (
          <button
            key={label}
            className="group flex w-full items-center gap-3 rounded-xl border border-slate-200/80 p-3.5 text-left transition hover:border-primary-200 hover:bg-slate-50"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-sm">
              <Icon className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-ink">{label}</span>
              <span className="block text-xs leading-tight text-slate-400">{desc}</span>
            </span>
            <ChevronRight className="size-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-primary-500" />
          </button>
        ))}
      </div>
    </Card>
  )
}
