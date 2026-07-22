import { http, HttpResponse, delay } from 'msw'
import type { TodoDto, OrgMemberDto, TodoStatus, UserDto, EmployeeDto } from '@core/api/types'

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
  { id: 'u5', name: 'Rania Khoury', email: 'admin@bahri.sa', initials: 'RK', role: 'admin', title: 'System Administrator', department: 'IT' },
]

// In-memory store — mutations persist for the session (until page reload).
const todos: TodoDto[] = [
  { id: 't1', title: 'Leave Request', when: 'Tomorrow, 10:00 AM', status: 'Pending Approval' },
  { id: 't2', title: 'Digital card Request', when: 'Tomorrow, 10:00 AM', status: 'Completed' },
]

const orgMembers: OrgMemberDto[] = [
  { id: 'm1', name: 'Ahmed Alsubaey', title: 'Chief Executive Officer', initials: 'AA', team: 'Leadership Team' },
  { id: 'm2', name: 'Mohammed Al-Harbi', title: 'Chief Support Officer', initials: 'MH', team: 'Leadership Team' },
  { id: 'm3', name: 'Sarah Al-Mansour', title: 'Chief HR Officer', initials: 'SM', team: 'Leadership Team' },
  { id: 'm4', name: 'Taher Azadbagh', title: 'Chief Planning Officer', initials: 'TA', team: 'Leadership Team' },
  { id: 'm5', name: 'Khalid Al-Otaibi', title: 'Product Lead', initials: 'KO', team: 'Product Development' },
  { id: 'm6', name: 'Layla Hassan', title: 'Senior Engineer', initials: 'LH', team: 'Product Development' },
  { id: 'm7', name: 'Omar Nasser', title: 'UX Designer', initials: 'ON', team: 'Product Development' },
  { id: 'm8', name: 'Fatima Zahra', title: 'QA Lead', initials: 'FZ', team: 'Product Development' },
]

const LATENCY = 500
let seq = 100

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
]
