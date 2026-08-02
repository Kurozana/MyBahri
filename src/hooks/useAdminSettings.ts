import { useEffect, useState } from 'react'
import {
  getMaintenance,
  getFlags,
  SETTINGS_EVENT,
  type Maintenance,
  type FeatureFlags,
} from '@/lib/adminSettings'

function useSettingsValue<T>(read: () => T): T {
  const [value, setValue] = useState<T>(read)
  useEffect(() => {
    const handler = () => setValue(read())
    window.addEventListener(SETTINGS_EVENT, handler)
    window.addEventListener('storage', handler) // cross-tab
    return () => {
      window.removeEventListener(SETTINGS_EVENT, handler)
      window.removeEventListener('storage', handler)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return value
}

export function useMaintenance(): Maintenance {
  return useSettingsValue(getMaintenance)
}

export function useFeatureFlags(): FeatureFlags {
  return useSettingsValue(getFlags)
}
