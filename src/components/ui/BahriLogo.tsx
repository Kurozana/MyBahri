import { cn } from '@/lib/cn'

/** Bahri "sails/waves" mark inside the brand gradient tile. */
export function BahriLogo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'grid place-items-center rounded-xl bg-gradient-to-br from-brand-teal to-brand-cyan shadow-sm',
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className="size-[62%]" fill="none" aria-hidden>
        <path
          d="M12 2.5c2.6 2.2 4 5 4 8.2 0 1.3-.25 2.5-.7 3.6L12 12.4 8.7 14.3c-.45-1.1-.7-2.3-.7-3.6 0-3.2 1.4-6 4-8.2Z"
          fill="white"
        />
        <path
          d="M4 15.2c1.3.9 2.2 1 3.4 1 1.5 0 2.4-1 4.6-1s3.1 1 4.6 1c1.2 0 2.1-.1 3.4-1-.5 3.5-3.9 6.3-8 6.3s-7.5-2.8-8-6.3Z"
          fill="white"
          fillOpacity="0.85"
        />
      </svg>
    </span>
  )
}
