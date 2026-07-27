import { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { useApi } from '@core/hooks/useApi'
import { portalApi } from '@core/api/portal'
import { cn } from '@/lib/cn'

const SEEN_KEY = 'mybahri-seen-release'

/** Dispatched by the admin dashboard after publishing, so the header refreshes. */
export const RELEASE_NOTES_UPDATED = 'release-notes:updated'

export function ReleaseNotesButton() {
  const { data, refetch } = useApi(portalApi.getReleaseNotes)
  const notes = data ?? []
  const [open, setOpen] = useState(false)
  const [seen, setSeen] = useState<string | null>(() => localStorage.getItem(SEEN_KEY))
  const [tab, setTab] = useState<'current' | 'history'>('current')

  // Refresh when a note is published elsewhere in the app.
  useEffect(() => {
    const handler = () => refetch()
    window.addEventListener(RELEASE_NOTES_UPDATED, handler)
    return () => window.removeEventListener(RELEASE_NOTES_UPDATED, handler)
  }, [refetch])

  const seenIdx = notes.findIndex((r) => r.version === seen)
  const unread = notes.length === 0 ? 0 : seenIdx === -1 ? notes.length : seenIdx

  const openModal = () => {
    setOpen(true)
    setTab('current')
    if (notes[0]) {
      localStorage.setItem(SEEN_KEY, notes[0].version)
      setSeen(notes[0].version)
    }
  }

  const latest = notes[0]

  return (
    <>
      <button
        onClick={openModal}
        title="What's new"
        aria-label="Release notes"
        className={cn(
          'relative grid size-9 place-items-center rounded-full border transition',
          unread > 0
            ? 'border-primary-300 bg-accent-soft text-primary-600 shadow-sm shadow-primary-500/20 dark:text-primary-300'
            : 'border-line bg-surface text-muted hover:bg-surface-2',
        )}
      >
        <Sparkles className="size-[18px]" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary-600 px-1 text-[10px] font-bold text-white">
            {unread}
          </span>
        )}
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="What's New">
        <div className="px-5 pb-5">
          <div className="mb-4 mt-1 flex gap-1 rounded-xl bg-surface-2 p-1 text-sm font-semibold">
            {(
              [
                ['current', "What's New"],
                ['history', 'History'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={cn(
                  'flex-1 rounded-lg px-3 py-1.5 transition',
                  tab === id
                    ? 'bg-surface text-primary-600 shadow-sm dark:text-primary-300'
                    : 'text-muted hover:text-content',
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === 'current' ? (
            latest ? (
              <ReleaseBlock version={latest.version} date={latest.date} items={latest.items} />
            ) : (
              <p className="py-6 text-center text-sm text-subtle">No release notes yet.</p>
            )
          ) : (
            <div className="max-h-[50vh] space-y-5 overflow-y-auto pr-1">
              {notes.map((r) => (
                <ReleaseBlock key={r.version} version={r.version} date={r.date} items={r.items} />
              ))}
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}

function ReleaseBlock({
  version,
  date,
  items,
}: {
  version: string
  date: string
  items: string[]
}) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-bold text-primary-700 dark:text-primary-300">
          v{version}
        </span>
        <span className="text-xs text-subtle">{date}</span>
      </div>
      <ul className="mt-2.5 space-y-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2 text-sm text-muted">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary-500" />
            {it}
          </li>
        ))}
      </ul>
    </div>
  )
}
