# Slice 1: Scaffold + Component Decomposition + Tailwind

[← Back to REFACTOR_SPEC.md](../REFACTOR_SPEC.md)

**Goal:** Break the monolith. Set up Tailwind. Get the exact same UI rendering from the new file structure.

**Reference:** See [Section 4 — Target Component Architecture](../REFACTOR_SPEC.md#4-target-component-architecture) in the main spec for the full target file tree this slice produces.

## Acceptance criteria

- [x] `npm install tailwindcss @tailwindcss/vite` and configure `vite.config.js` with `@tailwindcss/vite` plugin
- [x] Add `@import "tailwindcss"` to `app.css` and configure the custom design tokens in `app.css` using `@theme`
- [x] Extract all icon components into `icons/` folder
- [x] Extract constants into `lib/constants.js` and `lib/demo.js`
- [x] Extract API helpers into `lib/api.js`
- [x] Extract custom hooks: `useImageUpload`, `useScan`, `useRecipes`
- [x] Extract UI primitives: `Button`, `Badge`, `Card`, `Chip`, `Spinner`
- [x] Extract page-level components: `Header`, `Hero`, `HowItWorks`, `Stepper`, `UploadCard`, `IngredientEditor`, `RecipePicker`, `RecipeDetail`, `RecipeSkeleton`
- [x] All existing functionality works identically (demo mode, scan, recipes, responsive breakpoints) — verified via `npm run build`/`npm run lint` and inspection of the generated CSS; live browser click-through was not possible in this session (Chrome extension unavailable), so give the demo flow (`?demo=1`) a manual pass before merging
- [x] Delete `App.css` — all styles now in Tailwind utility classes or component-level styles
- [x] Delete all dead CSS (chefGuide, heroVisual, kitchenVisual, counterStillLife, stillBoard, etc.) — see [Section 6 — Files to Delete](../REFACTOR_SPEC.md#6-files-to-delete)
- [x] `App.jsx` is under 80 lines — just a shell with view toggle and state coordination

**What NOT to change in this slice:** No visual redesign. The UI should look essentially the same (minor differences from Tailwind reset are fine). This is a pure refactor.
