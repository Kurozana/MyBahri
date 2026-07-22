import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CalendarDays } from 'lucide-react'
import { asset } from '@/lib/asset'
import { ceoMessage } from '@core/content/home'

export default function CeoMessagePage() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto max-w-3xl">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-muted transition hover:bg-surface-2"
      >
        <ArrowLeft className="size-4" /> Back
      </button>

      <article className="overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
        {/* Hero */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary-800 via-primary-600 to-brand-mint px-8 pt-8 text-white">
          <div className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full bg-white/10" />
          <div className="relative flex items-end justify-between gap-6">
            <div className="pb-8">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
                <CalendarDays className="size-3.5" /> {ceoMessage.date}
              </span>
              <h1 className="mt-4 text-3xl font-extrabold">CEO Message</h1>
              <p className="mt-1 text-white/80">A message to all Bahri colleagues</p>
            </div>
            <img
              src={asset('assets/ceo.png')}
              alt="CEO"
              className="hidden h-44 w-auto self-end object-contain drop-shadow-2xl sm:block"
              style={{
                WebkitMaskImage: 'radial-gradient(120% 130% at 50% 30%, #000 62%, transparent 92%)',
                maskImage: 'radial-gradient(120% 130% at 50% 30%, #000 62%, transparent 92%)',
              }}
            />
          </div>
        </div>

        {/* Body */}
        <div className="space-y-4 px-8 py-8">
          {ceoMessage.full.map((para, i) => (
            <p key={i} className="leading-relaxed text-muted">
              {para}
            </p>
          ))}
          <div className="pt-2">
            <p className="font-bold text-content">{ceoMessage.author}</p>
            <p className="text-sm text-subtle">{ceoMessage.role}</p>
          </div>
        </div>
      </article>
    </div>
  )
}
