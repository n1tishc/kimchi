import { useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const CUISINES = [
  ['any', 'Any'],
  ['italian', 'Italian'],
  ['mexican', 'Mexican'],
  ['indian', 'Indian'],
  ['chinese', 'Chinese'],
  ['japanese', 'Japanese'],
  ['thai', 'Thai'],
  ['mediterranean', 'Mediterranean'],
  ['french', 'French'],
  ['korean', 'Korean'],
  ['american', 'American'],
]

export default function App() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [hasScanned, setHasScanned] = useState(false)
  const [items, setItems] = useState([])
  const [draft, setDraft] = useState('')
  const [cuisine, setCuisine] = useState('any')
  const [recipes, setRecipes] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [recipeLoading, setRecipeLoading] = useState(false)
  const [recipeError, setRecipeError] = useState(null)

  function cleanIngredients(values) {
    return [
      ...new Set(
        values
          .map((value) => String(value).trim().toLowerCase())
          .filter(Boolean),
      ),
    ]
  }

  function clearRecipes() {
    setRecipes(null)
    setRecipeError(null)
  }

  function pick(nextFile) {
    if (!nextFile) return

    setFile(nextFile)
    setPreview(URL.createObjectURL(nextFile))
    setHasScanned(false)
    setItems([])
    setDraft('')
    setError(null)
    clearRecipes()
  }

  async function scan() {
    if (!file) return

    setLoading(true)
    setError(null)
    setHasScanned(false)
    setItems([])
    setDraft('')
    clearRecipes()

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
      setItems(cleanIngredients(data.ingredients ?? []))
      setHasScanned(true)
    } catch (scanError) {
      setError(`Couldn't reach the model: ${scanError.message}`)
    } finally {
      setLoading(false)
    }
  }

  function addItem(event) {
    event.preventDefault()
    const value = draft.trim().toLowerCase()

    if (value && !items.includes(value)) {
      setItems([...items, value])
      clearRecipes()
    }

    setDraft('')
  }

  function removeItem(ingredient) {
    setItems(items.filter((item) => item !== ingredient))
    clearRecipes()
  }

  function changeCuisine(nextCuisine) {
    setCuisine(nextCuisine)
    clearRecipes()
  }

  async function getRecipes() {
    if (items.length === 0) return

    setRecipeLoading(true)
    setRecipeError(null)
    setRecipes(null)

    try {
      const response = await fetch(`${API_URL}/recipes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients: items, cuisine, count: 3 }),
      })

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`)
      }

      const data = await response.json()
      setRecipes(data.recipes ?? [])
    } catch (recipesError) {
      setRecipeError(`Couldn't generate recipes: ${recipesError.message}`)
    } finally {
      setRecipeLoading(false)
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

      {hasScanned && (
        <section className="results">
          <h2>
            {items.length} ingredient
            {items.length !== 1 ? 's' : ''} found
          </h2>

          {items.length === 0 ? (
            <p>No ingredients detected — try a clearer photo.</p>
          ) : (
            <ul className="chips">
              {items.map((ingredient) => (
                <li key={ingredient}>
                  <span>{ingredient}</span>
                  <button
                    className="chipRemove"
                    type="button"
                    aria-label={`Remove ${ingredient}`}
                    onClick={() => removeItem(ingredient)}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}

          <form className="ingredientForm" onSubmit={addItem}>
            <input
              type="text"
              value={draft}
              placeholder="Add an ingredient"
              onChange={(event) => setDraft(event.target.value)}
            />
            <button className="button" type="submit">
              Add
            </button>
          </form>

          <div className="recipeControls">
            <label className="field">
              Cuisine
              <select
                value={cuisine}
                onChange={(event) => changeCuisine(event.target.value)}
              >
                {CUISINES.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <button
              className="button primary"
              type="button"
              onClick={getRecipes}
              disabled={items.length === 0 || recipeLoading}
            >
              {recipeLoading ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  Getting recipes...
                </>
              ) : (
                'Get recipes'
              )}
            </button>
          </div>
        </section>
      )}

      {recipeError && <p className="error">{recipeError}</p>}

      {recipes && (
        <section className="recipes">
          {recipes.length === 0 ? (
            <p>No recipes returned.</p>
          ) : (
            recipes.map((recipe, index) => (
              <article className="recipe" key={recipe.name || index}>
                <header>
                  <h3>{recipe.name}</h3>
                  <span>{recipe.time}</span>
                </header>
                {recipe.uses?.length > 0 && (
                  <p className="uses">Uses: {recipe.uses.join(', ')}</p>
                )}
                {recipe.missing?.length > 0 && (
                  <p className="missing">
                    You'll also need: {recipe.missing.join(', ')}
                  </p>
                )}
                {recipe.steps?.length > 0 && (
                  <ol>
                    {recipe.steps.map((step, stepIndex) => (
                      <li key={stepIndex}>{step}</li>
                    ))}
                  </ol>
                )}
              </article>
            ))
          )}
        </section>
      )}
    </main>
  )
}
