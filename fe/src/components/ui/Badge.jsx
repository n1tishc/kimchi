const TYPE_STYLES = {
  detected: 'text-tomato bg-tomato-wash',
  pantry: 'text-leaf bg-leaf-wash',
  extra: 'text-[#755409] bg-[#fbebad]',
}

export function Badge({ type, className = '', children }) {
  return (
    <span
      className={`flex-none px-1.5 py-1 font-mono text-[.6rem] tracking-[.02em] uppercase ${TYPE_STYLES[type]} ${className}`.trim()}
    >
      {children}
    </span>
  )
}
