import { motion, useReducedMotion } from 'framer-motion'
import { ClockIcon } from '../../icons/ClockIcon'
import { reducedTransition } from '../../lib/motion'

export function RecipePicker({ recipes, selectedIndex, onSelect }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className="cloth picker" role="group" aria-label="Choose a recipe">
      {recipes.map((recipe, index) => {
        const selected = index === selectedIndex

        return (
          <motion.button
            className={`patch pick pad ${selected ? 'tone-hong stitch' : ''}`}
            key={recipe.title || index}
            type="button"
            aria-pressed={selected}
            onClick={() => onSelect(index)}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: reducedTransition(prefersReducedMotion, { duration: 0.28, delay: index * 0.1, ease: 'easeOut' }),
            }}
          >
            <span className="display pick-rank" aria-hidden="true">
              {index + 1}
            </span>
            <span className="display text-[1.5rem] leading-[1]">{recipe.title}</span>
            <span className="soft line-clamp-3 text-[.92rem] leading-[1.48]">{recipe.summary}</span>
            <span className="inline-flex items-center gap-1.5 mt-auto pt-2 text-[.88rem] font-bold">
              <ClockIcon className="w-[15px] h-[15px]" />
              {recipe.total_time_minutes} min · {recipe.difficulty}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}
