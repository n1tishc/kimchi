import { useEffect, useRef, useState } from 'react'
import { errorMessage } from '../lib/api'

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function cleanIngredients(values) {
  return [
    ...new Set(
      values
        .map((value) => String(value).trim().toLowerCase())
        .filter(Boolean),
    ),
  ]
}

export function useScan({ demoMode, demoItems, apiUrl, timeoutMs }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const abortRef = useRef(null)

  useEffect(() => () => abortRef.current?.abort(), [])

  function reset() {
    setError(null)
  }

  function abort() {
    abortRef.current?.abort()
  }

  async function scan(file) {
    if (!file && !demoMode) return null

    setLoading(true)
    setError(null)

    if (demoMode) {
      await wait(1100)
      setLoading(false)
      return cleanIngredients(demoItems)
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
      return cleanIngredients(data.ingredients ?? [])
    } catch (scanError) {
      if (timedOut) {
        setError('The model took too long to respond. Please try again.')
      } else if (!controller.signal.aborted) {
        setError(`Couldn't reach the model: ${scanError.message}`)
      }
      return null
    } finally {
      window.clearTimeout(timeoutId)
      if (abortRef.current === controller) abortRef.current = null
      setLoading(false)
    }
  }

  return { loading, error, scan, reset, abort }
}
