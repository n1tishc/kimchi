import { useEffect, useRef, useState } from 'react'
import { errorMessage } from '../lib/api'
import { wait } from '../lib/demo'

function cleanIngredients(values) {
  return [
    ...new Set(
      values
        .map((value) => String(value).trim().toLowerCase())
        .filter(Boolean),
    ),
  ]
}

// Scans one or more photos. The backend reads one image per request, so photos
// go through /predict one at a time and their ingredient lists are merged.
export function useScan({ demoMode, demoItems, apiUrl, timeoutMs }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  // { current, total } while scanning: which photo is being read right now.
  const [progress, setProgress] = useState(null)
  const abortRef = useRef(null)

  useEffect(() => () => abortRef.current?.abort(), [])

  function reset() {
    setError(null)
  }

  function abort() {
    abortRef.current?.abort()
  }

  // Resolves to the ingredient names, or throws with `timedOut`/`aborted` set.
  async function scanOne(file, controller) {
    let timedOut = false
    const timeoutId = window.setTimeout(() => {
      timedOut = true
      controller.abort()
    }, timeoutMs)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${apiUrl}/predict`, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      })

      if (!response.ok) {
        throw new Error(await errorMessage(response))
      }

      const data = await response.json()
      return data.ingredients ?? []
    } catch (scanError) {
      scanError.timedOut = timedOut
      scanError.aborted = controller.signal.aborted && !timedOut
      throw scanError
    } finally {
      window.clearTimeout(timeoutId)
    }
  }

  // Returns { items, failed } or null. `failed` counts photos that could not be
  // read when at least one other photo could; if none could, this sets `error`
  // and returns null.
  async function scan(files) {
    if (files.length === 0 && !demoMode) return null

    setLoading(true)
    setError(null)

    if (demoMode) {
      setProgress({ current: 1, total: 1 })
      await wait(1100)
      setProgress(null)
      setLoading(false)
      return { items: cleanIngredients(demoItems), failed: 0 }
    }

    abortRef.current?.abort()
    const found = []
    let succeeded = 0
    let lastError = null

    try {
      for (const [index, file] of files.entries()) {
        // A fresh controller per photo: one timing out must not cancel the rest.
        const controller = new AbortController()
        abortRef.current = controller
        setProgress({ current: index + 1, total: files.length })

        try {
          found.push(...(await scanOne(file, controller)))
          succeeded += 1
        } catch (scanError) {
          // A deliberate cancel (start over, unmount) stops the whole batch quietly.
          if (scanError.aborted) return null
          lastError = scanError
        }
      }

      if (succeeded === 0) {
        setError(
          lastError?.timedOut
            ? 'The model took too long to respond. Please try again.'
            : `Couldn't reach the model: ${lastError?.message ?? 'unknown error'}`,
        )
        return null
      }

      return { items: cleanIngredients(found), failed: files.length - succeeded }
    } finally {
      abortRef.current = null
      setProgress(null)
      setLoading(false)
    }
  }

  return { loading, error, progress, scan, reset, abort }
}
