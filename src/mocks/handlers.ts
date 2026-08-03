import { http, HttpResponse, delay } from 'msw'
import type {
  TodoDto,
  OrgMemberDto,
  TodoStatus,
  UserDto,
  EmployeeDto,
  AttendanceRecordDto,
  ReleaseNoteDto,
  AdminUserDto,
  AuditEntryDto,
  AnalyticsDto,
  NotificationDto,
  IntegrationDto,
  IntegrationLogDto,
  AdminNoteDto,
} from '@core/api/types'

// --- Admin console (mock demo data) ---
const adminUsers: AdminUserDto[] = [
  { id: 'au1', name: 'Sysadmin', email: 'admin@bahri.sa', role: 'admin', status: 'active', lastActive: 'Just now' },
  { id: 'au2', name: 'Anam Amjad', email: 'anam@bahri.sa', role: 'manager', status: 'active', lastActive: '2h ago' },
  { id: 'au3', name: 'Sarah Al-Mansour', email: 'hr@bahri.sa', role: 'hr', status: 'active', lastActive: 'Yesterday' },
  { id: 'au4', name: 'Ahmed Alsubaey', email: 'exec@bahri.sa', role: 'executive', status: 'active', lastActive: '3d ago' },
  { id: 'au5', name: 'Omar Nasser', email: 'employee@bahri.sa', role: 'employee', status: 'disabled', lastActive: '2w ago' },
]

const auditLog: AuditEntryDto[] = [
  { id: 'a1', at: '2026-08-02 09:14', actor: 'Sysadmin', action: 'Enabled maintenance mode', target: 'Settings' },
  { id: 'a2', at: '2026-08-02 08:40', actor: 'Sarah Al-Mansour', action: 'Published release notes v0.2.4', target: 'Release Notes' },
  { id: 'a3', at: '2026-08-01 16:22', actor: 'Sysadmin', action: 'Disabled account', target: 'employee@bahri.sa' },
  { id: 'a4', at: '2026-08-01 11:05', actor: 'Anam Amjad', action: 'Approved leave request', target: 'Workflow #1204' },
  { id: 'a5', at: '2026-07-31 14:30', actor: 'Sysadmin', action: 'Changed role to HR', target: 'hr@bahri.sa' },
]

const analytics: AnalyticsDto = {
  totalUsers: 1000,
  activeToday: 268,
  punchesToday: 241,
  requestsThisWeek: 87,
  mostUsedServices: [
    { name: 'Leave Request', count: 342 },
    { name: 'Meeting Room Booking', count: 210 },
    { name: 'Digital Card', count: 158 },
    { name: 'IT Support', count: 97 },
    { name: 'Pantry Request', count: 64 },
  ],
  topEvents: [
    { name: 'Annual Town Hall', registered: 145 },
    { name: 'Summer Family Day', registered: 89 },
    { name: 'Safety Awareness Day', registered: 60 },
  ],
}

// --- API / Integration Suite (mock registry + call logs) ---
const integrations: IntegrationDto[] = [
  {
    id: 'int-auth',
    name: 'MyBahri Auth API',
    classification: 'System',
    provider: 'MyBahri Portal',
    category: 'Identity',
    endpoint: '/api/auth',
    method: 'POST',
    status: 'operational',
    enabled: true,
    uptime: 99.98,
    avgLatencyMs: 84,
    callsToday: 1420,
    lastChecked: '1 min ago',
    description: 'Issues and validates portal sign-in tokens (JWT).',
  },
  {
    id: 'int-entra',
    name: 'Microsoft Entra ID (SSO)',
    classification: 'System',
    provider: 'Microsoft Entra',
    category: 'Identity',
    endpoint: 'https://login.microsoftonline.com/oauth2/v2.0',
    method: 'POST',
    status: 'operational',
    enabled: true,
    uptime: 99.95,
    avgLatencyMs: 210,
    callsToday: 612,
    lastChecked: '1 min ago',
    description: 'Single sign-on via corporate Microsoft accounts (OAuth 2.0 / PKCE).',
  },
  {
    id: 'int-fusion-emp',
    name: 'Oracle Fusion HCM — Employees',
    classification: 'Application',
    provider: 'Oracle Fusion HCM',
    category: 'HR',
    endpoint: '/hcmRestApi/resources/11.13.18.05/emps',
    method: 'GET',
    status: 'operational',
    enabled: true,
    uptime: 99.7,
    avgLatencyMs: 540,
    callsToday: 388,
    lastChecked: '3 min ago',
    description: 'Master employee records, org hierarchy and departments.',
  },
  {
    id: 'int-fusion-leave',
    name: 'Oracle Fusion HCM — Leave Balance',
    classification: 'Application',
    provider: 'Oracle Fusion HCM',
    category: 'HR',
    endpoint: '/hcmRestApi/resources/11.13.18.05/absencePlanBalances',
    method: 'GET',
    status: 'degraded',
    enabled: true,
    uptime: 97.4,
    avgLatencyMs: 1180,
    callsToday: 205,
    lastChecked: '2 min ago',
    description: 'Remaining leave days shown on the attendance card.',
  },
  {
    id: 'int-bpm',
    name: 'Oracle BPM — Approvals',
    classification: 'Application',
    provider: 'Oracle BPM Workflow',
    category: 'Workflow',
    endpoint: '/bpm/api/4.0/tasks',
    method: 'POST',
    status: 'operational',
    enabled: true,
    uptime: 99.4,
    avgLatencyMs: 690,
    callsToday: 143,
    lastChecked: '4 min ago',
    description: 'Routes leave and service requests for multi-level approval.',
  },
  {
    id: 'int-gcp-sync',
    name: 'GCP Middleware — User Sync',
    classification: 'System',
    provider: 'GCP Middleware',
    category: 'Provisioning',
    endpoint: 'https://mw.bahri.sa/v1/users/sync',
    method: 'Webhook',
    status: 'operational',
    enabled: true,
    uptime: 99.9,
    avgLatencyMs: 320,
    callsToday: 26,
    lastChecked: '12 min ago',
    description: 'Upserts portal accounts from the identity source (hash-based no-op detection).',
  },
  {
    id: 'int-gcp-payroll',
    name: 'GCP Middleware — Attendance → Payroll',
    classification: 'System',
    provider: 'GCP Middleware',
    category: 'Attendance',
    endpoint: 'https://mw.bahri.sa/v1/attendance/push',
    method: 'POST',
    status: 'operational',
    enabled: true,
    uptime: 99.6,
    avgLatencyMs: 450,
    callsToday: 3,
    lastChecked: '2 h ago',
    description: 'Nightly scheduler that pushes the day’s punches to Fusion payroll.',
  },
  {
    id: 'int-graph',
    name: 'Microsoft Graph — Calendar',
    classification: 'Application',
    provider: 'Microsoft Graph',
    category: 'Productivity',
    endpoint: 'https://graph.microsoft.com/v1.0/me/calendarView',
    method: 'GET',
    status: 'operational',
    enabled: true,
    uptime: 99.8,
    avgLatencyMs: 260,
    callsToday: 331,
    lastChecked: '1 min ago',
    description: 'Powers the Upcoming Meetings widget from Outlook calendars.',
  },
  {
    id: 'int-weather',
    name: 'Open-Meteo Weather',
    classification: 'Application',
    provider: 'Open-Meteo',
    category: 'Utility',
    endpoint: 'https://api.open-meteo.com/v1/forecast',
    method: 'GET',
    status: 'operational',
    enabled: true,
    uptime: 99.99,
    avgLatencyMs: 130,
    callsToday: 540,
    lastChecked: '1 min ago',
    description: 'Live weather shown in the top bar.',
  },
  {
    id: 'int-bahar',
    name: 'Bahar AI Assistant',
    classification: 'Application',
    provider: 'Bahar AI',
    category: 'AI',
    endpoint: 'https://ai.bahri.sa/v1/chat',
    method: 'POST',
    status: 'down',
    enabled: false,
    uptime: 0,
    avgLatencyMs: 0,
    callsToday: 0,
    lastChecked: '5 min ago',
    description: 'Conversational assistant. Currently disabled pending rollout.',
  },
]

const integrationLogs: IntegrationLogDto[] = [
  { id: 'l1', at: '2026-08-03 09:41:12', integration: 'Oracle Fusion HCM — Leave Balance', direction: 'outbound', method: 'GET', endpoint: '/absencePlanBalances?empId=1042', statusCode: 200, latencyMs: 1240, message: 'OK (slow)' },
  { id: 'l2', at: '2026-08-03 09:40:58', integration: 'MyBahri Auth API', direction: 'inbound', method: 'POST', endpoint: '/api/auth/login', statusCode: 200, latencyMs: 78 },
  { id: 'l3', at: '2026-08-03 09:40:31', integration: 'Microsoft Graph — Calendar', direction: 'outbound', method: 'GET', endpoint: '/me/calendarView', statusCode: 200, latencyMs: 254 },
  { id: 'l4', at: '2026-08-03 09:39:47', integration: 'Bahar AI Assistant', direction: 'outbound', method: 'POST', endpoint: '/v1/chat', statusCode: 503, latencyMs: 0, message: 'Service disabled' },
  { id: 'l5', at: '2026-08-03 09:38:20', integration: 'Oracle BPM — Approvals', direction: 'outbound', method: 'POST', endpoint: '/tasks/1204/approve', statusCode: 201, latencyMs: 662 },
  { id: 'l6', at: '2026-08-03 09:37:03', integration: 'Oracle Fusion HCM — Employees', direction: 'outbound', method: 'GET', endpoint: '/emps?q=dept=PMO', statusCode: 200, latencyMs: 512 },
  { id: 'l7', at: '2026-08-03 09:35:44', integration: 'Oracle Fusion HCM — Leave Balance', direction: 'outbound', method: 'GET', endpoint: '/absencePlanBalances?empId=1088', statusCode: 504, latencyMs: 3000, message: 'Gateway timeout' },
  { id: 'l8', at: '2026-08-03 09:34:10', integration: 'Microsoft Entra ID (SSO)', direction: 'inbound', method: 'POST', endpoint: '/oauth2/v2.0/token', statusCode: 200, latencyMs: 198 },
  { id: 'l9', at: '2026-08-03 09:31:02', integration: 'Open-Meteo Weather', direction: 'outbound', method: 'GET', endpoint: '/v1/forecast?lat=24.7&lon=46.7', statusCode: 200, latencyMs: 121 },
  { id: 'l10', at: '2026-08-03 02:00:05', integration: 'GCP Middleware — Attendance → Payroll', direction: 'outbound', method: 'POST', endpoint: '/v1/attendance/push', statusCode: 200, latencyMs: 448, message: '241 punches synced' },
  { id: 'l11', at: '2026-08-03 01:30:00', integration: 'GCP Middleware — User Sync', direction: 'inbound', method: 'POST', endpoint: '/v1/users/sync', statusCode: 200, latencyMs: 305, message: '3 created, 12 updated, 985 unchanged' },
  { id: 'l12', at: '2026-08-02 17:22:41', integration: 'Oracle Fusion HCM — Employees', direction: 'outbound', method: 'GET', endpoint: '/emps?q=id=1042', statusCode: 401, latencyMs: 96, message: 'Token expired — retried OK' },
]

// Unversioned admin/console changelog (mirrors ADMIN_NOTES.md). Read-only in the UI.
const adminNotes: AdminNoteDto[] = [
  {
    id: 'an3',
    date: 'August 2026',
    title: 'API / Integration Suite',
    tag: 'new',
    items: [
      'Added an Integrations area listing every connected system and application, with its status, endpoint, average response time, uptime and calls today.',
      'Each integration is classified as System or Application, with search and filtering across them.',
      'Added a per-integration on/off switch, so an integration can be paused without a code change.',
      'Added a recent-activity log of individual calls with result codes and response times, colour-coded so problems stand out.',
      'Both the registry and the activity log can be exported to Excel.',
    ],
  },
  {
    id: 'an2',
    date: 'August 2026',
    title: 'Admin Console refinements',
    tag: 'improved',
    items: [
      'Maintenance mode is fully editable: heading, message, and an optional "back online" countdown.',
      'Turning maintenance on now asks for confirmation, with a clear warning that it stops everyone except admins.',
      'Notifications became global announcements that publish straight to everyone\'s home banner.',
      'Removed a duplicate "Release Management" entry from the top-bar menu.',
    ],
  },
  {
    id: 'an1',
    date: 'August 2026',
    title: 'Admin Console',
    tag: 'new',
    items: [
      'Introduced the Admin Console with Overview, Users & Access, Notifications, Audit Log, Analytics, Release Notes and Settings.',
      'Users & Access: view accounts, change roles, and enable or disable people.',
      'Audit Log: a searchable record of who did what and when.',
      'Analytics: active users, punches, most-used services and top events.',
      'Settings: feature flags plus maintenance mode.',
    ],
  },
]

const notifications: NotificationDto[] = [
  { id: 'n1', title: 'Remote work next week', body: 'All staff will work remotely from Sunday to Thursday next week. Please take your equipment home.', audience: 'All staff', sentAt: '2026-08-01 17:00', active: true },
  { id: 'n2', title: 'New leave policy', body: 'The updated annual leave policy is now in effect.', audience: 'All staff', sentAt: '2026-07-28 10:15', active: false },
]
let notifSeq = 10

// In-memory release notes (newest first). Admins publish new ones via POST.
// Mirrors RELEASE_NOTES.md; user-facing versions only.
const releaseNotes: ReleaseNoteDto[] = [
  {
    version: '0.5.0',
    date: 'Aug 3, 2026',
    items: [
      'Open a full weekly view of your attendance from the Daily Attendance card, with Present / Partial / Absent tags.',
      'Meet Bahar, your AI assistant, from the new button in the bottom-right corner. Coming soon!',
    ],
  },
  {
    version: '0.4.0',
    date: 'Aug 1, 2026',
    items: [
      'The home banner now shows the latest company announcement.',
      'Planned maintenance now shows a friendly "we\'ll be back soon" page with a countdown.',
    ],
  },
  {
    version: '0.3.1',
    date: 'Jul 29, 2026',
    items: [
      'The side navigation now pushes the page aside when it expands, instead of covering it.',
      'Fixed pages and widgets occasionally showing "couldn\'t load" on first open.',
    ],
  },
  {
    version: '0.3.0',
    date: 'Jul 27, 2026',
    items: [
      'Multimedia now has Events, News, and Photo Library tabs.',
      'The calendar opens on the current month and highlights event days.',
      'Switch the calendar between Hijri and Gregorian.',
      "Added a What's New button to catch up on updates.",
      'Your leave balance now comes from the system instead of a fixed number.',
    ],
  },
  {
    version: '0.2.0',
    date: 'Jul 22, 2026',
    items: [
      'Added a new sign-in page with single sign-on and email.',
      'Added role-based access, so you only see what your role allows.',
      'Added Employee Lookup, a full CEO message page, and live weather.',
      'Added a reporting-line view and an Upcoming Meetings widget.',
    ],
  },
  {
    version: '0.1.0',
    date: 'Jul 20, 2026',
    items: [
      'First preview of the new, faster MyBahri portal.',
      'Home dashboard with attendance, to-dos, events, calendar and more.',
      'Live punch-in / punch-out with a running work timer.',
      'Dark Mode and seasonal themes.',
    ],
  },
]

const employees: EmployeeDto[] = [
  { id: 'e3', name: 'Ahmed Alsubaey', initials: 'AA', title: 'Chief Executive Officer', department: 'Executive', floor: 'Floor 9', extension: '9000', email: 'a.alsubaey@bahri.sa' },
  { id: 'e2', name: 'Sarah Al-Mansour', initials: 'SM', title: 'Chief HR Officer', department: 'Human Resources', floor: 'Floor 7', extension: '7001', email: 'sarah.m@bahri.sa', managerId: 'e3' },
  { id: 'e7', name: 'Taher Azadbagh', initials: 'TA', title: 'Chief Planning Officer', department: 'Strategy', floor: 'Floor 8', extension: '8110', email: 'taher.a@bahri.sa', managerId: 'e3' },
  { id: 'e9', name: 'Mohammed Al-Harbi', initials: 'MH', title: 'Chief Support Officer', department: 'Operations', floor: 'Floor 6', extension: '6015', email: 'm.harbi@bahri.sa', managerId: 'e3' },
  { id: 'e1', name: 'Anam Amjad', initials: 'AA', title: 'Project Manager', department: 'PMO', floor: 'Floor 5', extension: '5120', email: 'anam@bahri.sa', managerId: 'e7' },
  { id: 'e6', name: 'Khalid Al-Otaibi', initials: 'KO', title: 'Product Lead', department: 'Product', floor: 'Floor 4', extension: '4200', email: 'khalid.o@bahri.sa', managerId: 'e7' },
  { id: 'e11', name: 'Nadia Farouk', initials: 'NF', title: 'Program Manager', department: 'PMO', floor: 'Floor 5', extension: '5140', email: 'nadia.f@bahri.sa', managerId: 'e7' },
  { id: 'e4', name: 'Omar Nasser', initials: 'ON', title: 'UX Designer', department: 'Product', floor: 'Floor 4', extension: '4218', email: 'omar.n@bahri.sa', managerId: 'e6' },
  { id: 'e5', name: 'Layla Hassan', initials: 'LH', title: 'Senior Engineer', department: 'Engineering', floor: 'Floor 4', extension: '4305', email: 'layla.h@bahri.sa', managerId: 'e6' },
  { id: 'e8', name: 'Fatima Zahra', initials: 'FZ', title: 'QA Lead', department: 'Engineering', floor: 'Floor 4', extension: '4410', email: 'fatima.z@bahri.sa', managerId: 'e6' },
  { id: 'e10', name: 'Rania Khoury', initials: 'RK', title: 'System Administrator', department: 'IT', floor: 'Floor 3', extension: '3077', email: 'rania.k@bahri.sa', managerId: 'e9' },
]

// Demo accounts — sign in with any of these (any password) to see role-based UI.
const users: UserDto[] = [
  { id: 'u1', name: 'Anam Amjad', email: 'anam@bahri.sa', initials: 'AA', role: 'manager', title: 'Project Manager', department: 'PMO' },
  { id: 'u2', name: 'Sarah Al-Mansour', email: 'hr@bahri.sa', initials: 'SM', role: 'hr', title: 'Chief HR Officer', department: 'Human Resources' },
  { id: 'u3', name: 'Ahmed Alsubaey', email: 'exec@bahri.sa', initials: 'AA', role: 'executive', title: 'Chief Executive Officer', department: 'Executive' },
  { id: 'u4', name: 'Omar Nasser', email: 'employee@bahri.sa', initials: 'ON', role: 'employee', title: 'UX Designer', department: 'Product' },
  { id: 'u5', name: 'Sysadmin', email: 'admin@bahri.sa', initials: 'SA', role: 'admin', title: 'System Administrator', department: 'IT' },
]

// In-memory store — mutations persist for the session (until page reload).
const todos: TodoDto[] = [
  { id: 't1', title: 'Leave Request', when: 'Tomorrow, 10:00 AM', status: 'Pending Approval' },
  { id: 't2', title: 'Digital card Request', when: 'Tomorrow, 10:00 AM', status: 'Completed' },
]

// Intentionally empty — the org structure is populated from real accounts once
// they exist (provisioned from the identity source). No hardcoded people.
const orgMembers: OrgMemberDto[] = []

const LATENCY = 500
let seq = 100

// Builds this week's punches (Sun–Thu workweek) up to today, so the tags
// Present / Partial / Absent all have something to show. Portal is the source
// of truth; a nightly scheduler syncs these to Fusion payroll.
function buildAttendanceWeek(): AttendanceRecordDto[] {
  const plan: Record<number, { hours: number; in: string | null; out: string | null }> = {
    0: { hours: 8, in: '08:30', out: '16:30' },
    1: { hours: 8, in: '08:15', out: '16:20' },
    2: { hours: 5.5, in: '09:00', out: '14:30' },
    3: { hours: 0, in: null, out: null },
    4: { hours: 8, in: '08:40', out: '16:40' },
  }
  const today = new Date()
  const day = today.getDay() // 0 = Sunday … 6 = Saturday
  const sunday = new Date(today)
  sunday.setDate(today.getDate() - day)

  const records: AttendanceRecordDto[] = []
  for (let i = 0; i <= day && i <= 4; i++) {
    const d = new Date(sunday)
    d.setDate(sunday.getDate() + i)
    const p = plan[i]
    records.push({ date: d.toISOString().slice(0, 10), punchIn: p.in, punchOut: p.out, hours: p.hours })
  }
  return records
}

// Match the same base the client uses (see main.tsx). Under GitHub Pages this
// becomes '/MyBahri/api', which keeps requests inside the worker's scope.
const API = `${import.meta.env.BASE_URL}api`

export const handlers = [
  // --- Auth (mock) ---
  http.post(`${API}/auth/login`, async ({ request }) => {
    const { email } = (await request.json()) as { email?: string }
    const user =
      users.find((u) => u.email.toLowerCase() === String(email ?? '').toLowerCase()) ?? users[0]
    await delay(400)
    return HttpResponse.json({ token: `mock-token-${user.id}`, user })
  }),

  http.get(`${API}/auth/me`, async ({ request }) => {
    const id = (request.headers.get('Authorization') ?? '').replace('Bearer mock-token-', '')
    const user = users.find((u) => u.id === id)
    if (!user) return new HttpResponse(null, { status: 401 })
    await delay(200)
    return HttpResponse.json(user)
  }),

  http.get(`${API}/todos`, async () => {
    await delay(LATENCY)
    return HttpResponse.json(todos)
  }),

  http.post(`${API}/todos`, async ({ request }) => {
    await delay(300)
    const { title } = (await request.json()) as { title: string }
    const todo: TodoDto = {
      id: `t${seq++}`,
      title,
      when: 'Just now',
      status: 'Pending Approval',
    }
    todos.unshift(todo)
    return HttpResponse.json(todo, { status: 201 })
  }),

  http.patch(`${API}/todos/:id`, async ({ params, request }) => {
    await delay(200)
    const { status } = (await request.json()) as { status: TodoStatus }
    const todo = todos.find((t) => t.id === params.id)
    if (!todo) return new HttpResponse(null, { status: 404 })
    todo.status = status
    return HttpResponse.json(todo)
  }),

  http.get(`${API}/org-members`, async () => {
    await delay(LATENCY)
    return HttpResponse.json(orgMembers)
  }),

  http.get(`${API}/employees`, async () => {
    await delay(300)
    return HttpResponse.json(employees)
  }),

  http.get(`${API}/leave-balance`, async () => {
    await delay(300)
    return HttpResponse.json({ balance: 14, unit: 'days', asOf: new Date().toISOString() })
  }),

  http.get(`${API}/attendance/week`, async () => {
    await delay(300)
    return HttpResponse.json(buildAttendanceWeek())
  }),

  http.get(`${API}/release-notes`, async () => {
    await delay(200)
    return HttpResponse.json(releaseNotes)
  }),

  http.post(`${API}/release-notes`, async ({ request }) => {
    await delay(300)
    const note = (await request.json()) as ReleaseNoteDto
    releaseNotes.unshift(note)
    return HttpResponse.json(note, { status: 201 })
  }),

  // --- Admin console ---
  http.get(`${API}/admin/users`, async () => {
    await delay(300)
    return HttpResponse.json(adminUsers)
  }),
  http.patch(`${API}/admin/users/:id`, async ({ params, request }) => {
    await delay(200)
    const patch = (await request.json()) as Partial<AdminUserDto>
    const user = adminUsers.find((u) => u.id === params.id)
    if (!user) return new HttpResponse(null, { status: 404 })
    Object.assign(user, patch)
    return HttpResponse.json(user)
  }),
  http.get(`${API}/admin/audit`, async () => {
    await delay(300)
    return HttpResponse.json(auditLog)
  }),
  http.get(`${API}/admin/analytics`, async () => {
    await delay(300)
    return HttpResponse.json(analytics)
  }),
  http.get(`${API}/admin/notifications`, async () => {
    await delay(300)
    return HttpResponse.json(notifications)
  }),
  http.post(`${API}/admin/notifications`, async ({ request }) => {
    await delay(300)
    const { title, body, audience } = (await request.json()) as {
      title: string
      body: string
      audience: string
    }
    // A newly published announcement becomes the single active banner.
    notifications.forEach((x) => (x.active = false))
    const n: NotificationDto = {
      id: `n${notifSeq++}`,
      title,
      body,
      audience,
      sentAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      active: true,
    }
    notifications.unshift(n)
    return HttpResponse.json(n, { status: 201 })
  }),
  http.patch(`${API}/admin/notifications/:id`, async ({ params, request }) => {
    await delay(200)
    const { active } = (await request.json()) as { active: boolean }
    const n = notifications.find((x) => x.id === params.id)
    if (!n) return new HttpResponse(null, { status: 404 })
    if (active) notifications.forEach((x) => (x.active = false)) // only one active banner
    n.active = active
    return HttpResponse.json(n)
  }),

  // --- API / Integration Suite ---
  http.get(`${API}/admin/integrations`, async () => {
    await delay(300)
    return HttpResponse.json(integrations)
  }),
  http.patch(`${API}/admin/integrations/:id`, async ({ params, request }) => {
    await delay(200)
    const { enabled } = (await request.json()) as { enabled: boolean }
    const it = integrations.find((x) => x.id === params.id)
    if (!it) return new HttpResponse(null, { status: 404 })
    it.enabled = enabled
    // A disabled integration reports as down; re-enabling brings it back operational.
    it.status = enabled ? 'operational' : 'down'
    return HttpResponse.json(it)
  }),
  http.get(`${API}/admin/integration-logs`, async () => {
    await delay(300)
    return HttpResponse.json(integrationLogs)
  }),

  http.get(`${API}/admin/changelog`, async () => {
    await delay(300)
    return HttpResponse.json(adminNotes)
  }),
]
