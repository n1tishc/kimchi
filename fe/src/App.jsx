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

const INGREDIENT_TYPE_LABELS = {
  detected: 'Detected',
  pantry: 'Pantry',
  extra: 'Need to grab',
}

function ingredientType(value) {
  return Object.hasOwn(INGREDIENT_TYPE_LABELS, value) ? value : 'extra'
}

async function errorMessage(response) {
  try {
    const data = await response.json()
    return data.detail || `Server returned ${response.status}`
  } catch {
    return `Server returned ${response.status}`
  }
}

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
  const [selectedRecipeIndex, setSelectedRecipeIndex] = useState(0)

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
    setSelectedRecipeIndex(0)
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
        throw new Error(await errorMessage(response))
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
        body: JSON.stringify({ ingredients: items, cuisine }),
      })

      if (!response.ok) {
        throw new Error(await errorMessage(response))
      }

      const data = await response.json()
      setRecipes(data.recipes ?? [])
      setSelectedRecipeIndex(0)
    } catch (recipesError) {
      setRecipeError(`Couldn't generate recipes: ${recipesError.message}`)
    } finally {
      setRecipeLoading(false)
    }
  }

  const selectedRecipe = recipes?.[selectedRecipeIndex] ?? null

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
            <>
              <div className="recipePicker" aria-label="Choose a recipe">
                {recipes.map((recipe, index) => (
                  <button
                    className={
                      index === selectedRecipeIndex
                        ? 'recipeOption selected'
                        : 'recipeOption'
                    }
                    key={recipe.title || index}
                    type="button"
                    aria-pressed={index === selectedRecipeIndex}
                    onClick={() => setSelectedRecipeIndex(index)}
                  >
                    <span className="rank">#{index + 1}</span>
                    <span className="optionTitle">{recipe.title}</span>
                    <span className="optionSummary">{recipe.summary}</span>
                    <span className="optionMeta">
                      {recipe.total_time_minutes} min · {recipe.difficulty}
                    </span>
                  </button>
                ))}
              </div>

              {selectedRecipe && (
                <article className="recipeDetail">
                  <header>
                    <h2>{selectedRecipe.title}</h2>
                    <p>{selectedRecipe.summary}</p>
                    <div className="metaRow">
                      <span>{selectedRecipe.servings} servings</span>
                      <span>{selectedRecipe.total_time_minutes} min</span>
                      <span>{selectedRecipe.difficulty}</span>
                    </div>
                  </header>

                  {selectedRecipe.ingredients?.length > 0 && (
                    <section className="recipeBlock">
                      <h3>Ingredients</h3>
                      <ul className="recipeIngredients">
                        {selectedRecipe.ingredients.map((ingredient, index) => {
                          const type = ingredientType(ingredient.type)

                          return (
                            <li
                              className={`recipeIngredient ${type}`}
                              key={`${ingredient.item}-${index}`}
                            >
                              <span>
                                <strong>{ingredient.item}</strong>
                                <small>{ingredient.quantity}</small>
                              </span>
                              <span className={`typeBadge ${type}`}>
                                {INGREDIENT_TYPE_LABELS[type]}
                              </span>
                            </li>
                          )
                        })}
                      </ul>
                    </section>
                  )}

                  {selectedRecipe.equipment?.length > 0 && (
                    <section className="recipeBlock">
                      <h3>Equipment</h3>
                      <ul className="compactList">
                        {selectedRecipe.equipment.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {selectedRecipe.steps?.length > 0 && (
                    <section className="recipeBlock">
                      <h3>Steps</h3>
                      <ol className="recipeSteps">
                        {selectedRecipe.steps.map((step, index) => (
                          <li key={step.n || index}>
                            <p>{step.instruction}</p>
                            {step.tip && <span>{step.tip}</span>}
                          </li>
                        ))}
                      </ol>
                    </section>
                  )}

                  {selectedRecipe.chef_tips?.length > 0 && (
                    <section className="recipeBlock">
                      <h3>Chef tips</h3>
                      <ul className="compactList">
                        {selectedRecipe.chef_tips.map((tip) => (
                          <li key={tip}>{tip}</li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {selectedRecipe.level_up && (
                    <p className="levelUp">
                      <strong>Level up:</strong> {selectedRecipe.level_up}
                    </p>
                  )}
                </article>
              )}
            </>
          )}
        </section>
      )}
    </main>
  )
}
