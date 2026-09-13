export function Header({ view, onGoHome, onPrimaryAction }) {
  return (
    <header className="flex items-center justify-between min-h-[76px] max-[760px]:min-h-[65px] border-b border-ink">
      <button
        className="inline-flex items-center gap-[9px] p-0 text-ink bg-transparent border-0 cursor-pointer text-[1.05rem] font-bold tracking-[-.04em] focus-visible:outline-3 focus-visible:outline-cobalt focus-visible:outline-offset-4"
        type="button"
        onClick={onGoHome}
        aria-label="Kimchi home"
      >
        <span
          className="grid size-[29px] place-items-center text-surface bg-tomato rounded-full font-serif text-[1.3rem] font-semibold"
          aria-hidden="true"
        >
          K
        </span>
        <span>Kimchi</span>
      </button>
      <div className="flex items-center gap-5 max-[760px]:gap-[13px]">
        {view === 'home' && (
          <a
            className="max-[480px]:hidden text-ink-soft text-[.82rem] font-semibold decoration-transparent transition-colors duration-150 hover:text-tomato hover:decoration-current focus-visible:outline-3 focus-visible:outline-cobalt focus-visible:outline-offset-4"
            href="#how-it-works"
          >
            How it works
          </a>
        )}
        <button
          className="min-h-[38px] max-[480px]:min-h-9 px-[13px] max-[480px]:px-2.5 text-ink bg-butter border border-ink shadow-[2px_2px_0_var(--color-ink)] cursor-pointer text-[.76rem] font-bold transition-[transform,box-shadow,background-color] duration-150 hover:bg-[#ffdb74] hover:translate-x-px hover:translate-y-px hover:shadow-[1px_1px_0_var(--color-ink)] focus-visible:outline-3 focus-visible:outline-cobalt focus-visible:outline-offset-4"
          type="button"
          onClick={onPrimaryAction}
        >
          {view === 'home' ? 'Start cooking' : 'New dish'}
        </button>
      </div>
    </header>
  )
}
