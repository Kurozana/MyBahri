/**
 * Client-side settings store (v1) for maintenance mode + feature flags.
 * Persisted to localStorage and broadcast via a window event so the whole app
 * reacts instantly. Later this moves to a server-enforced settings endpoint so
 * it applies to every user, not just the current browser.
 */

export type Maintenance = { enabled: boolean; message: string; until: string | null }
export type FeatureFlags = Record<string, boolean>

const MAINT_KEY = 'mybahri-maintenance'
const FLAGS_KEY = 'mybahri-flags'
export const SETTINGS_EVENT = 'mybahri-settings-changed'

const defaultMaintenance: Maintenance = {
  enabled: false,
  message: "We're doing some quick maintenance and will be back shortly.",
  until: null,
}

/** Toggleable features surfaced in the admin Settings page. */
export const FEATURE_FLAGS: { key: string; label: string; desc: string; defaultOn: boolean }[] = [
  { key: 'meetings', label: 'Upcoming Meetings widget', desc: 'Outlook calendar widget on the home page.', defaultOn: true },
  { key: 'seasonalThemes', label: 'Seasonal themes', desc: 'Occasion themes like National Day.', defaultOn: true },
  { key: 'bahar', label: 'Bahar AI assistant', desc: 'The Bahar assistant launcher.', defaultOn: true },
  { key: 'birthdays', label: 'Birthday wishes', desc: 'Social Insight birthday card.', defaultOn: true },
]

export function getMaintenance(): Maintenance {
  try {
    return { ...defaultMaintenance, ...JSON.parse(localStorage.getItem(MAINT_KEY) ?? '{}') }
  } catch {
    return defaultMaintenance
  }
}

export function setMaintenance(m: Maintenance) {
  localStorage.setItem(MAINT_KEY, JSON.stringify(m))
  window.dispatchEvent(new Event(SETTINGS_EVENT))
}

export function getFlags(): FeatureFlags {
  let stored: FeatureFlags = {}
  try {
    stored = JSON.parse(localStorage.getItem(FLAGS_KEY) ?? '{}')
  } catch {
    stored = {}
  }
  const out: FeatureFlags = {}
  for (const f of FEATURE_FLAGS) out[f.key] = stored[f.key] ?? f.defaultOn
  return out
}

export function setFlag(key: string, on: boolean) {
  const flags = getFlags()
  flags[key] = on
  localStorage.setItem(FLAGS_KEY, JSON.stringify(flags))
  window.dispatchEvent(new Event(SETTINGS_EVENT))
}
