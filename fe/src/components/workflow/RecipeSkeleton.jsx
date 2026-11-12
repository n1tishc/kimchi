export function RecipeSkeleton() {
  return (
    <div role="status" aria-label="Loading recipes">
      <span className="sr-only">Loading recipes…</span>
      <div className="cloth picker" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <div className="patch pick pad pointer-events-none" key={i}>
            <span className="skel w-10 h-12" />
            <span className="skel w-[86%] h-7" />
            <span className="skel w-full h-3" />
            <span className="skel w-[64%] h-3" />
            <span className="skel w-[42%] h-3 mt-auto" />
          </div>
        ))}
      </div>

      <div className="cloth" aria-hidden="true">
        <div className="patch pad-lg grid gap-4">
          <span className="skel w-[55%] h-14" />
          <span className="skel w-full h-3" />
          <span className="skel w-[64%] h-3" />
          <div className="flex gap-2">
            <span className="skel w-24 h-8" />
            <span className="skel w-24 h-8" />
            <span className="skel w-24 h-8" />
          </div>
        </div>
        <div className="patch pad grid gap-3">
          {[0, 1, 2, 3].map((i) => (
            <span className="skel w-full h-12" key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
