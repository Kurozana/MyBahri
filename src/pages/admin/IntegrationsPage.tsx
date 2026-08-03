import { useMemo, useState } from 'react'
import {
  Search,
  Download,
  Plug,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Timer,
  ArrowDownLeft,
  ArrowUpRight,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useApi } from '@core/hooks/useApi'
import { adminApi } from '@core/api/admin'
import type {
  IntegrationDto,
  IntegrationLogDto,
  IntegrationStatus,
} from '@core/api/types'
import { Skeleton } from '@/components/ui/Skeleton'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'
import { exportCsv } from '@/lib/exportCsv'
import { cn } from '@/lib/cn'

type ClassFilter = 'All' | 'System' | 'Application'

const STATUS: Record<
  IntegrationStatus,
  { label: string; icon: LucideIcon; dot: string; text: string }
> = {
  operational: {
    label: 'Operational',
    icon: CheckCircle2,
    dot: 'bg-emerald-500',
    text: 'text-emerald-600 dark:text-emerald-400',
  },
  degraded: {
    label: 'Degraded',
    icon: AlertTriangle,
    dot: 'bg-amber-500',
    text: 'text-amber-600 dark:text-amber-400',
  },
  down: {
    label: 'Down',
    icon: XCircle,
    dot: 'bg-rose-500',
    text: 'text-rose-600 dark:text-rose-400',
  },
}

function Stat({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <span className="grid size-10 place-items-center rounded-xl bg-accent-soft text-primary-600 dark:text-primary-300">
        <Icon className="size-5" />
      </span>
      <p className="mt-3 text-2xl font-extrabold text-content">{value}</p>
      <p className="text-sm text-subtle">{label}</p>
    </div>
  )
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={cn(
        'relative h-6 w-11 shrink-0 rounded-full transition-colors',
        on ? 'bg-primary-600' : 'bg-surface-3',
      )}
      aria-pressed={on}
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

function statusCodeTone(code: number) {
  if (code >= 500) return 'text-rose-600 dark:text-rose-400'
  if (code >= 400) return 'text-amber-600 dark:text-amber-400'
  return 'text-emerald-600 dark:text-emerald-400'
}

export default function IntegrationsPage() {
  const toast = useToast()
  const { data, loading, refetch } = useApi(adminApi.getIntegrations)
  const { data: logsData, loading: logsLoading } = useApi(adminApi.getIntegrationLogs)
  const items = data ?? []
  const logs = logsData ?? []

  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<ClassFilter>('All')
  const [selected, setSelected] = useState<IntegrationDto | null>(null)

  const visible = useMemo(() => {
    const needle = q.toLowerCase()
    return items.filter((it) => {
      const matchesClass = filter === 'All' || it.classification === filter
      const matchesText =
        `${it.name} ${it.provider} ${it.category} ${it.endpoint}`.toLowerCase().includes(needle)
      return matchesClass && matchesText
    })
  }, [items, q, filter])

  const stats = useMemo(() => {
    const operational = items.filter((i) => i.status === 'operational').length
    const trouble = items.filter((i) => i.status !== 'operational').length
    const live = items.filter((i) => i.enabled)
    const avgLatency = live.length
      ? Math.round(live.reduce((sum, i) => sum + i.avgLatencyMs, 0) / live.length)
      : 0
    return { total: items.length, operational, trouble, avgLatency }
  }, [items])

  const toggleEnabled = async (it: IntegrationDto, enabled: boolean) => {
    try {
      await adminApi.setIntegrationEnabled(it.id, enabled)
      refetch()
      toast(enabled ? `${it.name} enabled` : `${it.name} turned off`)
    } catch {
      toast('Could not update the integration', 'info')
    }
  }

  const exportRegistry = () => {
    exportCsv(
      'integrations',
      visible.map((i) => ({
        Name: i.name,
        Classification: i.classification,
        Provider: i.provider,
        Category: i.category,
        Method: i.method,
        Endpoint: i.endpoint,
        Status: STATUS[i.status].label,
        Enabled: i.enabled ? 'Yes' : 'No',
        'Uptime %': i.uptime,
        'Avg latency (ms)': i.avgLatencyMs,
        'Calls today': i.callsToday,
        'Last checked': i.lastChecked,
      })),
    )
    toast('Exported registry to Excel')
  }

  const exportLogs = () => {
    exportCsv(
      'integration-logs',
      logs.map((l) => ({
        Timestamp: l.at,
        Integration: l.integration,
        Direction: l.direction,
        Method: l.method,
        Endpoint: l.endpoint,
        'Status code': l.statusCode,
        'Latency (ms)': l.latencyMs,
        Note: l.message ?? '',
      })),
    )
    toast('Exported logs to Excel')
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          [0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-28 rounded-2xl" />)
        ) : (
          <>
            <Stat icon={Plug} label="Integrations" value={String(stats.total)} />
            <Stat icon={CheckCircle2} label="Operational" value={String(stats.operational)} />
            <Stat icon={AlertTriangle} label="Needs attention" value={String(stats.trouble)} />
            <Stat icon={Timer} label="Avg latency" value={`${stats.avgLatency} ms`} />
          </>
        )}
      </div>

      {/* Registry */}
      <section>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, provider, category or endpoint…"
              className="w-full max-w-md rounded-full border border-line bg-surface py-2 pl-9 pr-3 text-sm text-content outline-none transition placeholder:text-subtle focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-500/20"
            />
          </div>

          <div className="flex rounded-full border border-line bg-surface p-0.5">
            {(['All', 'System', 'Application'] as ClassFilter[]).map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={cn(
                  'rounded-full px-3 py-1.5 text-xs font-semibold transition',
                  filter === c
                    ? 'bg-accent-soft text-primary-700 dark:text-primary-300'
                    : 'text-muted hover:text-content',
                )}
              >
                {c}
              </button>
            ))}
          </div>

          <button
            onClick={exportRegistry}
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-2 text-xs font-semibold text-muted transition hover:bg-surface-2"
          >
            <Download className="size-4" /> Export to Excel
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-line">
          <table className="w-full text-sm">
            <thead className="bg-surface-2 text-left text-xs font-semibold uppercase tracking-wide text-subtle">
              <tr>
                <th className="px-4 py-3">Integration</th>
                <th className="hidden px-4 py-3 md:table-cell">Type</th>
                <th className="hidden px-4 py-3 lg:table-cell">Endpoint</th>
                <th className="px-4 py-3">Status</th>
                <th className="hidden px-4 py-3 sm:table-cell">Latency</th>
                <th className="px-4 py-3 text-right">Enabled</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading &&
                [0, 1, 2, 3, 4].map((i) => (
                  <tr key={i}>
                    <td className="px-4 py-3" colSpan={6}>
                      <Skeleton className="h-6 w-full" />
                    </td>
                  </tr>
                ))}

              {!loading &&
                visible.map((it) => {
                  const s = STATUS[it.status]
                  return (
                    <tr key={it.id} className="bg-surface transition hover:bg-surface-2">
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelected(it)}
                          className="text-left"
                          title="View details"
                        >
                          <span className="font-semibold text-content hover:text-primary-600 dark:hover:text-primary-300">
                            {it.name}
                          </span>
                          <span className="block text-xs text-subtle">
                            {it.provider} · {it.category}
                          </span>
                        </button>
                      </td>
                      <td className="hidden px-4 py-3 md:table-cell">
                        <Badge tone={it.classification === 'System' ? 'info' : 'neutral'}>
                          {it.classification}
                        </Badge>
                      </td>
                      <td className="hidden max-w-[220px] px-4 py-3 lg:table-cell">
                        <code className="block truncate rounded bg-surface-2 px-1.5 py-0.5 text-xs text-muted">
                          {it.method} {it.endpoint}
                        </code>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('inline-flex items-center gap-1.5 font-semibold', s.text)}>
                          <span className={cn('size-2 rounded-full', s.dot)} />
                          {s.label}
                        </span>
                      </td>
                      <td className="hidden whitespace-nowrap px-4 py-3 text-muted sm:table-cell">
                        {it.enabled ? `${it.avgLatencyMs} ms` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end">
                          <Toggle on={it.enabled} onChange={(v) => toggleEnabled(it, v)} />
                        </div>
                      </td>
                    </tr>
                  )
                })}

              {!loading && visible.length === 0 && (
                <tr>
                  <td colSpan={6} className="bg-surface px-4 py-8 text-center text-sm text-subtle">
                    No integrations match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Activity log */}
      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-subtle">Recent activity</h2>
          <button
            onClick={exportLogs}
            className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-2 text-xs font-semibold text-muted transition hover:bg-surface-2"
          >
            <Download className="size-4" /> Export to Excel
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-line">
          <table className="w-full text-sm">
            <thead className="bg-surface-2 text-left text-xs font-semibold uppercase tracking-wide text-subtle">
              <tr>
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">Integration</th>
                <th className="hidden px-4 py-3 lg:table-cell">Call</th>
                <th className="px-4 py-3">Result</th>
                <th className="hidden px-4 py-3 sm:table-cell">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {logsLoading &&
                [0, 1, 2, 3].map((i) => (
                  <tr key={i}>
                    <td className="px-4 py-3" colSpan={5}>
                      <Skeleton className="h-5 w-full" />
                    </td>
                  </tr>
                ))}

              {!logsLoading &&
                logs.map((l: IntegrationLogDto) => (
                  <tr key={l.id} className="bg-surface transition hover:bg-surface-2">
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-subtle">{l.at}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 font-medium text-content">
                        {l.direction === 'inbound' ? (
                          <ArrowDownLeft className="size-3.5 text-subtle" />
                        ) : (
                          <ArrowUpRight className="size-3.5 text-subtle" />
                        )}
                        {l.integration}
                      </span>
                    </td>
                    <td className="hidden max-w-[240px] px-4 py-3 lg:table-cell">
                      <code className="block truncate rounded bg-surface-2 px-1.5 py-0.5 text-xs text-muted">
                        {l.method} {l.endpoint}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('font-semibold', statusCodeTone(l.statusCode))}>
                        {l.statusCode}
                      </span>
                      {l.message && <span className="ml-2 text-xs text-subtle">{l.message}</span>}
                    </td>
                    <td className="hidden whitespace-nowrap px-4 py-3 text-muted sm:table-cell">
                      {l.latencyMs} ms
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Detail modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name ?? ''}>
        {selected && (
          <div className="space-y-4 px-5 pb-5">
            <p className="text-sm text-muted">{selected.description}</p>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <Field label="Classification" value={selected.classification} />
              <Field label="Provider" value={selected.provider} />
              <Field label="Category" value={selected.category} />
              <Field label="Method" value={selected.method} />
              <Field label="Status" value={STATUS[selected.status].label} />
              <Field label="Uptime" value={`${selected.uptime}%`} />
              <Field label="Avg latency" value={`${selected.avgLatencyMs} ms`} />
              <Field label="Calls today" value={selected.callsToday.toLocaleString()} />
            </div>

            <div>
              <p className="mb-1 text-xs font-semibold text-muted">Endpoint</p>
              <code className="block break-all rounded-lg bg-surface-2 px-3 py-2 text-xs text-content">
                {selected.method} {selected.endpoint}
              </code>
            </div>

            <p className="text-xs text-subtle">Last checked {selected.lastChecked}</p>
          </div>
        )}
      </Modal>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface-2 px-3 py-2">
      <p className="text-xs text-subtle">{label}</p>
      <p className="font-semibold text-content">{value}</p>
    </div>
  )
}
