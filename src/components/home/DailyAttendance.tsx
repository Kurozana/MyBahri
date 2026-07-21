import { useState } from 'react'
import { CalendarDays, ChevronRight, LogIn, LogOut } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/cn'

export function DailyAttendance() {
  const [checkedIn, setCheckedIn] = useState(false)

  return (
    <Card className="flex flex-col">
      <div className="flex items-center gap-1.5">
        <span className="grid size-8 place-items-center rounded-lg bg-primary-50 text-primary-600">
          <CalendarDays className="size-[18px]" />
        </span>
        <h2 className="text-[15px] font-bold text-ink">Daily Attendance</h2>
        <ChevronRight className="size-4 text-slate-400" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-[11px] font-medium text-slate-400">Today's Date</p>
          <p className="mt-1 text-[13px] font-semibold text-ink">Monday, May 18, 2026</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-[11px] font-medium text-slate-400">Leave Balance</p>
          <p className="mt-1 text-[13px] font-semibold text-ink">14.00</p>
        </div>
      </div>

      <div className="mt-3 rounded-xl bg-slate-50 py-4 text-center">
        <p className="font-mono text-3xl font-bold tracking-wider text-ink">00:00:00</p>
        <p className="mt-1 text-xs text-slate-400">You haven't checked in today</p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600">
          <LogIn className="size-4 text-primary-500" /> 9:30 AM
        </div>
        <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600">
          <LogOut className="size-4 text-slate-400" /> 00:00 PM
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <button
          onClick={() => setCheckedIn(true)}
          className={cn(
            'rounded-xl py-2.5 text-sm font-semibold text-white transition',
            checkedIn
              ? 'bg-slate-300'
              : 'bg-gradient-to-r from-primary-500 to-primary-700 hover:brightness-105 active:scale-[0.99]',
          )}
        >
          Punch In
        </button>
        <button
          onClick={() => setCheckedIn(false)}
          className="rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          Punch Out
        </button>
      </div>
    </Card>
  )
}
