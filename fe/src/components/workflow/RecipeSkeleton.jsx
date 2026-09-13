import { Card } from '../ui/Card'

export function RecipeSkeleton() {
  return (
    <div className="grid gap-[18px]" role="status" aria-label="Loading recipes">
      <span className="sr-only">Loading recipes…</span>
      <div className="grid grid-cols-3 max-[760px]:grid-cols-1 gap-3" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <div className="grid min-h-[222px] max-[760px]:min-h-0 content-start gap-[11px] p-[18px] pointer-events-none" key={i}>
            <span className="skel w-[27px] h-[11px]" />
            <span className="skel block w-[86%] h-6" />
            <span className="skel block w-full h-[11px]" />
            <span className="skel block w-[64%] h-[11px]" />
            <span className="skel block w-[42%] h-[11px] mt-auto" />
          </div>
        ))}
      </div>

      <Card as="div" className="grid gap-4 p-[clamp(24px,5vw,48px)] max-[480px]:p-[22px]" aria-hidden="true">
        <span className="skel block w-[55%] h-[45px]" />
        <span className="skel block w-full h-[11px]" />
        <span className="skel block w-[64%] h-[11px]" />
        <div className="flex gap-2">
          <span className="skel w-[78px] h-[25px]" />
          <span className="skel w-[78px] h-[25px]" />
          <span className="skel w-[78px] h-[25px]" />
        </div>
        <span className="skel block w-20 h-3 mt-3" />
        {[0, 1, 2, 3].map((i) => (
          <span className="skel block w-full h-[45px]" key={i} />
        ))}
      </Card>
    </div>
  )
}
