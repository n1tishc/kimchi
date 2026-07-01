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

const PHASES = ['upload', 'ingredients', 'recipes']
const STEPS = [
  ['upload', 'Scan'],
  ['ingredients', 'Review'],
  ['recipes', 'Cook'],
]

// Demo data lets every screen render for a live walkthrough even if the
// backend is unreachable. Enable with VITE_DEMO=1 or by visiting ?demo=1.
const DEMO_MODE =
  import.meta.env.VITE_DEMO === '1' ||
  (typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).has('demo'))

const DEMO_IMAGE = '/demo-ingredients.png'

const DEMO_ITEMS = ['chicken', 'peppers', 'potatoes', 'tomato']

const DEMO_RECIPES = [
  {
    title: 'Chicken and Pepper Stew with Roasted Potatoes',
    summary:
      'A hearty, comforting stew featuring tender chicken and sweet peppers in a rich tomato sauce, served alongside crispy roasted potatoes.',
    servings: 4,
    total_time_minutes: 75,
    difficulty: 'Medium',
    ingredients: [
      { item: 'chicken thighs, bone-in and skin-on', quantity: '1.5 pounds', type: 'detected' },
      { item: 'bell peppers, sliced', quantity: '2 medium', type: 'detected' },
      { item: 'tomatoes, diced', quantity: '2 cups', type: 'detected' },
      { item: 'potatoes, cut into 1-inch cubes', quantity: '1.5 pounds', type: 'detected' },
      { item: 'onion, chopped', quantity: '1 medium', type: 'extra' },
      { item: 'garlic cloves, minced', quantity: '3 cloves', type: 'extra' },
      { item: 'olive oil', quantity: '3 tablespoons', type: 'pantry' },
      { item: 'chicken broth', quantity: '1 cup', type: 'pantry' },
      { item: 'paprika', quantity: '1 teaspoon', type: 'pantry' },
      { item: 'salt', quantity: 'to taste', type: 'pantry' },
      { item: 'black pepper', quantity: 'to taste', type: 'pantry' },
      { item: 'dried thyme', quantity: '1 teaspoon', type: 'pantry' },
    ],
    equipment: ['oven', 'large skillet', 'baking sheet', 'mixing bowl', 'knife', 'cutting board'],
    steps: [
      {
        n: 1,
        instruction:
          'Preheat oven to 425°F (220°C). Toss potato cubes with 1 tablespoon olive oil, salt, and pepper. Spread on a baking sheet and roast until golden and crispy, about 30-35 minutes.',
        tip: 'Turn potatoes halfway through roasting for even browning.',
      },
      {
        n: 2,
        instruction:
          'While potatoes roast, heat 2 tablespoons olive oil in a large skillet over medium-high heat. Season chicken thighs with salt, pepper, and paprika. Brown chicken skin-side down until deeply golden, about 5-6 minutes per side. Remove and set aside.',
        tip: 'Do not overcrowd the pan to get a good sear on the chicken.',
      },
      {
        n: 3,
        instruction:
          'In the same skillet, add chopped onion and garlic. Sauté until softened and fragrant, about 3 minutes.',
        tip: 'Scrape browned bits from the pan to add flavor.',
      },
      {
        n: 4,
        instruction:
          'Add sliced peppers and cook until slightly softened, about 5 minutes. Stir in diced tomatoes, chicken broth, and thyme. Bring to a simmer.',
        tip: 'Simmer gently to develop flavors without breaking down the peppers too much.',
      },
      {
        n: 5,
        instruction:
          'Return chicken thighs to the skillet, skin side up. Cover and simmer on low heat for 25 minutes, until chicken is cooked through and tender.',
        tip: 'Check internal temperature of chicken reaches 165°F (74°C) for safety.',
      },
      {
        n: 6,
        instruction: 'Serve the chicken and pepper stew hot with roasted potatoes on the side.',
        tip: 'Spoon some stew sauce over the potatoes for extra flavor.',
      },
    ],
    chef_tips: [
      'Use bone-in chicken thighs for more flavor and juiciness.',
      'Roasting potatoes at high heat ensures a crispy exterior and fluffy interior.',
      'Simmering the stew gently allows flavors to meld without overcooking vegetables.',
    ],
    level_up: 'Add a splash of white wine or a pinch of smoked paprika to the stew for deeper complexity.',
  },
  {
    title: 'Grilled Chicken and Pepper Skewers with Tomato Potato Salad',
    summary:
      'A fresh and vibrant meal featuring marinated grilled chicken and peppers on skewers, paired with a tangy tomato and potato salad.',
    servings: 4,
    total_time_minutes: 50,
    difficulty: 'Medium',
    ingredients: [
      { item: 'chicken breast, cubed', quantity: '1.5 pounds', type: 'detected' },
      { item: 'bell peppers, chunked', quantity: '2 large', type: 'detected' },
      { item: 'cherry tomatoes', quantity: '2 cups', type: 'detected' },
      { item: 'baby potatoes', quantity: '1 pound', type: 'detected' },
      { item: 'red onion', quantity: '1 small', type: 'extra' },
      { item: 'lemon', quantity: '1', type: 'extra' },
      { item: 'olive oil', quantity: '4 tablespoons', type: 'pantry' },
      { item: 'oregano', quantity: '1 teaspoon', type: 'pantry' },
    ],
    equipment: ['grill', 'skewers', 'pot', 'mixing bowl'],
    steps: [
      { n: 1, instruction: 'Boil baby potatoes until fork-tender, about 15 minutes, then halve.', tip: 'Salt the water generously.' },
      { n: 2, instruction: 'Marinate cubed chicken and pepper chunks in olive oil, lemon, and oregano for 15 minutes.', tip: '' },
      { n: 3, instruction: 'Thread chicken and peppers onto skewers and grill over medium-high heat, turning, for 12-15 minutes.', tip: 'Grill until lightly charred and cooked through.' },
      { n: 4, instruction: 'Toss potatoes, tomatoes, and red onion with lemon and olive oil. Serve alongside the skewers.', tip: '' },
    ],
    chef_tips: ['Soak wooden skewers so they do not burn.', 'Char the peppers for a smoky note.'],
    level_up: 'Finish the salad with crumbled feta and fresh herbs.',
  },
  {
    title: 'One-Pan Chicken with Tomato Pepper Potato Bake',
    summary:
      'An easy baked dish where chicken, potatoes, peppers, and tomatoes cook together in one pan, resulting in a flavorful, juicy meal with minimal cleanup.',
    servings: 4,
    total_time_minutes: 60,
    difficulty: 'Easy',
    ingredients: [
      { item: 'chicken thighs', quantity: '4 pieces', type: 'detected' },
      { item: 'bell peppers, sliced', quantity: '2 medium', type: 'detected' },
      { item: 'tomatoes, quartered', quantity: '3 medium', type: 'detected' },
      { item: 'potatoes, wedged', quantity: '1.25 pounds', type: 'detected' },
      { item: 'garlic', quantity: '4 cloves', type: 'extra' },
      { item: 'olive oil', quantity: '3 tablespoons', type: 'pantry' },
      { item: 'italian seasoning', quantity: '1 tablespoon', type: 'pantry' },
    ],
    equipment: ['oven', 'sheet pan', 'knife', 'cutting board'],
    steps: [
      { n: 1, instruction: 'Preheat oven to 400°F (205°C). Arrange potatoes, peppers, tomatoes, and garlic on a sheet pan.', tip: '' },
      { n: 2, instruction: 'Nestle chicken thighs among the vegetables. Drizzle with olive oil and season everything.', tip: 'Pat chicken dry for crispier skin.' },
      { n: 3, instruction: 'Roast for 40-45 minutes until chicken is golden and vegetables are tender.', tip: '' },
    ],
    chef_tips: ['Cut potatoes small so they finish with the chicken.'],
    level_up: 'Add olives and a squeeze of lemon in the last 5 minutes.',
  },
]

function ingredientType(value) {
  return Object.hasOwn(INGREDIENT_TYPE_LABELS, value) ? value : 'extra'
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
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
  const [phase, setPhase] = useState('upload')
  const [direction, setDirection] = useState('forward')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(DEMO_MODE ? DEMO_IMAGE : null)
  const [items, setItems] = useState([])
  const [draft, setDraft] = useState('')
  const [cuisine, setCuisine] = useState('any')
  const [recipes, setRecipes] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [recipeLoading, setRecipeLoading] = useState(false)
  const [recipeError, setRecipeError] = useState(null)
  const [selectedRecipeIndex, setSelectedRecipeIndex] = useState(0)

  function goTo(next, dir = 'forward') {
    setDirection(dir)
    setPhase(next)
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
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

  function clearRecipes() {
    setRecipes(null)
    setRecipeError(null)
    setSelectedRecipeIndex(0)
  }

  function pick(nextFile) {
    if (!nextFile) return

    setFile(nextFile)
    setPreview(URL.createObjectURL(nextFile))
    setItems([])
    setDraft('')
    setError(null)
    clearRecipes()
  }

  async function scan() {
    if (!file && !DEMO_MODE) return

    setLoading(true)
    setError(null)
    setItems([])
    setDraft('')
    clearRecipes()

    if (DEMO_MODE) {
      await wait(1100)
      setItems(cleanIngredients(DEMO_ITEMS))
      setLoading(false)
      goTo('ingredients')
      return
    }

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
      goTo('ingredients')
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
    setSelectedRecipeIndex(0)
    // Move to the recipes phase right away so the user sees skeletons instead of a frozen screen.
    goTo('recipes')

    if (DEMO_MODE) {
      await wait(1600)
      setRecipes(DEMO_RECIPES)
      setSelectedRecipeIndex(0)
      setRecipeLoading(false)
      return
    }

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
      // Send the user back to the ingredients screen so they can retry.
      goTo('ingredients', 'back')
    } finally {
      setRecipeLoading(false)
    }
  }

  function startOver() {
    setFile(null)
    setPreview(DEMO_MODE ? DEMO_IMAGE : null)
    setItems([])
    setDraft('')
    setError(null)
    clearRecipes()
    goTo('upload', 'back')
  }

  const selectedRecipe = recipes?.[selectedRecipeIndex] ?? null
  const activeStep = PHASES.indexOf(phase)

  return (
    <div className="page">
      <div className="app">
        <header className="intro">
          <span className="brandMark" aria-hidden="true">
            <LeafIcon />
          </span>
          <div className="introText">
            <p className="eyebrow">AI kitchen assistant</p>
            <h1>KimchiTest</h1>
            <p className="tagline">
              Photograph your ingredients and let the model turn them into recipes you can
              actually cook tonight.
            </p>
          </div>
        </header>

        <nav className="stepper" aria-label="Progress">
          {STEPS.map(([key, label], index) => {
            const state =
              index < activeStep ? 'done' : index === activeStep ? 'active' : 'upcoming'
            return (
              <div className={`step ${state}`} key={key}>
                <span className="stepDot" aria-hidden="true">
                  {state === 'done' ? <CheckIcon /> : index + 1}
                </span>
                <span className="stepLabel">{label}</span>
                {index < STEPS.length - 1 && <span className="stepLine" aria-hidden="true" />}
              </div>
            )
          })}
        </nav>

        <div className={`phaseWrap ${direction}`} key={phase}>
          {phase === 'upload' && (
            <section className="card uploadCard" aria-label="Upload ingredients">
              <div className="sectionHead">
                <h2>Snap your ingredients</h2>
                <p className="sectionSub">
                  Add a clear, well-lit photo and we&apos;ll read what&apos;s on the counter.
                </p>
              </div>

              <label className="dropzone">
                {preview ? (
                  <img src={preview || '/placeholder.svg'} alt="Selected ingredients" />
                ) : (
                  <span className="dropzoneEmpty">
                    <span className="dropzoneIcon" aria-hidden="true">
                      <CameraIcon />
                    </span>
                    <span className="dropzoneTitle">Click to choose a photo</span>
                    <span className="dropzoneHint">or use Camera to take one</span>
                  </span>
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
                  <CameraIcon />
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
                  disabled={(!file && !DEMO_MODE) || loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner" aria-hidden="true" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <ScanIcon />
                      Scan ingredients
                    </>
                  )}
                </button>
              </div>

              {loading && (
                <div className="progressNote" role="status">
                  <span className="progressBar" aria-hidden="true">
                    <span />
                  </span>
                  Reading your photo with the vision model...
                </div>
              )}

              {error && <p className="error">{error}</p>}
            </section>
          )}

          {phase === 'ingredients' && (
            <section className="card results" aria-label="Detected ingredients">
              <div className="sectionHead withBack">
                <button className="backButton" type="button" onClick={() => goTo('upload', 'back')}>
                  <ArrowLeftIcon />
                  Photo
                </button>
                <div>
                  <h2>
                    {items.length} ingredient{items.length !== 1 ? 's' : ''} found
                  </h2>
                  <p className="sectionSub">
                    Remove anything that is off, or add what the camera missed.
                  </p>
                </div>
              </div>

              {items.length === 0 ? (
                <p className="muted">No ingredients detected — try a clearer photo.</p>
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
                  <div className="selectWrap">
                    <select value={cuisine} onChange={(event) => changeCuisine(event.target.value)}>
                      {CUISINES.map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <ChevronIcon />
                  </div>
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

              {recipeError && <p className="error">{recipeError}</p>}
            </section>
          )}

          {phase === 'recipes' && (
            <section className="recipes" aria-label="Recipe suggestions">
              <div className="sectionHead withBack">
                <button
                  className="backButton"
                  type="button"
                  onClick={() => goTo('ingredients', 'back')}
                >
                  <ArrowLeftIcon />
                  Ingredients
                </button>
                <div>
                  <h2>Your recipes</h2>
                  <p className="sectionSub">
                    {recipeLoading
                      ? 'Cooking up three ideas from your ingredients...'
                      : 'Three ways to cook what you have. Pick one to see the full method.'}
                  </p>
                </div>
              </div>

              {recipeLoading ? (
                <RecipeSkeleton />
              ) : !recipes || recipes.length === 0 ? (
                <p className="muted">No recipes returned.</p>
              ) : (
                <>
                  <div className="recipePicker" aria-label="Choose a recipe">
                    {recipes.map((recipe, index) => (
                      <button
                        className={
                          index === selectedRecipeIndex ? 'recipeOption selected' : 'recipeOption'
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
                          <ClockIcon />
                          {recipe.total_time_minutes} min · {recipe.difficulty}
                        </span>
                      </button>
                    ))}
                  </div>

                  {selectedRecipe && (
                    <article className="card recipeDetail" key={selectedRecipeIndex}>
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
                          <ul className="equipmentList">
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

                  <button className="button ghost startOver" type="button" onClick={startOver}>
                    <ScanIcon />
                    Scan new ingredients
                  </button>
                </>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

function RecipeSkeleton() {
  return (
    <div className="recipeSkeleton" role="status" aria-label="Loading recipes">
      <span className="sr-only">Loading recipes…</span>
      <div className="recipePicker" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <div className="recipeOption skeletonCard" key={i}>
            <span className="skelChip skel" />
            <span className="skelLine skelTitle skel" />
            <span className="skelLine skel" />
            <span className="skelLine short skel" />
            <span className="skelLine meta skel" />
          </div>
        ))}
      </div>

      <div className="card recipeDetail skeletonDetail" aria-hidden="true">
        <span className="skelLine skelHeading skel" />
        <span className="skelLine skel" />
        <span className="skelLine short skel" />
        <div className="skelPills">
          <span className="skelPill skel" />
          <span className="skelPill skel" />
          <span className="skelPill skel" />
        </div>
        <span className="skelLine skelSubhead skel" />
        {[0, 1, 2, 3].map((i) => (
          <span className="skelRow skel" key={i} />
        ))}
      </div>
    </div>
  )
}

function LeafIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 20c0-8 6-14 16-14 0 10-6 16-14 16-1 0-2-.2-2-.2S4 21 4 20Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8 18c3-4 6-6 10-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function CameraIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 8.5A2.5 2.5 0 0 1 5.5 6h1.2c.5 0 1-.3 1.3-.8l.6-1A1.5 1.5 0 0 1 10.9 3.5h2.2c.5 0 1 .3 1.3.7l.6 1c.3.5.8.8 1.3.8h1.2A2.5 2.5 0 0 1 21 8.5v8A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-8Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12.5" r="3.2" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  )
}

function ScanIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M4 12h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg className="selectChevron" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ArrowLeftIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m5 13 4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
