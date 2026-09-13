import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'
import { INGREDIENT_TYPE_LABELS, ingredientType } from '../../lib/constants'

function RecipeSection({ title, children }) {
  return (
    <section className="pt-7">
      <h3 className="mt-0 mb-[13px] text-tomato text-[.75rem] font-bold">
        {title}
      </h3>
      {children}
    </section>
  )
}

export function RecipeDetail({ recipe }) {
  return (
    <Card as="article" className="p-[clamp(24px,5vw,48px)] max-[480px]:p-[22px]">
      <header className="pb-7 border-b border-line">
        <h2 className="max-w-[18ch] m-0 font-bold text-[clamp(2.5rem,5vw,4.25rem)] max-[480px]:text-[2.5rem] tracking-[-0.03em] leading-[.95] text-balance">
          {recipe.title}
        </h2>
        <p className="max-w-[65ch] mt-[18px] mb-0 text-ink-soft leading-[1.6]">{recipe.summary}</p>
        <div className="flex flex-wrap gap-[7px] mt-[19px]">
          <span className="px-2 py-[5px] text-ink-soft bg-sunken border border-line font-mono text-[.65rem] tracking-[.02em]">
            {recipe.servings} servings
          </span>
          <span className="px-2 py-[5px] text-ink-soft bg-sunken border border-line font-mono text-[.65rem] tracking-[.02em]">
            {recipe.total_time_minutes} min
          </span>
          <span className="px-2 py-[5px] text-ink-soft bg-sunken border border-line font-mono text-[.65rem] tracking-[.02em]">
            {recipe.difficulty}
          </span>
        </div>
      </header>

      {recipe.ingredients?.length > 0 && (
        <RecipeSection title="Ingredients">
          <ul className="m-0 p-0 list-none">
            {recipe.ingredients.map((ingredient, index) => {
              const type = ingredientType(ingredient.type)

              return (
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
              )
            })}
          </ul>
        </RecipeSection>
      )}

      {recipe.equipment?.length > 0 && (
        <RecipeSection title="Equipment">
          <ul className="flex flex-wrap gap-2 m-0 p-0 list-none">
            {recipe.equipment.map((item) => (
              <li className="px-[9px] py-[7px] border border-line text-ink-soft text-[.83rem] capitalize" key={item}>
                {item}
              </li>
            ))}
          </ul>
        </RecipeSection>
      )}

      {recipe.steps?.length > 0 && (
        <RecipeSection title="Steps">
          <ol className="recipe-steps grid gap-5 m-0 p-0 list-none">
            {recipe.steps.map((step, index) => (
              <li className="relative min-h-[30px] pl-[46px]" key={step.n || index}>
                <p className="m-0 leading-[1.6]">{step.instruction}</p>
                {step.tip && (
                  <span className="cooks-note block mt-[7px] px-2.5 py-2 text-leaf bg-leaf-wash text-[.83rem] leading-[1.45]">
                    {step.tip}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </RecipeSection>
      )}

      {recipe.chef_tips?.length > 0 && (
        <RecipeSection title="Chef tips">
          <ul className="compact-list grid gap-2 m-0 p-0 list-none">
            {recipe.chef_tips.map((tip) => (
              <li className="relative pl-[15px] text-ink-soft text-[.92rem] leading-[1.5]" key={tip}>
                {tip}
              </li>
            ))}
          </ul>
        </RecipeSection>
      )}

      {recipe.level_up && (
        <p className="mt-[30px] mb-0 px-[18px] py-4 text-gold-ink bg-gold-wash border-l-4 border-gold leading-[1.55]">
          <strong className="font-mono text-[.72rem] tracking-[.03em] uppercase">Level up:</strong> {recipe.level_up}
        </p>
      )}
    </Card>
  )
}
