import { ArrowRightIcon } from '../../icons/ArrowRightIcon'
import { Button } from '../ui/Button'

function HomeScanVisual() {
  return (
    <div
      className="grid min-h-[454px] max-[760px]:min-h-[384px] max-[760px]:order-[-1] max-[480px]:min-h-[340px] place-items-center overflow-hidden bg-cobalt-wash border border-line shadow-soft"
      aria-hidden="true"
    >
      <svg className="block w-[min(92%,390px)] h-auto" viewBox="0 0 360 360" fill="none">
        <rect
          className="fill-[rgba(26,26,26,.18)]"
          x="66"
          y="50"
          width="225"
          height="260"
          transform="rotate(8 66 50)"
        />
        <rect
          className="fill-surface stroke-ink stroke-[3]"
          x="52"
          y="40"
          width="225"
          height="260"
          transform="rotate(-5 52 40)"
        />
        <path
          className="stroke-ink stroke-[5] [stroke-linecap:round] [stroke-linejoin:round]"
          d="M102 134V99h35m86 0h35v35m0 92v35h-35m-86 0h-35v-35"
        />
        <circle className="fill-butter stroke-ink stroke-[3]" cx="180" cy="180" r="52" />
        <path
          className="fill-butter stroke-ink stroke-[3]"
          d="m180 137 37 21v44l-37 21-37-21v-44l37-21Z"
        />
        <path
          className="stroke-tomato stroke-[3] [stroke-linecap:round]"
          d="M75 287 145 237M285 76l-70 51"
        />
        <path
          className="stroke-leaf stroke-[3] [stroke-linecap:round]"
          d="M300 116v25M287 128h25M74 210v20M64 220h20"
        />
      </svg>
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
          Dinner, from the things already staring at you.
        </h1>
        <p className="max-w-[47ch] mt-[25px] text-ink-soft text-[1.04rem] max-[480px]:text-[.97rem] leading-[1.6]">
          A photo in. A real recipe out. No doom-scrolling, no shopping-list guilt.
        </p>
        <Button variant="primary" className="mt-[29px]" onClick={onStartCooking}>
          Let&apos;s see the fridge <ArrowRightIcon />
        </Button>
        <p className="mt-[13px] text-ink-faint text-[.72rem] font-medium">
          Takes about a minute. Chef&apos;s promise.
        </p>
      </div>
      <HomeScanVisual />
    </section>
  )
}
