import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Rocket, Send, Lock, Plus, ChevronDown, X } from 'lucide-react'
import { useApi } from '@core/hooks/useApi'
import { portalApi } from '@core/api/portal'
import { can } from '@core/auth/permissions'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/Toast'
import { RELEASE_NOTES_UPDATED } from '@/components/layout/ReleaseNotesButton'
import { cn } from '@/lib/cn'

type Bump = 'patch' | 'minor' | 'major'

function todayISO() {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/** Next version numbers for each bump type, derived from the latest release. */
function nextVersions(latest: string | undefined) {
  const [maj, min, pat] = (latest ?? '0.0.0').split('.').map((n) => Number(n) || 0)
  return {
    patch: `${maj}.${min}.${pat + 1}`,
    minor: `${maj}.${min + 1}.0`,
    major: `${maj + 1}.0.0`,
  }
}

export default function ReleaseNotesAdminPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const { user } = useAuth()
  const allowed = can(user?.role, 'content.manage')

  const { data, refetch } = useApi(portalApi.getReleaseNotes)
  const notes = data ?? []

  const [composing, setComposing] = useState(false)
  const [bump, setBump] = useState<Bump>('patch')
  const [dateISO, setDateISO] = useState(todayISO())
  const [itemsText, setItemsText] = useState('')
  const [busy, setBusy] = useState(false)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  if (!allowed) {
    return (
      <div className="mx-auto grid min-h-[50vh] max-w-md place-items-center text-center">
        <div>
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-surface-2 text-subtle">
            <Lock className="size-6" />
          </span>
          <h1 className="mt-4 text-lg font-bold text-content">No access</h1>
          <p className="mt-1 text-sm text-subtle">
            Release management requires the content-management permission.
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

  const versions = nextVersions(notes[0]?.version)
  const bumps: { id: Bump; label: string }[] = [
    { id: 'patch', label: 'Patch' },
    { id: 'minor', label: 'Minor' },
    { id: 'major', label: 'Major' },
  ]

  const toggle = (v: string) =>
    setExpanded((s) => {
      const next = new Set(s)
      next.has(v) ? next.delete(v) : next.add(v)
      return next
    })

  const resetForm = () => {
    setComposing(false)
    setBump('patch')
    setDateISO(todayISO())
    setItemsText('')
  }

  const publish = async () => {
    const items = itemsText
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
    if (items.length === 0) {
      toast('Add at least one item', 'info')
      return
    }
    setBusy(true)
    try {
      await portalApi.publishReleaseNote({
        version: versions[bump],
        date: formatDate(dateISO),
        items,
      })
      window.dispatchEvent(new Event(RELEASE_NOTES_UPDATED))
      refetch()
      resetForm()
      toast(`Published v${versions[bump]} 🎉`)
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
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-accent-soft text-primary-600 dark:text-primary-300">
              <Rocket className="size-[18px]" />
            </span>
            <div>
              <h1 className="text-lg font-bold text-content">Release Management</h1>
              <p className="text-xs text-subtle">Publish updates for everyone in the portal.</p>
            </div>
          </div>
          {!composing && (
            <button
              onClick={() => setComposing(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-105"
            >
              <Plus className="size-4" /> New release
            </button>
          )}
        </div>

        {/* Compose new release */}
        {composing && (
          <div className="mt-5 rounded-xl border border-line bg-surface-2/50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-content">New release</span>
              <button onClick={resetForm} className="text-subtle transition hover:text-content">
                <X className="size-4" />
              </button>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto]">
              <div>
                <span className="mb-1.5 block text-xs font-semibold text-muted">Version bump</span>
                <div className="flex gap-1.5">
                  {bumps.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setBump(b.id)}
                      className={cn(
                        'flex flex-col items-center rounded-lg border px-3 py-1.5 text-xs font-semibold transition',
                        bump === b.id
                          ? 'border-primary-400 bg-accent-soft text-primary-700 dark:text-primary-300'
                          : 'border-line text-muted hover:bg-surface-2',
                      )}
                    >
                      {b.label}
                      <span className="mt-0.5 font-mono text-[11px] font-normal opacity-80">
                        v{versions[b.id]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-muted">Date</span>
                <input
                  type="date"
                  value={dateISO}
                  onChange={(e) => setDateISO(e.target.value)}
                  className="rounded-xl border border-line bg-surface px-3 py-2 text-sm text-content outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-500/20"
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
                placeholder={'Added a new dashboard widget.\nFixed a display issue on the calendar.'}
                className="w-full resize-none rounded-xl border border-line bg-surface p-3 text-sm text-content outline-none transition placeholder:text-subtle focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-500/20"
              />
            </label>

            <button
              onClick={publish}
              disabled={busy}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-105 disabled:opacity-60"
            >
              <Send className="size-4" /> {busy ? 'Publishing…' : `Publish v${versions[bump]}`}
            </button>
          </div>
        )}
      </div>

      {/* Published releases — collapsed by default */}
      <div className="mt-6">
        <h2 className="mb-3 text-sm font-semibold text-subtle">Published ({notes.length})</h2>
        <div className="space-y-2.5">
          {notes.map((r) => {
            const open = expanded.has(r.version)
            return (
              <div key={r.version} className="overflow-hidden rounded-2xl border border-line bg-surface">
                <button
                  onClick={() => toggle(r.version)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-surface-2"
                >
                  <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-bold text-primary-700 dark:text-primary-300">
                    v{r.version}
                  </span>
                  <span className="text-xs text-subtle">{r.date}</span>
                  <span className="ml-auto text-xs text-subtle">{r.items.length} items</span>
                  <ChevronDown
                    className={cn('size-4 text-subtle transition-transform', open && 'rotate-180')}
                  />
                </button>
                {open && (
                  <ul className="space-y-1.5 border-t border-line px-4 py-3">
                    {r.items.map((it, i) => (
                      <li key={i} className="flex gap-2 text-sm text-muted">
                        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary-500" />
                        {it}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
