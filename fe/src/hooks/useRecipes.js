import { useEffect, useRef, useState } from 'react'
import { errorMessage } from '../lib/api'
import { wait } from '../lib/demo'

export function useRecipes({ demoMode, demoRecipes, apiUrl, timeoutMs }) {
  const [recipes, setRecipes] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const abortRef = useRef(null)

  useEffect(() => () => abortRef.current?.abort(), [])

  function reset() {
    setRecipes(null)
    setError(null)
    setSelectedIndex(0)
  }

  function abort() {
    abortRef.current?.abort()
  }

  // Returns { ok, aborted }. `aborted` distinguishes a deliberate cancellation
  // (e.g. startOver) — which should not trigger caller-side error navigation —
  // from a real failure.
  async function getRecipes(items, cuisine) {
    if (items.length === 0) return { ok: false, aborted: true }

    setLoading(true)
    setError(null)
    setRecipes(null)
    setSelectedIndex(0)

    if (demoMode) {
      await wait(1600)
      setRecipes(demoRecipes)
      setSelectedIndex(0)
      setLoading(false)
      return { ok: true, aborted: false }
    }

    const controller = new AbortController()
    let timedOut = false
    abortRef.current?.abort()
    abortRef.current = controller
    const timeoutId = window.setTimeout(() => {
      timedOut = true
      controller.abort()
    }, timeoutMs)

    try {
      const response = await fetch(`${apiUrl}/recipes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: items, cuisine }),
        signal: controller.signal,
      })

      if (!response.ok) {
        throw new Error(await errorMessage(response))
      }

      const data = await response.json()
      setRecipes(data.recipes ?? [])
      setSelectedIndex(0)
      return { ok: true, aborted: false }
    } catch (recipesError) {
      if (timedOut) {
        setError('Recipe generation took too long. Please try again.')
        return { ok: false, aborted: false }
      }
      if (!controller.signal.aborted) {
        setError(`Couldn't generate recipes: ${recipesError.message}`)
        return { ok: false, aborted: false }
      }
      return { ok: false, aborted: true }
    } finally {
      window.clearTimeout(timeoutId)
      if (abortRef.current === controller) abortRef.current = null
      setLoading(false)
    }
  }

  return { recipes, loading, error, selectedIndex, setSelectedIndex, getRecipes, reset, abort }
}
