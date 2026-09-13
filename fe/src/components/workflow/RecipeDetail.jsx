import { useState } from 'react'
import { Badge } from '../ui/Badge'
import { Callout } from '../ui/Callout'
import { Card } from '../ui/Card'
import { ClockIcon } from '../../icons/ClockIcon'
import { DifficultyIcon } from '../../icons/DifficultyIcon'
import { NoteIcon } from '../../icons/NoteIcon'
import { ServingsIcon } from '../../icons/ServingsIcon'
import { SparkIcon } from '../../icons/SparkIcon'
import { INGREDIENT_TYPE_LABELS, ingredientType } from '../../lib/constants'

const INGREDIENT_GROUPS = ['detected', 'pantry', 'extra']

function RecipeSection({ title, children }) {
  return (
    <section className="pt-8">
      <h3 className="mt-0 mb-[13px] text-tomato text-[.75rem] font-bold">{title}</h3>
      {children}
    </section>
  )
}

function MetaPill({ icon, children }) {
  return (
    <span className="inline-flex items-center gap-[6px] px-2 py-[5px] text-ink-soft bg-sunken border border-line text-[.72rem] font-medium">
      {icon}
      {children}
    </span>
  )
}

export function RecipeDetail({ recipe }) {
  const [completedSteps, setCompletedSteps] = useState(() => new Array(recipe.steps?.length ?? 0).fill(false))

  function toggleStep(index) {
    setCompletedSteps((current) => current.map((done, i) => (i === index ? !done : done)))
  }

  return (
    <Card as="article" className="p-[clamp(24px,5vw,48px)] max-[480px]:p-[22px]">
      <header className="pb-7 border-b border-line">
        <h2 className="max-w-[18ch] m-0 font-bold text-[clamp(2.5rem,5vw,4.25rem)] max-[480px]:text-[2.5rem] tracking-tight leading-[.95] text-balance">
          {recipe.title}
        </h2>
        <p className="max-w-[65ch] mt-[18px] mb-0 text-ink-soft leading-[1.6]">{recipe.summary}</p>
        <div className="flex flex-wrap gap-[7px] mt-[19px]">
          <MetaPill icon={<ServingsIcon />}>{recipe.servings} servings</MetaPill>
          <MetaPill icon={<ClockIcon />}>{recipe.total_time_minutes} min</MetaPill>
          <MetaPill icon={<DifficultyIcon />}>{recipe.difficulty}</MetaPill>
        </div>
      </header>

      {recipe.ingredients?.length > 0 && (
        <RecipeSection title="Ingredients">
          {INGREDIENT_GROUPS.map((type) => {
            const groupItems = recipe.ingredients.filter((ingredient) => ingredientType(ingredient.type) === type)
            if (groupItems.length === 0) return null

            return (
              <div className="mt-5 first:mt-0" key={type}>
                <h4 className="m-0 mb-1.5 text-ink-soft text-[.72rem] font-bold">{INGREDIENT_TYPE_LABELS[type]}</h4>
                <ul className="m-0 p-0 list-none">
                  {groupItems.map((ingredient, index) => (
                    <li
                      className="flex items-center max-[480px]:items-start justify-between gap-4 py-3 border-b border-line"
                      key={`${ingredient.item}-${index}`}
                    >
                      <span className="grid min-w-0 gap-0.5">
                        <strong className="text-[.95rem] font-bold capitalize">{ingredient.item}</strong>
                        <small className="text-ink-soft text-[.82rem]">{ingredient.quantity}</small>
                      </span>
                      <Badge type={type} className="max-[480px]:mt-0.5">
                        {INGREDIENT_TYPE_LABELS[type]}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </RecipeSection>
      )}

      {recipe.equipment?.length > 0 && (
        <RecipeSection title="Equipment">
          <ul className="flex flex-wrap gap-2 m-0 p-0 list-none">
            {recipe.equipment.map((item) => (
              <li
                className="px-[11px] py-[7px] rounded-[20px] border border-line text-ink-soft text-[.83rem] capitalize"
                key={item}
              >
                {item}
              </li>
            ))}
          </ul>
        </RecipeSection>
      )}

      {recipe.steps?.length > 0 && (
        <RecipeSection title="Steps">
          <ol className="relative grid gap-8 m-0 p-0 list-none">
            <span aria-hidden="true" className="absolute left-5 top-2 bottom-2 w-px bg-line" />
            {recipe.steps.map((step, index) => {
              const stepNumber = step.n ?? index + 1
              const done = completedSteps[index]

              return (
                <li className="relative pl-14" key={step.n ?? index}>
                  <span
                    className="absolute left-0 top-0 w-10 bg-surface text-center font-mono text-[1.5rem] font-bold text-tomato leading-none"
                    aria-hidden="true"
                  >
                    {stepNumber}
                  </span>
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      className="mt-[5px] size-4 flex-none accent-tomato cursor-pointer"
                      checked={done}
                      onChange={() => toggleStep(index)}
                      aria-label={`Mark step ${stepNumber} as done`}
                    />
                    <p className={`m-0 leading-[1.6] ${done ? 'text-ink-faint line-through' : ''}`}>
                      {step.instruction}
                    </p>
                  </label>
                  {step.tip && (
                    <Callout tone="leaf" icon={<NoteIcon />} className="mt-3 ml-[26px]">
                      {step.tip}
                    </Callout>
                  )}
                </li>
              )
            })}
          </ol>
        </RecipeSection>
      )}

      {recipe.chef_tips?.length > 0 && (
        <RecipeSection title="Chef tips">
          <Callout tone="neutral" icon={<NoteIcon />}>
            <ul className="grid gap-2 m-0 pl-4 list-disc marker:text-ink-faint text-ink-soft text-[.92rem] leading-[1.5]">
              {recipe.chef_tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </Callout>
        </RecipeSection>
      )}

      {recipe.level_up && (
        <RecipeSection title="Level up">
          <Callout tone="gold" icon={<SparkIcon className="size-[15px] stroke-current stroke-[2.5] [stroke-linecap:round]" />}>
            {recipe.level_up}
          </Callout>
        </RecipeSection>
      )}
    </Card>
  )
}
