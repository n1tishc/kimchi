import { ArrowRightIcon } from '../../icons/ArrowRightIcon'
import { CameraIcon } from '../../icons/CameraIcon'
import { ChipIcon } from '../../icons/ChipIcon'
import { ListIcon } from '../../icons/ListIcon'
import { RankIcon } from '../../icons/RankIcon'
import { ScanIcon } from '../../icons/ScanIcon'

const PIPELINE = [
  { Icon: CameraIcon, tone: '', name: 'Your photo', detail: 'One overhead shot of the counter.' },
  {
    Icon: ScanIcon,
    tone: 'tone-hong',
    name: 'SmolVLM2-500M, fine-tuned',
    detail: 'A 500M-parameter vision-language model with a LoRA adapter trained to name ingredients.',
    lead: true,
  },
  { Icon: ListIcon, tone: '', name: 'Ingredient list', detail: 'Plain names. You edit them before anything is cooked up.' },
  { Icon: ChipIcon, tone: '', name: 'LLM recipe writer', detail: 'Your list plus a cuisine, turned into full methods.' },
  { Icon: RankIcon, tone: '', name: '3 ranked recipes', detail: 'Steps, cook’s notes, equipment and what you still need to grab.' },
]

const STATS = [
  { value: '353', label: 'ingredient classes in the V2 vocabulary' },
  { value: '82%', label: 'recall on the V1 51-class eval' },
  { value: 'LoRA', label: 'adapter on SmolVLM2-500M' },
  { value: '<30s', label: 'photo to three recipes, end to end' },
]

export function TechShowcase() {
  return (
    <section aria-labelledby="tech-title">
      <div className="cloth">
        <div className="patch pad-lg">
          <h2 id="tech-title" className="display h-section m-0 max-w-[15ch]">
            A small vision model does the looking.
          </h2>
          <p className="lede mt-6 mb-0 text-ink-soft">
            Kimchi is not a wrapper around someone else&apos;s image API. The ingredient reader is a SmolVLM2-500M
            fine-tuned with LoRA for this one job, served behind a FastAPI endpoint.
          </p>
        </div>
      </div>

      <ol className="cloth pipeline m-0 list-none">
        {PIPELINE.map((node, index) => (
          <li className={`patch pad ${node.tone} ${node.lead ? 'stitch' : ''}`} key={node.name}>
            <span className="flex items-center justify-between">
              <span className="num">{String(index + 1).padStart(2, '0')}</span>
              <node.Icon />
            </span>
            <span>
              <strong className={`display block ${node.lead ? 'text-[clamp(1.9rem,3.2vw,2.9rem)]' : 'text-[1.55rem]'}`}>
                {node.name}
              </strong>
              <span className="soft block mt-2.5 text-[.92rem] leading-[1.45]">{node.detail}</span>
            </span>
          </li>
        ))}
      </ol>

      <div className="cloth stats">
        {STATS.map((stat) => (
          <div className="patch pad" key={stat.value}>
            <p className="display stat-value m-0">{stat.value}</p>
            <p className="m-0 mt-2.5 text-ink-soft text-[.95rem] font-medium leading-[1.35]">{stat.label}</p>
          </div>
        ))}
        <a
          className="patch tone-ink stitch pad grid content-between gap-6 font-bold leading-[1.25] no-underline"
          href="https://huggingface.co/LongGrainRice/kimchi-test"
          target="_blank"
          rel="noreferrer"
        >
          <ArrowRightIcon />
          <span>Model card on Hugging Face</span>
        </a>
      </div>
    </section>
  )
}
