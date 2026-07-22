import type { Role, Permission } from '@core/api/types'

/**
 * Role → permission mapping (RBAC). Portable and backend-agnostic: the same map
 * is used by web and mobile, and can later be sourced from the backend instead
 * of hard-coded here without changing call sites.
 */
export const rolePermissions: Record<Role, Permission[]> = {
  employee: ['attendance.punch', 'directory.view'],
  manager: ['attendance.punch', 'directory.view', 'workflow.approve'],
  hr: ['attendance.punch', 'directory.view', 'content.manage'],
  executive: ['attendance.punch', 'directory.view', 'workflow.approve'],
  admin: ['attendance.punch', 'directory.view', 'workflow.approve', 'content.manage', 'admin.access'],
}

export const roleLabels: Record<Role, string> = {
  employee: 'Employee',
  manager: 'Line Manager',
  hr: 'HR',
  executive: 'Executive',
  admin: 'Administrator',
}

export function permissionsFor(role: Role): Permission[] {
  return rolePermissions[role] ?? []
}

export function can(role: Role | undefined, permission: Permission): boolean {
  return !!role && permissionsFor(role).includes(permission)
}
