import { apiGet, apiPost, apiPatch } from '@core/api/client'
import type {
  TodoDto,
  OrgMemberDto,
  TodoStatus,
  EmployeeDto,
  LeaveBalanceDto,
  AttendanceRecordDto,
  ReleaseNoteDto,
} from '@core/api/types'

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

  // Leave balance — mocked now; will be sourced from Oracle Fusion via GCP later.
  getLeaveBalance: (signal?: AbortSignal) => apiGet<LeaveBalanceDto>('/leave-balance', signal),

  // This week's punches. Portal is the source of truth; synced to Fusion payroll nightly.
  getAttendanceWeek: (signal?: AbortSignal) =>
    apiGet<AttendanceRecordDto[]>('/attendance/week', signal),

  getReleaseNotes: (signal?: AbortSignal) => apiGet<ReleaseNoteDto[]>('/release-notes', signal),
  publishReleaseNote: (note: ReleaseNoteDto) => apiPost<ReleaseNoteDto>('/release-notes', note),
}
