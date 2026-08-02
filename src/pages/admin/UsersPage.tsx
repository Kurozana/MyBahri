import { useEffect, useState } from 'react'
import { Search, Ban, CheckCircle2 } from 'lucide-react'
import { useApi } from '@core/hooks/useApi'
import { adminApi } from '@core/api/admin'
import { roleLabels } from '@core/auth/permissions'
import type { AdminUserDto, Role } from '@core/api/types'
import { Skeleton } from '@/components/ui/Skeleton'
import { Badge } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'

const ROLES: Role[] = ['employee', 'manager', 'hr', 'executive', 'admin']

export default function UsersPage() {
  const toast = useToast()
  const { data, loading } = useApi(adminApi.getUsers)
  const [users, setUsers] = useState<AdminUserDto[]>([])
  const [q, setQ] = useState('')

  useEffect(() => {
    if (data) setUsers(data)
  }, [data])

  const visible = users.filter(
    (u) =>
      u.name.toLowerCase().includes(q.toLowerCase()) ||
      u.email.toLowerCase().includes(q.toLowerCase()),
  )

  const changeRole = (u: AdminUserDto, role: Role) => {
    setUsers((list) => list.map((x) => (x.id === u.id ? { ...x, role } : x)))
    adminApi.updateUser(u.id, { role }).catch(() => toast('Update failed', 'info'))
  }
  const toggleStatus = (u: AdminUserDto) => {
    const status = u.status === 'active' ? 'disabled' : 'active'
    setUsers((list) => list.map((x) => (x.id === u.id ? { ...x, status } : x)))
    adminApi.updateUser(u.id, { status }).catch(() => toast('Update failed', 'info'))
    toast(status === 'disabled' ? `Disabled ${u.name}` : `Enabled ${u.name}`)
  }

  return (
    <div>
      <div className="relative mb-4 max-w-xs">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search users…"
          className="w-full rounded-full border border-line bg-surface py-2 pl-9 pr-3 text-sm text-content outline-none transition placeholder:text-subtle focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-500/20"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-line">
        <table className="w-full text-sm">
          <thead className="bg-surface-2 text-left text-xs font-semibold uppercase tracking-wide text-subtle">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="hidden px-4 py-3 sm:table-cell">Last active</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {loading &&
              [0, 1, 2].map((i) => (
                <tr key={i}>
                  <td className="px-4 py-3" colSpan={5}>
                    <Skeleton className="h-6 w-full" />
                  </td>
                </tr>
              ))}
            {!loading &&
              visible.map((u) => (
                <tr key={u.id} className="bg-surface transition hover:bg-surface-2">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-[11px] font-bold text-white">
                        {u.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-content">{u.name}</p>
                        <p className="truncate text-xs text-subtle">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={u.role}
                      onChange={(e) => changeRole(u, e.target.value as Role)}
                      className="rounded-lg border border-line bg-surface px-2 py-1 text-xs font-medium text-content outline-none focus:border-primary-400"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {roleLabels[r]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={u.status === 'active' ? 'success' : 'neutral'}>
                      {u.status === 'active' ? 'Active' : 'Disabled'}
                    </Badge>
                  </td>
                  <td className="hidden px-4 py-3 text-subtle sm:table-cell">{u.lastActive}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => toggleStatus(u)}
                      title={u.status === 'active' ? 'Disable' : 'Enable'}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-line px-2.5 py-1 text-xs font-semibold text-muted transition hover:bg-surface-2"
                    >
                      {u.status === 'active' ? (
                        <>
                          <Ban className="size-3.5" /> Disable
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="size-3.5" /> Enable
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
