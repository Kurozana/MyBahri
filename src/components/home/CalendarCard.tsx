import { useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight, Clock } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { MiniCalendar } from '@/components/ui/MiniCalendar'
import { events } from '@core/content/home'
import { getMonthGrid, dayNumberInGrid, shiftMonthAnchor, type CalendarSystem } from '@/lib/calendar'
import { cn } from '@/lib/cn'

const MODES: { label: string; system: CalendarSystem }[] = [
  { label: 'Hijri', system: 'islamic-umalqura' },
  { label: 'Gregorian', system: 'gregory' },
]

function toISO(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function CalendarCard() {
  const [system, setSystem] = useState<CalendarSystem>('gregory')
  const [anchor, setAnchor] = useState<Date>(() => new Date())

  const today = new Date()
  const grid = getMonthGrid(anchor, system)

  // Portal events + today's standup, marked on the calendar with hover tooltips.
  const allEvents = [...events, { dateISO: toISO(today), title: 'Team Standup' }]
  const monthEvents = allEvents
    .map((ev) => ({ day: dayNumberInGrid(grid, new Date(`${ev.dateISO}T00:00:00`)), title: ev.title }))
    .filter((x): x is { day: number; title: string } => x.day !== null)
  const todayNum = dayNumberInGrid(grid, today) ?? undefined

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
          {monthEvents.length}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setAnchor(shiftMonthAnchor(grid, -1))}
            className="grid size-6 place-items-center rounded text-subtle hover:bg-surface-2"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="min-w-32 text-center text-sm font-bold text-content">{grid.label}</span>
          <button
            onClick={() => setAnchor(shiftMonthAnchor(grid, 1))}
            className="grid size-6 place-items-center rounded text-subtle hover:bg-surface-2"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
        <div className="flex gap-1 rounded-lg bg-surface-2 p-0.5 text-xs font-semibold">
          {MODES.map((m) => (
            <button
              key={m.system}
              onClick={() => setSystem(m.system)}
              className={cn(
                'rounded-md px-2.5 py-1 transition',
                system === m.system
                  ? 'bg-surface text-primary-600 shadow-sm dark:text-primary-300'
                  : 'text-muted',
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3">
        <MiniCalendar
          startOffset={grid.startOffset}
          daysInMonth={grid.daysInMonth}
          today={todayNum}
          events={monthEvents}
        />
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
