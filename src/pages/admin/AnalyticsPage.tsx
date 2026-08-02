import { Users2, Activity, Clock, FileText } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useApi } from '@core/hooks/useApi'
import { adminApi } from '@core/api/admin'
import { Skeleton } from '@/components/ui/Skeleton'

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

export default function AnalyticsPage() {
  const { data, loading } = useApi(adminApi.getAnalytics)

  if (loading || !data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
    )
  }

  const maxService = Math.max(...data.mostUsedServices.map((s) => s.count))
  const maxEvent = Math.max(...data.topEvents.map((e) => e.registered))

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={Users2} label="Total users" value={data.totalUsers.toLocaleString()} />
        <Stat icon={Activity} label="Active today" value={data.activeToday.toLocaleString()} />
        <Stat icon={Clock} label="Punches today" value={data.punchesToday.toLocaleString()} />
        <Stat icon={FileText} label="Requests this week" value={data.requestsThisWeek.toLocaleString()} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-line bg-surface p-6">
          <h2 className="mb-4 font-bold text-content">Most-used services</h2>
          <div className="space-y-3">
            {data.mostUsedServices.map((s) => (
              <div key={s.name}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-content">{s.name}</span>
                  <span className="font-semibold text-muted">{s.count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-700"
                    style={{ width: `${(s.count / maxService) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-surface p-6">
          <h2 className="mb-4 font-bold text-content">Top events by registration</h2>
          <div className="space-y-3">
            {data.topEvents.map((e) => (
              <div key={e.name}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-content">{e.name}</span>
                  <span className="font-semibold text-muted">{e.registered}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-mint to-primary-500"
                    style={{ width: `${(e.registered / maxEvent) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
