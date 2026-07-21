/**
 * Thin typed fetch wrapper. All data access goes through this.
 *
 * During development requests are answered by MSW mocks (see src/mocks).
 * To point at a real Mendix backend later, set VITE_API_BASE_URL (e.g. "/api"
 * proxied in vite.config.ts) — no service or component code needs to change.
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { Accept: 'application/json' },
    signal,
  })
  if (!res.ok) throw new ApiError(res.status, `GET ${path} failed with ${res.status}`)
  return (await res.json()) as T
}

async function send<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  if (!res.ok) throw new ApiError(res.status, `${method} ${path} failed with ${res.status}`)
  return (await res.json()) as T
}

export const apiPost = <T>(path: string, body?: unknown) => send<T>('POST', path, body)
export const apiPatch = <T>(path: string, body?: unknown) => send<T>('PATCH', path, body)
