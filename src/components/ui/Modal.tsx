import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'

type ModalProps = {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-center p-4 pt-[10vh]">
      <div className="fixed inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} />
      <div className="animate-toast-in relative h-fit w-full max-w-lg rounded-2xl border border-line bg-surface shadow-2xl">
        {title && (
          <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
            <h2 className="text-base font-bold text-content">{title}</h2>
            <button
              onClick={onClose}
              className="grid size-8 place-items-center rounded-full text-subtle transition hover:bg-surface-2 hover:text-content"
            >
              <X className="size-4" />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
