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
} from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/Card'
import { MiniCalendar } from '@/components/ui/MiniCalendar'
import { events } from '@/data/home'
import { BahriLogo } from '@/components/ui/BahriLogo'
import { cn } from '@/lib/cn'

const tabs = [
  { id: 'events', label: 'Events', icon: CalendarDays },
  { id: 'news', label: 'News', icon: Newspaper },
  { id: 'library', label: 'Bahri Photo Library', icon: Images },
] as const

export function Multimedia() {
  const [tab, setTab] = useState<(typeof tabs)[number]['id']>('events')

  return (
    <Card>
      <CardHeader
        title="Multimedia"
        showChevron
        action={
          <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition',
                  tab === id
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700',
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
        <div className="rounded-xl bg-slate-50 p-3">
          <div className="mb-2 flex items-center justify-between px-1">
            <span className="text-xs font-bold text-ink">May 2026</span>
            <div className="flex gap-1">
              <button className="grid size-5 place-items-center rounded text-slate-400 hover:bg-slate-200">
                <ChevronLeft className="size-3.5" />
              </button>
              <button className="grid size-5 place-items-center rounded text-slate-400 hover:bg-slate-200">
                <ChevronRight className="size-3.5" />
              </button>
            </div>
          </div>
          <MiniCalendar startOffset={5} daysInMonth={31} today={18} marked={[20, 22, 25]} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {events.map((ev, i) => (
            <div
              key={i}
              className="group overflow-hidden rounded-xl border border-slate-200/80 transition hover:shadow-md"
            >
              <div className="relative grid h-28 place-items-center bg-gradient-to-br from-brand-mint to-primary-600">
                <BahriLogo className="size-9 bg-white/20 backdrop-blur" />
                <Info className="absolute right-2.5 top-2.5 size-4 text-white/70" />
              </div>
              <div className="space-y-1.5 p-3">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-ink">
                  <CalendarDays className="size-3.5 text-primary-500" /> {ev.date}
                </p>
                <p className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="size-3.5 text-slate-400" /> {ev.time}
                </p>
                <p className="flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="size-3.5 text-slate-400" /> {ev.location}
                </p>
                <p className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Users className="size-3.5 text-slate-400" /> {ev.attending} attending
                </p>
                <button className="mt-1.5 w-full rounded-lg bg-gradient-to-r from-primary-500 to-primary-700 py-2 text-xs font-semibold text-white transition hover:brightness-105">
                  Register
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
