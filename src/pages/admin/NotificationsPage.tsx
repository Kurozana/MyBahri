import { useState } from 'react'
import { Send, Bell } from 'lucide-react'
import { useApi } from '@core/hooks/useApi'
import { adminApi } from '@core/api/admin'
import { Skeleton } from '@/components/ui/Skeleton'
import { useToast } from '@/components/ui/Toast'

const AUDIENCES = ['All staff', 'Managers', 'HR', 'Executives', 'IT']

export default function NotificationsPage() {
  const toast = useToast()
  const { data, loading, refetch } = useApi(adminApi.getNotifications)
  const notifications = data ?? []

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [audience, setAudience] = useState(AUDIENCES[0])
  const [busy, setBusy] = useState(false)

  const send = async () => {
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
      toast(`Sent to ${audience} 🔔`)
    } catch {
      toast('Could not send', 'info')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <section className="h-fit rounded-2xl border border-line bg-surface p-6">
        <h2 className="font-bold text-content">Send an announcement</h2>
        <div className="mt-4 space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
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
            onClick={send}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-105 disabled:opacity-60"
          >
            <Send className="size-4" /> {busy ? 'Sending…' : 'Send'}
          </button>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-subtle">Sent ({notifications.length})</h2>
        <div className="space-y-2.5">
          {loading && [0, 1].map((i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}
          {!loading &&
            notifications.map((n) => (
              <div key={n.id} className="rounded-2xl border border-line bg-surface p-4">
                <div className="flex items-start gap-2.5">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent-soft text-primary-600 dark:text-primary-300">
                    <Bell className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-content">{n.title}</p>
                    <p className="mt-0.5 text-sm text-muted">{n.body}</p>
                    <p className="mt-1.5 text-xs text-subtle">
                      {n.audience} · {n.sentAt}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  )
}
