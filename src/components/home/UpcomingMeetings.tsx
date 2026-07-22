import { useEffect, useState } from 'react'
import { CalendarClock, Video, MapPin, Users, TriangleAlert, CalendarPlus, RefreshCw } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { getUpcomingMeetings } from '@core/api/graph'
import type { MeetingDto } from '@core/api/types'
import { connectCalendar, getCalendarToken, isCalendarConnected, preloadMsal } from '@/lib/msal'

type Status = 'idle' | 'loading' | 'ready' | 'error'

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
function fmtDay(iso: string) {
  const d = new Date(iso)
  const today = new Date()
  if (d.toDateString() === today.toDateString()) return 'Today'
  return d.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' })
}

function friendlyError(e: unknown): string {
  const err = e as { errorCode?: string; errorMessage?: string; message?: string }
  if (err?.errorCode === 'user_cancelled' || err?.errorCode === 'interaction_in_progress') {
    return "Sign-in didn't finish — please click Connect again."
  }
  return err?.errorMessage || err?.message || "Couldn't connect. Please try again."
}

export function UpcomingMeetings() {
  const [status, setStatus] = useState<Status>('idle')
  const [meetings, setMeetings] = useState<MeetingDto[]>([])
  const [connecting, setConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setStatus('loading')
    const token = await getCalendarToken()
    if (!token) {
      setStatus('idle')
      return
    }
    try {
      const now = new Date()
      const to = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      const data = await getUpcomingMeetings(token, now.toISOString(), to.toISOString())
      setMeetings(data)
      setStatus('ready')
    } catch {
      setStatus('error')
    }
  }

  useEffect(() => {
    if (isCalendarConnected()) void load()
  }, [])

  const connect = async () => {
    setConnecting(true)
    setError(null)
    try {
      await connectCalendar()
      await load()
    } catch (e) {
      console.error('[calendar] connect failed', e)
      setError(friendlyError(e))
      setStatus('idle')
    } finally {
      setConnecting(false)
    }
  }

  return (
    <Card>
      <CardHeader
        icon={<CalendarClock className="size-[18px]" />}
        title="Upcoming Meetings"
        action={
          status === 'ready' ? (
            <button
              onClick={load}
              title="Refresh"
              className="grid size-8 place-items-center rounded-full text-subtle transition hover:bg-surface-2 hover:text-primary-600"
            >
              <RefreshCw className="size-4" />
            </button>
          ) : undefined
        }
      />

      <div className="mt-4">
        {status === 'idle' && (
          <div className="flex flex-col items-center rounded-xl border border-dashed border-line px-4 py-8 text-center">
            <span className="grid size-12 place-items-center rounded-2xl bg-accent-soft text-primary-600 dark:text-primary-300">
              <CalendarPlus className="size-6" />
            </span>
            <p className="mt-3 text-sm font-semibold text-content">Connect your calendar</p>
            <p className="mt-1 max-w-xs text-xs text-subtle">
              See your Outlook meetings for the week right here.
            </p>

            {error && (
              <p className="mt-3 flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-600 dark:bg-rose-400/10 dark:text-rose-300">
                <TriangleAlert className="size-3.5 shrink-0" /> {error}
              </p>
            )}

            <button
              onClick={connect}
              onMouseEnter={preloadMsal}
              onFocus={preloadMsal}
              disabled={connecting}
              className="mt-4 rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-105 disabled:opacity-60"
            >
              {connecting ? 'Connecting…' : error ? 'Try again' : 'Connect Outlook Calendar'}
            </button>
          </div>
        )}

        {status === 'loading' &&
          [0, 1, 2].map((i) => (
            <div key={i} className="mb-2.5 flex gap-3 rounded-xl border border-line p-3">
              <Skeleton className="h-12 w-14" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}

        {status === 'error' && (
          <div className="flex items-center justify-between gap-2 rounded-xl bg-rose-50 p-3.5 text-sm text-rose-600 dark:bg-rose-400/10 dark:text-rose-300">
            <span className="flex items-center gap-2">
              <TriangleAlert className="size-4" /> Couldn't load your calendar.
            </span>
            <button onClick={load} className="font-semibold underline">
              Retry
            </button>
          </div>
        )}

        {status === 'ready' && meetings.length === 0 && (
          <p className="rounded-xl border border-line py-8 text-center text-sm text-subtle">
            No meetings in the next 7 days. Enjoy the calm. 🌊
          </p>
        )}

        {status === 'ready' && meetings.length > 0 && (
          <div className="space-y-2.5">
            {meetings.map((m) => (
              <div
                key={m.id}
                className="flex gap-3 rounded-xl border border-line p-3 transition hover:border-primary-200 hover:bg-surface-2"
              >
                <div className="flex w-16 shrink-0 flex-col items-center justify-center rounded-lg bg-accent-soft py-1.5 text-center">
                  <span className="text-[10px] font-semibold uppercase text-primary-600 dark:text-primary-300">
                    {fmtDay(m.start)}
                  </span>
                  <span className="text-sm font-bold text-content">{fmtTime(m.start)}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-content">{m.subject}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-subtle">
                    <span>
                      {fmtTime(m.start)} – {fmtTime(m.end)}
                    </span>
                    {m.isOnline ? (
                      <span className="flex items-center gap-1">
                        <Video className="size-3.5" /> Online
                      </span>
                    ) : m.location ? (
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3.5" /> {m.location}
                      </span>
                    ) : null}
                    {m.attendees > 0 && (
                      <span className="flex items-center gap-1">
                        <Users className="size-3.5" /> {m.attendees}
                      </span>
                    )}
                  </div>
                </div>
                {m.joinUrl && (
                  <a
                    href={m.joinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="my-auto shrink-0 rounded-lg bg-gradient-to-r from-primary-500 to-primary-700 px-3 py-1.5 text-xs font-semibold text-white transition hover:brightness-105"
                  >
                    Join
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
