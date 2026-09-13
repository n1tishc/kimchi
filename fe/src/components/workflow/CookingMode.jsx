import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowLeftIcon } from '../../icons/ArrowLeftIcon'
import { ArrowRightIcon } from '../../icons/ArrowRightIcon'
import { CloseIcon } from '../../icons/CloseIcon'
import { NoteIcon } from '../../icons/NoteIcon'
import { Button } from '../ui/Button'
import { Callout } from '../ui/Callout'

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
      className="fixed inset-0 z-50 grid grid-rows-[auto_auto_minmax(0,1fr)_auto] bg-paper text-ink"
      role="dialog"
      aria-modal="true"
      aria-label={`Cooking ${recipe.title}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="h-1 bg-line" aria-hidden="true">
        <div
          className="h-full bg-tomato transition-[width] duration-200 ease-out"
          style={{ width: `${((stepIndex + 1) / total) * 100}%` }}
        />
      </div>

      <header className="flex items-center justify-between gap-4 px-5 pt-4 pb-2">
        <p className="m-0 text-ink-soft text-[.8rem] font-bold font-mono">
          Step {stepIndex + 1} of {total}
        </p>
        <button
          ref={exitButtonRef}
          type="button"
          className="grid size-9 place-items-center p-0 text-ink-soft bg-transparent border border-line rounded-full cursor-pointer transition-colors duration-150 hover:text-tomato hover:border-tomato focus-visible:outline-3 focus-visible:outline-cobalt focus-visible:outline-offset-4"
          onClick={onExit}
          aria-label="Exit cooking mode"
        >
          <CloseIcon />
        </button>
      </header>

      <div className="grid content-center gap-6 px-6 py-4 overflow-y-auto">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            className="mt-[7px] size-5 flex-none accent-tomato cursor-pointer"
            checked={done}
            onChange={() => onToggleStep(stepIndex)}
            aria-label={`Mark step ${stepNumber} as done`}
          />
          <p
            className={`m-0 text-[1.35rem] max-[480px]:text-[1.15rem] font-bold leading-[1.45] ${
              done ? 'text-ink-soft line-through' : ''
            }`}
          >
            {step.instruction}
          </p>
        </label>

        {step.tip && (
          <Callout tone="leaf" icon={<NoteIcon />}>
            {step.tip}
          </Callout>
        )}
      </div>

      <footer className="grid grid-cols-2 gap-3 px-5 pt-3 pb-[max(16px,env(safe-area-inset-bottom))] border-t border-line">
        <Button className="w-full" onClick={() => goToDelta(-1)} disabled={stepIndex === 0}>
          <ArrowLeftIcon />
          Previous
        </Button>
        <Button variant="primary" className="w-full" onClick={() => goToDelta(1)} disabled={stepIndex === total - 1}>
          Next
          <ArrowRightIcon />
        </Button>
      </footer>
    </div>,
    document.body,
  )
}
