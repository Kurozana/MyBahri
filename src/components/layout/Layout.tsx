import { Suspense } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Sidebar } from '@/components/layout/Sidebar'
import { Footer } from '@/components/layout/Footer'
import { BrandLoader } from '@/components/ui/BrandLoader'

function PageLoader() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      {/* Compact, lightweight loader for fast code-split route transitions. */}
      <BrandLoader />
    </div>
  )
}

/** Persistent app shell. Header & Sidebar render once; only <Outlet/> swaps per route. */
export function Layout() {
  const location = useLocation()
  return (
    <div className="min-h-screen">
      <Header />
      <div className="mx-auto flex max-w-[1600px] gap-5 px-4 py-5 sm:px-6">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <Suspense fallback={<PageLoader />}>
            {/* Keyed by route so the content replays a subtle enter animation on
                every navigation (cached or not) — independent of the loader. */}
            <div key={location.pathname} className="animate-page-in">
              <Outlet />
            </div>
          </Suspense>
          <Footer />
        </main>
      </div>
    </div>
  )
}
