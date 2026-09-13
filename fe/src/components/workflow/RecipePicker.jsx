import { motion, useReducedMotion } from 'framer-motion'
import { ClockIcon } from '../../icons/ClockIcon'
import { reducedTransition } from '../../lib/motion'

export function RecipePicker({ recipes, selectedIndex, onSelect }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className="grid grid-cols-3 max-[760px]:grid-cols-1 gap-6" aria-label="Choose a recipe">
      {recipes.map((recipe, index) => {
        const selected = index === selectedIndex

        return (
          <motion.button
            className={`grid min-h-[222px] max-[760px]:min-h-0 content-start gap-[11px] rounded-xl text-ink bg-surface cursor-pointer text-left transition-colors duration-[170ms] focus-visible:outline-3 focus-visible:outline-cobalt focus-visible:outline-offset-4 ${
              selected
                ? 'p-[17px] bg-tomato-wash border-2 border-tomato shadow-none'
                : 'p-[18px] border border-line shadow-soft hover:bg-sunken'
            }`}
            key={recipe.title || index}
            type="button"
            aria-pressed={selected}
            onClick={() => onSelect(index)}
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.94 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: reducedTransition(prefersReducedMotion, { duration: 0.25, delay: index * 0.1, ease: 'easeOut' }),
            }}
            whileHover={
              !selected
                ? {
                    y: -2,
                    boxShadow: '0 6px 16px rgba(0,0,0,.1)',
                    transition: reducedTransition(prefersReducedMotion, { duration: 0.17 }),
                  }
                : undefined
            }
          >
            <span className="text-tomato font-mono text-[.67rem] tracking-[.06em]">#{index + 1}</span>
            <span className="font-bold text-[1.46rem] tracking-tight leading-[1.02]">
              {recipe.title}
            </span>
            <span className="line-clamp-3 text-ink-soft text-[.82rem] leading-[1.48]">{recipe.summary}</span>
            <span className="inline-flex items-center gap-[5px] mt-auto text-ink-soft text-[.72rem] font-medium">
              <ClockIcon className="w-[13px] h-[13px]" />
              {recipe.total_time_minutes} min · {recipe.difficulty}
            </span>
          </motion.button>
        )
      })}
    </div>
  )
}
