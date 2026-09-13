import { CheckIcon } from '../../icons/CheckIcon'
import { STEPS } from '../../lib/constants'

const STATE_TEXT_COLOR = {
  active: 'text-tomato',
  done: 'text-leaf',
  upcoming: 'text-ink-faint',
}

export function Stepper({ activeStep }) {
  return (
    <nav className="flex items-center w-full mb-[17px] px-0.5 border-b border-line" aria-label="Progress">
      {STEPS.map((step, index) => {
        const state = index < activeStep ? 'done' : index === activeStep ? 'active' : 'upcoming'
        const isLast = index === STEPS.length - 1

        return (
          <div
            className={`flex ${isLast ? 'flex-[0_1_32%] max-[760px]:flex-[0_1_auto]' : 'flex-1'} min-w-0 items-center gap-[9px] py-3 ${STATE_TEXT_COLOR[state]}`}
            key={step.key}
          >
            <span className="font-mono text-[.64rem] tracking-[-.04em] [&>svg]:block" aria-hidden="true">
              {state === 'done' ? <CheckIcon /> : step.number}
            </span>
            <span
              className={`text-[.79rem] max-[480px]:text-[.7rem] font-bold tracking-[-.01em] ${
                state === 'active' || state === 'done' ? 'text-ink' : ''
              }`}
            >
              {step.label}
            </span>
            {!isLast && (
              <span
                className={`h-px flex-1 max-[760px]:w-6 max-[480px]:w-3.5 mx-[15px] max-[760px]:mx-[9px] max-[480px]:mx-[7px] ${
                  state === 'done' ? 'bg-leaf' : 'bg-line'
                }`}
                aria-hidden="true"
              />
            )}
          </div>
        )
      })}
    </nav>
  )
}
