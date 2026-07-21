import { useState } from 'react'
import { Palette, Check } from 'lucide-react'
import { useOccasion } from '@/hooks/useOccasion'
import { cn } from '@/lib/cn'

export function OccasionSwitcher() {
  const { current, occasionId, setOccasion, occasions } = useOccasion()
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        title="Occasion theme"
        aria-label="Occasion theme"
        className="grid size-9 place-items-center rounded-full border border-line bg-surface text-muted transition hover:bg-surface-2 hover:text-primary-600"
      >
        {current ? <span className="text-base leading-none">{current.icon}</span> : <Palette className="size-[18px]" />}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-11 z-50 w-60 animate-toast-in rounded-2xl border border-line bg-surface p-2 shadow-xl">
            <p className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-subtle">
              Occasion theme
            </p>
            <button
              onClick={() => {
                setOccasion(null)
                setOpen(false)
              }}
              className={cn(
                'flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm transition hover:bg-surface-2',
                !occasionId && 'bg-surface-2',
              )}
            >
              <span className="grid size-7 place-items-center rounded-lg bg-gradient-to-br from-brand-teal to-brand-cyan text-white">
                <Palette className="size-4" />
              </span>
              <span className="flex-1 text-left font-medium text-content">Default (Bahri)</span>
              {!occasionId && <Check className="size-4 text-primary-600" />}
            </button>

            {occasions.map((o) => (
              <button
                key={o.id}
                onClick={() => {
                  setOccasion(o.id)
                  setOpen(false)
                }}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm transition hover:bg-surface-2',
                  occasionId === o.id && 'bg-surface-2',
                )}
              >
                <span className="grid size-7 place-items-center rounded-lg bg-surface-3 text-base">
                  {o.icon}
                </span>
                <span className="flex-1 text-left font-medium text-content">{o.name}</span>
                {occasionId === o.id && <Check className="size-4 text-primary-600" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
