import { cn } from '@/lib/cn'

const DOW = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

type MiniCalendarProps = {
  /** 0 = Sunday. Weekday the 1st falls on. */
  startOffset: number
  daysInMonth: number
  today?: number
  /** days rendered with a subtle highlight ring */
  marked?: number[]
  className?: string
}

export function MiniCalendar({
  startOffset,
  daysInMonth,
  today,
  marked = [],
  className,
}: MiniCalendarProps) {
  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  return (
    <div className={cn('select-none', className)}>
      <div className="grid grid-cols-7 gap-y-1 text-center text-[11px] font-semibold text-slate-400">
        {DOW.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-y-1 text-center text-[12px]">
        {cells.map((day, i) => {
          if (day === null) return <span key={i} />
          const isToday = day === today
          const isMarked = marked.includes(day)
          return (
            <span key={i} className="grid place-items-center py-0.5">
              <span
                className={cn(
                  'grid size-7 place-items-center rounded-full transition',
                  isToday && 'bg-primary-600 font-semibold text-white',
                  !isToday && isMarked && 'font-semibold text-primary-600 ring-1 ring-primary-200',
                  !isToday && !isMarked && 'text-slate-600 hover:bg-slate-100',
                )}
              >
                {day}
              </span>
            </span>
          )
        })}
      </div>
    </div>
  )
}
