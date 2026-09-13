import { ClockIcon } from '../../icons/ClockIcon'

export function RecipePicker({ recipes, selectedIndex, onSelect }) {
  return (
    <div className="grid grid-cols-3 max-[760px]:grid-cols-1 gap-6" aria-label="Choose a recipe">
      {recipes.map((recipe, index) => {
        const selected = index === selectedIndex

        return (
          <button
            className={`grid min-h-[222px] max-[760px]:min-h-0 content-start gap-[11px] rounded-xl text-ink bg-surface cursor-pointer text-left transition-[background-color,transform,box-shadow] duration-[170ms] focus-visible:outline-3 focus-visible:outline-cobalt focus-visible:outline-offset-4 ${
              selected
                ? 'p-[17px] bg-tomato-wash border-2 border-tomato shadow-none'
                : 'p-[18px] border border-line shadow-soft hover:bg-sunken hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(0,0,0,.1)]'
            }`}
            key={recipe.title || index}
            type="button"
            aria-pressed={selected}
            onClick={() => onSelect(index)}
          >
            <span className="text-tomato font-mono text-[.67rem] tracking-[.06em]">#{index + 1}</span>
            <span className="font-bold text-[1.46rem] tracking-[-0.03em] leading-[1.02]">
              {recipe.title}
            </span>
            <span className="line-clamp-3 text-ink-soft text-[.82rem] leading-[1.48]">{recipe.summary}</span>
            <span className="inline-flex items-center gap-[5px] mt-auto text-ink-faint font-mono text-[.67rem]">
              <ClockIcon className="w-[13px] h-[13px]" />
              {recipe.total_time_minutes} min · {recipe.difficulty}
            </span>
          </button>
        )
      })}
    </div>
  )
}
