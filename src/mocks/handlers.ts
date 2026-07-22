import { http, HttpResponse, delay } from 'msw'
import type { TodoDto, OrgMemberDto, TodoStatus, UserDto } from '@core/api/types'

// Demo accounts — sign in with any of these (any password) to see role-based UI.
const users: UserDto[] = [
  { id: 'u1', name: 'Anam Amjad', email: 'anam@bahri.sa', initials: 'AA', role: 'manager', title: 'Project Manager', department: 'PMO' },
  { id: 'u2', name: 'Sarah Al-Mansour', email: 'hr@bahri.sa', initials: 'SM', role: 'hr', title: 'Chief HR Officer', department: 'Human Resources' },
  { id: 'u3', name: 'Mohammed Al-Harbi', email: 'exec@bahri.sa', initials: 'MH', role: 'executive', title: 'Chief Executive Officer', department: 'Executive' },
  { id: 'u4', name: 'Omar Nasser', email: 'employee@bahri.sa', initials: 'ON', role: 'employee', title: 'UX Designer', department: 'Product' },
  { id: 'u5', name: 'Rania Khoury', email: 'admin@bahri.sa', initials: 'RK', role: 'admin', title: 'System Administrator', department: 'IT' },
]

// In-memory store — mutations persist for the session (until page reload).
const todos: TodoDto[] = [
  { id: 't1', title: 'Leave Request', when: 'Tomorrow, 10:00 AM', status: 'Pending Approval' },
  { id: 't2', title: 'Digital card Request', when: 'Tomorrow, 10:00 AM', status: 'Completed' },
]

const orgMembers: OrgMemberDto[] = [
  { id: 'm1', name: 'Mohammed Al-Harbi', title: 'Chief Executive Officer', initials: 'MH', team: 'Leadership Team' },
  { id: 'm2', name: 'Ahmed Alsubaey', title: 'Chief Support Officer', initials: 'AA', team: 'Leadership Team' },
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
]
