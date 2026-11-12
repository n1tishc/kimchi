import { useTheme } from '../../hooks/useTheme'
import { ThemeToggle } from '../ui/ThemeToggle'

export function Header({ view, onGoHome, onPrimaryAction }) {
  const { isDark, toggleTheme } = useTheme()

  return (
    <header className="cloth header-cloth">
      <button className="patch tone-hong gap-2.5 text-[1.25rem]" type="button" onClick={onGoHome} aria-label="Kimchi home">
        <span className="display text-[1.5rem] leading-none">Kimchi</span>
        <span className="font-hangul text-[1.1rem] font-normal" lang="ko" aria-hidden="true">
          김치
        </span>
      </button>
      <div className="patch header-fill text-ink-soft text-[.92rem]">
        <span>Cooks from what you&apos;ve got</span>
      </div>
      {view === 'home' && (
        <a className="patch header-link" href="#how-it-works">
          How it works
        </a>
      )}
      <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
      <button className="patch tone-ink" type="button" onClick={onPrimaryAction}>
        {view === 'home' ? 'Start cooking' : 'New dish'}
      </button>
    </header>
  )
}
