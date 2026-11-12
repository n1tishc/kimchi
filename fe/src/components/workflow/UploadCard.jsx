import { useState } from 'react'
import { CameraIcon } from '../../icons/CameraIcon'
import { CloseIcon } from '../../icons/CloseIcon'
import { ScanIcon } from '../../icons/ScanIcon'
import { UploadIcon } from '../../icons/UploadIcon'
import { MAX_PHOTOS } from '../../hooks/useImageUpload'
import { Button } from '../ui/Button'
import { ErrorNote } from '../ui/ErrorNote'

function plural(count, word) {
  return `${count} ${word}${count === 1 ? '' : 's'}`
}

// Turns the result of an add into one sentence, or null when everything was taken.
function describeSkipped({ added, notImages, overLimit }) {
  const parts = []
  if (notImages > 0) parts.push(`${plural(notImages, 'file')} skipped because ${notImages === 1 ? 'it isn’t an image' : 'they aren’t images'}`)
  if (overLimit > 0) parts.push(`${plural(overLimit, 'photo')} left out because a scan takes at most ${MAX_PHOTOS}`)
  if (parts.length === 0) return null
  const sentence = parts.join(', and ')
  return `${sentence[0].toUpperCase()}${sentence.slice(1)}.${added === 0 && notImages > 0 ? ' Add a photo (JPG, PNG, etc.) instead.' : ''}`
}

export function UploadCard({ photos, onAdd, onRemove, onScan, scanDisabled, scanning, progress, error }) {
  const [isDragging, setIsDragging] = useState(false)
  const [addNote, setAddNote] = useState(null)

  const ownCount = photos.filter((photo) => photo.file).length
  const canAddMore = ownCount < MAX_PHOTOS && !scanning
  // Only the sample photo (demo mode) has no file behind it.
  const scanCount = ownCount || photos.length

  function addFiles(fileList) {
    if (!fileList || fileList.length === 0) return
    setAddNote(describeSkipped(onAdd(fileList)))
  }

  function handleInputChange(event) {
    addFiles(event.target.files)
    // Lets the same file be picked again after it has been removed.
    event.target.value = ''
  }

  function handleDragEnter(event) {
    event.preventDefault()
    setIsDragging(true)
  }

  function handleDragOver(event) {
    event.preventDefault()
  }

  function handleDragLeave(event) {
    // Children re-fire enter/leave as the pointer crosses them; only clear on a real exit.
    if (event.currentTarget.contains(event.relatedTarget)) return
    setIsDragging(false)
  }

  function handleDrop(event) {
    event.preventDefault()
    setIsDragging(false)
    if (!scanning) addFiles(event.dataTransfer.files)
  }

  const fileInput = (
    <input className="sr-only" type="file" accept="image/*" multiple disabled={!canAddMore} onChange={handleInputChange} />
  )

  return (
    <section aria-label="Upload ingredients">
      <div
        className="cloth upload"
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {photos.length === 0 ? (
          <label className={`patch dropzone stitch ${isDragging ? 'tone-hong' : ''}`}>
            <span className="grid justify-items-center gap-3 p-8">
              <span className="grid size-14 place-items-center bg-ink text-ramie" aria-hidden="true">
                <CameraIcon />
              </span>
              <span className="display text-[clamp(1.7rem,3vw,2.4rem)]">
                {isDragging ? 'Drop them on the cloth.' : 'Choose photos'}
              </span>
              <span className="soft">or drag them onto this patch. Up to {MAX_PHOTOS}, one for each shelf or counter.</span>
            </span>
            {fileInput}
          </label>
        ) : (
          <div className={`patch p-[3px] ${isDragging ? 'tone-hong' : ''}`}>
            <ul className="photos">
              {photos.map((photo, index) => {
                const reading = scanning && progress?.current === index + 1
                return (
                  <li className="patch tone-slate photo" key={photo.id}>
                    <img src={photo.url} alt={`Photo ${index + 1} of your ingredients`} />
                    {reading && (
                      <>
                        <span className="scan-veil" aria-hidden="true" />
                        <span className="scan-needle" aria-hidden="true" />
                      </>
                    )}
                    {photo.file ? (
                      !scanning && (
                        <button
                          className="photo-x"
                          type="button"
                          aria-label={`Remove photo ${index + 1}`}
                          onClick={() => onRemove(photo.id)}
                        >
                          <CloseIcon />
                        </button>
                      )
                    ) : (
                      <span className="tag">Sample photo</span>
                    )}
                  </li>
                )
              })}
              {canAddMore && (
                <li className="contents">
                  <label className="patch photo photo-add">
                    <UploadIcon />
                    <span>{ownCount === 0 ? 'Add your own photos' : 'Add another'}</span>
                    <span className="text-ink-soft text-[.88rem] font-medium">
                      {ownCount === 0 ? `Up to ${MAX_PHOTOS}` : `${ownCount} of ${MAX_PHOTOS}`}
                    </span>
                    {fileInput}
                  </label>
                </li>
              )}
            </ul>
          </div>
        )}

        <aside className="patch pad grid content-start gap-4" aria-label="Photo guidelines">
          <h2 className="display m-0 text-[1.5rem]">For a better read</h2>
          <p className="m-0 text-ink-soft leading-[1.5]">Lay ingredients out with a little space between them. Daylight helps.</p>
          <p className="m-0 text-ink-soft leading-[1.5]">
            Fridge, counter and cupboard can each get their own photo. Everything found is merged into one list.
          </p>
          <p className="m-0 text-ink-soft leading-[1.5]">You&apos;ll always get to correct the list before recipes are made.</p>
        </aside>
      </div>

      <div className="cloth">
        <div className="patch pad flex flex-wrap items-center gap-3 max-[480px]:grid max-[480px]:grid-cols-1">
          {photos.length === 0 && (
            <Button as="label" className="max-[480px]:w-full">
              <UploadIcon />
              Upload
              {fileInput}
            </Button>
          )}

          <Button
            variant="primary"
            className="max-[480px]:w-full"
            onClick={onScan}
            disabled={scanDisabled}
            aria-busy={scanning || undefined}
          >
            {scanning ? (
              <>
                <span className="sewbar" aria-hidden="true" />
                Scanning...
              </>
            ) : (
              <>
                <ScanIcon />
                {scanCount > 1 ? `Scan ${scanCount} photos` : 'Scan ingredients'}
              </>
            )}
          </Button>

          {scanning && (
            <p className="m-0 text-ink-soft" role="status">
              {progress && progress.total > 1
                ? `The vision model is reading photo ${progress.current} of ${progress.total}...`
                : 'The vision model is cutting your photo into ingredients...'}
            </p>
          )}
        </div>
        {addNote && <ErrorNote>{addNote}</ErrorNote>}
        {error && <ErrorNote>{error}</ErrorNote>}
      </div>
    </section>
  )
}
