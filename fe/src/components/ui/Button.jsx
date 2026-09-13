const BASE =
  'inline-flex min-h-12 items-center justify-center gap-[9px] px-[17px] text-ink bg-surface ' +
  'border border-ink shadow-[2px_2px_0_var(--color-ink)] cursor-pointer text-[.87rem] font-bold ' +
  'leading-none transition-[color,background-color,transform,box-shadow] duration-150 ease-in-out ' +
  'not-disabled:hover:text-white not-disabled:hover:bg-ink not-disabled:hover:translate-x-px ' +
  'not-disabled:hover:translate-y-px not-disabled:hover:shadow-[1px_1px_0_var(--color-ink)] ' +
  'not-disabled:active:translate-x-0.5 not-disabled:active:translate-y-0.5 ' +
  'not-disabled:active:shadow-[0_0_0_var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-[.46] ' +
  'focus-visible:outline-3 focus-visible:outline-cobalt focus-visible:outline-offset-4'

const VARIANTS = {
  default: '',
  primary:
    'text-white bg-tomato border-tomato-dark shadow-[3px_3px_0_var(--color-tomato-dark)] ' +
    'not-disabled:hover:bg-tomato-dark not-disabled:hover:shadow-[1px_1px_0_var(--color-tomato-dark)]',
  ghost:
    'text-ink-soft border-line shadow-none justify-self-start not-disabled:hover:text-white ' +
    'not-disabled:hover:bg-ink not-disabled:hover:border-ink',
}

export function Button({ as: Component = 'button', variant = 'default', className = '', ...props }) {
  const classes = `${BASE} ${VARIANTS[variant]} ${className}`.trim()

  if (Component === 'button') {
    return <button type="button" className={classes} {...props} />
  }

  return <Component className={classes} {...props} />
}
