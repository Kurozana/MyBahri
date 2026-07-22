import type { ReactNode } from 'react'
import { can } from '@core/auth/permissions'
import type { Permission } from '@core/api/types'
import { useAuth } from '@/hooks/useAuth'

/** Renders children only if the signed-in user has the given permission. */
export function Can({ permission, children }: { permission: Permission; children: ReactNode }) {
  const { user } = useAuth()
  return can(user?.role, permission) ? <>{children}</> : null
}
