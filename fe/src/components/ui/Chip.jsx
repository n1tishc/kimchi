import { motion, useReducedMotion } from 'framer-motion'
import { CloseIcon } from '../../icons/CloseIcon'
import { reducedTransition } from '../../lib/motion'

// One detected ingredient, as a scrap of dyed cloth.
// staggerIndex: position within the initially-detected batch, or null for a
// scrap added later (which should appear immediately, not queue behind a delay).
export function Chip({ label, number, onRemove, staggerIndex = null }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.li
      className="patch scrap"
      initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9, y: 10 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        transition: reducedTransition(prefersReducedMotion, {
          duration: 0.28,
          delay: staggerIndex == null ? 0 : staggerIndex * 0.07,
          ease: 'easeOut',
        }),
      }}
    >
      <span className="flex items-start justify-between gap-2">
        <span className="num text-hong" aria-hidden="true">
          {String(number).padStart(2, '0')}
        </span>
        <button className="scrap-x" type="button" aria-label={`Remove ${label}`} onClick={onRemove}>
          <CloseIcon />
        </button>
      </span>
      <span className="display scrap-name">{label}</span>
    </motion.li>
  )
}
