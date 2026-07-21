import { useCallback, useEffect, useState } from 'react'
import { cn } from '@/lib/cn'

const SESSION_KEY = 'mybahri-splash-seen'
const PRELOADER = '/assets/Bahri_Logo_Preloder_Dark_BG.mp4'
const MAX_DURATION = 6500 // safety net if the video never fires 'ended'

/**
 * Full-screen brand preloader shown once when the app first opens in a session.
 * The clip is a full-frame brand gradient, so it covers the viewport with no
 * seams; it plays through once, then fades out.
 */
export function FirstLoadSplash() {
  const [visible, setVisible] = useState(() => !sessionStorage.getItem(SESSION_KEY))
  const [leaving, setLeaving] = useState(false)

  const finish = useCallback(() => {
    setLeaving(true)
    window.setTimeout(() => {
      sessionStorage.setItem(SESSION_KEY, '1')
      setVisible(false)
    }, 500)
  }, [])

  useEffect(() => {
    if (!visible) return
    const timer = window.setTimeout(finish, MAX_DURATION)
    return () => window.clearTimeout(timer)
  }, [visible, finish])

  if (!visible) return null

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] overflow-hidden bg-gradient-to-br from-primary-700 to-brand-mint',
        leaving && 'animate-splash-out',
      )}
    >
      <video
        src={PRELOADER}
        autoPlay
        muted
        playsInline
        onEnded={finish}
        onError={finish}
        className="size-full object-cover"
      />
    </div>
  )
}
