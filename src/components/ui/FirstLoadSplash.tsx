import { useEffect, useState } from 'react'
import { BrandLoader } from '@/components/ui/BrandLoader'
import { cn } from '@/lib/cn'

const SESSION_KEY = 'mybahri-splash-seen'
const MIN_DURATION = 2000

/**
 * Full-screen brand splash shown once when the app first opens in a session.
 * Sits above everything, then fades out. Later, pass the real loader clip to
 * <BrandLoader videoSrc="/assets/first-load.webm" />.
 */
export function FirstLoadSplash() {
  const [visible, setVisible] = useState(() => !sessionStorage.getItem(SESSION_KEY))
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (!visible) return
    const t1 = window.setTimeout(() => setLeaving(true), MIN_DURATION)
    const t2 = window.setTimeout(() => {
      sessionStorage.setItem(SESSION_KEY, '1')
      setVisible(false)
    }, MIN_DURATION + 500)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [visible])

  if (!visible) return null

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] grid place-items-center bg-page',
        leaving && 'animate-splash-out',
      )}
    >
      {/* soft brand glow behind the mark */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-brand-teal/20 to-brand-cyan/20 blur-3xl" />
      <BrandLoader variant="splash" />
    </div>
  )
}
