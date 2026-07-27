import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles, Send, Lock } from 'lucide-react'
import { useApi } from '@core/hooks/useApi'
import { portalApi } from '@core/api/portal'
import { can } from '@core/auth/permissions'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/Toast'
import { RELEASE_NOTES_UPDATED } from '@/components/layout/ReleaseNotesButton'

function todayLabel() {
  return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function ReleaseNotesAdminPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const { user } = useAuth()
  const allowed = can(user?.role, 'content.manage')

  const { data, refetch } = useApi(portalApi.getReleaseNotes)
  const notes = data ?? []

  const [version, setVersion] = useState('')
  const [date, setDate] = useState(todayLabel())
  const [itemsText, setItemsText] = useState('')
  const [busy, setBusy] = useState(false)

  if (!allowed) {
    return (
      <div className="mx-auto grid min-h-[50vh] max-w-md place-items-center text-center">
        <div>
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-surface-2 text-subtle">
            <Lock className="size-6" />
          </span>
          <h1 className="mt-4 text-lg font-bold text-content">No access</h1>
          <p className="mt-1 text-sm text-subtle">
            Publishing release notes requires the content-management permission.
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 rounded-xl border border-line px-4 py-2 text-sm font-medium text-muted transition hover:bg-surface-2"
          >
            Back home
          </button>
        </div>
      </div>
    )
  }

  const publish = async () => {
    const items = itemsText
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
    if (!version.trim() || items.length === 0) {
      toast('Add a version and at least one item', 'info')
      return
    }
    setBusy(true)
    try {
      await portalApi.publishReleaseNote({ version: version.trim(), date, items })
      window.dispatchEvent(new Event(RELEASE_NOTES_UPDATED))
      refetch()
      setVersion('')
      setItemsText('')
      setDate(todayLabel())
      toast('Release notes published 🎉')
    } catch {
      toast('Could not publish', 'info')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-muted transition hover:bg-surface-2"
      >
        <ArrowLeft className="size-4" /> Back
      </button>

      <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-accent-soft text-primary-600 dark:text-primary-300">
            <Sparkles className="size-[18px]" />
          </span>
          <div>
            <h1 className="text-lg font-bold text-content">Release Notes</h1>
            <p className="text-xs text-subtle">Publish an update for everyone in the portal.</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_1fr]">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-muted">Version</span>
            <input
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="e.g. 0.3.0"
              className="w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm text-content outline-none transition placeholder:text-subtle focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-500/20"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-muted">Date</span>
            <input
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-line bg-surface px-3 py-2.5 text-sm text-content outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-500/20"
            />
          </label>
        </div>

        <label className="mt-4 block">
          <span className="mb-1.5 block text-xs font-semibold text-muted">
            What's new (one item per line)
          </span>
          <textarea
            value={itemsText}
            onChange={(e) => setItemsText(e.target.value)}
            rows={5}
            placeholder={'Added a new dashboard widget.\nFixed various bugs.'}
            className="w-full resize-none rounded-xl border border-line bg-surface p-3 text-sm text-content outline-none transition placeholder:text-subtle focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-500/20"
          />
        </label>

        <button
          onClick={publish}
          disabled={busy}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-105 disabled:opacity-60"
        >
          <Send className="size-4" /> {busy ? 'Publishing…' : 'Publish'}
        </button>
      </div>

      <div className="mt-6">
        <h2 className="mb-3 text-sm font-semibold text-subtle">Published ({notes.length})</h2>
        <div className="space-y-4">
          {notes.map((r) => (
            <div key={r.version} className="rounded-2xl border border-line bg-surface p-4">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-bold text-primary-700 dark:text-primary-300">
                  v{r.version}
                </span>
                <span className="text-xs text-subtle">{r.date}</span>
              </div>
              <ul className="mt-2 space-y-1">
                {r.items.map((it, i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary-500" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
