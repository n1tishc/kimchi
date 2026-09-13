# Slice 1: Scaffold + Component Decomposition + Tailwind

[← Back to REFACTOR_SPEC.md](../REFACTOR_SPEC.md)

**Goal:** Break the monolith. Set up Tailwind. Get the exact same UI rendering from the new file structure.

**Reference:** See [Section 4 — Target Component Architecture](../REFACTOR_SPEC.md#4-target-component-architecture) in the main spec for the full target file tree this slice produces.

## Acceptance criteria

- [ ] `npm install tailwindcss @tailwindcss/vite` and configure `vite.config.js` with `@tailwindcss/vite` plugin
- [ ] Add `@import "tailwindcss"` to `app.css` and configure the custom design tokens in `app.css` using `@theme`
- [ ] Extract all icon components into `icons/` folder
- [ ] Extract constants into `lib/constants.js` and `lib/demo.js`
- [ ] Extract API helpers into `lib/api.js`
- [ ] Extract custom hooks: `useImageUpload`, `useScan`, `useRecipes`
- [ ] Extract UI primitives: `Button`, `Badge`, `Card`, `Chip`, `Spinner`
- [ ] Extract page-level components: `Header`, `Hero`, `HowItWorks`, `Stepper`, `UploadCard`, `IngredientEditor`, `RecipePicker`, `RecipeDetail`, `RecipeSkeleton`
- [ ] All existing functionality works identically (demo mode, scan, recipes, responsive breakpoints)
- [ ] Delete `App.css` — all styles now in Tailwind utility classes or component-level styles
- [ ] Delete all dead CSS (chefGuide, heroVisual, kitchenVisual, counterStillLife, stillBoard, etc.) — see [Section 6 — Files to Delete](../REFACTOR_SPEC.md#6-files-to-delete)
- [ ] `App.jsx` is under 80 lines — just a shell with view toggle and state coordination

**What NOT to change in this slice:** No visual redesign. The UI should look essentially the same (minor differences from Tailwind reset are fine). This is a pure refactor.
