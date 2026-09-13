export function Card({ as: Component = 'div', className = '', ...props }) {
  return <Component className={`bg-surface border border-ink shadow-hard ${className}`.trim()} {...props} />
}
