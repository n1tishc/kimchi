import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowLeftIcon } from '../../icons/ArrowLeftIcon'
import { ArrowRightIcon } from '../../icons/ArrowRightIcon'
import { CloseIcon } from '../../icons/CloseIcon'
import { Button } from '../ui/Button'
import { StepVisual } from './StepVisual'

const SWIPE_THRESHOLD_PX = 50

export function CookingMode({ recipe, completedSteps, onToggleStep, onExit }) {
  const steps = recipe.steps
  const total = steps.length
  const [stepIndex, setStepIndex] = useState(0)
  const touchStartRef = useRef(null)
  const wakeLockRef = useRef(null)
  const exitButtonRef = useRef(null)

  const step = steps[stepIndex]
  const stepNumber = step.n ?? stepIndex + 1
  const done = completedSteps[stepIndex]

  // Delta-based so it reads the current step off React's functional-update state
  // instead of closing over `stepIndex` — keeps it stable across renders.
  const goToDelta = useCallback(
    (delta) => {
      setStepIndex((current) => Math.min(Math.max(current + delta, 0), total - 1))
    },
    [total],
  )

  // Wake locks release automatically whenever the document loses visibility
  // (tab switch, screen lock), so re-request on return or the screen stops
  // staying awake partway through a cook.
  useEffect(() => {
    if (!('wakeLock' in navigator)) return undefined

    let cancelled = false

    async function requestLock() {
      try {
        const sentinel = await navigator.wakeLock.request('screen')
        if (cancelled) {
          sentinel.release()
          return
        }
        // The sentinel stays truthy after an OS/tab-hide auto-release, so the
        // visibilitychange handler below needs this to know when to re-request.
        sentinel.addEventListener('release', () => {
          if (wakeLockRef.current === sentinel) wakeLockRef.current = null
        })
        wakeLockRef.current = sentinel
      } catch {
        // Denied, unsupported, or backgrounded at request time — cooking mode still works, the screen may just dim.
      }
    }

    requestLock()

    function onVisibilityChange() {
      if (document.visibilityState === 'visible' && !wakeLockRef.current) requestLock()
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', onVisibilityChange)
      wakeLockRef.current?.release()
      wakeLockRef.current = null
    }
  }, [])

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'Escape') onExit()
      if (event.key === 'ArrowRight') goToDelta(1)
      if (event.key === 'ArrowLeft') goToDelta(-1)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [goToDelta, onExit])

  // Full-screen overlay: keep the recipe page from scrolling underneath it.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  // aria-modal implies focus is managed: move it in on open. (Restoring it to the
  // "Start cooking" trigger on close is handled by RecipeDetail, which owns that
  // element — it has to survive this component's unmount to receive focus back.)
  useEffect(() => {
    exitButtonRef.current?.focus()
  }, [])

  function handleTouchStart(event) {
    const touch = event.touches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
  }

  function handleTouchEnd(event) {
    const start = touchStartRef.current
    touchStartRef.current = null
    if (!start) return

    const touch = event.changedTouches[0]
    const deltaX = touch.clientX - start.x
    const deltaY = touch.clientY - start.y
    if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX || Math.abs(deltaX) < Math.abs(deltaY)) return

    // A real swipe on the instruction label can also fire a compatibility click on
    // touchend, which would double as a tap-to-complete — suppress it once this is
    // confirmed to be a step-change gesture, not a tap.
    event.preventDefault()
    goToDelta(deltaX < 0 ? 1 : -1)
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 grid grid-rows-[auto_auto_minmax(0,1fr)_auto] gap-[3px] p-[3px] bg-seam text-ink"
      role="dialog"
      aria-modal="true"
      aria-label={`Cooking ${recipe.title}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* One stitch per step: sewn so far, the one in hand, and still to sew. */}
      <div className="flex gap-[3px]" aria-hidden="true">
        {steps.map((_, index) => (
          <span
            className={`h-3 flex-1 transition-colors duration-200 ${
              index < stepIndex ? 'bg-ink-soft' : index === stepIndex ? 'bg-hong' : 'bg-ramie'
            }`}
            key={index}
          />
        ))}
      </div>

      <header className="patch flex items-center justify-between gap-4 px-5 py-3">
        <p className="m-0 font-bold">
          Step {stepIndex + 1} of {total}
        </p>
        <button
          ref={exitButtonRef}
          type="button"
          className="grid size-11 place-items-center p-0 text-ramie bg-ink border-0 cursor-pointer hover:bg-hong hover:text-paper-fixed"
          onClick={onExit}
          aria-label="Exit cooking mode"
        >
          <CloseIcon />
        </button>
      </header>

      <div className="patch grid md:grid-cols-2 items-center gap-x-10 gap-y-6 px-[clamp(20px,5vw,72px)] py-6 overflow-y-auto">
        {/* Keyed so each step's illustration restarts its own motion. */}
        <StepVisual instruction={step.instruction} key={stepIndex} />

        <div className="grid gap-5">
          <span className="display text-hong text-[clamp(2.4rem,5vw,3.6rem)]" aria-hidden="true">
            {stepNumber}
          </span>
          <label className="flex items-start gap-4 cursor-pointer select-none">
            <input
              type="checkbox"
              className="check mt-[7px]"
              checked={done}
              onChange={() => onToggleStep(stepIndex)}
              aria-label={`Mark step ${stepNumber} as done`}
            />
            <p
              className={`m-0 max-w-[36ch] text-[clamp(1.15rem,2vw,1.6rem)] font-medium leading-[1.4] ${
                done ? 'text-ink-soft line-through' : ''
              }`}
            >
              {step.instruction}
            </p>
          </label>

          {step.tip && <p className="note m-0 max-w-[60ch] max-[480px]:flex-col max-[480px]:gap-1">{step.tip}</p>}
        </div>
      </div>

      <footer className="grid grid-cols-2 gap-[3px] pb-[env(safe-area-inset-bottom)]">
        <Button variant="paper" className="btn-lg w-full" onClick={() => goToDelta(-1)} disabled={stepIndex === 0}>
          <ArrowLeftIcon />
          Previous
        </Button>
        <Button variant="primary" className="btn-lg w-full" onClick={() => goToDelta(1)} disabled={stepIndex === total - 1}>
          Next
          <ArrowRightIcon />
        </Button>
      </footer>
    </div>,
    document.body,
  )
}
