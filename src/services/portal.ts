import { apiGet } from '@/lib/apiClient'
import type { TodoDto, OrgMemberDto } from '@/services/types'

/**
 * Portal data service. Components call these functions and never touch fetch
 * directly, so the transport (mock vs. real Mendix) stays swappable in one place.
 */
export const portalApi = {
  getTodos: (signal?: AbortSignal) => apiGet<TodoDto[]>('/todos', signal),
  getOrgMembers: (signal?: AbortSignal) => apiGet<OrgMemberDto[]>('/org-members', signal),
}
