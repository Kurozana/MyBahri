import { BahriLogo } from '@/components/ui/BahriLogo'

export function Footer() {
  return (
    <footer className="mt-8 overflow-hidden rounded-2xl bg-gradient-to-r from-primary-800 via-primary-600 to-brand-mint px-6 py-6 text-white sm:px-8">
      <div className="flex items-center gap-3">
        <BahriLogo className="size-11 bg-white/15 backdrop-blur" />
        <div>
          <p className="text-xl font-extrabold tracking-tight">Bahri</p>
          <p className="text-sm text-white/70">Global logistics &amp; shipping</p>
        </div>
      </div>
    </footer>
  )
}
