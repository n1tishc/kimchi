import { MoonIcon } from '../../icons/MoonIcon'
import { SunIcon } from '../../icons/SunIcon'

export function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      className="grid size-9 max-[480px]:size-8 flex-none place-items-center p-0 text-ink-soft bg-transparent border border-line rounded-full cursor-pointer transition-colors duration-150 hover:text-tomato hover:border-tomato focus-visible:outline-3 focus-visible:outline-cobalt focus-visible:outline-offset-4"
      type="button"
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}
