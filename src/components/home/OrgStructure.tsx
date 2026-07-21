import { useState } from 'react'
import { Network, Search, TriangleAlert } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { useApi } from '@/hooks/useApi'
import { portalApi } from '@/services/portal'
import { cn } from '@/lib/cn'

const filters = ['All', 'Leadership Team', 'Product Development'] as const

export function OrgStructure() {
  const [filter, setFilter] = useState<(typeof filters)[number]>('All')
  const [query, setQuery] = useState('')
  const { data: members, loading, error } = useApi(portalApi.getOrgMembers)

  const visible = (members ?? [])
    .filter((m) => filter === 'All' || m.team === filter)
    .filter((m) => m.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <Card>
      <CardHeader
        icon={<Network className="size-[18px]" />}
        title="Organizational Structure"
        showChevron
        action={
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search employee..."
              className="w-56 rounded-full border border-line bg-surface py-2 pl-9 pr-3 text-sm text-content outline-none transition placeholder:text-subtle focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-500/20"
            />
          </div>
        }
      />

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-xs font-semibold transition',
              filter === f
                ? 'bg-primary-600 text-white'
                : 'bg-surface-2 text-muted hover:bg-surface-3',
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {error ? (
        <div className="mt-5 flex items-center gap-2 rounded-xl bg-rose-50 p-3.5 text-sm text-rose-600 dark:bg-rose-400/10 dark:text-rose-300">
          <TriangleAlert className="size-4" /> Couldn't load the org directory.
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {loading
            ? [0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex flex-col items-center rounded-xl border border-line p-4"
                >
                  <Skeleton className="size-14 rounded-full" />
                  <Skeleton className="mt-2.5 h-4 w-24" />
                  <Skeleton className="mt-1.5 h-3 w-20" />
                </div>
              ))
            : visible.map((m) => (
                <div
                  key={m.id}
                  className="group flex flex-col items-center rounded-xl border border-line p-4 text-center transition hover:border-primary-300 hover:shadow-md"
                >
                  <div className="grid size-14 place-items-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-sm font-bold text-white transition group-hover:scale-105">
                    {m.initials}
                  </div>
                  <p className="mt-2.5 text-sm font-semibold leading-tight text-content">{m.name}</p>
                  <p className="mt-0.5 text-xs text-subtle">{m.title}</p>
                </div>
              ))}
        </div>
      )}

      {!loading && !error && visible.length === 0 && (
        <p className="mt-5 text-center text-sm text-subtle">No employees match your search.</p>
      )}
    </Card>
  )
}
