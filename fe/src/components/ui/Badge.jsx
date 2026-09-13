const TYPE_STYLES = {
  detected: 'text-tomato bg-tomato-wash border-l-tomato',
  pantry: 'text-leaf bg-leaf-wash border-l-leaf',
  extra: 'text-gold-ink bg-gold-wash border-l-gold',
}

export function Badge({ type, className = '', children }) {
  return (
    <span
      className={`flex-none rounded-r-[20px] border-l-[3px] px-2.5 py-1 text-[.76rem] font-bold ${TYPE_STYLES[type]} ${className}`.trim()}
    >
      {children}
    </span>
  )
}
