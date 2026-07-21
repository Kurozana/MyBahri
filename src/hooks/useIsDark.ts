import { useEffect, useState } from 'react'

/**
 * Reactively reports whether dark mode is active by observing the `.dark` class
 * on <html>. Decoupled from useTheme's state so any component (e.g. loaders that
 * pick a light/dark video) can read the current theme without owning it.
 */
export function useIsDark() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))

  useEffect(() => {
    const el = document.documentElement
    const observer = new MutationObserver(() => setDark(el.classList.contains('dark')))
    observer.observe(el, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return dark
}
