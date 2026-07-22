/**
 * Thin typed fetch wrapper — the single choke point for all data access.
 *
 * Backend-agnostic by design: the host app injects the base URL via
 * `configureApi()` at startup, so this file has NO build-tool coupling
 * (no import.meta.env) and works unchanged on web and React Native. Whether
 * the backend is Mendix, Node/Nest, or a GCP endpoint is invisible here.
 */

let baseUrl = '/api'
let authToken: string | null = null

export function configureApi(url: string) {
  baseUrl = url
}

/** Set/clear the bearer token sent with every request (null = signed out). */
export function setAuthToken(token: string | null) {
  authToken = token
}

function authHeaders(): Record<string, string> {
  return authToken ? { Authorization: `Bearer ${authToken}` } : {}
}

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
  const res = await fetch(`${baseUrl}${path}`, {
    headers: { Accept: 'application/json', ...authHeaders() },
    signal,
  })
  if (!res.ok) throw new ApiError(res.status, `GET ${path} failed with ${res.status}`)
  return (await res.json()) as T
}

async function send<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...authHeaders() },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  if (!res.ok) throw new ApiError(res.status, `${method} ${path} failed with ${res.status}`)
  return (await res.json()) as T
}

export const apiPost = <T>(path: string, body?: unknown) => send<T>('POST', path, body)
export const apiPatch = <T>(path: string, body?: unknown) => send<T>('PATCH', path, body)
