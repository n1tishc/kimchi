import { ArrowRightIcon } from '../../icons/ArrowRightIcon'
import { DEMO_IMAGE, DEMO_ITEMS, DEMO_RECIPES } from '../../lib/demo'
import { Button } from '../ui/Button'

// Where each demo ingredient sits in the 1024px demo photo, and how far to zoom
// into it. The names come straight from DEMO_ITEMS (what the model returns for
// this photo); the model returns names, not locations, so these crops are placed
// by hand and the page says so.
const CROPS = [
  { area: 'chicken', cx: 330, cy: 545, zoom: 190 },
  { area: 'peppers', cx: 640, cy: 240, zoom: 300 },
  { area: 'potatoes', cx: 855, cy: 405, zoom: 330 },
  { area: 'tomato', cx: 740, cy: 620, zoom: 330 },
]

const FIRST_STITCH_S = 0.9
const STITCH_GAP_S = 0.75

function ScanCloth() {
  const topRecipe = DEMO_RECIPES[0]
  const resultDelay = FIRST_STITCH_S + CROPS.length * STITCH_GAP_S + 0.3

  return (
    <div className="hero-scan" role="img" aria-label={`The demo photo cut into patches, each named by the vision model: ${DEMO_ITEMS.join(', ')}.`}>
      <p className="patch m-0 flex items-center gap-2.5 px-4 py-3 text-[.92rem] font-bold" style={{ gridArea: 'head' }}>
        <span className="live-dot" aria-hidden="true" />
        SmolVLM2-500M, LoRA fine-tuned, reading the demo photo
      </p>

      {CROPS.map((crop, index) => {
        const delay = FIRST_STITCH_S + index * STITCH_GAP_S
        return (
          <figure
            className="patch tone-slate crop stitch stitch-draw"
            style={{ gridArea: crop.area, '--d': `${delay}s` }}
            key={crop.area}
          >
            <img
              className="crop-img"
              src={DEMO_IMAGE}
              alt=""
              width="1024"
              height="1024"
              style={{
                width: `${crop.zoom}%`,
                transform: `translate(-${crop.cx / 10.24}%, -${crop.cy / 10.24}%)`,
              }}
            />
            <figcaption className="tag" style={{ '--d': `${delay + 0.85}s` }}>
              <span className="num">{String(index + 1).padStart(2, '0')}</span>
              {DEMO_ITEMS[index]}
            </figcaption>
          </figure>
        )
      })}

      <div
        className="patch tone-ink stitch grid content-between gap-3 p-4 pb-5"
        style={{ gridArea: 'result', animation: `tag-in .4s ease-out ${resultDelay}s both` }}
      >
        <span className="num">3 recipes, ranked</span>
        <span>
          <span className="display block text-[clamp(1.25rem,1.9vw,1.75rem)] leading-[.98]">{topRecipe.title}</span>
          <span className="soft block mt-2 text-[.88rem]">
            {topRecipe.total_time_minutes} min · {topRecipe.difficulty}
          </span>
        </span>
      </div>

      <p className="patch m-0 px-4 py-2.5 text-ink-soft text-[.82rem] leading-[1.45]" style={{ gridArea: 'note' }}>
        The four names are the model&apos;s real output for this photo. It returns names, not locations, so the cuts are
        placed by hand.
      </p>
    </div>
  )
}

export function Hero({ onStartCooking }) {
  return (
    <section className="cloth hero" aria-labelledby="home-title">
      <div className="hero-copy">
        <h1 id="home-title" className="hero-title display">
          <span className="patch tone-hong" style={{ '--d': '0s' }}>
            Dinner,
          </span>
          <span className="patch hero-hangul" style={{ '--d': '.08s' }} lang="ko" aria-hidden="true">
            김치
          </span>
          <span className="patch col-span-2" style={{ '--d': '.16s' }}>
            pieced from
          </span>
          <span className="patch col-span-2" style={{ '--d': '.24s' }}>
            what you&apos;ve got.
          </span>
        </h1>

        <div className="patch pad grid content-end">
          <p className="lede-lg m-0">
            Photograph your counter. A fine-tuned vision model names every ingredient on it, you fix what it got wrong,
            and an LLM stitches the lot into three recipes you can cook tonight.
          </p>
        </div>
        <div className="patch pad grid content-end justify-items-start gap-3.5">
          <Button variant="primary" className="btn-lg w-full" onClick={onStartCooking}>
            Scan my counter <ArrowRightIcon />
          </Button>
          <p className="m-0 text-[.9rem] font-medium">Takes about a minute. Chef&apos;s promise.</p>
        </div>
      </div>

      <ScanCloth />
    </section>
  )
}
