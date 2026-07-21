import { ArrowRight } from 'lucide-react'

export function CeoMessage() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-800 via-primary-600 to-brand-mint p-6 text-white shadow-[0_18px_40px_-24px_rgba(10,93,143,0.9)]">
      <div className="pointer-events-none absolute -bottom-16 -left-10 size-56 rounded-full bg-white/5" />
      <span className="absolute right-5 top-5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
        16 Sep, 2025
      </span>

      <div className="relative flex h-full items-center gap-6">
        <div className="flex-1">
          <h2 className="text-2xl font-extrabold">CEO Message</h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85">
            I am proud to share that our Q1 performance has exceeded expectations, with a 23%
            increase in operational efficiency and outstanding safety records across all our fleet
            operations. This achievement is a testament to your dedication and commitment to
            excellence.
          </p>
          <button className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-primary-700 transition hover:gap-3 hover:bg-white/90">
            Read Full Message
            <ArrowRight className="size-4" />
          </button>
        </div>

        <div className="hidden shrink-0 self-end sm:block">
          <img
            src="/assets/ceo.png"
            alt="CEO"
            className="h-52 w-auto object-contain drop-shadow-2xl"
          />
        </div>
      </div>
    </div>
  )
}
