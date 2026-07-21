import { BahriLogo } from '@/components/ui/BahriLogo'
import { cn } from '@/lib/cn'

type BrandLoaderProps = {
  /** 'splash' = big first-open moment; 'inline' = compact route/navigation loader. */
  variant?: 'splash' | 'inline'
  label?: string
  /**
   * Optional loader video (drop a .webm/.mp4 in public/assets and pass its path).
   * When set, the video replaces the CSS mark animation. Muted + playsinline so it
   * autoplays everywhere; loops on inline, plays through on splash.
   */
  videoSrc?: string
  className?: string
}

/**
 * Brand animation used by both loaders. Placeholder CSS animation for now —
 * swap in the real loader clip via `videoSrc` once the assets land.
 */
export function BrandLoader({ variant = 'inline', label, videoSrc, className }: BrandLoaderProps) {
  const isSplash = variant === 'splash'
  const markSize = isSplash ? 'size-20' : 'size-12'

  return (
    <div className={cn('flex flex-col items-center justify-center gap-5', className)}>
      {videoSrc ? (
        <video
          src={videoSrc}
          autoPlay
          muted
          playsInline
          loop={!isSplash}
          className={cn('object-contain', isSplash ? 'h-40 w-40' : 'h-16 w-16')}
        />
      ) : (
        <div className="relative grid place-items-center">
          <span
            className={cn(
              'absolute rounded-2xl bg-gradient-to-br from-brand-teal to-brand-cyan',
              markSize,
              'animate-loader-halo',
            )}
          />
          <BahriLogo className={cn(markSize, 'animate-loader-pulse')} />
        </div>
      )}

      {isSplash && (
        <span className="text-2xl font-extrabold tracking-tight text-content">
          My<span className="text-primary-600 dark:text-primary-400">Bahri</span>
        </span>
      )}

      <div
        className={cn(
          'relative overflow-hidden rounded-full bg-surface-3',
          isSplash ? 'h-1 w-44' : 'h-0.5 w-28',
        )}
      >
        <span className="animate-loader-progress absolute inset-y-0 w-1/3 rounded-full bg-gradient-to-r from-primary-500 to-primary-700" />
      </div>

      {label && <span className="text-xs font-medium text-subtle">{label}</span>}
    </div>
  )
}
