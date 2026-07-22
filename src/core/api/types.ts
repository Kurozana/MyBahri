/**
 * API data contracts — the JSON shapes exchanged with the backend (mocked by MSW
 * now, real backend/GCP later). Pure types: no web or framework dependencies, so
 * this file is shared verbatim by the web app and the future React Native app.
 */

export type TodoStatus = 'Pending Approval' | 'Completed'

export interface TodoDto {
  id: string
  title: string
  when: string
  status: TodoStatus
}

export interface OrgMemberDto {
  id: string
  name: string
  title: string
  initials: string
  team: 'Leadership Team' | 'Product Development'
}

export interface EmployeeDto {
  id: string
  name: string
  initials: string
  title: string
  department: string
  floor: string
  extension: string
  email: string
  /** id of this person's manager; absent for the top of the org. */
  managerId?: string
}

// --- Accounts & permissions ---

export type Role = 'employee' | 'manager' | 'hr' | 'executive' | 'admin'

export type Permission =
  | 'attendance.punch'
  | 'directory.view'
  | 'workflow.approve'
  | 'content.manage'
  | 'admin.access'

export interface UserDto {
  id: string
  name: string
  email: string
  initials: string
  role: Role
  title: string
  department: string
}

export interface AuthResponse {
  token: string
  user: UserDto
}
