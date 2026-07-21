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
          <span className="grid size-8 place-items-center rounded-lg bg-accent-soft text-primary-600 dark:text-primary-300">
            <CalendarDays className="size-[18px]" />
          </span>
          <h2 className="text-[15px] font-bold text-content">Calendar</h2>
          <ChevronRight className="size-4 text-subtle" />
        </div>
        <span className="grid size-6 place-items-center rounded-full bg-accent-soft text-xs font-bold text-primary-600 dark:text-primary-300">
          5
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button className="grid size-6 place-items-center rounded text-subtle hover:bg-surface-2">
            <ChevronLeft className="size-4" />
          </button>
          <span className="text-sm font-bold text-content">May 2026</span>
          <button className="grid size-6 place-items-center rounded text-subtle hover:bg-surface-2">
            <ChevronRight className="size-4" />
          </button>
        </div>
        <div className="flex gap-1 rounded-lg bg-surface-2 p-0.5 text-xs font-semibold">
          {(['Hijri', 'Gregorian'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                'rounded-md px-2.5 py-1 transition',
                mode === m ? 'bg-surface text-primary-600 shadow-sm dark:text-primary-300' : 'text-muted',
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

      <div className="mt-4 border-t border-line pt-3">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-subtle">
          <Clock className="size-3.5" /> Today's Schedule
        </p>
        <div className="mt-2 flex items-center gap-3 rounded-xl border-l-4 border-primary-500 bg-accent-soft/60 p-3">
          <div>
            <p className="text-sm font-semibold text-content">Team Standup</p>
            <p className="text-xs text-muted">10:00 AM - 10:30 AM</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
