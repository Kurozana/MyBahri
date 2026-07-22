import { useState } from 'react'
import { Card, CardHeader } from '@/components/ui/Card'
import { extensions } from '@core/content/home'
import { iconMap } from '@/lib/icons'
import { useToast } from '@/components/ui/Toast'
import { EmployeeLookup } from '@/components/home/EmployeeLookup'
import { cn } from '@/lib/cn'

export function Extensions() {
  const toast = useToast()
  const [lookupOpen, setLookupOpen] = useState(false)

  return (
    <Card>
      <CardHeader title="Extensions" />
      <div className="mt-4 grid grid-cols-2 gap-3">
        {extensions.map(({ label, iconKey, variant }) => {
          const Icon = iconMap[iconKey]
          const onClick =
            iconKey === 'employee-lookup'
              ? () => setLookupOpen(true)
              : () => toast(`Opening ${label}…`, 'info')
          return (
            <button
              key={label}
              onClick={onClick}
              className="group flex flex-col items-center gap-2.5 rounded-xl border border-line p-4 text-center transition hover:border-primary-300 hover:bg-surface-2"
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
              <span className="text-xs font-semibold text-content">{label}</span>
            </button>
          )
        })}
      </div>

      {lookupOpen && <EmployeeLookup open={lookupOpen} onClose={() => setLookupOpen(false)} />}
    </Card>
  )
}
