import { CameraIcon } from '../../icons/CameraIcon'
import { ScanIcon } from '../../icons/ScanIcon'
import { UploadIcon } from '../../icons/UploadIcon'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { ErrorNote } from '../ui/ErrorNote'

export function UploadCard({ preview, onPick, onScan, scanDisabled, scanning, error }) {
  return (
    <Card as="section" className="grid gap-[26px] p-[clamp(22px,4vw,38px)] max-[480px]:p-[22px]" aria-label="Upload ingredients">
      <div className="grid gap-[7px]">
        <h2 className="m-0 font-bold text-[clamp(2.15rem,4vw,3rem)] tracking-tight leading-[.95]">
          Show the chef your haul.
        </h2>
        <p className="max-w-[54ch] m-0 text-ink-soft text-[.94rem] leading-[1.55]">
          Add a clear, well-lit photo and we&apos;ll read what&apos;s on the counter.
        </p>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_230px] max-[760px]:grid-cols-1 border border-line">
        <label className="grid min-h-[348px] max-[760px]:min-h-[285px] place-items-center overflow-hidden p-6 text-ink-soft bg-cobalt-wash border-r border-line max-[760px]:border-r-0 max-[760px]:border-b text-center cursor-pointer transition-colors duration-[180ms] hover:bg-[#d7e6fc] dark:hover:bg-[#1a3550] focus-within:outline-3 focus-within:outline-tomato focus-within:outline-offset-[3px]">
          {preview ? (
            <img
              className="block w-full h-full max-h-[454px] object-contain mix-blend-multiply"
              src={preview || '/placeholder.svg'}
              alt="Selected ingredients"
            />
          ) : (
            <span className="grid justify-items-center gap-[7px]">
              <span
                className="grid size-12 mb-[5px] place-items-center text-tomato bg-surface border border-current rounded-full"
                aria-hidden="true"
              >
                <CameraIcon />
              </span>
              <span className="text-ink text-base font-bold">Choose a photo</span>
              <span className="text-ink-soft text-[.82rem]">or drag an image here</span>
            </span>
          )}
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(event) => onPick(event.target.files?.[0])}
          />
        </label>
        <aside
          className="self-stretch p-6 max-[760px]:p-[17px] bg-surface max-[760px]:grid max-[760px]:grid-cols-[1fr_1.25fr] max-[760px]:gap-[14px]"
          aria-label="Photo guidelines"
        >
          <p className="mb-3 text-tomato text-[.8rem] font-bold max-[760px]:col-span-2">
            For a better read
          </p>
          <p className="mb-6 max-[760px]:mb-0 max-[760px]:col-start-1 text-ink-soft text-[.84rem] leading-[1.55]">
            Lay ingredients out with a little space between them. Daylight helps.
          </p>
          <p className="mb-0 max-[760px]:col-start-2 max-[760px]:[grid-row:1/span_2] text-ink-soft text-[.84rem] leading-[1.55]">
            We&apos;ll always let you correct the list before recipes are made.
          </p>
        </aside>
      </div>

      <div className="flex flex-wrap gap-[11px] max-[480px]:grid max-[480px]:grid-cols-1">
        <Button as="label" className="max-[480px]:w-full">
          <UploadIcon />
          Upload
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(event) => onPick(event.target.files?.[0])}
          />
        </Button>

        <Button
          variant="primary"
          className={`max-[480px]:w-full ${scanning ? 'relative overflow-hidden' : ''}`}
          onClick={onScan}
          disabled={scanDisabled}
        >
          {scanning ? (
            <>
              <span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent animate-shimmer"
                aria-hidden="true"
              />
              <span className="relative">Scanning...</span>
            </>
          ) : (
            <>
              <ScanIcon />
              Scan ingredients
            </>
          )}
        </Button>
      </div>

      {scanning && (
        <p className="text-ink-soft text-[.82rem]" role="status">
          Reading your photo with the vision model...
        </p>
      )}

      {error && <ErrorNote>{error}</ErrorNote>}
    </Card>
  )
}
