import { useEffect, useState } from 'react'
import { HardHat } from 'lucide-react'
import { BahriLogo } from '@/components/ui/BahriLogo'
import type { Maintenance } from '@/lib/adminSettings'

function useCountdown(untilISO: string | null) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!untilISO) return
    const t = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(t)
  }, [untilISO])
  if (!untilISO) return null
  const diff = Math.max(0, new Date(untilISO).getTime() - now)
  const s = Math.floor(diff / 1000)
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
    done: diff === 0,
  }
}

const pad = (n: number) => String(n).padStart(2, '0')

export function MaintenancePage({ maintenance }: { maintenance: Maintenance }) {
  const c = useCountdown(maintenance.until)
  const loginUrl = `${import.meta.env.BASE_URL}login`

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-gradient-to-br from-primary-800 via-primary-600 to-brand-mint px-6 text-center text-white">
      <div className="pointer-events-none absolute -right-16 top-10 size-72 animate-float-slow rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -left-10 bottom-16 size-56 animate-float-slow rounded-full bg-white/10 [animation-delay:2s]" />

      <div className="relative max-w-lg">
        <div className="mx-auto flex items-center justify-center gap-3">
          <BahriLogo className="size-11 bg-white/15 backdrop-blur" />
          <span className="text-2xl font-extrabold tracking-tight">MyBahri</span>
        </div>

        <div className="mx-auto mt-10 grid size-16 place-items-center rounded-2xl bg-white/15 backdrop-blur">
          <HardHat className="size-8" />
        </div>

        <h1 className="mt-6 text-3xl font-extrabold">We'll be back soon!</h1>
        <p className="mt-3 text-white/85">{maintenance.message}</p>

        {c && !c.done && (
          <div className="mt-8 flex items-center justify-center gap-3">
            {[
              { v: c.d, l: 'Days' },
              { v: c.h, l: 'Hours' },
              { v: c.m, l: 'Min' },
              { v: c.s, l: 'Sec' },
            ].map((u) => (
              <div key={u.l} className="w-16 rounded-2xl bg-white/15 py-3 backdrop-blur">
                <div className="font-mono text-2xl font-bold tabular-nums">{pad(u.v)}</div>
                <div className="text-[10px] uppercase tracking-wide text-white/70">{u.l}</div>
              </div>
            ))}
          </div>
        )}
        {c?.done && <p className="mt-8 text-sm font-medium text-white/80">Back any moment now…</p>}

        <a
          href={loginUrl}
          className="mt-10 inline-block text-xs font-medium text-white/60 underline-offset-4 transition hover:text-white hover:underline"
        >
          Staff sign-in
        </a>
      </div>
    </div>
  )
}
