import { ArrowRightIcon } from '../icons/ArrowRightIcon'
import { Hero } from '../components/home/Hero'
import { HowItWorks } from '../components/home/HowItWorks'
import { TechShowcase } from '../components/home/TechShowcase'
import { Button } from '../components/ui/Button'

export function HomePage({ hidden, onStartCooking }) {
  return (
    <main id="home" hidden={hidden}>
      <Hero onStartCooking={onStartCooking} />
      <TechShowcase />
      <HowItWorks onSelectPhase={onStartCooking} />

      <section className="cloth grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)] max-[760px]:grid-cols-1" aria-labelledby="close-title">
        <div className="patch tone-hong pad-lg">
          <p className="m-0 mb-5 text-[1.05rem] font-bold">Built for &ldquo;what even is dinner?&rdquo; nights</p>
          <h2 id="close-title" className="display m-0 max-w-[11ch] text-[clamp(2.4rem,5vw,4.4rem)]">
            Less figuring out. More cooking.
          </h2>
        </div>
        <div className="patch pad grid content-end gap-4">
          <p className="m-0 text-[1.1rem] font-bold leading-[1.35]">One photo is all it needs to start.</p>
          <Button variant="ink" className="btn-lg w-full" onClick={onStartCooking}>
            Start with a photo <ArrowRightIcon />
          </Button>
        </div>
      </section>

      <footer className="cloth grid-cols-[minmax(0,1fr)_auto_auto] max-[760px]:grid-cols-1">
        <p className="patch m-0 px-5 py-4 text-ink-soft text-[.92rem]">
          Kimchi is a portfolio project: a fine-tuned vision model, a FastAPI backend and this React frontend.
        </p>
        <a className="patch link px-5 py-4" href="https://github.com/n1tishc/kimchi" target="_blank" rel="noreferrer">
          Source on GitHub
        </a>
        <a
          className="patch link px-5 py-4"
          href="https://huggingface.co/LongGrainRice/kimchi-test"
          target="_blank"
          rel="noreferrer"
        >
          Model card
        </a>
      </footer>
    </main>
  )
}
