import { cn } from '@/lib/cn'
import { asset } from '@/lib/asset'

/** The Bahri emblem, used as the app logo. Size via className. */
export function BahriLogo({ className }: { className?: string }) {
  return (
    <img
      src={asset('assets/bahri-emblem-white.png')}
      alt="Bahri"
      className={cn('object-contain', className)}
    />
  )
}
