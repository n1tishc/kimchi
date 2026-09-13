export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
export const REQUEST_TIMEOUT_MS = 30_000

export async function errorMessage(response) {
  try {
    const data = await response.json()
    return data.detail || `Server returned ${response.status}`
  } catch {
    return `Server returned ${response.status}`
  }
}
