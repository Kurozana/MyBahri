import { cn } from '@/lib/cn'

const DOW = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export type CalendarDayEvent = { day: number; title: string }

type MiniCalendarProps = {
  /** 0 = Sunday. Weekday the 1st falls on. */
  startOffset: number
  daysInMonth: number
  /** day-of-month considered "today" (highlighted) */
  today?: number
  /** events in this month; their days are marked and show a hover tooltip */
  events?: CalendarDayEvent[]
  className?: string
}

export function MiniCalendar({
  startOffset,
  daysInMonth,
  today,
  events = [],
  className,
}: MiniCalendarProps) {
  const eventsByDay = new Map<number, string[]>()
  for (const e of events) {
    eventsByDay.set(e.day, [...(eventsByDay.get(e.day) ?? []), e.title])
  }

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  return (
    <div className={cn('select-none', className)}>
      <div className="grid grid-cols-7 gap-y-1 text-center text-[11px] font-semibold text-subtle">
        {DOW.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-y-1 text-center text-[12px]">
        {cells.map((day, i) => {
          if (day === null) return <span key={i} />
          const isToday = day === today
          const dayEvents = eventsByDay.get(day)
          const isMarked = !!dayEvents
          return (
            <span key={i} className="group relative grid place-items-center py-0.5">
              <span
                className={cn(
                  'grid size-7 place-items-center rounded-full transition',
                  isToday && 'bg-primary-600 font-semibold text-white',
                  !isToday &&
                    isMarked &&
                    'cursor-default font-semibold text-primary-600 ring-1 ring-primary-200 dark:text-primary-300 dark:ring-primary-400/40',
                  !isToday && !isMarked && 'text-muted hover:bg-surface-3',
                )}
              >
                {day}
              </span>
              {/* event dot */}
              {isMarked && !isToday && (
                <span className="pointer-events-none absolute bottom-0.5 size-1 rounded-full bg-primary-500" />
              )}
              {/* hover tooltip */}
              {dayEvents && (
                <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1.5 text-[11px] font-medium text-white shadow-lg group-hover:block dark:bg-surface-3 dark:text-content">
                  {dayEvents.join(' · ')}
                  <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-ink dark:border-t-surface-3" />
                </span>
              )}
            </span>
          )
        })}
      </div>
    </div>
  )
}
