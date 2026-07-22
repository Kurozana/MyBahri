import type { MeetingDto } from '@core/api/types'

/**
 * Microsoft Graph calendar access. Pure fetch given an access token (the token
 * is obtained by the platform's MSAL layer), so this stays portable — the same
 * function serves web and mobile. Reads the user's Outlook/Microsoft calendar.
 */

type GraphEvent = {
  id: string
  subject?: string
  start?: { dateTime?: string }
  end?: { dateTime?: string }
  location?: { displayName?: string }
  organizer?: { emailAddress?: { name?: string } }
  isOnlineMeeting?: boolean
  onlineMeeting?: { joinUrl?: string }
  attendees?: unknown[]
}

/** Upcoming events between two ISO datetimes, ordered by start. */
export async function getUpcomingMeetings(
  token: string,
  fromISO: string,
  toISO: string,
  signal?: AbortSignal,
): Promise<MeetingDto[]> {
  const params = new URLSearchParams({
    startDateTime: fromISO,
    endDateTime: toISO,
    $orderby: 'start/dateTime',
    $top: '20',
    $select: 'subject,start,end,location,organizer,isOnlineMeeting,onlineMeeting,attendees',
  })
  const res = await fetch(`https://graph.microsoft.com/v1.0/me/calendarView?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      // Return times already converted to KSA.
      Prefer: 'outlook.timezone="Arabian Standard Time"',
    },
    signal,
  })
  if (!res.ok) throw new Error(`Graph calendarView failed: ${res.status}`)

  const data = (await res.json()) as { value?: GraphEvent[] }
  return (data.value ?? []).map((ev) => ({
    id: ev.id,
    subject: ev.subject?.trim() || '(No subject)',
    start: ev.start?.dateTime ?? '',
    end: ev.end?.dateTime ?? '',
    location: ev.location?.displayName || undefined,
    organizer: ev.organizer?.emailAddress?.name || undefined,
    isOnline: Boolean(ev.isOnlineMeeting),
    joinUrl: ev.onlineMeeting?.joinUrl || undefined,
    attendees: ev.attendees?.length ?? 0,
  }))
}
