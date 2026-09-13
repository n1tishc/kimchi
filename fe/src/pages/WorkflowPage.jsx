import { useState } from 'react'
import { ScanIcon } from '../icons/ScanIcon'
import { API_URL, REQUEST_TIMEOUT_MS } from '../lib/api'
import { PHASES, STEPS } from '../lib/constants'
import { DEMO_IMAGE, DEMO_ITEMS, DEMO_MODE, DEMO_RECIPES } from '../lib/demo'
import { useImageUpload } from '../hooks/useImageUpload'
import { useRecipes } from '../hooks/useRecipes'
import { useScan } from '../hooks/useScan'
import { BackLink } from '../components/ui/BackLink'
import { Button } from '../components/ui/Button'
import { IngredientEditor } from '../components/workflow/IngredientEditor'
import { RecipeDetail } from '../components/workflow/RecipeDetail'
import { RecipePicker } from '../components/workflow/RecipePicker'
import { RecipeSkeleton } from '../components/workflow/RecipeSkeleton'
import { Stepper } from '../components/workflow/Stepper'
import { UploadCard } from '../components/workflow/UploadCard'

export function WorkflowPage({ hidden, onStartOver, cuisine, onCuisineChange }) {
  const [phase, setPhase] = useState('upload')
  const [direction, setDirection] = useState('forward')
  const [items, setItems] = useState([])
  const [draft, setDraft] = useState('')

  const imageUpload = useImageUpload({ demoMode: DEMO_MODE, demoImage: DEMO_IMAGE })
  const scan = useScan({
    demoMode: DEMO_MODE,
    demoItems: DEMO_ITEMS,
    apiUrl: API_URL,
    timeoutMs: REQUEST_TIMEOUT_MS,
  })
  const recipesHook = useRecipes({
    demoMode: DEMO_MODE,
    demoRecipes: DEMO_RECIPES,
    apiUrl: API_URL,
    timeoutMs: REQUEST_TIMEOUT_MS,
  })

  function goTo(next, dir = 'forward') {
    setDirection(dir)
    setPhase(next)
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleScan() {
    setItems([])
    setDraft('')
    recipesHook.reset()
    const result = await scan.scan(imageUpload.file)
    if (result) {
      setItems(result)
      goTo('ingredients')
    }
  }

  function handlePick(nextFile) {
    imageUpload.pick(nextFile)
    setItems([])
    setDraft('')
    scan.reset()
    recipesHook.reset()
  }

  function addItem(event) {
    event.preventDefault()
    const value = draft.trim().toLowerCase()

    if (value && !items.includes(value)) {
      setItems([...items, value])
      recipesHook.reset()
    }

    setDraft('')
  }

  function removeItem(ingredient) {
    setItems(items.filter((item) => item !== ingredient))
    recipesHook.reset()
  }

  function changeCuisine(nextCuisine) {
    onCuisineChange(nextCuisine)
    recipesHook.reset()
  }

  async function handleGetRecipes() {
    if (items.length === 0) return
    goTo('recipes')
    const result = await recipesHook.getRecipes(items, cuisine)
    if (!result.ok && !result.aborted) goTo('ingredients', 'back')
  }

  const selectedRecipe = recipesHook.recipes?.[recipesHook.selectedIndex] ?? null
  const activeStep = PHASES.indexOf(phase)
  const currentStep = STEPS[activeStep]
  const scanDisabled = (!imageUpload.file && !DEMO_MODE) || scan.loading

  return (
    <main
      id="workflow"
      tabIndex="-1"
      className="pt-[clamp(32px,6vw,68px)] outline-none"
      hidden={hidden}
    >
      <section
        className="grid items-center min-h-[270px] max-[760px]:min-h-[230px] mb-[26px] px-[clamp(2px,3vw,34px)] overflow-hidden bg-cobalt-wash border border-line shadow-soft"
        aria-labelledby="stage-title"
      >
        <div className="relative z-[2] py-7">
          <p className="mb-3 text-tomato text-[.8rem] font-bold">
            {currentStep.number} · {currentStep.label}
          </p>
          <h1
            id="stage-title"
            className="max-w-[13ch] m-0 font-bold text-[clamp(2.85rem,5vw,4.8rem)] max-[760px]:text-[clamp(2.65rem,10vw,4.15rem)] tracking-[-0.03em] leading-[.84] text-balance"
          >
            {currentStep.title}
          </h1>
          <p className="max-w-[48ch] mt-4 text-ink-soft text-[.94rem] leading-[1.5]">{currentStep.description}</p>
        </div>
      </section>

      <Stepper activeStep={activeStep} />

      <div className={direction === 'back' ? 'animate-settle-back' : 'animate-settle'} key={phase}>
        {phase === 'upload' && (
          <UploadCard
            preview={imageUpload.preview}
            onPick={handlePick}
            onScan={handleScan}
            scanDisabled={scanDisabled}
            scanning={scan.loading}
            error={scan.error}
          />
        )}

        {phase === 'ingredients' && (
          <IngredientEditor
            items={items}
            draft={draft}
            cuisine={cuisine}
            recipeLoading={recipesHook.loading}
            recipeError={recipesHook.error}
            onBack={() => goTo('upload', 'back')}
            onRemoveItem={removeItem}
            onDraftChange={setDraft}
            onAddItem={addItem}
            onCuisineChange={changeCuisine}
            onGetRecipes={handleGetRecipes}
          />
        )}

        {phase === 'recipes' && (
          <section className="grid gap-[18px]" aria-label="Recipe suggestions">
            <div className="grid grid-cols-[auto_minmax(0,1fr)] max-[480px]:grid-cols-1 items-start gap-4 max-[480px]:gap-3 pt-4">
              <BackLink onClick={() => goTo('ingredients', 'back')}>Ingredients</BackLink>
              <div className="min-w-0">
                <h2 className="m-0 font-bold text-[clamp(2.15rem,4vw,3rem)] tracking-[-0.03em] leading-[.95]">
                  Pick tonight&apos;s plot twist.
                </h2>
                <p className="max-w-[54ch] m-0 text-ink-soft text-[.94rem] leading-[1.55]">
                  {recipesHook.loading
                    ? 'Cooking up three ideas from your ingredients...'
                    : 'Three ways to cook what you have. Pick one to see the full method.'}
                </p>
              </div>
            </div>

            {recipesHook.loading ? (
              <RecipeSkeleton />
            ) : !recipesHook.recipes || recipesHook.recipes.length === 0 ? (
              <p className="p-6 bg-surface border border-line text-ink-soft leading-[1.5]">No recipes returned.</p>
            ) : (
              <>
                <RecipePicker
                  recipes={recipesHook.recipes}
                  selectedIndex={recipesHook.selectedIndex}
                  onSelect={recipesHook.setSelectedIndex}
                />

                {selectedRecipe && <RecipeDetail recipe={selectedRecipe} key={recipesHook.selectedIndex} />}

                <Button variant="ghost" className="mt-1" onClick={onStartOver}>
                  <ScanIcon />
                  Scan new ingredients
                </Button>
              </>
            )}
          </section>
        )}
      </div>
    </main>
  )
}
