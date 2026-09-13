import { ArrowLeftIcon } from '../../icons/ArrowLeftIcon'
import { ChevronIcon } from '../../icons/ChevronIcon'
import { CUISINES } from '../../lib/constants'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Chip } from '../ui/Chip'
import { Spinner } from '../ui/Spinner'

export function IngredientEditor({
  items,
  draft,
  cuisine,
  recipeLoading,
  recipeError,
  onBack,
  onRemoveItem,
  onDraftChange,
  onAddItem,
  onCuisineChange,
  onGetRecipes,
}) {
  return (
    <Card as="section" className="grid gap-[21px] p-[clamp(22px,4vw,38px)] max-[480px]:p-[22px]" aria-label="Detected ingredients">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] max-[480px]:grid-cols-1 items-start gap-4 max-[480px]:gap-3">
        <button
          className="inline-flex min-h-[34px] items-center gap-[5px] p-0 text-ink-soft bg-transparent border-0 cursor-pointer font-mono text-[.68rem] tracking-[.02em] uppercase transition-colors duration-150 hover:text-tomato focus-visible:outline-3 focus-visible:outline-cobalt focus-visible:outline-offset-4"
          type="button"
          onClick={onBack}
        >
          <ArrowLeftIcon />
          Photo
        </button>
        <div className="min-w-0">
          <h2 className="m-0 font-serif text-[clamp(2.15rem,4vw,3rem)] font-medium tracking-[-.05em] leading-[.95]">
            {items.length} ingredient{items.length !== 1 ? 's' : ''} found
          </h2>
          <p className="max-w-[54ch] m-0 text-ink-soft text-[.94rem] leading-[1.55]">
            Keep the good stuff. Cross off the impostors.
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="m-0 text-ink-soft leading-[1.5]">No ingredients detected — try a clearer photo.</p>
      ) : (
        <ul className="flex flex-wrap gap-2 m-0 p-0 list-none">
          {items.map((ingredient) => (
            <Chip key={ingredient} label={ingredient} onRemove={() => onRemoveItem(ingredient)} />
          ))}
        </ul>
      )}

      <form className="grid grid-cols-[minmax(0,1fr)_auto] max-[480px]:grid-cols-1 gap-2.5" onSubmit={onAddItem}>
        <input
          className="min-h-12 w-full px-[13px] text-ink bg-surface border border-ink rounded-none text-[.92rem] placeholder:text-ink-faint focus:outline-3 focus:outline-cobalt focus:outline-offset-1"
          type="text"
          value={draft}
          aria-label="Add an ingredient"
          placeholder="Add an ingredient"
          onChange={(event) => onDraftChange(event.target.value)}
        />
        <Button type="submit" className="max-[480px]:w-full">
          Add
        </Button>
      </form>

      <div className="grid grid-cols-[minmax(180px,1fr)_auto] max-[480px]:grid-cols-1 gap-3.5 items-end mt-px pt-[21px] border-t border-line">
        <label className="grid gap-2 text-ink-soft font-mono text-[.67rem] tracking-[.07em] uppercase">
          Cuisine
          <div className="relative block">
            <select
              className="min-h-12 w-full pl-[13px] pr-[38px] text-ink bg-surface border border-ink rounded-none text-[.92rem] appearance-none cursor-pointer focus:outline-3 focus:outline-cobalt focus:outline-offset-1"
              value={cuisine}
              onChange={(event) => onCuisineChange(event.target.value)}
            >
              {CUISINES.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <ChevronIcon className="absolute top-1/2 right-3 -translate-y-1/2 text-ink-soft pointer-events-none" />
          </div>
        </label>

        <Button
          variant="primary"
          className="max-[480px]:w-full"
          onClick={onGetRecipes}
          disabled={items.length === 0 || recipeLoading}
        >
          {recipeLoading ? (
            <>
              <Spinner />
              Getting recipes...
            </>
          ) : (
            'Get recipes'
          )}
        </Button>
      </div>

      {recipeError && (
        <p className="m-0 px-3.5 py-3 text-danger bg-danger-wash border-l-4 border-danger text-[.9rem] leading-[1.5]">
          {recipeError}
        </p>
      )}
    </Card>
  )
}
