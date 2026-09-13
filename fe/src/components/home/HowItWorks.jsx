import { ArrowRightIcon } from '../../icons/ArrowRightIcon'
import { STEPS } from '../../lib/constants'

const ILLUSTRATION_SVG_CLASS =
  'w-[118px] max-[760px]:w-[90px] stroke-ink stroke-2 [stroke-linecap:round] [stroke-linejoin:round]'

function PhaseIllustration({ phase }) {
  if (phase === 'upload') {
    return (
      <svg className={ILLUSTRATION_SVG_CLASS} viewBox="0 0 90 70" fill="none">
        <rect x="17" y="11" width="56" height="45" rx="8" />
        <circle cx="45" cy="34" r="12" />
        <path d="m29 11 5-7h22l5 7M22 63h46" />
      </svg>
    )
  }
  if (phase === 'ingredients') {
    return (
      <svg className={ILLUSTRATION_SVG_CLASS} viewBox="0 0 90 70" fill="none">
        <path d="M20 17h50l-5 39H25l-5-39ZM17 17h56M30 9h30" />
        <path d="m32 34 7 7 17-18" />
      </svg>
    )
  }
  return (
    <svg className={ILLUSTRATION_SVG_CLASS} viewBox="0 0 90 70" fill="none">
      <path d="M20 46c0-21 50-21 50 0v10H20V46Z" />
      <path d="M25 46c5-15 35-15 40 0M32 30c0-12 7-17 13-17s13 5 13 17M45 13V7" />
      <path d="M13 58h64" />
    </svg>
  )
}

const PHASE_CARD_BG = {
  upload: 'bg-cobalt-wash',
  ingredients: 'bg-leaf-wash',
  recipes: 'bg-tomato-wash',
}

export function HowItWorks({ onSelectPhase }) {
  return (
    <section
      className="pt-[clamp(84px,12vw,140px)]"
      id="how-it-works"
      aria-labelledby="how-title"
    >
      <div className="grid grid-cols-[minmax(0,.8fr)_minmax(0,1fr)] max-[760px]:grid-cols-1 items-end gap-[13px] sm:gap-7 mb-8">
        <p className="mb-3 text-tomato text-[.8rem] font-bold">
          The three-act dinner
        </p>
        <h2
          id="how-title"
          className="max-w-[11ch] m-0 font-bold text-[clamp(2.6rem,5vw,4.6rem)] tracking-[-0.03em] leading-[.9] text-balance"
        >
          No recipe rabbit hole. Just this.
        </h2>
      </div>
      <div className="grid grid-cols-3 max-[760px]:grid-cols-1 gap-6">
        {STEPS.map((step) => (
          <button
            className={`relative grid max-[760px]:grid-cols-[126px_1fr] max-[760px]:gap-x-[18px] min-h-[360px] max-[760px]:min-h-0 content-start max-[760px]:items-start p-[19px] max-[760px]:p-0 max-[760px]:pr-[18px] max-[760px]:pb-[18px] rounded-xl text-ink border border-line shadow-soft cursor-pointer overflow-hidden text-left transition-[transform,box-shadow] duration-[180ms] hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(0,0,0,.1)] focus-visible:outline-3 focus-visible:outline-cobalt focus-visible:outline-offset-4 ${PHASE_CARD_BG[step.key]}`}
            type="button"
            key={step.key}
            onClick={onSelectPhase}
          >
            <span
              className="grid w-full max-[760px]:w-[126px] h-[172px] max-[760px]:h-[150px] -m-[19px] mb-5 max-[760px]:m-0 max-[760px]:[grid-row:1/span_3] place-items-center bg-white/30 border-b border-line max-[760px]:border-b-0 max-[760px]:border-r"
              aria-hidden="true"
            >
              <PhaseIllustration phase={step.key} />
            </span>
            <span className="text-ink-soft font-mono text-[.67rem] max-[760px]:self-end max-[760px]:mt-6">
              {step.number}
            </span>
            <strong className="my-2 max-[760px]:mt-[7px] max-[760px]:mb-[7px] font-bold text-[2rem] max-[760px]:text-[1.8rem] tracking-[-0.03em] leading-none">
              {step.label}
            </strong>
            <span className="max-w-[23ch] max-[760px]:pb-[2px] text-ink-soft text-[.86rem] leading-[1.52]">
              {step.description}
            </span>
            <span
              className="absolute right-[18px] bottom-[18px] max-[760px]:right-[14px] max-[760px]:bottom-3 grid size-[34px] place-items-center text-white bg-ink rounded-full"
              aria-hidden="true"
            >
              <ArrowRightIcon />
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}
