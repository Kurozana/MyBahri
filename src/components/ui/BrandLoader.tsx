import { useState } from 'react'
import { useIsDark } from '@/hooks/useIsDark'
import { BahriLogo } from '@/components/ui/BahriLogo'
import { cn } from '@/lib/cn'

// Short looping logo clips (theme-matched backgrounds).
const ICON_LIGHT = '/assets/Bahri_Logo_Icon_Bright.mp4'
const ICON_DARK = '/assets/Icone_DarkIcon_Dark_BG.mp4'

/**
 * Lightweight navigation/route loader: the looping brand icon clip that matches
 * the active theme's background, shown as a neat tile. Falls back to a CSS mark
 * animation if the video can't play.
 */
export function BrandLoader({ label, className }: { label?: string; className?: string }) {
  const isDark = useIsDark()
  const [failed, setFailed] = useState(false)
  const src = isDark ? ICON_DARK : ICON_LIGHT

  return (
    <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
      {failed ? (
        <div className="relative grid place-items-center">
          <span className="animate-loader-halo absolute size-12 rounded-2xl bg-gradient-to-br from-brand-teal to-brand-cyan" />
          <BahriLogo className="animate-loader-pulse size-12" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl shadow-sm ring-1 ring-line">
          <video
            key={src}
            src={src}
            autoPlay
            muted
            loop
            playsInline
            onError={() => setFailed(true)}
            className="size-16 object-cover"
          />
        </div>
      )}

      <div className="relative h-0.5 w-24 overflow-hidden rounded-full bg-surface-3">
        <span className="animate-loader-progress absolute inset-y-0 w-1/3 rounded-full bg-gradient-to-r from-primary-500 to-primary-700" />
      </div>

      {label && <span className="text-xs font-medium text-subtle">{label}</span>}
    </div>
  )
}
