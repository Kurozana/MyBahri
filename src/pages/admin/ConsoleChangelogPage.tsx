import { History, Sparkles, Wrench, Bug } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useApi } from '@core/hooks/useApi'
import { adminApi } from '@core/api/admin'
import type { AdminNoteDto } from '@core/api/types'
import { Skeleton } from '@/components/ui/Skeleton'
import { Badge } from '@/components/ui/Badge'

const tagMeta: Record<AdminNoteDto['tag'], { label: string; tone: 'success' | 'info' | 'warning'; icon: LucideIcon }> = {
  new: { label: 'New', tone: 'success', icon: Sparkles },
  improved: { label: 'Improved', tone: 'info', icon: Wrench },
  fixed: { label: 'Fixed', tone: 'warning', icon: Bug },
}

/** Groups entries by their period label, preserving order. */
function groupByPeriod(notes: AdminNoteDto[]) {
  const groups: { period: string; entries: AdminNoteDto[] }[] = []
  for (const note of notes) {
    const last = groups[groups.length - 1]
    if (last && last.period === note.date) last.entries.push(note)
    else groups.push({ period: note.date, entries: [note] })
  }
  return groups
}

export default function ConsoleChangelogPage() {
  const { data, loading } = useApi(adminApi.getAdminNotes)
  const groups = groupByPeriod(data ?? [])

  return (
    <div className="max-w-3xl">
      <div className="mb-5 flex items-start gap-3 rounded-2xl border border-line bg-surface-2 p-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-primary-600 dark:text-primary-300">
          <History className="size-5" />
        </span>
        <div>
          <h2 className="font-bold text-content">Console changelog</h2>
          <p className="mt-0.5 text-sm text-subtle">
            Changes to the administration side of the portal. These are separate from the staff
            release notes and aren't versioned. View-only.
          </p>
        </div>
      </div>

      {loading && (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      )}

      {!loading &&
        groups.map((group) => (
          <section key={group.period} className="mb-6">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-subtle">
              {group.period}
            </h3>
            <div className="space-y-3">
              {group.entries.map((entry) => {
                const meta = tagMeta[entry.tag]
                const Icon = meta.icon
                return (
                  <article key={entry.id} className="rounded-2xl border border-line bg-surface p-5">
                    <div className="flex items-center gap-2.5">
                      <h4 className="font-bold text-content">{entry.title}</h4>
                      <Badge tone={meta.tone}>
                        <Icon className="mr-1 size-3" /> {meta.label}
                      </Badge>
                    </div>
                    <ul className="mt-3 space-y-1.5">
                      {entry.items.map((item, i) => (
                        <li key={i} className="flex gap-2 text-sm text-muted">
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary-400" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                )
              })}
            </div>
          </section>
        ))}

      {!loading && groups.length === 0 && (
        <p className="rounded-2xl border border-dashed border-line py-12 text-center text-sm text-subtle">
          No admin changes recorded yet.
        </p>
      )}
    </div>
  )
}
