import { motion, useReducedMotion } from 'framer-motion'
import { CloseIcon } from '../../icons/CloseIcon'

export function Chip({ label, onRemove, staggerIndex = 0 }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.li
      className="inline-flex items-center gap-2 py-[7px] pr-[6px] pl-[13px] text-ink bg-tomato-wash rounded-[20px] text-[.87rem] font-bold leading-none capitalize"
      initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.85, y: 8 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
          duration: prefersReducedMotion ? 0 : 0.25,
          delay: prefersReducedMotion ? 0 : staggerIndex * 0.06,
          ease: 'easeOut',
        },
      }}
    >
      <span>{label}</span>
      <button
        className="grid size-[26px] place-items-center p-0 text-ink bg-transparent border-0 rounded-full cursor-pointer transition-colors duration-150 hover:text-white hover:bg-tomato focus-visible:outline-3 focus-visible:outline-cobalt focus-visible:outline-offset-4"
        type="button"
        aria-label={`Remove ${label}`}
        onClick={onRemove}
      >
        <CloseIcon />
      </button>
    </motion.li>
  )
}
