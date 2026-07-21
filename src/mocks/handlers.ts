import { http, HttpResponse, delay } from 'msw'
import type { TodoDto, OrgMemberDto, TodoStatus } from '@core/api/types'

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

export const handlers = [
  http.get('/api/todos', async () => {
    await delay(LATENCY)
    return HttpResponse.json(todos)
  }),

  http.post('/api/todos', async ({ request }) => {
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

  http.patch('/api/todos/:id', async ({ params, request }) => {
    await delay(200)
    const { status } = (await request.json()) as { status: TodoStatus }
    const todo = todos.find((t) => t.id === params.id)
    if (!todo) return new HttpResponse(null, { status: 404 })
    todo.status = status
    return HttpResponse.json(todo)
  }),

  http.get('/api/org-members', async () => {
    await delay(LATENCY)
    return HttpResponse.json(orgMembers)
  }),
]
