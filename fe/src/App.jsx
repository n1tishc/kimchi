import { useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function App() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [ingredients, setIngredients] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function pick(nextFile) {
    if (!nextFile) return

    setFile(nextFile)
    setPreview(URL.createObjectURL(nextFile))
    setIngredients(null)
    setError(null)
  }

  async function scan() {
    if (!file) return

    setLoading(true)
    setError(null)
    setIngredients(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`)
      }

      const data = await response.json()
      setIngredients(data.ingredients ?? [])
    } catch (scanError) {
      setError(`Couldn't reach the model: ${scanError.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="app">
      <header className="intro">
        <h1>KimchiTest</h1>
        <p>Photograph your ingredients and let the model read them.</p>
      </header>

      <label className="dropzone">
        {preview ? (
          <img src={preview} alt="selected ingredients" />
        ) : (
          <span>Click to choose a photo</span>
        )}
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={(event) => pick(event.target.files?.[0])}
        />
      </label>

      <div className="actions">
        <label className="button">
          Camera
          <input
            type="file"
            accept="image/*"
            capture="environment"
            hidden
            onChange={(event) => pick(event.target.files?.[0])}
          />
        </label>

        <button
          className="button primary"
          type="button"
          onClick={scan}
          disabled={!file || loading}
        >
          {loading ? (
            <>
              <span className="spinner" aria-hidden="true" />
              Scanning...
            </>
          ) : (
            'Scan ingredients'
          )}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {ingredients && (
        <section className="results">
          <h2>
            {ingredients.length} ingredient
            {ingredients.length !== 1 ? 's' : ''} found
          </h2>

          {ingredients.length === 0 ? (
            <p>No ingredients detected — try a clearer photo.</p>
          ) : (
            <ul className="chips">
              {ingredients.map((ingredient) => (
                <li key={ingredient}>{ingredient}</li>
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  )
}
