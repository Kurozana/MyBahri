import { useEffect } from 'react'
import { Megaphone, Info } from 'lucide-react'
import { useApi } from '@core/hooks/useApi'
import { adminApi } from '@core/api/admin'
import { RELEASE_NOTES_UPDATED } from '@/components/layout/ReleaseNotesButton'

/** Shows the currently-active announcement (set in Admin → Notifications) as the
 *  home banner. Renders nothing when there's no active announcement. */
export function AnnouncementBanner() {
  const { data, refetch } = useApi(adminApi.getNotifications)

  // Refresh if something changes it elsewhere in the session.
  useEffect(() => {
    const h = () => refetch()
    window.addEventListener(RELEASE_NOTES_UPDATED, h)
    return () => window.removeEventListener(RELEASE_NOTES_UPDATED, h)
  }, [refetch])

  const active = (data ?? []).find((n) => n.active)
  if (!active) return null

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-mint via-primary-500 to-primary-700 px-5 py-4 text-white shadow-[0_10px_30px_-18px_rgba(5,136,179,0.8)]">
      <div className="pointer-events-none absolute -right-8 -top-10 size-40 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute right-24 top-6 size-24 rounded-full bg-white/10" />
      <div className="relative flex items-center gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/20 backdrop-blur">
          <Megaphone className="size-6" />
        </span>
        <div className="min-w-0">
          <h3 className="text-base font-bold">{active.title}</h3>
          <p className="text-sm leading-snug text-white/85">{active.body}</p>
        </div>
        <Info className="ml-auto hidden size-5 shrink-0 text-white/70 sm:block" />
      </div>
    </div>
  )
}
