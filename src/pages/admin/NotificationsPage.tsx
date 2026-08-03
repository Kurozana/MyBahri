import { useState } from 'react'
import { Megaphone, Radio, Power } from 'lucide-react'
import { useApi } from '@core/hooks/useApi'
import { adminApi } from '@core/api/admin'
import { Skeleton } from '@/components/ui/Skeleton'
import { Badge } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'

const AUDIENCES = ['All staff', 'Managers', 'HR', 'Executives', 'IT']

export default function NotificationsPage() {
  const toast = useToast()
  const { data, loading, refetch } = useApi(adminApi.getNotifications)
  const announcements = data ?? []

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [audience, setAudience] = useState(AUDIENCES[0])
  const [busy, setBusy] = useState(false)

  const publish = async () => {
    if (!title.trim() || !body.trim()) {
      toast('Add a title and message', 'info')
      return
    }
    setBusy(true)
    try {
      await adminApi.sendNotification({ title: title.trim(), body: body.trim(), audience })
      refetch()
      setTitle('')
      setBody('')
      toast('Announcement is now live 📣')
    } catch {
      toast('Could not publish', 'info')
    } finally {
      setBusy(false)
    }
  }

  const setActive = async (id: string, active: boolean) => {
    await adminApi.setNotificationActive(id, active).catch(() => toast('Update failed', 'info'))
    refetch()
    toast(active ? 'Announcement set live' : 'Announcement turned off')
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <section className="h-fit rounded-2xl border border-line bg-surface p-6">
        <h2 className="font-bold text-content">New announcement</h2>
        <p className="mt-0.5 text-sm text-subtle">
          Publishing makes it the live banner on everyone's home page.
        </p>
        <div className="mt-4 space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title — e.g. Remote work next week"
            className="w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm text-content outline-none transition placeholder:text-subtle focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-500/20"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            placeholder="Message…"
            className="w-full resize-none rounded-xl border border-line bg-surface p-3 text-sm text-content outline-none transition placeholder:text-subtle focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-500/20"
          />
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-muted">Audience</span>
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="rounded-xl border border-line bg-surface px-3 py-2 text-sm text-content outline-none focus:border-primary-400"
            >
              {AUDIENCES.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </label>
          <button
            onClick={publish}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-105 disabled:opacity-60"
          >
            <Megaphone className="size-4" /> {busy ? 'Publishing…' : 'Publish'}
          </button>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-subtle">All announcements ({announcements.length})</h2>
        <div className="space-y-2.5">
          {loading && [0, 1].map((i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
          {!loading &&
            announcements.map((n) => (
              <div
                key={n.id}
                className="rounded-2xl border border-line bg-surface p-4 transition data-[live=true]:border-primary-300"
                data-live={n.active}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold text-content">{n.title}</p>
                      {n.active && (
                        <Badge tone="success">
                          <Radio className="mr-1 size-3" /> Live
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-muted">{n.body}</p>
                    <p className="mt-1.5 text-xs text-subtle">
                      {n.audience} · {n.sentAt}
                    </p>
                  </div>
                  <button
                    onClick={() => setActive(n.id, !n.active)}
                    className={cnBtn(n.active)}
                    title={n.active ? 'Turn off banner' : 'Set as live banner'}
                  >
                    <Power className="size-3.5" /> {n.active ? 'Turn off' : 'Set live'}
                  </button>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  )
}

function cnBtn(active: boolean) {
  return [
    'inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition',
    active
      ? 'border-line text-muted hover:bg-surface-2'
      : 'border-primary-300 text-primary-600 hover:bg-accent-soft dark:text-primary-300',
  ].join(' ')
}
