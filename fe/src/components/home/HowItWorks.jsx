import { ArrowRightIcon } from '../../icons/ArrowRightIcon'
import { STEPS } from '../../lib/constants'
import { DEMO_IMAGE, DEMO_ITEMS, DEMO_RECIPES } from '../../lib/demo'

const [SHOW, ROLL_CALL, MAGIC] = STEPS

function ActHeading({ step }) {
  return (
    <span className="flex items-end justify-between gap-4">
      <span>
        <strong className="display block text-[clamp(1.8rem,2.8vw,2.4rem)]">{step.label}</strong>
        <span className="block max-w-[30ch] mt-2.5 text-[1rem] leading-[1.45]">{step.description}</span>
      </span>
      <span className="flex-none" aria-hidden="true">
        <ArrowRightIcon />
      </span>
    </span>
  )
}

export function HowItWorks({ onSelectPhase }) {
  return (
    <section id="how-it-works" aria-labelledby="how-title">
      <div className="cloth">
        <div className="patch pad-lg">
          <h2 id="how-title" className="display h-section m-0 max-w-[13ch]">
            No recipe rabbit hole. Just this.
          </h2>
        </div>
      </div>

      <div className="cloth acts">
        <button className="patch tone-slate act pad stitch" type="button" onClick={onSelectPhase}>
          <img className="act-photo" src={DEMO_IMAGE} alt="" width="1024" height="1024" loading="lazy" />
          <span className="mini-chip justify-self-start">Photograph the counter</span>
          <span className="p-4 -m-1 bg-ink-fixed text-paper-fixed">
            <ActHeading step={SHOW} />
          </span>
        </button>

        <button className="patch act pad stitch" type="button" onClick={onSelectPhase}>
          <span className="flex flex-wrap gap-2" aria-hidden="true">
            {DEMO_ITEMS.map((item) => (
              <span className="mini-chip capitalize shadow-[inset_0_0_0_2px_var(--color-ink-fixed)]" key={item}>
                {item}
              </span>
            ))}
            <span className="mini-chip line-through opacity-60 shadow-[inset_0_0_0_2px_var(--color-ink-fixed)]">Bay leaf</span>
            <span className="mini-chip bg-hong text-paper-fixed">+ Add</span>
          </span>
          <ActHeading step={ROLL_CALL} />
        </button>

        <button className="patch act pad stitch" type="button" onClick={onSelectPhase}>
          <span className="grid gap-2.5" aria-hidden="true">
            {DEMO_RECIPES.map((recipe, index) => (
              <span className="flex items-baseline gap-2.5 font-bold leading-[1.2]" key={recipe.title}>
                <span className="display text-[1.5rem] text-hong">{index + 1}</span>
                <span className="line-clamp-2">{recipe.title}</span>
              </span>
            ))}
          </span>
          <ActHeading step={MAGIC} />
        </button>
      </div>
    </section>
  )
}
