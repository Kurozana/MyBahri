import { NavLink } from 'react-router-dom'
import { Bot } from 'lucide-react'
import { navItems } from '@/config/nav'
import { cn } from '@/lib/cn'

export function Sidebar() {
  return (
    <aside className="sticky top-[76px] hidden h-fit w-[60px] shrink-0 flex-col items-start gap-4 lg:flex">
      {/* Collapsed icon rail that expands to reveal labels on hover.
          Fixed 60px footprint in layout; the expanded panel flies out over the
          content (z-20) so nothing reflows. */}
      <nav
        className={cn(
          'group/nav relative z-20 flex w-[60px] flex-col gap-1.5 overflow-hidden rounded-2xl border border-line bg-surface p-2 shadow-[0_8px_24px_-16px_rgba(15,23,41,0.18)]',
          'transition-[width,box-shadow] duration-300 ease-out hover:w-56 hover:shadow-xl',
        )}
      >
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

      <button
        title="Bahri Assistant"
        className="ml-1.5 grid size-12 place-items-center rounded-full bg-gradient-to-br from-brand-teal to-brand-cyan text-white shadow-lg shadow-brand-cyan/30 transition hover:scale-105"
      >
        <Bot className="size-6" />
      </button>
    </aside>
  )
}
