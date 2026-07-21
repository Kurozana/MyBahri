import { useEffect, useState } from 'react'
import { ClipboardList, Plus, Clock, Filter, TriangleAlert, Check, X } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Skeleton } from '@/components/ui/Skeleton'
import { useApi } from '@/hooks/useApi'
import { portalApi } from '@/services/portal'
import { useToast } from '@/components/ui/Toast'
import type { TodoDto } from '@/services/types'
import { cn } from '@/lib/cn'

const filters = ['All', 'Pending', 'Approved'] as const

export function TodoList() {
  const toast = useToast()
  const [filter, setFilter] = useState<(typeof filters)[number]>('All')
  const { data, loading, error } = useApi(portalApi.getTodos)

  const [items, setItems] = useState<TodoDto[]>([])
  const [adding, setAdding] = useState(false)
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (data) setItems(data)
  }, [data])

  const visible = items.filter((t) => {
    if (filter === 'Pending') return t.status === 'Pending Approval'
    if (filter === 'Approved') return t.status === 'Completed'
    return true
  })
  const pendingCount = items.filter((t) => t.status === 'Pending Approval').length

  const submitNew = async () => {
    const title = draft.trim()
    if (!title) return
    setBusy(true)
    try {
      const created = await portalApi.addTodo({ title })
      setItems((list) => [created, ...list])
      setDraft('')
      setAdding(false)
      toast('Request submitted')
    } catch {
      toast('Could not submit request', 'info')
    } finally {
      setBusy(false)
    }
  }

  const approve = async (todo: TodoDto) => {
    setItems((list) => list.map((t) => (t.id === todo.id ? { ...t, status: 'Completed' } : t)))
    try {
      await portalApi.updateTodoStatus(todo.id, 'Completed')
      toast(`"${todo.title}" marked complete`)
    } catch {
      setItems((list) =>
        list.map((t) => (t.id === todo.id ? { ...t, status: 'Pending Approval' } : t)),
      )
      toast('Update failed', 'info')
    }
  }

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-accent-soft text-primary-600 dark:text-primary-300">
            <ClipboardList className="size-[18px]" />
          </span>
          <div>
            <h2 className="text-[17px] font-bold leading-tight text-content">To Do List</h2>
            <p className="text-xs text-subtle">Employee services</p>
          </div>
        </div>
        <span className="grid size-6 place-items-center rounded-full bg-rose-100 text-xs font-bold text-rose-600 dark:bg-rose-400/15 dark:text-rose-300">
          {pendingCount}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <Filter className="size-4 text-subtle" />
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-semibold transition',
              filter === f
                ? 'bg-primary-600 text-white'
                : 'bg-surface-2 text-muted hover:bg-surface-3',
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-2.5">
        {loading &&
          [0, 1].map((i) => (
            <div key={i} className="flex items-center justify-between rounded-xl border border-line p-3.5">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          ))}

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3.5 text-sm text-rose-600 dark:bg-rose-400/10 dark:text-rose-300">
            <TriangleAlert className="size-4" /> Couldn't load your tasks. Please try again.
          </div>
        )}

        {!loading &&
          !error &&
          visible.map((t) => (
            <div
              key={t.id}
              className="group flex items-center justify-between rounded-xl border border-line p-3.5 transition hover:bg-surface-2"
            >
              <div>
                <p className="text-sm font-semibold text-content">{t.title}</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-subtle">
                  <Clock className="size-3.5" /> {t.when}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={t.status === 'Completed' ? 'success' : 'warning'}>{t.status}</Badge>
                {t.status === 'Pending Approval' && (
                  <button
                    onClick={() => approve(t)}
                    title="Mark complete"
                    className="grid size-7 place-items-center rounded-full text-subtle opacity-0 transition hover:bg-emerald-100 hover:text-emerald-600 group-hover:opacity-100 dark:hover:bg-emerald-400/15 dark:hover:text-emerald-300"
                  >
                    <Check className="size-4" />
                  </button>
                )}
              </div>
            </div>
          ))}

        {!loading && !error && visible.length === 0 && (
          <p className="py-4 text-center text-sm text-subtle">Nothing here.</p>
        )}
      </div>

      {adding ? (
        <div className="mt-3 flex items-center gap-2">
          <input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submitNew()
              if (e.key === 'Escape') setAdding(false)
            }}
            placeholder="What do you need?"
            className="flex-1 rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-content outline-none transition placeholder:text-subtle focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-500/20"
          />
          <button
            onClick={submitNew}
            disabled={busy || !draft.trim()}
            className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 text-white transition hover:brightness-105 disabled:opacity-50"
          >
            <Check className="size-4" />
          </button>
          <button
            onClick={() => setAdding(false)}
            className="grid size-10 shrink-0 place-items-center rounded-xl border border-line text-muted transition hover:bg-surface-2"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-line py-3 text-sm font-semibold text-muted transition hover:border-primary-300 hover:bg-accent-soft/40 hover:text-primary-600 dark:hover:text-primary-300"
        >
          <Plus className="size-4" /> Add New
        </button>
      )}
    </Card>
  )
}
