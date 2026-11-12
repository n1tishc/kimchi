import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { ArrowRightIcon } from '../../icons/ArrowRightIcon'
import { ClockIcon } from '../../icons/ClockIcon'
import { DifficultyIcon } from '../../icons/DifficultyIcon'
import { ServingsIcon } from '../../icons/ServingsIcon'
import { INGREDIENT_TYPE_LABELS, ingredientType } from '../../lib/constants'
import { CookingMode } from './CookingMode'

const INGREDIENT_GROUPS = ['detected', 'pantry', 'extra']

const GROUP_HINT = {
  detected: 'Seen in your photo',
  pantry: 'Probably in the cupboard',
  extra: 'Not on the counter yet',
}

function Meta({ icon, children }) {
  return (
    <span className="inline-flex items-center gap-2 text-[1rem] font-bold">
      {icon}
      {children}
    </span>
  )
}

export function RecipeDetail({ recipe, active = true }) {
  const [completedSteps, setCompletedSteps] = useState(() => new Array(recipe.steps?.length ?? 0).fill(false))
  const [cookingModeOpen, setCookingModeOpen] = useState(false)
  const hasSteps = recipe.steps?.length > 0
  const cookingTriggerRef = useRef(null)

  function toggleStep(index) {
    setCompletedSteps((current) => current.map((done, i) => (i === index ? !done : done)))
  }

  // Captured here (not read back from document.activeElement inside CookingMode)
  // because applying `inert` to this button on open blurs it synchronously, before
  // CookingMode's own mount effect would ever get a chance to see it as focused.
  function openCookingMode(event) {
    cookingTriggerRef.current = event.currentTarget
    setCookingModeOpen(true)
  }

  // Restoring focus has to wait for this effect (post-commit), not happen inline in
  // the exit handler — `inert` is still applied to the trigger until React actually
  // re-renders, so an immediate .focus() call there would silently no-op.
  useEffect(() => {
    if (cookingModeOpen) return
    const trigger = cookingTriggerRef.current
    if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus()
    cookingTriggerRef.current = null
  }, [cookingModeOpen])

  // `active` mirrors WorkflowPage's `hidden` prop: App.jsx never unmounts WorkflowPage
  // when the user navigates home, only toggles `hidden` on it. Both portals below render
  // outside that hidden <main>, so without this they'd stay visible over the home page.
  useEffect(() => {
    if (!active) setCookingModeOpen(false)
  }, [active])

  const groups = INGREDIENT_GROUPS.map((type) => ({
    type,
    items: (recipe.ingredients ?? []).filter((ingredient) => ingredientType(ingredient.type) === type),
  })).filter((group) => group.items.length > 0)

  return (
    <article className="cloth recipe">
      <header className="patch pad-lg">
        <h2 className="display m-0 max-w-[17ch] text-[clamp(2.1rem,4.2vw,3.6rem)]">{recipe.title}</h2>
        <p className="lede mt-4 mb-0 max-w-[62ch] text-ink-soft">{recipe.summary}</p>
        <div className="flex flex-wrap items-center gap-x-7 gap-y-3 mt-7">
          <Meta icon={<ServingsIcon />}>{recipe.servings} servings</Meta>
          <Meta icon={<ClockIcon />}>{recipe.total_time_minutes} min</Meta>
          <Meta icon={<DifficultyIcon />}>{recipe.difficulty}</Meta>
          {hasSteps && (
            <Button variant="primary" className="max-md:hidden ml-auto" onClick={openCookingMode} inert={cookingModeOpen || undefined}>
              Cook step by step <ArrowRightIcon />
            </Button>
          )}
        </div>
      </header>

      {groups.length > 0 && (
        <section className="recipe-groups" aria-label="Ingredients">
          {groups.map(({ type, items }) => (
            <div className="patch pad" key={type}>
              <h3 className="m-0">
                <Badge type={type}>{INGREDIENT_TYPE_LABELS[type]}</Badge>
              </h3>
              <p className="m-0 mt-1 mb-4 text-ink-soft text-[.9rem]">{GROUP_HINT[type]}</p>
              <ul className="m-0 p-0 list-none">
                {items.map((ingredient, index) => (
                  <li
                    className="flex items-baseline justify-between gap-4 py-2.5 border-t-[1.5px] border-dashed border-ink/35"
                    key={`${ingredient.item}-${index}`}
                  >
                    <strong className="font-bold capitalize leading-[1.3]">{ingredient.item}</strong>
                    <span className="flex-none text-ink-soft text-[.92rem] text-right">{ingredient.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {hasSteps && (
        <section className="patch pad-lg recipe-steps-patch" aria-labelledby="steps-title">
          <h3 id="steps-title" className="display h-block m-0 mb-8">
            Method
          </h3>
          <ol className="grid gap-10 m-0 p-0 list-none">
            {recipe.steps.map((step, index) => {
              const stepNumber = step.n ?? index + 1
              const done = completedSteps[index]

              return (
                <li className="grid grid-cols-[clamp(44px,6vw,72px)_minmax(0,1fr)] gap-x-4" key={step.n ?? index}>
                  <span className="display step-num" aria-hidden="true">
                    {stepNumber}
                  </span>
                  <div className="grid gap-3.5">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="check"
                        checked={done}
                        onChange={() => toggleStep(index)}
                        aria-label={`Mark step ${stepNumber} as done`}
                      />
                      <p className={`m-0 max-w-[62ch] text-[1.08rem] leading-[1.6] ${done ? 'text-ink-soft line-through' : ''}`}>
                        {step.instruction}
                      </p>
                    </label>
                    {step.tip && <p className="note m-0 ml-[34px] max-[480px]:ml-0 max-[480px]:flex-col max-[480px]:gap-1">{step.tip}</p>}
                  </div>
                </li>
              )
            })}
          </ol>
        </section>
      )}

      <div className="recipe-side">
        {recipe.equipment?.length > 0 && (
          <section className="patch pad" aria-labelledby="equipment-title">
            <h3 id="equipment-title" className="display m-0 mb-4 text-[1.5rem]">
              Equipment
            </h3>
            <ul className="flex flex-wrap gap-2 m-0 p-0 list-none">
              {recipe.equipment.map((item) => (
                <li className="px-3 py-2 shadow-[inset_0_0_0_2px_var(--color-ink)] font-bold capitalize leading-none" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          </section>
        )}

        {recipe.chef_tips?.length > 0 && (
          <section className="patch pad" aria-labelledby="tips-title">
            <h3 id="tips-title" className="display m-0 mb-4 text-[1.5rem]">
              Chef tips
            </h3>
            <ul className="grid gap-3 m-0 p-0 list-none leading-[1.5]">
              {recipe.chef_tips.map((tip) => (
                <li className="pt-3 border-t-[1.5px] border-dashed border-ink/35" key={tip}>
                  {tip}
                </li>
              ))}
            </ul>
          </section>
        )}

        {recipe.level_up && (
          <section className="patch stitch pad" aria-labelledby="levelup-title">
            <h3 id="levelup-title" className="display m-0 mb-3 text-[1.5rem]">
              Level up
            </h3>
            <p className="m-0 font-medium leading-[1.5]">{recipe.level_up}</p>
          </section>
        )}
      </div>

      {hasSteps && (
        // Reserves the scroll space the fixed bar below occupies, so it never covers
        // the page's own trailing content ("Scan new ingredients" in WorkflowPage).
        <div className="md:hidden patch min-h-[84px]" aria-hidden="true" />
      )}

      {hasSteps &&
        active &&
        createPortal(
          // `inert` (not unmounting) while Cooking Mode is open: it sits fully behind that
          // full-screen overlay either way, but staying mounted keeps this exact DOM node
          // around for the focus-restore effect above to hand focus back to.
          <div
            className="md:hidden fixed inset-x-0 bottom-0 z-40 p-[3px] pb-[max(3px,env(safe-area-inset-bottom))] bg-seam"
            inert={cookingModeOpen || undefined}
          >
            <Button variant="primary" className="btn-lg w-full" onClick={openCookingMode}>
              Start cooking <ArrowRightIcon />
            </Button>
          </div>,
          document.body,
        )}

      {hasSteps && active && cookingModeOpen && (
        <CookingMode
          recipe={recipe}
          completedSteps={completedSteps}
          onToggleStep={toggleStep}
          onExit={() => setCookingModeOpen(false)}
        />
      )}
    </article>
  )
}
