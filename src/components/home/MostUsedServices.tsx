import { ChevronRight } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/Card'
import { mostUsedServices } from '@/data/home'
import { useToast } from '@/components/ui/Toast'

export function MostUsedServices() {
  const toast = useToast()

  return (
    <Card>
      <CardHeader title="Most Used Services" />
      <div className="mt-4 space-y-3">
        {mostUsedServices.map(({ label, desc, icon: Icon }) => (
          <button
            key={label}
            onClick={() => toast(`Opening ${label}…`, 'info')}
            className="group flex w-full items-center gap-3 rounded-xl border border-line p-3.5 text-left transition hover:border-primary-300 hover:bg-surface-2"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-sm">
              <Icon className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-content">{label}</span>
              <span className="block text-xs leading-tight text-subtle">{desc}</span>
            </span>
            <ChevronRight className="size-4 text-subtle transition group-hover:translate-x-0.5 group-hover:text-primary-500" />
          </button>
        ))}
      </div>
    </Card>
  )
}
