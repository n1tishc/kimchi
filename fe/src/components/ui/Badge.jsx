const TYPE_STYLES = {
  detected: 'text-tomato bg-tomato-wash',
  pantry: 'text-leaf bg-leaf-wash',
  extra: 'text-gold-ink bg-gold-wash',
}

export function Badge({ type, className = '', children }) {
  return (
    <span
      className={`flex-none rounded-[20px] px-2 py-1 font-mono text-[.6rem] tracking-[.02em] uppercase ${TYPE_STYLES[type]} ${className}`.trim()}
    >
      {children}
    </span>
  )
}
