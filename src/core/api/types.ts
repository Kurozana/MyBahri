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

// --- Admin ---
export interface AdminUserDto {
  id: string
  name: string
  email: string
  role: Role
  status: 'active' | 'disabled'
  lastActive: string
}

export interface AuditEntryDto {
  id: string
  at: string
  actor: string
  action: string
  target: string
}

export interface AnalyticsDto {
  totalUsers: number
  activeToday: number
  punchesToday: number
  requestsThisWeek: number
  mostUsedServices: { name: string; count: number }[]
  topEvents: { name: string; registered: number }[]
}

export interface NotificationDto {
  id: string
  title: string
  body: string
  audience: string
  sentAt: string
  /** When active, this announcement shows as the banner across the portal. */
  active: boolean
}

export interface ReleaseNoteDto {
  version: string
  date: string
  items: string[]
}

// --- API / Integration Suite ---

/** How an integration is classified in the registry. */
export type IntegrationClass = 'System' | 'Application'
export type IntegrationStatus = 'operational' | 'degraded' | 'down'
export type IntegrationMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'GraphQL' | 'Webhook'

export interface IntegrationDto {
  id: string
  name: string
  /** System = core platform plumbing; Application = a business-facing integration. */
  classification: IntegrationClass
  /** Owning system or vendor, e.g. 'Oracle Fusion HCM', 'GCP Middleware'. */
  provider: string
  /** Functional area, e.g. 'HR', 'Identity', 'Attendance'. */
  category: string
  endpoint: string
  method: IntegrationMethod
  status: IntegrationStatus
  /** Turned off = the portal stops calling it (kill switch). */
  enabled: boolean
  /** Rolling availability, percent. */
  uptime: number
  avgLatencyMs: number
  callsToday: number
  lastChecked: string
  description: string
}

export interface IntegrationLogDto {
  id: string
  at: string
  /** Name of the integration this call belongs to. */
  integration: string
  direction: 'inbound' | 'outbound'
  method: string
  endpoint: string
  statusCode: number
  latencyMs: number
  message?: string
}

export interface LeaveBalanceDto {
  /** remaining leave days */
  balance: number
  unit: string
  asOf: string
}

export interface MeetingDto {
  id: string
  subject: string
  start: string // ISO datetime
  end: string // ISO datetime
  location?: string
  organizer?: string
  isOnline: boolean
  joinUrl?: string
  attendees: number
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
