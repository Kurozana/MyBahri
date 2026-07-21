import { NavLink } from 'react-router-dom'
import { ChevronRight, Bot } from 'lucide-react'
import { navItems } from '@/config/nav'
import { cn } from '@/lib/cn'

export function Sidebar() {
  return (
    <aside className="sticky top-[76px] hidden h-fit flex-col items-center gap-4 lg:flex">
      <nav className="flex flex-col items-center gap-1.5 rounded-2xl border border-line bg-surface p-2 shadow-[0_8px_24px_-16px_rgba(15,23,41,0.18)] transition-colors">
        {navItems.map(({ icon: Icon, label, path, load }) => (
          <NavLink
            key={path}
            to={path}
            title={label}
            end={path === '/'}
            onMouseEnter={() => void load()}
            onFocus={() => void load()}
            className={({ isActive }) =>
              cn(
                'group relative grid size-11 place-items-center rounded-xl transition',
                isActive
                  ? 'bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-md shadow-primary-600/30'
                  : 'text-subtle hover:bg-surface-2 hover:text-primary-600',
              )
            }
          >
            <Icon className="size-[20px]" />
          </NavLink>
        ))}
        <div className="my-1 h-px w-7 bg-line" />
        <button
          title="Expand"
          className="grid size-11 place-items-center rounded-xl text-subtle transition hover:bg-surface-2 hover:text-primary-600"
        >
          <ChevronRight className="size-5" />
        </button>
      </nav>

      <button
        title="Bahri Assistant"
        className="grid size-12 place-items-center rounded-full bg-gradient-to-br from-brand-teal to-brand-cyan text-white shadow-lg shadow-brand-cyan/30 transition hover:scale-105"
      >
        <Bot className="size-6" />
      </button>
    </aside>
  )
}
