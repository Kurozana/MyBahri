// RBAC — mirrors the web app's src/core/auth/permissions. When the monorepo
// lands, both sides import this from the shared @core package.

export type Role = 'employee' | 'manager' | 'hr' | 'executive' | 'admin'

export type Permission =
  | 'attendance.punch'
  | 'directory.view'
  | 'workflow.approve'
  | 'content.manage'
  | 'admin.access'

export const rolePermissions: Record<Role, Permission[]> = {
  employee: ['attendance.punch', 'directory.view'],
  manager: ['attendance.punch', 'directory.view', 'workflow.approve'],
  hr: ['attendance.punch', 'directory.view', 'content.manage'],
  executive: ['attendance.punch', 'directory.view', 'workflow.approve'],
  admin: ['attendance.punch', 'directory.view', 'workflow.approve', 'content.manage', 'admin.access'],
}

export function can(role: string | undefined, permission: Permission): boolean {
  if (!role) return false
  return (rolePermissions[role as Role] ?? []).includes(permission)
}
