import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { CheckCircle2, Info, X } from 'lucide-react'

type ToastTone = 'success' | 'info'
type Toast = { id: number; message: string; tone: ToastTone }

type ToastContextValue = (message: string, tone?: ToastTone) => void

const ToastContext = createContext<ToastContextValue | null>(null)

let nextId = 1

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const remove = useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id))
  }, [])

  const push = useCallback<ToastContextValue>(
    (message, tone = 'success') => {
      const id = nextId++
      setToasts((list) => [...list, { id, message, tone }])
      setTimeout(() => remove(id), 3200)
    },
    [remove],
  )

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="animate-toast-in pointer-events-auto flex items-center gap-2.5 rounded-xl border border-line bg-surface px-4 py-3 text-sm font-medium text-content shadow-lg"
          >
            {t.tone === 'success' ? (
              <CheckCircle2 className="size-5 text-emerald-500" />
            ) : (
              <Info className="size-5 text-primary-500" />
            )}
            {t.message}
            <button onClick={() => remove(t.id)} className="ml-1 text-subtle hover:text-content">
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
