const TONE_STYLES = {
  leaf: 'text-leaf bg-leaf-wash border-leaf',
  neutral: 'text-ink-soft bg-sunken border-line',
  gold: 'text-gold-ink bg-gold-wash border-gold',
}

export function Callout({ tone = 'neutral', icon, className = '', children }) {
  return (
    <div
      className={`flex items-start gap-3 px-[18px] py-4 rounded-r-lg border-l-4 leading-[1.55] ${TONE_STYLES[tone]} ${className}`.trim()}
    >
      {icon && <span className="flex-none mt-0.5">{icon}</span>}
      <div className="min-w-0">{children}</div>
    </div>
  )
}
