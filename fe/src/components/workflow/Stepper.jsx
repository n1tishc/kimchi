import { CheckIcon } from '../../icons/CheckIcon'
import { STEPS } from '../../lib/constants'

const STATE_TONE = {
  active: 'tone-ink stitch',
  done: '',
  upcoming: '',
}

export function Stepper({ activeStep }) {
  return (
    <nav aria-label="Progress">
      <ol className="cloth stepper m-0 list-none">
        {STEPS.map((step, index) => {
          const state = index < activeStep ? 'done' : index === activeStep ? 'active' : 'upcoming'

          return (
            <li
              className={`patch ${STATE_TONE[state]} ${state === 'upcoming' ? 'text-ink-soft' : ''}`}
              aria-current={state === 'active' ? 'step' : undefined}
              key={step.key}
            >
              <span className="num [&>svg]:block" aria-hidden="true">
                {state === 'done' ? <CheckIcon /> : step.number}
              </span>
              <span className="truncate">{step.label}</span>
              {state === 'done' && <span className="sr-only">(done)</span>}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
