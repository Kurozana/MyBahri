import { Megaphone, Info } from 'lucide-react'

export function PromotionsBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-mint via-primary-500 to-primary-700 px-5 py-4 text-white shadow-[0_10px_30px_-18px_rgba(5,136,179,0.8)]">
      <div className="pointer-events-none absolute -right-8 -top-10 size-40 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute right-24 top-6 size-24 rounded-full bg-white/10" />
      <div className="relative flex items-center gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/20 backdrop-blur">
          <Megaphone className="size-6" />
        </span>
        <div className="min-w-0">
          <h3 className="text-base font-bold">Promotions</h3>
          <p className="text-sm leading-snug text-white/85">
            Join us for a chance to connect with your colleagues, share ideas, and enjoy some
            refreshments. Stay tuned for more details on dates and activities!
          </p>
        </div>
        <Info className="ml-auto hidden size-5 shrink-0 text-white/70 sm:block" />
      </div>
    </div>
  )
}
