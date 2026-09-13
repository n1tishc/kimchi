import { ArrowRightIcon } from '../../icons/ArrowRightIcon'
import { Card } from '../ui/Card'

const PIPELINE = [
  { icon: '📸', label: 'Photo' },
  { icon: '🔬', label: 'SmolVLM2-500M (fine-tuned)' },
  { icon: '🧾', label: 'Ingredient List' },
  { icon: '🤖', label: 'LLM Recipe Gen' },
  { icon: '🍽️', label: '3 Ranked Recipes' },
]

const STATS = [
  '82% recall on 51 ingredient classes',
  'LoRA fine-tuned SmolVLM2-500M',
  'Sub-30s end-to-end',
]

function PipelineArrow() {
  return (
    <>
      <span className="text-ink-faint text-lg max-[760px]:hidden" aria-hidden="true">
        →
      </span>
      <span className="hidden max-[760px]:block text-ink-faint text-lg" aria-hidden="true">
        ↓
      </span>
    </>
  )
}

export function TechShowcase() {
  return (
    <section className="pt-[clamp(84px,12vw,140px)]" aria-labelledby="tech-title">
      <h2
        id="tech-title"
        className="max-w-[16ch] m-0 mb-8 font-bold text-[clamp(2.6rem,5vw,4.6rem)] tracking-tight leading-[.9] text-balance"
      >
        How it works under the hood
      </h2>

      <div className="flex items-center flex-wrap max-[760px]:flex-col max-[760px]:items-start gap-x-3 gap-y-2 p-5 max-[480px]:p-4 bg-sunken border border-line rounded-xl">
        {PIPELINE.map((node, index) => (
          <div className="contents" key={node.label}>
            <div className="grid justify-items-center gap-1.5 max-[760px]:justify-items-start text-center max-[760px]:text-left">
              <span className="text-[1.8rem] leading-none" aria-hidden="true">
                {node.icon}
              </span>
              <span className="max-w-[12ch] text-ink-soft text-[.72rem] font-bold leading-tight">
                {node.label}
              </span>
            </div>
            {index < PIPELINE.length - 1 && <PipelineArrow />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 max-[760px]:grid-cols-1 gap-6 mt-6">
        {STATS.map((stat) => (
          <Card className="p-5" key={stat}>
            <p className="m-0 text-[1rem] font-bold leading-snug">{stat}</p>
          </Card>
        ))}
      </div>

      <a
        className="inline-flex items-center gap-1.5 mt-6 text-cobalt text-[.87rem] font-bold hover:underline focus-visible:outline-3 focus-visible:outline-cobalt focus-visible:outline-offset-4"
        href="https://huggingface.co/LongGrainRice/kimchi-test"
        target="_blank"
        rel="noreferrer"
      >
        View the model card on Hugging Face <ArrowRightIcon />
      </a>
    </section>
  )
}
