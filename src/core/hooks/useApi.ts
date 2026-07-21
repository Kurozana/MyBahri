import { useEffect, useState } from 'react'

type ApiState<T> = {
  data: T | undefined
  loading: boolean
  error: Error | undefined
}

/**
 * Minimal typed data-fetching hook. Uses only React (shared by web + React Native),
 * so it lives in the portable core. When the app grows, swap for TanStack Query —
 * call sites barely change because the service layer isolates fetching.
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return state
}
