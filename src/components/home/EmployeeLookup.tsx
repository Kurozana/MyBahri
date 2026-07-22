import { useState } from 'react'
import { Search, ArrowLeft, Phone, Mail, Building2, MapPin } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Skeleton } from '@/components/ui/Skeleton'
import { useApi } from '@core/hooks/useApi'
import { portalApi } from '@core/api/portal'
import type { EmployeeDto } from '@core/api/types'

export function EmployeeLookup({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { data, loading } = useApi(portalApi.getEmployees)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<EmployeeDto | null>(null)

  const results = (data ?? []).filter((e) => {
    const q = query.toLowerCase()
    return (
      e.name.toLowerCase().includes(q) ||
      e.department.toLowerCase().includes(q) ||
      e.title.toLowerCase().includes(q)
    )
  })

  const close = () => {
    onClose()
    // reset after the close animation
    setTimeout(() => {
      setSelected(null)
      setQuery('')
    }, 150)
  }

  return (
    <Modal open={open} onClose={close} title="Employee Lookup">
      {selected ? (
        <div className="p-5">
          <button
            onClick={() => setSelected(null)}
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted transition hover:text-content"
          >
            <ArrowLeft className="size-4" /> Back to search
          </button>

          <div className="flex items-center gap-4">
            <span className="grid size-16 place-items-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-lg font-bold text-white">
              {selected.initials}
            </span>
            <div>
              <p className="text-lg font-bold text-content">{selected.name}</p>
              <p className="text-sm text-muted">{selected.title}</p>
            </div>
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-3">
            <DetailRow icon={<Building2 className="size-4" />} label="Department" value={selected.department} />
            <DetailRow icon={<MapPin className="size-4" />} label="Location" value={selected.floor} />
            <DetailRow
              icon={<Phone className="size-4" />}
              label="Work phone"
              value={`Ext. ${selected.extension}`}
              href={`tel:${selected.extension}`}
            />
            <DetailRow
              icon={<Mail className="size-4" />}
              label="Email"
              value={selected.email}
              href={`mailto:${selected.email}`}
            />
          </dl>
        </div>
      ) : (
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-subtle" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, team or role…"
              className="w-full rounded-xl border border-line bg-surface py-3 pl-11 pr-3 text-sm text-content outline-none transition placeholder:text-subtle focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-500/20"
            />
          </div>

          <div className="scroll-thin mt-3 max-h-80 space-y-1 overflow-y-auto">
            {loading &&
              [0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl p-2.5">
                  <Skeleton className="size-10 rounded-full" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-3.5 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}

            {!loading &&
              results.map((e) => (
                <button
                  key={e.id}
                  onClick={() => setSelected(e)}
                  className="flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition hover:bg-surface-2"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-xs font-bold text-white">
                    {e.initials}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-content">{e.name}</span>
                    <span className="block truncate text-xs text-subtle">
                      {e.title} · {e.department}
                    </span>
                  </span>
                  <span className="hidden text-xs font-medium text-subtle sm:block">Ext. {e.extension}</span>
                </button>
              ))}

            {!loading && results.length === 0 && (
              <p className="py-6 text-center text-sm text-subtle">No employees match "{query}".</p>
            )}
          </div>
        </div>
      )}
    </Modal>
  )
}

function DetailRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode
  label: string
  value: string
  href?: string
}) {
  const inner = (
    <>
      <dt className="flex items-center gap-1.5 text-xs font-medium text-subtle">
        {icon} {label}
      </dt>
      <dd className="mt-0.5 truncate text-sm font-semibold text-content">{value}</dd>
    </>
  )
  return href ? (
    <a href={href} className="rounded-xl border border-line p-3 transition hover:border-primary-300 hover:bg-surface-2">
      {inner}
    </a>
  ) : (
    <div className="rounded-xl border border-line p-3">{inner}</div>
  )
}
