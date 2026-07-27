/**
 * Small date/calendar helpers built on the Intl API — no dependency.
 * Supports both Gregorian and (Umm al-Qura) Hijri months, computed from a
 * Gregorian anchor date so event marking works the same in either system.
 */

export type CalendarSystem = 'gregory' | 'islamic-umalqura'

export interface MonthGrid {
  label: string
  /** weekday (0 = Sunday) that day 1 falls on */
  startOffset: number
  daysInMonth: number
  /** Gregorian date of day 1 of this month */
  firstDay: Date
  system: CalendarSystem
}

function partsOf(date: Date, system: CalendarSystem) {
  const fmt = new Intl.DateTimeFormat(`en-US-u-ca-${system}`, {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  })
  const p = fmt.formatToParts(date)
  const num = (t: string) => Number(p.find((x) => x.type === t)?.value)
  return { day: num('day'), month: num('month'), year: num('year') }
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  r.setDate(r.getDate() + n)
  return r
}

function midnight(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

export function getMonthGrid(anchor: Date, system: CalendarSystem): MonthGrid {
  const p = partsOf(anchor, system)
  const firstDay = addDays(anchor, -(p.day - 1)) // Gregorian date of day 1
  let daysInMonth = 1
  while (daysInMonth < 32) {
    const q = partsOf(addDays(firstDay, daysInMonth), system)
    if (q.month !== p.month || q.year !== p.year) break
    daysInMonth++
  }
  const label = new Intl.DateTimeFormat(`en-US-u-ca-${system}`, {
    month: 'long',
    year: 'numeric',
  }).format(firstDay)
  return { label, startOffset: firstDay.getDay(), daysInMonth, firstDay, system }
}

/** Day-of-month (in the grid's system) for a Gregorian date, or null if outside this month. */
export function dayNumberInGrid(grid: MonthGrid, date: Date): number | null {
  const idx = Math.round((midnight(date).getTime() - grid.firstDay.getTime()) / 86_400_000)
  return idx >= 0 && idx < grid.daysInMonth ? idx + 1 : null
}

/** Anchor date for the previous/next month in the same calendar system. */
export function shiftMonthAnchor(grid: MonthGrid, dir: -1 | 1): Date {
  return dir < 0 ? addDays(grid.firstDay, -1) : addDays(grid.firstDay, grid.daysInMonth)
}
