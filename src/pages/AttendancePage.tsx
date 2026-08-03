import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CalendarDays, LogIn, LogOut } from 'lucide-react'
import { useApi } from '@core/hooks/useApi'
import { portalApi } from '@core/api/portal'
import type { AttendanceRecordDto } from '@core/api/types'
import { Skeleton } from '@/components/ui/Skeleton'
import { cn } from '@/lib/cn'

/** A full workday is 8 hours. */
const FULL_DAY = 8

type Tag = 'Present' | 'Partial' | 'Absent'

function tagFor(hours: number): Tag {
  if (hours >= FULL_DAY) return 'Present'
  if (hours > 0) return 'Partial'
  return 'Absent'
}

const tagStyle: Record<Tag, string> = {
  Present: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-300',
  Partial: 'bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-300',
  Absent: 'bg-rose-100 text-rose-700 dark:bg-rose-400/15 dark:text-rose-300',
}

function fmtDay(iso: string) {
  const d = new Date(`${iso}T00:00:00`)
  return {
    weekday: d.toLocaleDateString(undefined, { weekday: 'long' }),
    date: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
  }
}

export default function AttendancePage() {
  const navigate = useNavigate()
  const { data, loading } = useApi(portalApi.getAttendanceWeek)
  const records = data ?? []

  const counts = records.reduce(
    (acc, r) => {
      acc[tagFor(r.hours)] += 1
      return acc
    },
    { Present: 0, Partial: 0, Absent: 0 } as Record<Tag, number>,
  )
  const totalHours = records.reduce((sum, r) => sum + r.hours, 0)

  return (
    <div className="mx-auto max-w-3xl">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-muted transition hover:bg-surface-2"
      >
        <ArrowLeft className="size-4" /> Back
      </button>

      <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-accent-soft text-primary-600 dark:text-primary-300">
            <CalendarDays className="size-[18px]" />
          </span>
          <div>
            <h1 className="text-lg font-bold text-content">This week's attendance</h1>
            <p className="text-xs text-subtle">
              {loading ? 'Loading…' : `${totalHours.toFixed(1)} hours logged so far`}
            </p>
          </div>
        </div>

        {/* Summary tags */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          {(['Present', 'Partial', 'Absent'] as Tag[]).map((t) => (
            <div key={t} className="rounded-xl border border-line bg-surface-2 p-3 text-center">
              <p className="text-2xl font-extrabold text-content">{counts[t]}</p>
              <span
                className={cn(
                  'mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold',
                  tagStyle[t],
                )}
              >
                {t}
              </span>
            </div>
          ))}
        </div>

        {/* Daily records */}
        <div className="overflow-hidden rounded-2xl border border-line">
          <table className="w-full text-sm">
            <thead className="bg-surface-2 text-left text-xs font-semibold uppercase tracking-wide text-subtle">
              <tr>
                <th className="px-4 py-3">Day</th>
                <th className="px-4 py-3">In</th>
                <th className="px-4 py-3">Out</th>
                <th className="px-4 py-3">Hours</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {loading &&
                [0, 1, 2, 3].map((i) => (
                  <tr key={i}>
                    <td className="px-4 py-3" colSpan={5}>
                      <Skeleton className="h-5 w-full" />
                    </td>
                  </tr>
                ))}

              {!loading &&
                records.map((r: AttendanceRecordDto) => {
                  const d = fmtDay(r.date)
                  const tag = tagFor(r.hours)
                  return (
                    <tr key={r.date} className="bg-surface transition hover:bg-surface-2">
                      <td className="px-4 py-3">
                        <span className="font-semibold text-content">{d.weekday}</span>
                        <span className="block text-xs text-subtle">{d.date}</span>
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {r.punchIn ? (
                          <span className="inline-flex items-center gap-1.5">
                            <LogIn className="size-3.5 text-primary-500" /> {r.punchIn}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted">
                        {r.punchOut ? (
                          <span className="inline-flex items-center gap-1.5">
                            <LogOut className="size-3.5 text-subtle" /> {r.punchOut}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="px-4 py-3 font-semibold text-content">
                        {r.hours.toFixed(1)}h
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={cn(
                            'inline-block rounded-full px-2.5 py-1 text-xs font-semibold',
                            tagStyle[tag],
                          )}
                        >
                          {tag}
                        </span>
                      </td>
                    </tr>
                  )
                })}

              {!loading && records.length === 0 && (
                <tr>
                  <td colSpan={5} className="bg-surface px-4 py-8 text-center text-sm text-subtle">
                    No punches recorded yet this week.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-subtle">
          Present = a full {FULL_DAY}-hour day · Partial = under {FULL_DAY} hours · Absent = no hours
          logged.
        </p>
      </div>
    </div>
  )
}
