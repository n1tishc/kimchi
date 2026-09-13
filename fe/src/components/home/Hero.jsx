import { ArrowRightIcon } from '../../icons/ArrowRightIcon'
import { DEMO_ITEMS } from '../../lib/demo'
import { Button } from '../ui/Button'

// Reuses the same fixture the real `?demo=1` walkthrough scans, so the mockup
// below can never drift from what the app actually detects.
const PREVIEW_INGREDIENTS = DEMO_ITEMS.map((item) => item[0].toUpperCase() + item.slice(1))

function StepDivider() {
  return (
    <span className="mx-auto text-ink-faint rotate-90 [&>svg]:size-3" aria-hidden="true">
      <ArrowRightIcon />
    </span>
  )
}

function ProductPreview() {
  return (
    <div
      className="grid content-center gap-2.5 min-h-[454px] max-[760px]:min-h-[384px] max-[760px]:order-[-1] max-[480px]:min-h-[340px] p-5 max-[480px]:p-4 overflow-hidden bg-surface border border-line rounded-xl shadow-soft"
      aria-hidden="true"
    >
      <div className="flex items-center gap-1.5">
        <span className="size-2.5 rounded-full bg-line" />
        <span className="size-2.5 rounded-full bg-line" />
        <span className="size-2.5 rounded-full bg-line" />
      </div>

      <div className="grid gap-2 p-3 bg-cobalt-wash rounded-lg overflow-hidden">
        <img
          className="block w-full h-[74px] rounded-md object-cover"
          src="/hero-slab.jpg"
          width="480"
          height="480"
          alt=""
        />
        <span className="text-ink-soft text-[.68rem] font-bold">Straight off the counter — a real scan, not a mockup</span>
      </div>

      <StepDivider />

      <div className="grid gap-2 p-3 bg-leaf-wash rounded-lg">
        <span className="text-ink-soft text-[.72rem] font-bold">4 ingredients found</span>
        <div className="flex flex-wrap gap-1.5">
          {PREVIEW_INGREDIENTS.map((item) => (
            <span className="px-2 py-1 text-ink-fixed bg-white text-[.68rem] font-bold rounded-[20px]" key={item}>
              {item}
            </span>
          ))}
        </div>
      </div>

      <StepDivider />

      <div className="grid gap-1.5 p-3 bg-tomato-wash rounded-lg">
        <span className="font-bold text-[.86rem] tracking-tight">Chicken &amp; Pepper Stew</span>
        <span className="text-ink-soft text-[.68rem] font-medium">75 min · Medium</span>
      </div>
    </div>
  )
}

export function Hero({ onStartCooking }) {
  return (
    <section
      className="grid grid-cols-[minmax(0,.98fr)_minmax(360px,.92fr)] max-[760px]:grid-cols-1 items-center gap-6 min-h-[530px] max-[760px]:min-h-0"
      aria-labelledby="home-title"
    >
      <div className="relative z-[1] max-w-[620px]">
        <p className="mb-3 text-tomato text-[.8rem] font-bold">
          Your tiny kitchen co-pilot
        </p>
        <h1
          id="home-title"
          className="max-w-[10.5ch] m-0 font-bold text-[clamp(3.6rem,7.4vw,6.9rem)] max-[760px]:text-[clamp(3.4rem,15vw,5.5rem)] max-[480px]:text-[clamp(3.25rem,15.5vw,4.8rem)] tracking-tight leading-[.84] text-balance"
        >
          Photograph your ingredients. Get real recipes.
        </h1>
        <p className="max-w-[47ch] mt-[25px] text-ink-soft text-[1.04rem] max-[480px]:text-[.97rem] leading-[1.6]">
          A fine-tuned vision model detects what&apos;s on your counter. An LLM turns it into three cookable recipes.
        </p>
        <Button variant="primary" className="mt-[29px]" onClick={onStartCooking}>
          Let&apos;s see the fridge <ArrowRightIcon />
        </Button>
        <p className="mt-[13px] text-ink-soft text-[.72rem] font-medium">
          Takes about a minute. Chef&apos;s promise.
        </p>
      </div>
      <ProductPreview />
    </section>
  )
}
