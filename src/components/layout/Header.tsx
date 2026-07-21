import { Bell, ChevronDown, Cloud, IdCard } from 'lucide-react'
import { BahriLogo } from '@/components/ui/BahriLogo'
import { currentUser } from '@/data/home'

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <BahriLogo className="size-9" />
          <span className="text-lg font-extrabold tracking-tight text-ink">
            My<span className="text-primary-600">Bahri</span>
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 sm:flex">
            <Cloud className="size-4 text-primary-500" />
            <span className="font-semibold text-ink">28°C</span>
            <span className="text-slate-400">Riyadh</span>
          </button>

          <button className="grid size-9 place-items-center rounded-full border border-slate-200 bg-white text-primary-600 transition hover:bg-slate-50">
            <IdCard className="size-[18px]" />
          </button>

          <button className="relative grid size-9 place-items-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50">
            <Bell className="size-[18px]" />
            <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-primary-600 text-[10px] font-bold text-white">
              3
            </span>
          </button>

          <button className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-2 transition hover:bg-slate-50">
            <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-xs font-bold text-white">
              {currentUser.initials}
            </span>
            <span className="hidden text-left leading-tight sm:block">
              <span className="block text-sm font-semibold text-ink">{currentUser.name}</span>
              <span className="block text-xs text-slate-400">{currentUser.role}</span>
            </span>
            <ChevronDown className="size-4 text-slate-400" />
          </button>
        </div>
      </div>
    </header>
  )
}
