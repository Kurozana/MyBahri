import { useState } from 'react'
import { ClipboardList, Plus, Clock, Filter, TriangleAlert } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { useApi } from '@/hooks/useApi'
import { portalApi } from '@/services/portal'
import { cn } from '@/lib/cn'

const filters = ['All', 'Pending', 'Approved'] as const

export function TodoList() {
  const [filter, setFilter] = useState<(typeof filters)[number]>('All')
  const { data: todos, loading, error } = useApi(portalApi.getTodos)

  const visible = (todos ?? []).filter((t) => {
    if (filter === 'Pending') return t.status === 'Pending Approval'
    if (filter === 'Approved') return t.status === 'Completed'
    return true
  })

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-primary-50 text-primary-600">
            <ClipboardList className="size-[18px]" />
          </span>
          <div>
            <h2 className="text-[17px] font-bold leading-tight text-ink">To Do List</h2>
            <p className="text-xs text-slate-400">Employee services</p>
          </div>
        </div>
        <span className="grid size-6 place-items-center rounded-full bg-rose-100 text-xs font-bold text-rose-600">
          {todos?.length ?? 0}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Filter className="size-4 text-slate-400" />
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-semibold transition',
              filter === f
                ? 'bg-primary-600 text-white'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200',
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-2.5">
        {loading &&
          [0, 1].map((i) => (
            <div key={i} className="flex items-center justify-between rounded-xl border border-slate-200/80 p-3.5">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          ))}

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3.5 text-sm text-rose-600">
            <TriangleAlert className="size-4" /> Couldn't load your tasks. Please try again.
          </div>
        )}

        {!loading &&
          !error &&
          visible.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between rounded-xl border border-slate-200/80 p-3.5 transition hover:bg-slate-50"
            >
              <div>
                <p className="text-sm font-semibold text-ink">{t.title}</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock className="size-3.5" /> {t.when}
                </p>
              </div>
              <Badge tone={t.status === 'Completed' ? 'success' : 'warning'}>{t.status}</Badge>
            </div>
          ))}
      </div>

      <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-3 text-sm font-semibold text-slate-500 transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-600">
        <Plus className="size-4" /> Add New
      </button>
    </Card>
  )
}
