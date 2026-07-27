import { cn } from '@/lib/cn'
import { asset } from '@/lib/asset'
import { useIsDark } from '@/hooks/useIsDark'

/** The Bahri emblem, used as the app logo. Navy on light mode, white on dark.
 *  Size via className. */
export function BahriLogo({ className }: { className?: string }) {
  const isDark = useIsDark()
  const src = isDark ? 'assets/bahri-emblem-white.png' : 'assets/bahri-emblem-navy.png'
  return <img src={asset(src)} alt="Bahri" className={cn('object-contain', className)} />
}
