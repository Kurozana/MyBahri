/**
 * Occasion theming — seasonal "skins" (National Day, Founding Day, Coffee Day…)
 * that layer OVER the base theme without replacing it.
 *
 * Portable & platform-agnostic: an occasion is just a set of semantic color
 * overrides + an optional auto-activation date window. The web app maps these to
 * CSS variables; React Native would map them to its own styling. Because it's
 * only a handful of values swapped at runtime, switching has ~zero perf cost —
 * no rebuild, no component re-render.
 */

/** Semantic colors an occasion may override. Base theme provides the fallbacks. */
export interface OccasionColors {
  primary500: string
  primary600: string
  primary700: string
  primary800: string
  brandTeal: string
  brandCyan: string
  brandMint: string
  accentSoft: string
}

export interface Occasion {
  id: string
  name: string
  /** emoji shown in the switcher and (optionally) as a decorative accent */
  icon: string
  colors: OccasionColors
  /** inclusive auto-activation window as 'MM-DD' strings (same calendar year) */
  window?: { from: string; to: string }
}

export const occasions: Occasion[] = [
  {
    id: 'national-day',
    name: 'Saudi National Day',
    icon: '🇸🇦',
    window: { from: '09-20', to: '09-25' },
    colors: {
      primary500: '#1f9d57',
      primary600: '#0b7a3b',
      primary700: '#0a6531',
      primary800: '#08512a',
      brandTeal: '#34d17e',
      brandCyan: '#10b769',
      brandMint: '#7fd6a6',
      accentSoft: '#e6f6ec',
    },
  },
  {
    id: 'founding-day',
    name: 'Founding Day',
    icon: '🏛️',
    window: { from: '02-20', to: '02-24' },
    colors: {
      primary500: '#c08a3e',
      primary600: '#a56a25',
      primary700: '#85541d',
      primary800: '#6b4417',
      brandTeal: '#e6c15a',
      brandCyan: '#d19a3c',
      brandMint: '#d8c48f',
      accentSoft: '#f7efdd',
    },
  },
  {
    id: 'coffee-day',
    name: 'International Coffee Day',
    icon: '☕',
    window: { from: '10-01', to: '10-03' },
    colors: {
      primary500: '#a9755a',
      primary600: '#7c4f36',
      primary700: '#63402c',
      primary800: '#4f3323',
      brandTeal: '#d0a17f',
      brandCyan: '#a9755a',
      brandMint: '#cbb29f',
      accentSoft: '#f1e7df',
    },
  },
]

export function getOccasionById(id: string | null | undefined): Occasion | null {
  if (!id) return null
  return occasions.find((o) => o.id === id) ?? null
}

/** The occasion whose auto-activation window contains `date`, if any. */
export function getActiveOccasion(date: Date): Occasion | null {
  const mmdd = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  return (
    occasions.find((o) => o.window && mmdd >= o.window.from && mmdd <= o.window.to) ?? null
  )
}
