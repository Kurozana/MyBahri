import { Suspense } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, Users2, Bell, ScrollText, BarChart3, Plug, Rocket, Settings } from 'lucide-react'
import { ShieldCheck } from 'lucide-react'
import { BrandLoader } from '@/components/ui/BrandLoader'
import { cn } from '@/lib/cn'

export const adminNav = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'Users', icon: Users2 },
  { to: '/admin/notifications', label: 'Notifications', icon: Bell },
  { to: '/admin/audit', label: 'Audit Log', icon: ScrollText },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/integrations', label: 'Integrations', icon: Plug },
  { to: '/admin/release-notes', label: 'Release Notes', icon: Rocket },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export function AdminLayout() {
  return (
    <div>
      <div className="flex items-center gap-2.5">
        <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white">
          <ShieldCheck className="size-[18px]" />
        </span>
        <div>
          <h1 className="text-lg font-bold text-content">Admin Console</h1>
          <p className="text-xs text-subtle">Manage the portal, integrations and people.</p>
        </div>
      </div>

      <nav className="scroll-thin mt-5 flex gap-1 overflow-x-auto border-b border-line pb-2">
        {adminNav.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition',
                isActive
                  ? 'bg-accent-soft text-primary-700 dark:text-primary-300'
                  : 'text-muted hover:bg-surface-2 hover:text-content',
              )
            }
          >
            <Icon className="size-4" /> {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-6">
        <Suspense
          fallback={
            <div className="grid min-h-[40vh] place-items-center">
              <BrandLoader />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </div>
    </div>
  )
}
