import { cn } from '@/lib/cn'
import { asset } from '@/lib/asset'

/** Bahri emblem on the brand gradient tile. Callers pass size (and may override
 *  the background) via className. */
export function BahriLogo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'grid place-items-center rounded-xl bg-gradient-to-br from-brand-teal to-brand-cyan shadow-sm',
        className,
      )}
    >
      <img
        src={asset('assets/bahri-emblem-white.png')}
        alt="Bahri"
        aria-hidden
        className="size-[58%] object-contain"
      />
    </span>
  )
}
