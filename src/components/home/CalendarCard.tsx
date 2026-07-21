import { useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { MiniCalendar } from '@/components/ui/MiniCalendar'
import { cn } from '@/lib/cn'

export function CalendarCard() {
  const [mode, setMode] = useState<'Hijri' | 'Gregorian'>('Gregorian')

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="grid size-8 place-items-center rounded-lg bg-primary-50 text-primary-600">
            <CalendarDays className="size-[18px]" />
          </span>
          <h2 className="text-[15px] font-bold text-ink">Calendar</h2>
          <ChevronRight className="size-4 text-slate-400" />
        </div>
        <span className="grid size-6 place-items-center rounded-full bg-primary-50 text-xs font-bold text-primary-600">
          5
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button className="grid size-6 place-items-center rounded text-slate-400 hover:bg-slate-100">
            <ChevronLeft className="size-4" />
          </button>
          <span className="text-sm font-bold text-ink">May 2026</span>
          <button className="grid size-6 place-items-center rounded text-slate-400 hover:bg-slate-100">
            <ChevronRight className="size-4" />
          </button>
        </div>
        <div className="flex gap-1 rounded-lg bg-slate-100 p-0.5 text-xs font-semibold">
          {(['Hijri', 'Gregorian'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                'rounded-md px-2.5 py-1 transition',
                mode === m ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500',
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3">
        <MiniCalendar startOffset={5} daysInMonth={31} today={19} marked={[20, 25]} />
      </div>

      <div className="mt-4 border-t border-slate-100 pt-3">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
          <Clock className="size-3.5" /> Today's Schedule
        </p>
        <div className="mt-2 flex items-center gap-3 rounded-xl border-l-4 border-primary-500 bg-primary-50/60 p-3">
          <div>
            <p className="text-sm font-semibold text-ink">Team Standup</p>
            <p className="text-xs text-slate-500">10:00 AM - 10:30 AM</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
