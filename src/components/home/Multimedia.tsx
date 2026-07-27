import { useState } from 'react'
import {
  CalendarDays,
  Newspaper,
  Images,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Users,
  Info,
  Check,
  ImageOff,
} from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/Card'
import { MiniCalendar } from '@/components/ui/MiniCalendar'
import { events, newsItems } from '@core/content/home'
import { BahriLogo } from '@/components/ui/BahriLogo'
import { useToast } from '@/components/ui/Toast'
import { getMonthGrid, dayNumberInGrid, shiftMonthAnchor } from '@/lib/calendar'
import { cn } from '@/lib/cn'

const tabs = [
  { id: 'events', label: 'Events', icon: CalendarDays },
  { id: 'news', label: 'News', icon: Newspaper },
  { id: 'library', label: 'Bahri Photo Library', icon: Images },
] as const

export function Multimedia() {
  const toast = useToast()
  const [tab, setTab] = useState<(typeof tabs)[number]['id']>('events')
  const [anchor, setAnchor] = useState<Date>(() => new Date())
  const [registered, setRegistered] = useState<Record<number, boolean>>({})

  const grid = getMonthGrid(anchor, 'gregory')
  const monthEvents = events
    .map((ev) => ({ ev, day: dayNumberInGrid(grid, new Date(`${ev.dateISO}T00:00:00`)) }))
    .filter((x): x is { ev: (typeof events)[number]; day: number } => x.day !== null)
    .map((x) => ({ day: x.day, title: x.ev.title }))
  const todayNum = dayNumberInGrid(grid, new Date()) ?? undefined

  const toggleRegister = (i: number) => {
    setRegistered((r) => {
      const next = { ...r, [i]: !r[i] }
      toast(next[i] ? `Registered for ${events[i].title}` : 'Registration cancelled')
      return next
    })
  }

  return (
    <Card>
      <CardHeader
        title="Multimedia"
        showChevron
        action={
          <div className="flex items-center gap-1 rounded-xl bg-surface-2 p-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition',
                  tab === id
                    ? 'bg-surface text-primary-600 shadow-sm dark:text-primary-300'
                    : 'text-muted hover:text-content',
                )}
              >
                <Icon className="size-3.5" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        }
      />

      {/* EVENTS: calendar + event cards */}
      {tab === 'events' && (
        <div className="mt-5 grid gap-5 lg:grid-cols-[220px_1fr]">
          <div className="rounded-xl bg-surface-2 p-3">
            <div className="mb-2 flex items-center justify-between px-1">
              <span className="text-xs font-bold text-content">{grid.label}</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setAnchor(shiftMonthAnchor(grid, -1))}
                  className="grid size-5 place-items-center rounded text-subtle hover:bg-surface-3"
                >
                  <ChevronLeft className="size-3.5" />
                </button>
                <button
                  onClick={() => setAnchor(shiftMonthAnchor(grid, 1))}
                  className="grid size-5 place-items-center rounded text-subtle hover:bg-surface-3"
                >
                  <ChevronRight className="size-3.5" />
                </button>
              </div>
            </div>
            <MiniCalendar
              startOffset={grid.startOffset}
              daysInMonth={grid.daysInMonth}
              today={todayNum}
              events={monthEvents}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {events.map((ev, i) => {
              const isReg = !!registered[i]
              const count = ev.attending + (isReg ? 1 : 0)
              return (
                <div
                  key={i}
                  className="group overflow-hidden rounded-xl border border-line transition hover:shadow-md"
                >
                  <div className="relative grid h-28 place-items-center bg-gradient-to-br from-brand-mint to-primary-600">
                    <BahriLogo className="size-9" />
                    <Info className="absolute right-2.5 top-2.5 size-4 text-white/70" />
                  </div>
                  <div className="space-y-1.5 p-3">
                    <p className="text-sm font-semibold text-content">{ev.title}</p>
                    <p className="flex items-center gap-1.5 text-xs font-medium text-primary-600 dark:text-primary-300">
                      <CalendarDays className="size-3.5" /> {ev.date}
                    </p>
                    <p className="flex items-center gap-1.5 text-xs text-muted">
                      <Clock className="size-3.5 text-subtle" /> {ev.time}
                    </p>
                    <p className="flex items-center gap-1.5 text-xs text-muted">
                      <MapPin className="size-3.5 text-subtle" /> {ev.location}
                    </p>
                    <p className="flex items-center gap-1.5 text-xs text-muted">
                      <Users className="size-3.5 text-subtle" /> {count} attending
                    </p>
                    <button
                      onClick={() => toggleRegister(i)}
                      className={cn(
                        'mt-1.5 flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition',
                        isReg
                          ? 'border border-emerald-300 text-emerald-600 dark:border-emerald-400/40 dark:text-emerald-300'
                          : 'bg-gradient-to-r from-primary-500 to-primary-700 text-white hover:brightness-105',
                      )}
                    >
                      {isReg ? (
                        <>
                          <Check className="size-3.5" /> Registered
                        </>
                      ) : (
                        'Register'
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* NEWS: same card layout, no calendar */}
      {tab === 'news' && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {newsItems.map((n, i) => (
            <div
              key={i}
              className="group overflow-hidden rounded-xl border border-line transition hover:shadow-md"
            >
              <div className="relative grid h-28 place-items-center bg-gradient-to-br from-primary-600 to-primary-800">
                <Newspaper className="size-8 text-white/80" />
              </div>
              <div className="space-y-1.5 p-3">
                <p className="text-sm font-semibold leading-snug text-content">{n.title}</p>
                <p className="text-[11px] font-medium text-subtle">{n.date}</p>
                <p className="text-xs leading-relaxed text-muted">{n.summary}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PHOTO LIBRARY: placeholder shell */}
      {tab === 'library' && (
        <div className="mt-5 flex flex-col items-center rounded-xl border border-dashed border-line px-4 py-12 text-center">
          <span className="grid size-12 place-items-center rounded-2xl bg-surface-2 text-subtle">
            <ImageOff className="size-6" />
          </span>
          <p className="mt-3 text-sm font-semibold text-content">Photo Library</p>
          <p className="mt-1 max-w-xs text-xs text-subtle">
            Coming soon — a shared gallery of Bahri photos and albums.
          </p>
        </div>
      )}
    </Card>
  )
}
