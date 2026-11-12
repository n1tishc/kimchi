import { INGREDIENT_TYPE_MARKS } from '../../lib/constants'

// The ingredient-type mark: a dyed square beside the type's name. Same dye
// everywhere a type appears.
export function Badge({ type, className = '', children }) {
  return (
    <span className={`inline-flex items-center gap-2.5 font-extrabold text-[1.05rem] ${className}`.trim()}>
      <span className="group-mark" style={{ '--mark': INGREDIENT_TYPE_MARKS[type] }} aria-hidden="true" />
      {children}
    </span>
  )
}
