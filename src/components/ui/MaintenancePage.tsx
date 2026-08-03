import { useEffect, useState } from 'react'
import { Wrench } from 'lucide-react'
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
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-[#0a1626] px-6 text-center text-white">
      {/* soft brand glow, calm not busy */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-primary-600/25 to-brand-cyan/15 blur-3xl" />

      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-10 backdrop-blur-sm">
        <div className="flex items-center justify-center gap-2.5">
          <BahriLogo className="size-9" />
          <span className="text-xl font-extrabold tracking-tight">MyBahri</span>
        </div>

        <div className="mx-auto mt-8 grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-brand-teal to-brand-cyan text-white shadow-lg shadow-brand-cyan/30">
          <Wrench className="size-7" />
        </div>

        {maintenance.title && <h1 className="mt-6 text-3xl font-extrabold">{maintenance.title}</h1>}
        {maintenance.message && (
          <p className="mt-3 leading-relaxed text-white/70">{maintenance.message}</p>
        )}

        {c && !c.done && (
          <div className="mt-8 flex items-center justify-center gap-2.5">
            {[
              { v: c.d, l: 'Days' },
              { v: c.h, l: 'Hrs' },
              { v: c.m, l: 'Min' },
              { v: c.s, l: 'Sec' },
            ].map((u) => (
              <div key={u.l} className="w-16 rounded-xl border border-white/10 bg-white/5 py-3">
                <div className="font-mono text-2xl font-bold tabular-nums">{pad(u.v)}</div>
                <div className="text-[10px] uppercase tracking-wide text-white/50">{u.l}</div>
              </div>
            ))}
          </div>
        )}
        {c?.done && <p className="mt-8 text-sm font-medium text-white/70">Back any moment now…</p>}
      </div>

      <a
        href={loginUrl}
        className="relative mt-8 text-xs font-medium text-white/40 underline-offset-4 transition hover:text-white/80 hover:underline"
      >
        Staff sign-in
      </a>
    </div>
  )
}
