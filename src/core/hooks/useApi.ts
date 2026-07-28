import { useCallback, useEffect, useState } from 'react'

type ApiState<T> = {
  data: T | undefined
  loading: boolean
  error: Error | undefined
}

type UseApiResult<T> = ApiState<T> & { refetch: () => void }

/**
 * Minimal typed data-fetching hook. Uses only React (shared by web + React
 * Native). Auto-retries transient failures once, and exposes refetch() for a
 * manual retry. Swap for TanStack Query when the app grows.
 */
export function useApi<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  options?: { retries?: number },
): UseApiResult<T> {
  // Default to a few retries with backoff so transient startup failures
  // (e.g. the mock service worker not yet active on first load) self-heal.
  const retries = options?.retries ?? 3
  const [state, setState] = useState<ApiState<T>>({
    data: undefined,
    loading: true,
    error: undefined,
  })
  const [nonce, setNonce] = useState(0)
  const refetch = useCallback(() => setNonce((n) => n + 1), [])

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false
    let attempt = 0

    const run = () => {
      setState((s) => ({ ...s, loading: true, error: undefined }))
      fetcher(controller.signal)
        .then((data) => {
          if (!cancelled) setState({ data, loading: false, error: undefined })
        })
        .catch((err: unknown) => {
          if (cancelled || controller.signal.aborted) return
          if (attempt < retries) {
            attempt += 1
            setTimeout(run, 400 * 2 ** (attempt - 1)) // exponential backoff: 400/800/1600ms
          } else {
            setState({ data: undefined, loading: false, error: err as Error })
          }
        })
    }

    run()
    return () => {
      cancelled = true
      controller.abort()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nonce])

  return { ...state, refetch }
}
