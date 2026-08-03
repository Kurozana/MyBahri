import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { asset } from '@/lib/asset'
import { ceoMessage } from '@core/content/home'

export function CeoMessage() {
  const navigate = useNavigate()

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-800 via-primary-600 to-brand-mint p-6 text-white shadow-[0_18px_40px_-24px_rgba(10,93,143,0.9)]">
      <div className="pointer-events-none absolute -bottom-16 -left-10 size-56 rounded-full bg-white/5" />
      <span className="absolute right-5 top-5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
        {ceoMessage.date}
      </span>

      <div className="relative flex h-full items-center gap-6">
        <div className="flex-1">
          <h2 className="text-2xl font-extrabold">CEO Message</h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85">{ceoMessage.excerpt}</p>
          <button
            onClick={() => navigate('/ceo-message')}
            className="btn-shine mt-5 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:border-primary-300 hover:bg-primary-500 hover:shadow-[0_0_28px_4px_rgba(16,193,253,0.55)]"
          >
            Read Full Message
            <ArrowRight className="size-4" />
          </button>
        </div>

        <div className="hidden shrink-0 self-end sm:block">
          <img
            src={asset('assets/ceo.png')}
            alt="CEO"
            className="h-52 w-auto object-contain drop-shadow-2xl"
            style={{
              WebkitMaskImage:
                'radial-gradient(120% 130% at 50% 30%, #000 62%, transparent 92%)',
              maskImage: 'radial-gradient(120% 130% at 50% 30%, #000 62%, transparent 92%)',
            }}
          />
        </div>
      </div>
    </div>
  )
}
