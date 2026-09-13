# Slice 5: Recipe Detail Redesign

[← Back to REFACTOR_SPEC.md](../REFACTOR_SPEC.md)

**Goal:** Make the recipe view scannable, breathable, and usable in a kitchen.

**Dependencies:** [Slice 2](02-design-system.md) (design tokens).

## Acceptance criteria

- [x] **Recipe header:** Large title + summary + meta row (servings, time, difficulty as separate badge-style pills with icons)
- [x] **Ingredients section:** Table-like layout with:
  - Each ingredient on its own row: name (bold), quantity (secondary text), and type badge
  - Type badges get color-coded left borders in addition to the background color (red for detected, green for pantry, gold for extra)
  - Group ingredients by type (Detected first, then Pantry, then Need to grab) with section subheadings
- [x] **Steps section:** Timeline layout with:
  - Large step numbers (accent color, JetBrains Mono, 1.5rem)
  - Instruction text clearly separated from the "Cook's note" callout
  - Cook's note gets a distinct callout card style (left border + subtle background, icon)
  - Optional "mark as done" checkbox per step (local state only, not persisted)
- [x] **Equipment:** Horizontal pill list (current style is fine, just ensure it uses new design tokens)
- [x] **Chef tips:** Callout card with a light background
- [x] **Level up:** Callout card with gold/amber accent
- [x] **Spacing:** At least 32px vertical padding between each recipe section

### Implementation notes / interpreted calls

- **New shared `Callout` component** (`fe/src/components/ui/Callout.jsx`) backs all three callout usages (cook's note, chef tips, level up) via a `tone` prop (`leaf` / `neutral` / `gold`) mapping to text/background/border-color classes. The three call sites need the same shape — icon + left border + subtle background — so one component avoids re-deriving the same card styling three times.
- **Chef tips uses the `neutral` tone**, which still carries a (barely-visible, `border-line`-colored) left border for structural consistency with the other two callouts, even though the criterion only asks for "a light background." Not asked for, but not contradicted either — it keeps one visual language across all callouts instead of introducing a fourth, border-less card variant for a single use case.
- **`Badge` gained a left-border variant** (`border-l-[3px]`, one color per ingredient type) and dropped its left corner radius (`rounded-r-[20px]` instead of `rounded-[20px]`) so the border reads as a flat colored edge rather than curving into an arc. `Badge` has exactly one call site (the ingredient list), so this was a safe in-place change rather than a new variant.
- **Ingredients are grouped by iterating a fixed `['detected', 'pantry', 'extra']` order** and filtering the recipe's ingredient list per group, skipping empty groups — rather than assuming the API/demo data is pre-sorted by type. Kept the existing per-row `<ul><li>` markup (already matched "name bold + quantity secondary + badge" before this slice) instead of rebuilding it as a CSS grid or literal `<table>`; the existing structure already reads as a table, and grouping only needed a subheading wrapper around it, not a rewrite.
- **Timeline line is one absolutely-positioned `<span>`** spanning the full `<ol>` height at a fixed left offset, with each step number `<span>` given `bg-surface` (matching the enclosing `Card`) to visually "cut" the line where the number sits — avoids computing a separate line segment per step.
- **Three new icons added** (`ServingsIcon`, `DifficultyIcon`, `NoteIcon`), following the existing baked-in `stroke="currentColor"` pattern used by `ClockIcon`/`CameraIcon`/etc. `NoteIcon` (a small lightbulb) is reused for both the per-step cook's note and the chef-tips callout, since both represent the same "tip" concept; `SparkIcon` (already in the codebase, used on the home page) is reused for the level-up callout instead of adding a fourth icon, since "level up" and "spark" are thematically the same idea.
- **"Mark as done" is local `useState` array of booleans**, sized to `steps.length`, reset for free on recipe switch: `WorkflowPage` already remounts `RecipeDetail` with `key={recipesHook.selectedIndex}` when the selected recipe changes, so no explicit reset logic was needed.
- **`RecipeSkeleton.jsx` was left untouched.** It's a loose shape approximation of the recipe card, not a pixel match, and nothing in this slice's criteria asks for the skeleton to mirror the new layout in detail.

**Verification caveat**: no Chrome browser extension was connected this session either — `list_connected_browsers` returned an empty list, same as Slice 4. Verified via `npm run build`/`npm run lint` (both clean) and a dev-server request to every new/edited file to confirm each transforms without a Vite/esbuild error. This proves the code compiles, not that the timeline line lines up correctly, that the badge left-border/radius combination looks right, or that the callouts read well — please exercise `npm run dev` + `?demo=1` through to a recipe detail view before merging.
