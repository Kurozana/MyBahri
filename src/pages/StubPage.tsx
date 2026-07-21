import { useLocation } from 'react-router-dom'
import { Construction } from 'lucide-react'
import { navItems } from '@/config/nav'

/** Placeholder for pages not yet built — proves out code-split routing. */
export default function StubPage() {
  const { pathname } = useLocation()
  const item = navItems.find((n) => n.path === pathname)

  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="flex flex-col items-center rounded-2xl border border-slate-200/80 bg-white px-10 py-14 text-center shadow-sm">
        <span className="grid size-16 place-items-center rounded-2xl bg-primary-50 text-primary-600">
          <Construction className="size-8" />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold text-ink">{item?.label ?? 'Page'}</h1>
        <p className="mt-2 max-w-sm text-sm text-slate-500">
          This page is part of the full PoC scope. It loaded as its own lazy chunk — notice the
          shell (header &amp; sidebar) never reloaded.
        </p>
      </div>
    </div>
  )
}
