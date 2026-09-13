const BASE =
  'inline-flex min-h-12 items-center justify-center gap-[9px] px-[17px] rounded-xl text-ink bg-surface ' +
  'border border-line cursor-pointer text-[.87rem] font-bold leading-none ' +
  'transition-colors duration-150 ease-in-out not-disabled:hover:bg-sunken ' +
  'disabled:cursor-not-allowed disabled:opacity-[.46] ' +
  'focus-visible:outline-3 focus-visible:outline-cobalt focus-visible:outline-offset-4'

const VARIANTS = {
  default: '',
  primary: 'text-white bg-tomato border-tomato not-disabled:hover:bg-tomato-dark',
  ghost:
    'text-ink-soft border-transparent bg-transparent justify-self-start ' +
    'not-disabled:hover:text-ink not-disabled:hover:bg-sunken',
}

export function Button({ as: Component = 'button', variant = 'default', className = '', ...props }) {
  const classes = `${BASE} ${VARIANTS[variant]} ${className}`.trim()

  if (Component === 'button') {
    return <button type="button" className={classes} {...props} />
  }

  return <Component className={classes} {...props} />
}
