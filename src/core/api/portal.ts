import { apiGet, apiPost, apiPatch } from '@core/api/client'
import type { TodoDto, OrgMemberDto, TodoStatus, EmployeeDto } from '@core/api/types'

/**
 * Portal data service. UI calls these functions and never touches fetch directly,
 * so the transport (mock vs. real backend/GCP) stays swappable in one place, and
 * both web and mobile share the exact same service surface.
 */
export const portalApi = {
  getTodos: (signal?: AbortSignal) => apiGet<TodoDto[]>('/todos', signal),
  addTodo: (input: { title: string }) => apiPost<TodoDto>('/todos', input),
  updateTodoStatus: (id: string, status: TodoStatus) =>
    apiPatch<TodoDto>(`/todos/${id}`, { status }),

  getOrgMembers: (signal?: AbortSignal) => apiGet<OrgMemberDto[]>('/org-members', signal),

  getEmployees: (signal?: AbortSignal) => apiGet<EmployeeDto[]>('/employees', signal),
}
