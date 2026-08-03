import { useState } from 'react'
import { Bot, Sparkles, X } from 'lucide-react'
import { useFeatureFlags } from '@/hooks/useAdminSettings'

/**
 * Floating "Bahar" AI assistant launcher, pinned to the bottom-right so it stays
 * clear of the collapsible sidebar. Bahar isn't wired up yet — clicking it opens
 * a small "coming soon" bubble rather than a chat.
 */
export function BaharButton() {
  const flags = useFeatureFlags()
  const [open, setOpen] = useState(false)

  if (!flags.bahar) return null

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {open && (
        <div className="animate-toast-in w-64 rounded-2xl border border-line bg-surface p-4 shadow-xl">
          <div className="flex items-start justify-between gap-2">
            <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-brand-teal to-brand-cyan text-white">
              <Sparkles className="size-[18px]" />
            </span>
            <button
              onClick={() => setOpen(false)}
              className="grid size-7 place-items-center rounded-full text-subtle transition hover:bg-surface-2 hover:text-content"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
          </div>
          <p className="mt-3 text-sm font-bold text-content">Bahar — your AI assistant</p>
          <p className="mt-1 text-xs text-subtle">
            Coming soon! Bahar will help you find services, people and answers across the portal.
          </p>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        title="Bahar — AI Assistant (coming soon)"
        aria-label="Bahar — AI Assistant"
        className="grid size-14 place-items-center rounded-full bg-gradient-to-br from-brand-teal to-brand-cyan text-white shadow-lg shadow-brand-cyan/30 transition hover:scale-105 active:scale-95"
      >
        <Bot className="size-6" />
      </button>
    </div>
  )
}
