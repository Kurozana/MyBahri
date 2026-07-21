import { Instagram, Linkedin, Youtube } from 'lucide-react'
import { BahriLogo } from '@/components/ui/BahriLogo'

export function Footer() {
  return (
    <footer className="mt-8 overflow-hidden rounded-2xl bg-gradient-to-r from-primary-800 via-primary-600 to-brand-mint px-6 py-6 text-white sm:px-8">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <BahriLogo className="size-11 bg-white/15 backdrop-blur" />
          <div>
            <p className="text-xl font-extrabold tracking-tight">Bahri</p>
            <p className="text-sm text-white/70">Global logistics &amp; shipping</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {[Instagram, Linkedin, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="grid size-9 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
              >
                <Icon className="size-[18px]" />
              </a>
            ))}
          </div>
          <a
            href="#"
            className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-emerald-600 transition hover:bg-white/90"
          >
            <span className="grid size-5 place-items-center rounded-full bg-emerald-500 text-white">
              <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor">
                <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm5.3 14c-.2.6-1.2 1.2-1.7 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-3.9-4.7-4.1-.1-.2-1.1-1.4-1.1-2.7 0-1.3.7-1.9 1-2.2.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.4.5c-.2.2-.3.4-.1.6.1.3.7 1.1 1.4 1.7.9.8 1.7 1.1 2 1.2.2.1.4.1.5-.1l.6-.7c.2-.2.3-.2.5-.1l1.8.9c.2.1.4.2.4.3.1.1.1.7-.1 1.2Z" />
              </svg>
            </span>
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </footer>
  )
}
