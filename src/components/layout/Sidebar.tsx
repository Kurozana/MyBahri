import { NavLink } from 'react-router-dom'
import { Bot } from 'lucide-react'
import { navItems } from '@/config/nav'
import { useFeatureFlags } from '@/hooks/useAdminSettings'
import { cn } from '@/lib/cn'

export function Sidebar() {
  const flags = useFeatureFlags()
  return (
    // Collapsed icon rail that expands on hover to reveal labels. It lives in the
    // layout (not an overlay), so expanding pushes the page content right —
    // nothing gets covered.
    <aside className="group/nav sticky top-[76px] hidden h-fit w-[60px] shrink-0 flex-col items-stretch gap-4 transition-[width] duration-300 ease-out hover:w-56 lg:flex">
      <nav className="flex w-full flex-col gap-1.5 overflow-hidden rounded-2xl border border-line bg-surface p-2 shadow-[0_8px_24px_-16px_rgba(15,23,41,0.18)]">
        {navItems.map(({ icon: Icon, label, path, load }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            onMouseEnter={() => void load()}
            onFocus={() => void load()}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 overflow-hidden rounded-xl transition-colors',
                isActive
                  ? 'bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-md shadow-primary-600/30'
                  : 'text-subtle hover:bg-surface-2 hover:text-primary-600',
              )
            }
          >
            <span className="grid size-11 shrink-0 place-items-center">
              <Icon className="size-[20px]" />
            </span>
            <span className="whitespace-nowrap pr-3 text-sm font-medium opacity-0 transition-opacity duration-200 group-hover/nav:opacity-100">
              {label}
            </span>
          </NavLink>
        ))}
      </nav>

      {flags.bahar && (
        <button
          title="Bahar — AI Assistant"
          className="ml-1.5 grid size-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-teal to-brand-cyan text-white shadow-lg shadow-brand-cyan/30 transition hover:scale-105"
        >
          <Bot className="size-6" />
        </button>
      )}
    </aside>
  )
}
