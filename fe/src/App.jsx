import { useEffect, useRef, useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const REQUEST_TIMEOUT_MS = 30_000
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
  {
    key: 'upload',
    number: '01',
    label: 'Show & tell',
    title: 'What are we working with?',
    description: 'Give the chef a quick look at today’s ingredients.',
  },
  {
    key: 'ingredients',
    number: '02',
    label: 'Roll call',
    title: 'Let’s make the cast list.',
    description: 'Fix the line-up, then pick a culinary mood.',
  },
  {
    key: 'recipes',
    number: '03',
    label: 'Make magic',
    title: 'Dinner has entered the chat.',
    description: 'Choose a recipe and let the good smells begin.',
  },
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
  const [view, setView] = useState('home')
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
  const previewUrlRef = useRef(null)
  const scanAbortRef = useRef(null)
  const recipesAbortRef = useRef(null)

  useEffect(() => () => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    scanAbortRef.current?.abort()
    recipesAbortRef.current?.abort()
  }, [])

  function goTo(next, dir = 'forward') {
    setView('workflow')
    setDirection(dir)
    setPhase(next)
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function goHome() {
    setView('home')
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
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

  function revokePreview() {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current)
      previewUrlRef.current = null
    }
  }

  function pick(nextFile) {
    if (!nextFile) return

    revokePreview()
    const previewUrl = URL.createObjectURL(nextFile)
    previewUrlRef.current = previewUrl
    setFile(nextFile)
    setPreview(previewUrl)
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

    const controller = new AbortController()
    let timedOut = false
    scanAbortRef.current?.abort()
    scanAbortRef.current = controller
    const timeoutId = window.setTimeout(() => {
      timedOut = true
      controller.abort()
    }, REQUEST_TIMEOUT_MS)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      })

      if (!response.ok) {
        throw new Error(await errorMessage(response))
      }

      const data = await response.json()
      setItems(cleanIngredients(data.ingredients ?? []))
      goTo('ingredients')
    } catch (scanError) {
      if (timedOut) {
        setError("The model took too long to respond. Please try again.")
      } else if (!controller.signal.aborted) {
        setError(`Couldn't reach the model: ${scanError.message}`)
      }
    } finally {
      window.clearTimeout(timeoutId)
      if (scanAbortRef.current === controller) scanAbortRef.current = null
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

    const controller = new AbortController()
    let timedOut = false
    recipesAbortRef.current?.abort()
    recipesAbortRef.current = controller
    const timeoutId = window.setTimeout(() => {
      timedOut = true
      controller.abort()
    }, REQUEST_TIMEOUT_MS)

    try {
      const response = await fetch(`${API_URL}/recipes`, {
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
      setSelectedRecipeIndex(0)
    } catch (recipesError) {
      if (timedOut) {
        setRecipeError("Recipe generation took too long. Please try again.")
        goTo('ingredients', 'back')
      } else if (!controller.signal.aborted) {
        setRecipeError(`Couldn't generate recipes: ${recipesError.message}`)
        // Send the user back to the ingredients screen so they can retry.
        goTo('ingredients', 'back')
      }
    } finally {
      window.clearTimeout(timeoutId)
      if (recipesAbortRef.current === controller) recipesAbortRef.current = null
      setRecipeLoading(false)
    }
  }

  function startOver() {
    scanAbortRef.current?.abort()
    recipesAbortRef.current?.abort()
    revokePreview()
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
  const currentStep = STEPS[activeStep]

  function beginCooking() {
    setView('workflow')
    window.requestAnimationFrame(() => {
      document.querySelector('#workflow')?.focus({ preventScroll: true })
      document.querySelector('#workflow')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  return (
    <div className="page">
      <a className="skipLink" href={view === 'home' ? '#how-it-works' : '#workflow'}>
        Skip to content
      </a>
      <div className="app">
        <header className="masthead">
          <button className="wordmark" type="button" onClick={goHome} aria-label="Kimchi home">
            <span className="wordmarkMark" aria-hidden="true">K</span>
            <span>Kimchi</span>
          </button>
          <div className="mastheadActions">
            {view === 'home' && (
              <a className="textLink" href="#how-it-works">How it works</a>
            )}
            <button className="navButton" type="button" onClick={view === 'home' ? beginCooking : startOver}>
              {view === 'home' ? 'Start cooking' : 'New dish'}
            </button>
          </div>
        </header>

        {view === 'home' ? (
          <main className="home" id="home">
            <section className="hero" aria-labelledby="home-title">
              <div className="heroCopy">
                <p className="eyebrow">Your tiny kitchen co-pilot</p>
                <h1 id="home-title">Dinner, from the things already staring at you.</h1>
                <p className="tagline">A photo in. A real recipe out. No doom-scrolling, no shopping-list guilt.</p>
                <button className="button primary heroButton" type="button" onClick={beginCooking}>
                  Let&apos;s see the fridge <ArrowRightIcon />
                </button>
                <p className="heroFootnote">Takes about a minute. Chef&apos;s promise.</p>
              </div>
              <HomeScanVisual />
            </section>

            <section className="howItWorks" id="how-it-works" aria-labelledby="how-title">
              <div className="sectionLead">
                <p className="eyebrow">The three-act dinner</p>
                <h2 id="how-title">No recipe rabbit hole. Just this.</h2>
              </div>
              <div className="phaseCards">
                {STEPS.map((step) => (
                  <button className={`phaseCard ${step.key}`} type="button" key={step.key} onClick={beginCooking}>
                    <span className="phaseIllustration" aria-hidden="true"><PhaseIllustration phase={step.key} /></span>
                    <span className="phaseNumber">{step.number}</span>
                    <strong>{step.label}</strong>
                    <span>{step.description}</span>
                    <span className="phaseCardArrow" aria-hidden="true"><ArrowRightIcon /></span>
                  </button>
                ))}
              </div>
            </section>

            <section className="homeSignoff">
              <div className="signoffMark" aria-hidden="true">
                <SparkIcon />
              </div>
              <div>
                <p className="eyebrow">Built for “what even is dinner?” nights</p>
                <h2>Less figuring out. More cooking.</h2>
              </div>
              <button className="button" type="button" onClick={beginCooking}>Start with a photo <ArrowRightIcon /></button>
            </section>
          </main>
        ) : (
        <main id="workflow" tabIndex="-1" className="workflow">
          <section className="kitchenStage" aria-labelledby="stage-title">
            <div className="stageCopy">
              <p className="eyebrow">{currentStep.number} · {currentStep.label}</p>
              <h1 id="stage-title">{currentStep.title}</h1>
              <p>{currentStep.description}</p>
            </div>
          </section>
          <nav className="stepper" aria-label="Progress">
            {STEPS.map((step, index) => {
              const state =
                index < activeStep ? 'done' : index === activeStep ? 'active' : 'upcoming'
              return (
                <div className={`step ${state}`} key={step.key}>
                  <span className="stepDot" aria-hidden="true">
                    {state === 'done' ? <CheckIcon /> : step.number}
                  </span>
                  <span className="stepLabel">{step.label}</span>
                  {index < STEPS.length - 1 && <span className="stepLine" aria-hidden="true" />}
                </div>
              )
            })}
          </nav>

          <div className={`phaseWrap ${direction}`} key={phase}>
          {phase === 'upload' && (
            <section className="card uploadCard" aria-label="Upload ingredients">
              <div className="sectionHead">
                  <h2>Show the chef your haul.</h2>
                <p className="sectionSub">
                  Add a clear, well-lit photo and we&apos;ll read what&apos;s on the counter.
                </p>
              </div>

              <div className="uploadWorkspace">
                <label className="dropzone">
                  {preview ? (
                    <img src={preview || '/placeholder.svg'} alt="Selected ingredients" />
                  ) : (
                    <span className="dropzoneEmpty">
                      <span className="dropzoneIcon" aria-hidden="true">
                        <CameraIcon />
                      </span>
                      <span className="dropzoneTitle">Choose a photo</span>
                      <span className="dropzoneHint">or drag an image here</span>
                    </span>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(event) => pick(event.target.files?.[0])}
                  />
                </label>
                <aside className="uploadGuide" aria-label="Photo guidelines">
                  <p className="guideKicker">For a better read</p>
                  <p>Lay ingredients out with a little space between them. Daylight helps.</p>
                  <p>We&apos;ll always let you correct the list before recipes are made.</p>
                </aside>
              </div>

              <div className="actions">
                <label className="button">
                  <UploadIcon />
                  Upload
                  <input
                    type="file"
                    accept="image/*"
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
                    <p className="sectionSub">Keep the good stuff. Cross off the impostors.</p>
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
                        <CloseIcon />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <form className="ingredientForm" onSubmit={addItem}>
                <input
                  type="text"
                  value={draft}
                  aria-label="Add an ingredient"
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
                  <h2>Pick tonight&apos;s plot twist.</h2>
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
        </main>
        )}
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

function HomeScanVisual() {
  return (
    <div className="homeScanVisual" aria-hidden="true">
      <svg viewBox="0 0 360 360" fill="none">
        <rect className="scanPosterShadow" x="66" y="50" width="225" height="260" transform="rotate(8 66 50)" />
        <rect className="scanPoster" x="52" y="40" width="225" height="260" transform="rotate(-5 52 40)" />
        <path className="scanFrame" d="M102 134V99h35m86 0h35v35m0 92v35h-35m-86 0h-35v-35" />
        <circle className="scanLens" cx="180" cy="180" r="52" />
        <path className="scanAperture" d="m180 137 37 21v44l-37 21-37-21v-44l37-21Z" />
        <path className="scanBeam" d="M75 287 145 237M285 76l-70 51" />
        <path className="scanSpark" d="M300 116v25M287 128h25M74 210v20M64 220h20" />
      </svg>
    </div>
  )
}

function PhaseIllustration({ phase }) {
  if (phase === 'upload') {
    return (
      <svg viewBox="0 0 90 70" fill="none">
        <rect x="17" y="11" width="56" height="45" rx="8" />
        <circle cx="45" cy="34" r="12" />
        <path d="m29 11 5-7h22l5 7M22 63h46" />
      </svg>
    )
  }
  if (phase === 'ingredients') {
    return (
      <svg viewBox="0 0 90 70" fill="none">
        <path d="M20 17h50l-5 39H25l-5-39ZM17 17h56M30 9h30" />
        <path d="m32 34 7 7 17-18" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 90 70" fill="none">
      <path d="M20 46c0-21 50-21 50 0v10H20V46Z" />
      <path d="M25 46c5-15 35-15 40 0M32 30c0-12 7-17 13-17s13 5 13 17M45 13V7" />
      <path d="M13 58h64" />
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

function UploadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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

function ArrowRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m9 5 7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

function SparkIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M32 6c2 16 8 23 24 26-16 3-22 10-24 26-2-16-8-23-24-26 16-3 22-10 24-26Z" />
      <path d="M52 10v10M47 15h10M13 46v8M9 50h8" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m7 7 10 10M17 7 7 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}
