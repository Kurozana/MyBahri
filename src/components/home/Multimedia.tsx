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
} from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/Card'
import { MiniCalendar } from '@/components/ui/MiniCalendar'
import { events } from '@core/content/home'
import { BahriLogo } from '@/components/ui/BahriLogo'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/cn'

const tabs = [
  { id: 'events', label: 'Events', icon: CalendarDays },
  { id: 'news', label: 'News', icon: Newspaper },
  { id: 'library', label: 'Bahri Photo Library', icon: Images },
] as const

export function Multimedia() {
  const toast = useToast()
  const [tab, setTab] = useState<(typeof tabs)[number]['id']>('events')
  const [registered, setRegistered] = useState<Record<number, boolean>>({})

  const toggleRegister = (i: number) => {
    setRegistered((r) => {
      const next = { ...r, [i]: !r[i] }
      toast(next[i] ? `Registered for ${events[i].date}` : 'Registration cancelled')
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

      <div className="mt-5 grid gap-5 lg:grid-cols-[220px_1fr]">
        <div className="rounded-xl bg-surface-2 p-3">
          <div className="mb-2 flex items-center justify-between px-1">
            <span className="text-xs font-bold text-content">May 2026</span>
            <div className="flex gap-1">
              <button className="grid size-5 place-items-center rounded text-subtle hover:bg-surface-3">
                <ChevronLeft className="size-3.5" />
              </button>
              <button className="grid size-5 place-items-center rounded text-subtle hover:bg-surface-3">
                <ChevronRight className="size-3.5" />
              </button>
            </div>
          </div>
          <MiniCalendar startOffset={5} daysInMonth={31} today={18} marked={[20, 22, 25]} />
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
                  <BahriLogo className="size-9 bg-white/20 backdrop-blur" />
                  <Info className="absolute right-2.5 top-2.5 size-4 text-white/70" />
                </div>
                <div className="space-y-1.5 p-3">
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-content">
                    <CalendarDays className="size-3.5 text-primary-500" /> {ev.date}
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
    </Card>
  )
}
