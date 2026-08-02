import { useState } from 'react'
import { HardHat, Eye, X, Flag } from 'lucide-react'
import { FEATURE_FLAGS, setFlag, setMaintenance } from '@/lib/adminSettings'
import { useFeatureFlags, useMaintenance } from '@/hooks/useAdminSettings'
import { MaintenancePage } from '@/components/ui/MaintenancePage'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/cn'

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={cn(
        'relative h-6 w-11 shrink-0 rounded-full transition-colors',
        on ? 'bg-primary-600' : 'bg-surface-3',
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 size-5 rounded-full bg-white shadow transition-all',
          on ? 'left-[22px]' : 'left-0.5',
        )}
      />
    </button>
  )
}

function toLocalInput(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}

export default function SettingsPage() {
  const toast = useToast()
  const flags = useFeatureFlags()
  const maintenance = useMaintenance()

  const [message, setMessage] = useState(maintenance.message)
  const [until, setUntil] = useState(toLocalInput(maintenance.until))
  const [preview, setPreview] = useState(false)

  const apply = (enabled: boolean) => {
    setMaintenance({
      enabled,
      message,
      until: until ? new Date(until).toISOString() : null,
    })
    toast(enabled ? 'Maintenance mode ON' : 'Maintenance mode OFF')
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Maintenance mode */}
      <section className="rounded-2xl border border-line bg-surface p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300">
              <HardHat className="size-5" />
            </span>
            <div>
              <h2 className="font-bold text-content">Maintenance mode</h2>
              <p className="mt-0.5 text-sm text-subtle">
                Show everyone a friendly “be right back” page with a countdown. Admins still get in.
              </p>
            </div>
          </div>
          <Toggle on={maintenance.enabled} onChange={apply} />
        </div>

        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-muted">Message</span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
              className="w-full resize-none rounded-xl border border-line bg-surface p-3 text-sm text-content outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-500/20"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-muted">Back online at</span>
            <input
              type="datetime-local"
              value={until}
              onChange={(e) => setUntil(e.target.value)}
              className="rounded-xl border border-line bg-surface px-3 py-2 text-sm text-content outline-none transition focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-500/20"
            />
          </label>

          <div className="flex gap-2">
            {maintenance.enabled && (
              <button
                onClick={() => apply(true)}
                className="rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-105"
              >
                Save changes
              </button>
            )}
            <button
              onClick={() => setPreview(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-line px-4 py-2 text-sm font-semibold text-muted transition hover:bg-surface-2"
            >
              <Eye className="size-4" /> Preview
            </button>
          </div>
        </div>
      </section>

      {/* Feature flags */}
      <section className="rounded-2xl border border-line bg-surface p-6">
        <div className="flex items-center gap-2.5">
          <span className="grid size-10 place-items-center rounded-xl bg-accent-soft text-primary-600 dark:text-primary-300">
            <Flag className="size-5" />
          </span>
          <div>
            <h2 className="font-bold text-content">Feature flags</h2>
            <p className="mt-0.5 text-sm text-subtle">Turn portal features on or off.</p>
          </div>
        </div>

        <div className="mt-4 divide-y divide-line">
          {FEATURE_FLAGS.map((f) => (
            <div key={f.key} className="flex items-center justify-between gap-4 py-3">
              <div>
                <p className="text-sm font-semibold text-content">{f.label}</p>
                <p className="text-xs text-subtle">{f.desc}</p>
              </div>
              <Toggle on={flags[f.key]} onChange={(v) => setFlag(f.key, v)} />
            </div>
          ))}
        </div>
      </section>

      {preview && (
        <div className="fixed inset-0 z-[60]">
          <button
            onClick={() => setPreview(false)}
            className="absolute right-4 top-4 z-[61] grid size-9 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25"
          >
            <X className="size-5" />
          </button>
          <MaintenancePage
            maintenance={{
              enabled: true,
              message,
              until: until ? new Date(until).toISOString() : null,
            }}
          />
        </div>
      )}
    </div>
  )
}
