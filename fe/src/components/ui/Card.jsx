export function Card({ as: Component = 'div', className = '', ...props }) {
  return <Component className={`bg-surface border border-line rounded-xl shadow-soft ${className}`.trim()} {...props} />
}
