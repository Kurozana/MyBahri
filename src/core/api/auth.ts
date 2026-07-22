import { apiGet, apiPost } from '@core/api/client'
import type { AuthResponse, UserDto } from '@core/api/types'

/**
 * Authentication service. Real SSO/OIDC (or Mendix/GCP-issued tokens) later
 * slots in behind this same surface — the UI keeps calling login()/me().
 */
export const authApi = {
  login: (email: string, password: string) =>
    apiPost<AuthResponse>('/auth/login', { email, password }),
  /** Resolve the current user from the stored token. */
  me: (signal?: AbortSignal) => apiGet<UserDto>('/auth/me', signal),
}
