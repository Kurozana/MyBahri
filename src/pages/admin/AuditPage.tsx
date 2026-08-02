import { useState } from 'react'
import { Search } from 'lucide-react'
import { useApi } from '@core/hooks/useApi'
import { adminApi } from '@core/api/admin'
import { Skeleton } from '@/components/ui/Skeleton'

export default function AuditPage() {
  const { data, loading } = useApi(adminApi.getAudit)
  const entries = data ?? []
  const [q, setQ] = useState('')

  const visible = entries.filter((e) =>
    `${e.actor} ${e.action} ${e.target}`.toLowerCase().includes(q.toLowerCase()),
  )

  return (
    <div>
      <div className="relative mb-4 max-w-xs">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search the log…"
          className="w-full rounded-full border border-line bg-surface py-2 pl-9 pr-3 text-sm text-content outline-none transition placeholder:text-subtle focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-500/20"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-line">
        <table className="w-full text-sm">
          <thead className="bg-surface-2 text-left text-xs font-semibold uppercase tracking-wide text-subtle">
            <tr>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">Who</th>
              <th className="px-4 py-3">Action</th>
              <th className="hidden px-4 py-3 sm:table-cell">Target</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {loading &&
              [0, 1, 2, 3].map((i) => (
                <tr key={i}>
                  <td className="px-4 py-3" colSpan={4}>
                    <Skeleton className="h-5 w-full" />
                  </td>
                </tr>
              ))}
            {!loading &&
              visible.map((e) => (
                <tr key={e.id} className="bg-surface transition hover:bg-surface-2">
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-subtle">{e.at}</td>
                  <td className="px-4 py-3 font-semibold text-content">{e.actor}</td>
                  <td className="px-4 py-3 text-muted">{e.action}</td>
                  <td className="hidden px-4 py-3 text-subtle sm:table-cell">{e.target}</td>
                </tr>
              ))}
            {!loading && visible.length === 0 && (
              <tr>
                <td colSpan={4} className="bg-surface px-4 py-8 text-center text-sm text-subtle">
                  No matching entries.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
