import { createContext, createElement, useCallback, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'kimchi-theme'
const MEDIA_QUERY = '(prefers-color-scheme: dark)'

const ThemeContext = createContext(null)

function readStoredTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'light' || stored === 'dark' ? stored : 'system'
  } catch {
    return 'system'
  }
}

// Plain hooks/*.js files aren't run through the JSX loader, so this returns
// the provider via createElement rather than JSX.
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(readStoredTheme)
  const [systemPrefersDark, setSystemPrefersDark] = useState(
    () => window.matchMedia(MEDIA_QUERY).matches,
  )

  useEffect(() => {
    const media = window.matchMedia(MEDIA_QUERY)
    const onChange = (event) => setSystemPrefersDark(event.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  const isDark = theme === 'dark' || (theme === 'system' && systemPrefersDark)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const currentlyDark = current === 'dark' || (current === 'system' && systemPrefersDark)
      const next = currentlyDark ? 'light' : 'dark'
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // localStorage unavailable (private mode) — theme still applies for this session
      }
      return next
    })
  }, [systemPrefersDark])

  return createElement(ThemeContext.Provider, { value: { isDark, toggleTheme } }, children)
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within a ThemeProvider')
  return context
}
