import { useRef } from 'react'
import { ArrowRightIcon } from '../../icons/ArrowRightIcon'
import { CUISINES } from '../../lib/constants'
import { BackLink } from '../ui/BackLink'
import { Button } from '../ui/Button'
import { Chip } from '../ui/Chip'
import { ErrorNote } from '../ui/ErrorNote'
import { Spinner } from '../ui/Spinner'

export function IngredientEditor({
  items,
  draft,
  cuisine,
  recipeLoading,
  recipeError,
  scanNote,
  onBack,
  onRemoveItem,
  onDraftChange,
  onAddItem,
  onCuisineChange,
  onGetRecipes,
}) {
  // Only the initially-detected batch staggers in; ingredients added later via
  // the form should appear immediately rather than queueing behind a delay.
  const detectedCount = useRef(items.length).current

  return (
    <section aria-label="Detected ingredients">
      <div className="cloth">
        <div className="patch pad grid gap-3">
          <BackLink onClick={onBack}>Photo</BackLink>
          <h2 className="display h-block m-0">
            {items.length} ingredient{items.length !== 1 ? 's' : ''} found
          </h2>
          <p className="max-w-[54ch] m-0 text-ink-soft leading-[1.55]">Keep the good stuff. Cross off the impostors.</p>
          {scanNote && <p className="m-0 font-bold leading-[1.5]">{scanNote}</p>}
        </div>

        {items.length === 0 ? (
          <p className="patch pad m-0 leading-[1.5]">No ingredients detected. Try a clearer photo, or add them by hand below.</p>
        ) : (
          <div className="patch p-[3px]">
            <ul className="scraps">
              {items.map((ingredient, index) => (
                <Chip
                  key={ingredient}
                  label={ingredient}
                  number={index + 1}
                  staggerIndex={index < detectedCount ? index : null}
                  onRemove={() => onRemoveItem(ingredient)}
                />
              ))}
            </ul>
          </div>
        )}

        <form className="patch pad grid grid-cols-[minmax(0,1fr)_auto] max-[480px]:grid-cols-1 gap-3" onSubmit={onAddItem}>
          <input
            className="field"
            type="text"
            value={draft}
            aria-label="Add an ingredient"
            placeholder="Something it missed? Add it"
            onChange={(event) => onDraftChange(event.target.value)}
          />
          <Button type="submit" className="max-[480px]:w-full">
            Add
          </Button>
        </form>
      </div>

      <div className="cloth grid-cols-[minmax(0,1fr)_minmax(240px,340px)] max-[760px]:grid-cols-1">
        <div className="patch pad">
          <fieldset className="cuisines">
            <legend className="display mb-4 p-0 text-[1.5rem]">Pick a culinary mood</legend>
            {CUISINES.map(([value, label]) => (
              <label className="cuisine" key={value}>
                <input
                  type="radio"
                  name="cuisine"
                  value={value}
                  checked={cuisine === value}
                  onChange={() => onCuisineChange(value)}
                />
                {label}
              </label>
            ))}
          </fieldset>
        </div>

        <div className="patch pad grid content-end gap-3">
          <Button
            variant="primary"
            className="btn-lg w-full"
            onClick={onGetRecipes}
            disabled={items.length === 0 || recipeLoading}
            aria-busy={recipeLoading || undefined}
          >
            {recipeLoading ? (
              <>
                <Spinner />
                Getting recipes...
              </>
            ) : (
              <>
                Get recipes <ArrowRightIcon />
              </>
            )}
          </Button>
        </div>

        {recipeError && (
          <div className="col-span-full">
            <ErrorNote>{recipeError}</ErrorNote>
          </div>
        )}
      </div>
    </section>
  )
}
