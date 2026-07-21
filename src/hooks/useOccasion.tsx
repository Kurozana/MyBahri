import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  occasions,
  getOccasionById,
  getActiveOccasion,
  type Occasion,
  type OccasionColors,
} from '@core/theme/occasions'

const STORAGE_KEY = 'mybahri-occasion'

/** Web mapping: semantic occasion colors -> the CSS variables the theme uses. */
const CSS_VARS: Record<keyof OccasionColors, string> = {
  primary500: '--color-primary-500',
  primary600: '--color-primary-600',
  primary700: '--color-primary-700',
  primary800: '--color-primary-800',
  brandTeal: '--color-brand-teal',
  brandCyan: '--color-brand-cyan',
  brandMint: '--color-brand-mint',
  accentSoft: '--color-accent-soft',
}

/**
 * Apply an occasion by overriding a handful of CSS variables inline on <html>.
 * This sits ON TOP of the base theme (which defines the same vars in :root), so
 * clearing the overrides instantly restores the main theme. No rebuild, no
 * component re-render — the browser just recomputes the variable cascade.
 */
function applyOccasion(occasion: Occasion | null) {
  const root = document.documentElement
  if (!occasion) {
    Object.values(CSS_VARS).forEach((v) => root.style.removeProperty(v))
    return
  }
  ;(Object.keys(CSS_VARS) as (keyof OccasionColors)[]).forEach((key) => {
    root.style.setProperty(CSS_VARS[key], occasion.colors[key])
  })
}

type OccasionContextValue = {
  current: Occasion | null
  occasionId: string | null
  setOccasion: (id: string | null) => void
  occasions: Occasion[]
}

const OccasionContext = createContext<OccasionContextValue | null>(null)

function initialOccasionId(): string | null {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) return stored === 'default' ? null : stored
  // No manual choice → auto-activate by today's date (production behaviour).
  return getActiveOccasion(new Date())?.id ?? null
}

export function OccasionProvider({ children }: { children: ReactNode }) {
  const [occasionId, setId] = useState<string | null>(initialOccasionId)

  useEffect(() => {
    applyOccasion(getOccasionById(occasionId))
  }, [occasionId])

  const setOccasion = (id: string | null) => {
    setId(id)
    localStorage.setItem(STORAGE_KEY, id ?? 'default')
  }

  return (
    <OccasionContext.Provider
      value={{ current: getOccasionById(occasionId), occasionId, setOccasion, occasions }}
    >
      {children}
    </OccasionContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useOccasion() {
  const ctx = useContext(OccasionContext)
  if (!ctx) throw new Error('useOccasion must be used within OccasionProvider')
  return ctx
}
