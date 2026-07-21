import { apiGet, apiPost, apiPatch } from '@/lib/apiClient'
import type { TodoDto, OrgMemberDto, TodoStatus } from '@/services/types'

/**
 * Portal data service. Components call these functions and never touch fetch
 * directly, so the transport (mock vs. real Mendix) stays swappable in one place.
 */
export const portalApi = {
  getTodos: (signal?: AbortSignal) => apiGet<TodoDto[]>('/todos', signal),
  addTodo: (input: { title: string }) => apiPost<TodoDto>('/todos', input),
  updateTodoStatus: (id: string, status: TodoStatus) =>
    apiPatch<TodoDto>(`/todos/${id}`, { status }),

  getOrgMembers: (signal?: AbortSignal) => apiGet<OrgMemberDto[]>('/org-members', signal),
}
