import { useState } from 'react'
import { useIsDark } from '@/hooks/useIsDark'
import { BahriLogo } from '@/components/ui/BahriLogo'
import { cn } from '@/lib/cn'
import { asset } from '@/lib/asset'

// Short looping logo clips (theme-matched backgrounds so they blend into the page).
const ICON_LIGHT = asset('assets/Bahri_Logo_Icon_Bright.mp4')
const ICON_DARK = asset('assets/Icone_DarkIcon_Dark_BG.mp4')

/**
 * Page / route loader: plays the brand logo clip that matches the active theme,
 * sized so it reads clearly. Falls back to a CSS mark animation if the video
 * can't play.
 */
export function BrandLoader({ className }: { className?: string }) {
  const isDark = useIsDark()
  const [failed, setFailed] = useState(false)
  const src = isDark ? ICON_DARK : ICON_LIGHT

  return (
    <div className={cn('grid place-items-center', className)}>
      {failed ? (
        <div className="relative grid size-20 place-items-center">
          <span className="animate-loader-halo absolute size-20 rounded-2xl bg-gradient-to-br from-brand-teal to-brand-cyan" />
          <BahriLogo className="animate-loader-pulse size-20" />
        </div>
      ) : (
        <video
          key={src}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          onError={() => setFailed(true)}
          className="h-40 w-auto object-contain"
        />
      )}
    </div>
  )
}
