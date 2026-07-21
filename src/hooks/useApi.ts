import { useEffect, useState } from 'react'

type ApiState<T> = {
  data: T | undefined
  loading: boolean
  error: Error | undefined
}

/**
 * Minimal typed data-fetching hook: runs a fetcher, tracks loading/error, and
 * aborts on unmount. Good enough for the PoC; when the portal grows, swap this
 * for TanStack Query (caching, retries, background refetch) — the call sites
 * barely change because the service layer already isolates fetching.
 */
export function useApi<T>(fetcher: (signal: AbortSignal) => Promise<T>): ApiState<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: undefined,
    loading: true,
    error: undefined,
  })

  useEffect(() => {
    const controller = new AbortController()
    setState({ data: undefined, loading: true, error: undefined })

    fetcher(controller.signal)
      .then((data) => setState({ data, loading: false, error: undefined }))
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        setState({ data: undefined, loading: false, error: err as Error })
      })

    return () => controller.abort()
    // fetcher is expected to be a stable reference (e.g. portalApi.getTodos)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return state
}
