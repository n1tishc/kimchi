import { MoonIcon } from '../../icons/MoonIcon'
import { SunIcon } from '../../icons/SunIcon'

export function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      className="patch justify-center"
      type="button"
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}
