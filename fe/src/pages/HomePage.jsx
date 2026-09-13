import { ArrowRightIcon } from '../icons/ArrowRightIcon'
import { SparkIcon } from '../icons/SparkIcon'
import { Hero } from '../components/home/Hero'
import { HowItWorks } from '../components/home/HowItWorks'
import { Button } from '../components/ui/Button'

export function HomePage({ hidden, onStartCooking }) {
  return (
    <main
      className="pt-[clamp(42px,8vw,86px)] max-[480px]:pt-[31px]"
      id="home"
      hidden={hidden}
    >
      <Hero onStartCooking={onStartCooking} />
      <HowItWorks onSelectPhase={onStartCooking} />

      <section className="grid grid-cols-[175px_minmax(0,1fr)_auto] max-[760px]:grid-cols-[130px_1fr] max-[480px]:grid-cols-[105px_1fr] items-center gap-[clamp(25px,5vw,64px)] max-[760px]:gap-3.5 mt-[clamp(82px,12vw,150px)] py-[30px] border-y border-ink">
        <div
          className="grid size-[104px] max-[760px]:size-[94px] max-[480px]:size-[78px] place-items-center text-tomato bg-butter border border-ink shadow-[4px_4px_0_var(--color-ink)] -rotate-6"
          aria-hidden="true"
        >
          <SparkIcon className="w-[53px] h-[53px] stroke-current stroke-[2.2] [stroke-linecap:round]" />
        </div>
        <div>
          <p className="mb-3 text-tomato font-mono text-[.68rem] font-medium tracking-[.08em] uppercase">
            Built for “what even is dinner?” nights
          </p>
          <h2 className="max-w-[11ch] m-0 font-serif text-[clamp(2.6rem,5vw,4.6rem)] max-[480px]:text-[2.45rem] font-medium tracking-[-.055em] leading-[.9] text-balance">
            Less figuring out. More cooking.
          </h2>
        </div>
        <Button className="max-[760px]:col-span-2 max-[760px]:w-full" onClick={onStartCooking}>
          Start with a photo <ArrowRightIcon />
        </Button>
      </section>
    </main>
  )
}
