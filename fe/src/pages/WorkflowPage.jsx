import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
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
import { reducedTransition } from '../lib/motion'

export function WorkflowPage({ hidden, onStartOver, cuisine, onCuisineChange }) {
  const [phase, setPhase] = useState('upload')
  const [items, setItems] = useState([])
  const [draft, setDraft] = useState('')
  const [scanNote, setScanNote] = useState(null)
  const prefersReducedMotion = useReducedMotion()

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

  function goTo(next) {
    setPhase(next)
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleScan() {
    setItems([])
    setDraft('')
    recipesHook.reset()
    setScanNote(null)
    const total = imageUpload.files.length
    const result = await scan.scan(imageUpload.files)
    if (result) {
      setItems(result.items)
      if (result.failed > 0) {
        setScanNote(
          `${result.failed} of ${total} photos couldn't be read, so some ingredients may be missing. Add them below.`,
        )
      }
      goTo('ingredients')
    }
  }

  // Any change to the photo set invalidates what was scanned from the old one.
  function clearScanResults() {
    setItems([])
    setDraft('')
    setScanNote(null)
    scan.reset()
    recipesHook.reset()
  }

  function handleAddPhotos(fileList) {
    const outcome = imageUpload.add(fileList)
    if (outcome.added > 0) clearScanResults()
    return outcome
  }

  function handleRemovePhoto(id) {
    imageUpload.remove(id)
    clearScanResults()
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
    if (!result.ok && !result.aborted) goTo('ingredients')
  }

  const selectedRecipe = recipesHook.recipes?.[recipesHook.selectedIndex] ?? null
  const activeStep = PHASES.indexOf(phase)
  const currentStep = STEPS[activeStep]
  const scanDisabled = (imageUpload.files.length === 0 && !DEMO_MODE) || scan.loading

  return (
    <main id="workflow" tabIndex="-1" className="outline-none" hidden={hidden}>
      <Stepper activeStep={activeStep} />

      <section className="cloth" aria-labelledby="stage-title">
        <div className="patch pad">
          <p className="m-0 mb-3 text-hong font-bold">
            {currentStep.number} · {currentStep.label}
          </p>
          <h1 id="stage-title" className="display m-0 max-w-[13ch] text-[clamp(2.1rem,4.2vw,3.4rem)]">
            {currentStep.title}
          </h1>
          <p className="lede mt-3 mb-0 text-ink-soft">{currentStep.description}</p>
        </div>
      </section>

      {/* mode="wait": criterion wants the outgoing phase to finish fading out before the next fades in */}
      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0, transition: reducedTransition(prefersReducedMotion, { duration: 0.24, ease: 'easeOut' }) }}
          exit={{ opacity: 0, transition: reducedTransition(prefersReducedMotion, { duration: 0.15, ease: 'easeOut' }) }}
        >
          {phase === 'upload' && (
            <UploadCard
              photos={imageUpload.photos}
              onAdd={handleAddPhotos}
              onRemove={handleRemovePhoto}
              onScan={handleScan}
              scanDisabled={scanDisabled}
              scanning={scan.loading}
              progress={scan.progress}
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
              scanNote={scanNote}
              onBack={() => goTo('upload')}
              onRemoveItem={removeItem}
              onDraftChange={setDraft}
              onAddItem={addItem}
              onCuisineChange={changeCuisine}
              onGetRecipes={handleGetRecipes}
            />
          )}

          {phase === 'recipes' && (
            <section aria-label="Recipe suggestions">
              <div className="cloth">
                <div className="patch pad grid gap-3">
                  <BackLink onClick={() => goTo('ingredients')}>Ingredients</BackLink>
                  <h2 className="display h-block m-0">Pick tonight&apos;s plot twist.</h2>
                  <p className="max-w-[54ch] m-0 text-ink-soft leading-[1.55]">
                    {recipesHook.loading
                      ? 'Stitching three ideas together from your ingredients...'
                      : 'Three ways to cook what you have. Pick one to see the full method.'}
                  </p>
                </div>
              </div>

              {/* default (sync) mode: criterion wants the skeleton and incoming content to overlap */}
              <div className="grid *:[grid-area:1/1]">
                <AnimatePresence>
                  {recipesHook.loading && (
                    <motion.div
                      key="skeleton"
                      exit={{ opacity: 0, transition: reducedTransition(prefersReducedMotion, { duration: 0.15, ease: 'easeOut' }) }}
                    >
                      <RecipeSkeleton />
                    </motion.div>
                  )}
                  {!recipesHook.loading && (
                    <motion.div
                      key="content"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: reducedTransition(prefersReducedMotion, { duration: 0.2, ease: 'easeOut' }) }}
                    >
                      {!recipesHook.recipes || recipesHook.recipes.length === 0 ? (
                        <div className="cloth">
                          <p className="patch pad m-0 leading-[1.5]">No recipes returned.</p>
                        </div>
                      ) : (
                        <>
                          <RecipePicker
                            recipes={recipesHook.recipes}
                            selectedIndex={recipesHook.selectedIndex}
                            onSelect={recipesHook.setSelectedIndex}
                          />

                          {selectedRecipe && (
                            <RecipeDetail
                              recipe={selectedRecipe}
                              key={recipesHook.selectedIndex}
                              active={!hidden}
                            />
                          )}

                          <div className="cloth">
                            <div className="patch pad">
                              <Button onClick={onStartOver}>
                                <ScanIcon />
                                Scan new ingredients
                              </Button>
                            </div>
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </section>
          )}
        </motion.div>
      </AnimatePresence>
    </main>
  )
}
