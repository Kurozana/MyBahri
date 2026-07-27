import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Network, Search, TriangleAlert, RefreshCw } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { useApi } from '@core/hooks/useApi'
import { portalApi } from '@core/api/portal'
import { cn } from '@/lib/cn'

const filters = ['All', 'Leadership Team', 'Product Development'] as const

export function OrgStructure() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<(typeof filters)[number]>('All')
  const [query, setQuery] = useState('')
  const { data: members, loading, error, refetch } = useApi(portalApi.getOrgMembers)

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
        <div className="mt-5 flex flex-col items-center gap-3 rounded-xl border border-line bg-rose-50/60 p-6 text-center dark:bg-rose-400/5">
          <span className="grid size-10 place-items-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-400/15 dark:text-rose-300">
            <TriangleAlert className="size-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-content">Couldn't load the org directory</p>
            <p className="mt-0.5 text-xs text-subtle">Check your connection and try again.</p>
          </div>
          <button
            onClick={refetch}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-105"
          >
            <RefreshCw className="size-4" /> Try again
          </button>
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
                <button
                  key={m.id}
                  type="button"
                  onClick={() => navigate('/org')}
                  title="View reporting line"
                  className="group flex flex-col items-center rounded-xl border border-line p-4 text-center transition hover:border-primary-300 hover:shadow-md"
                >
                  <div className="grid size-14 place-items-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-sm font-bold text-white transition group-hover:scale-105">
                    {m.initials}
                  </div>
                  <p className="mt-2.5 text-sm font-semibold leading-tight text-content group-hover:text-primary-600 dark:group-hover:text-primary-300">
                    {m.name}
                  </p>
                  <p className="mt-0.5 text-xs text-subtle">{m.title}</p>
                </button>
              ))}
        </div>
      )}

      {!loading && !error && visible.length === 0 && (
        <p className="mt-5 text-center text-sm text-subtle">No employees match your search.</p>
      )}
    </Card>
  )
}
