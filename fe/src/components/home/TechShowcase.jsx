import { ArrowRightIcon } from '../../icons/ArrowRightIcon'
import { CameraIcon } from '../../icons/CameraIcon'
import { ChipIcon } from '../../icons/ChipIcon'
import { ListIcon } from '../../icons/ListIcon'
import { RankIcon } from '../../icons/RankIcon'
import { ScanIcon } from '../../icons/ScanIcon'
import { Card } from '../ui/Card'

const PIPELINE = [
  { Icon: CameraIcon, label: 'Photo' },
  { Icon: ScanIcon, label: 'SmolVLM2-500M (fine-tuned)' },
  { Icon: ListIcon, label: 'Ingredient List' },
  { Icon: ChipIcon, label: 'LLM Recipe Gen' },
  { Icon: RankIcon, label: '3 Ranked Recipes' },
]

const STATS = [
  { value: '353', label: 'ingredient classes (V2 vocabulary)', wide: true },
  { value: '82%', label: 'recall — V1, 51-class eval' },
  { value: 'LoRA', label: 'fine-tuned SmolVLM2-500M' },
  { value: '<30s', label: 'end-to-end', wide: true },
]

function PipelineArrow() {
  return (
    <span className="text-ink-faint max-[760px]:rotate-90" aria-hidden="true">
      <ArrowRightIcon />
    </span>
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
            <div className="grid justify-items-center gap-2 max-[760px]:justify-items-start max-[760px]:grid-flow-col max-[760px]:items-center text-center max-[760px]:text-left">
              <span
                className="grid size-10 place-items-center text-tomato bg-surface border border-line rounded-full"
                aria-hidden="true"
              >
                <node.Icon />
              </span>
              <span className="max-w-[12ch] max-[760px]:max-w-none text-ink-soft text-[.72rem] font-bold leading-tight">
                {node.label}
              </span>
            </div>
            {index < PIPELINE.length - 1 && <PipelineArrow />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 max-[760px]:grid-cols-1 gap-6 mt-6">
        {STATS.map((stat) => (
          <Card className={`p-5 ${stat.wide ? 'col-span-2 max-[760px]:col-span-1' : ''}`} key={stat.label}>
            <p
              className={`m-0 font-mono font-bold text-tomato tracking-tight leading-none ${
                stat.wide ? 'text-[2.4rem]' : 'text-[1.9rem]'
              }`}
            >
              {stat.value}
            </p>
            <p className="m-0 mt-2 text-ink-soft text-[.8rem] font-medium leading-snug">{stat.label}</p>
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
