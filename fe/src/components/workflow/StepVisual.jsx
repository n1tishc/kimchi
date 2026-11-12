import { ClockIcon } from '../../icons/ClockIcon'
import { describeStep } from '../../lib/stepVisual'

const HONG = 'var(--color-hong)'

function Steam({ x, y }) {
  return (
    <g className="steam">
      {[0, 20, 40].map((dx, index) => (
        <path key={dx} style={{ animationDelay: `${index * 0.45}s` }} d={`M${x + dx} ${y} q-7 -9 0 -18 q7 -9 0 -18`} />
      ))}
    </g>
  )
}

function Flames({ xs, y = 152 }) {
  return xs.map((x, index) => (
    <path
      className="flame"
      key={x}
      style={{ animationDelay: `${index * 0.2}s` }}
      d={`M${x} ${y} c-10 -8 -4 -17 0 -24 c4 7 10 16 0 24 z`}
      fill={HONG}
      stroke="none"
    />
  ))
}

const ART = {
  pan: (
    <>
      <Steam x={84} y={64} />
      <path d="M50 84 h112 v8 a18 18 0 0 1 -18 18 h-76 a18 18 0 0 1 -18 -18 z" />
      <path d="M162 90 h54" />
      <circle cx="82" cy="78" r="7" fill={HONG} stroke="none" />
      <circle cx="106" cy="76" r="8" fill={HONG} stroke="none" />
      <circle cx="131" cy="78" r="7" fill={HONG} stroke="none" />
      <Flames xs={[78, 106, 134]} />
    </>
  ),
  simmer: (
    <>
      <Steam x={176} y={58} />
      <rect x="60" y="70" width="120" height="56" rx="8" />
      <path d="M60 88 h-16 M180 88 h16 M54 70 h132 M72 70 q48 -28 96 0" />
      <circle cx="120" cy="46" r="5" fill="currentColor" />
      <Flames xs={[120]} />
    </>
  ),
  boil: (
    <>
      <Steam x={100} y={52} />
      <rect x="60" y="66" width="120" height="60" rx="8" />
      <path d="M60 86 h-16 M180 86 h16" />
      <circle className="bubble" cx="90" cy="82" r="5" fill={HONG} stroke="none" />
      <circle className="bubble" style={{ animationDelay: '.4s' }} cx="120" cy="80" r="6" fill={HONG} stroke="none" />
      <circle className="bubble" style={{ animationDelay: '.8s' }} cx="150" cy="82" r="5" fill={HONG} stroke="none" />
      <Flames xs={[92, 120, 148]} />
    </>
  ),
  oven: (
    <>
      <rect x="48" y="20" width="144" height="124" rx="8" />
      <path d="M48 48 h144" />
      <circle cx="70" cy="34" r="4" fill="currentColor" />
      <circle cx="90" cy="34" r="4" fill="currentColor" />
      <rect className="glow" x="68" y="64" width="104" height="60" fill={HONG} stroke="none" />
      <rect x="68" y="64" width="104" height="60" rx="4" />
      <path d="M80 106 h80" />
      <circle cx="100" cy="98" r="7" fill={HONG} stroke="none" />
      <circle cx="120" cy="98" r="7" fill={HONG} stroke="none" />
      <circle cx="140" cy="98" r="7" fill={HONG} stroke="none" />
    </>
  ),
  grill: (
    <>
      <Steam x={100} y={48} />
      <path d="M44 84 h152 M52 84 a68 44 0 0 0 136 0 M88 122 l-12 30 M152 122 l12 30" />
      <path d="M60 66 h124" />
      <rect x="80" y="57" width="16" height="18" fill={HONG} stroke="none" />
      <rect x="106" y="57" width="16" height="18" />
      <rect x="132" y="57" width="16" height="18" fill={HONG} stroke="none" />
    </>
  ),
  knife: (
    <>
      <rect x="36" y="108" width="168" height="18" rx="4" />
      <rect x="46" y="96" width="10" height="10" fill={HONG} stroke="none" />
      <rect x="60" y="96" width="10" height="10" fill={HONG} stroke="none" />
      <g className="rock">
        <path d="M82 104 L160 104 L160 74 Q118 78 82 104 z" />
        <path d="M160 80 h42 v14 h-42" />
      </g>
    </>
  ),
  bowl: (
    <>
      <path className="stir" d="M150 26 L122 84" />
      <circle cx="94" cy="70" r="8" fill={HONG} stroke="none" />
      <circle cx="118" cy="66" r="8" fill={HONG} stroke="none" />
      <path d="M48 76 H192 A72 56 0 0 1 48 76 Z" fill="var(--color-ramie)" />
      <path d="M98 134 h44" />
    </>
  ),
  serve: (
    <>
      <Steam x={102} y={48} />
      <ellipse cx="124" cy="116" rx="84" ry="20" />
      <path d="M88 112 q36 -54 72 0 z" fill={HONG} stroke="none" />
      <path d="M22 66 v76 M14 66 v18 q8 9 16 0 v-18" />
    </>
  ),
}

// An illustration of what this step mostly asks for, with any time and
// temperature the step mentions pulled out where wet hands can read them.
export function StepVisual({ instruction }) {
  const { technique, label, time, temperature } = describeStep(instruction)

  return (
    <figure className="grid justify-items-center gap-4 m-0">
      <svg
        className="step-art"
        viewBox="0 0 240 160"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {ART[technique]}
      </svg>
      <figcaption className="flex flex-wrap items-center justify-center gap-2.5 text-[1.05rem] font-bold">
        <span className="px-3 py-2 bg-hong text-paper-fixed leading-none">{label}</span>
        {time && (
          <span className="inline-flex items-center gap-1.5 px-3 py-2 leading-none shadow-[inset_0_0_0_2px_var(--color-ink)]">
            <ClockIcon className="w-[15px] h-[15px]" />
            {time}
          </span>
        )}
        {temperature && (
          <span className="px-3 py-2 leading-none shadow-[inset_0_0_0_2px_var(--color-ink)]">{temperature}</span>
        )}
      </figcaption>
    </figure>
  )
}
