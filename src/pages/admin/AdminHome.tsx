import { Link } from 'react-router-dom'
import { TriangleAlert } from 'lucide-react'
import { adminNav } from './AdminLayout'
import { useMaintenance } from '@/hooks/useAdminSettings'

const descriptions: Record<string, string> = {
  '/admin/users': 'Accounts, roles and access.',
  '/admin/notifications': 'Send announcements to staff.',
  '/admin/audit': 'Who did what, and when.',
  '/admin/analytics': 'Usage and engagement metrics.',
  '/admin/integrations': 'APIs, systems and call logs.',
  '/admin/release-notes': 'Author and publish updates.',
  '/admin/settings': 'Feature flags and maintenance mode.',
}

export default function AdminHome() {
  const maintenance = useMaintenance()
  const cards = adminNav.filter((n) => !n.end)

  return (
    <div>
      {maintenance.enabled && (
        <div className="mb-5 flex items-center gap-2 rounded-xl bg-amber-100 p-3.5 text-sm font-semibold text-amber-800 dark:bg-amber-400/15 dark:text-amber-300">
          <TriangleAlert className="size-4" /> Maintenance mode is ON — visitors see the maintenance
          page.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="group rounded-2xl border border-line bg-surface p-5 transition hover:border-primary-300 hover:shadow-md"
          >
            <span className="grid size-11 place-items-center rounded-xl bg-accent-soft text-primary-600 transition group-hover:scale-105 dark:text-primary-300">
              <Icon className="size-5" />
            </span>
            <p className="mt-3 font-semibold text-content">{label}</p>
            <p className="mt-0.5 text-sm text-subtle">{descriptions[to]}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
