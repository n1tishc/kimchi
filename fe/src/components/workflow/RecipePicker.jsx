import { ClockIcon } from '../../icons/ClockIcon'

export function RecipePicker({ recipes, selectedIndex, onSelect }) {
  return (
    <div className="grid grid-cols-3 max-[760px]:grid-cols-1 gap-3" aria-label="Choose a recipe">
      {recipes.map((recipe, index) => {
        const selected = index === selectedIndex

        return (
          <button
            className={`grid min-h-[222px] max-[760px]:min-h-0 content-start gap-[11px] text-ink bg-surface cursor-pointer text-left transition-[background-color,transform,box-shadow] duration-[170ms] focus-visible:outline-3 focus-visible:outline-cobalt focus-visible:outline-offset-4 ${
              selected
                ? 'p-[17px] bg-tomato-wash border-2 border-tomato shadow-none'
                : 'p-[18px] border border-ink shadow-[2px_2px_0_rgba(37,34,30,.1)] hover:bg-cream hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0_rgba(37,34,30,.12)]'
            }`}
            key={recipe.title || index}
            type="button"
            aria-pressed={selected}
            onClick={() => onSelect(index)}
          >
            <span className="text-tomato font-mono text-[.67rem] tracking-[.06em]">#{index + 1}</span>
            <span className="font-serif text-[1.46rem] font-medium tracking-[-.04em] leading-[1.02]">
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
