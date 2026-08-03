import { apiGet, apiPost, apiPatch } from '@core/api/client'
import type {
  AdminUserDto,
  AuditEntryDto,
  AnalyticsDto,
  NotificationDto,
  IntegrationDto,
  IntegrationLogDto,
  Role,
} from '@core/api/types'

/** Admin console data. Mock-backed for v1; wires to the real backend later. */
export const adminApi = {
  getUsers: (signal?: AbortSignal) => apiGet<AdminUserDto[]>('/admin/users', signal),
  updateUser: (id: string, patch: { role?: Role; status?: 'active' | 'disabled' }) =>
    apiPatch<AdminUserDto>(`/admin/users/${id}`, patch),

  getAudit: (signal?: AbortSignal) => apiGet<AuditEntryDto[]>('/admin/audit', signal),
  getAnalytics: (signal?: AbortSignal) => apiGet<AnalyticsDto>('/admin/analytics', signal),

  getNotifications: (signal?: AbortSignal) => apiGet<NotificationDto[]>('/admin/notifications', signal),
  sendNotification: (input: { title: string; body: string; audience: string }) =>
    apiPost<NotificationDto>('/admin/notifications', input),
  setNotificationActive: (id: string, active: boolean) =>
    apiPatch<NotificationDto>(`/admin/notifications/${id}`, { active }),

  // API / Integration Suite
  getIntegrations: (signal?: AbortSignal) =>
    apiGet<IntegrationDto[]>('/admin/integrations', signal),
  setIntegrationEnabled: (id: string, enabled: boolean) =>
    apiPatch<IntegrationDto>(`/admin/integrations/${id}`, { enabled }),
  getIntegrationLogs: (signal?: AbortSignal) =>
    apiGet<IntegrationLogDto[]>('/admin/integration-logs', signal),
}
