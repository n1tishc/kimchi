const VARIANTS = {
  default: 'btn-quiet',
  primary: 'btn-hong',
  ink: '',
  paper: 'btn-paper',
  ghost: 'btn-quiet justify-self-start',
}

export function Button({ as: Component = 'button', variant = 'default', className = '', ...props }) {
  const classes = `btn ${VARIANTS[variant]} ${className}`.trim()

  if (Component === 'button') {
    return <button type="button" className={classes} {...props} />
  }

  return <Component className={classes} {...props} />
}
