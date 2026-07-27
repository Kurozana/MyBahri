import { useEffect, useRef, useState } from 'react'
import { CalendarDays, ChevronRight, LogIn, LogOut } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { useToast } from '@/components/ui/Toast'
import { useApi } from '@core/hooks/useApi'
import { portalApi } from '@core/api/portal'
import { cn } from '@/lib/cn'

function fmtDuration(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':')
}

function fmtClock(date: Date | null) {
  if (!date) return '--:-- --'
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function DailyAttendance() {
  const toast = useToast()
  const { data: leave } = useApi(portalApi.getLeaveBalance)
  const todayLabel = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const [punchIn, setPunchIn] = useState<Date | null>(null)
  const [punchOut, setPunchOut] = useState<Date | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const timer = useRef<number | null>(null)

  const checkedIn = punchIn !== null && punchOut === null

  useEffect(() => {
    if (checkedIn && punchIn) {
      timer.current = window.setInterval(() => {
        setElapsed(Math.floor((Date.now() - punchIn.getTime()) / 1000))
      }, 1000)
      return () => {
        if (timer.current) window.clearInterval(timer.current)
      }
    }
  }, [checkedIn, punchIn])

  const handlePunchIn = () => {
    const now = new Date()
    setPunchIn(now)
    setPunchOut(null)
    setElapsed(0)
    toast(`Punched in at ${fmtClock(now)}`)
  }

  const handlePunchOut = () => {
    const now = new Date()
    setPunchOut(now)
    toast(`Punched out at ${fmtClock(now)}`)
  }

  return (
    <Card className="flex flex-col">
      <div className="flex items-center gap-1.5">
        <span className="grid size-8 place-items-center rounded-lg bg-accent-soft text-primary-600 dark:text-primary-300">
          <CalendarDays className="size-[18px]" />
        </span>
        <h2 className="text-[15px] font-bold text-content">Daily Attendance</h2>
        <ChevronRight className="size-4 text-subtle" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-surface-2 p-3">
          <p className="text-[11px] font-medium text-subtle">Today's Date</p>
          <p className="mt-1 text-[13px] font-semibold text-content">{todayLabel}</p>
        </div>
        <div className="rounded-xl bg-surface-2 p-3">
          <p className="text-[11px] font-medium text-subtle">Leave Balance</p>
          <p className="mt-1 text-[13px] font-semibold text-content">
            {leave ? `${leave.balance.toFixed(2)} ${leave.unit}` : '—'}
          </p>
        </div>
      </div>

      <div
        className={cn(
          'mt-3 rounded-xl py-4 text-center transition-colors',
          checkedIn ? 'bg-primary-600/10' : 'bg-surface-2',
        )}
      >
        <p
          className={cn(
            'font-mono text-3xl font-bold tracking-wider tabular-nums',
            checkedIn ? 'text-primary-600 dark:text-primary-300' : 'text-content',
          )}
        >
          {fmtDuration(elapsed)}
        </p>
        <p className="mt-1 text-xs text-subtle">
          {checkedIn
            ? `Checked in at ${fmtClock(punchIn)}`
            : punchOut
              ? `Checked out at ${fmtClock(punchOut)}`
              : "You haven't checked in today"}
        </p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="flex items-center justify-center gap-2 rounded-xl border border-line py-2.5 text-sm font-semibold text-muted">
          <LogIn className="size-4 text-primary-500" /> {fmtClock(punchIn)}
        </div>
        <div className="flex items-center justify-center gap-2 rounded-xl border border-line py-2.5 text-sm font-semibold text-muted">
          <LogOut className="size-4 text-subtle" /> {fmtClock(punchOut)}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <button
          onClick={handlePunchIn}
          disabled={checkedIn}
          className={cn(
            'rounded-xl py-2.5 text-sm font-semibold text-white transition',
            checkedIn
              ? 'cursor-not-allowed bg-surface-3 text-subtle'
              : 'bg-gradient-to-r from-primary-500 to-primary-700 hover:brightness-105 active:scale-[0.99]',
          )}
        >
          Punch In
        </button>
        <button
          onClick={handlePunchOut}
          disabled={!checkedIn}
          className={cn(
            'rounded-xl border py-2.5 text-sm font-semibold transition',
            checkedIn
              ? 'border-line text-muted hover:bg-surface-2 active:scale-[0.99]'
              : 'cursor-not-allowed border-line text-subtle opacity-60',
          )}
        >
          Punch Out
        </button>
      </div>
    </Card>
  )
}
