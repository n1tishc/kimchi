# Slice 8: Mobile Cooking Mode

[← Back to REFACTOR_SPEC.md](../REFACTOR_SPEC.md)

**Goal:** On mobile viewports, add a "Start cooking" button on the recipe detail that enters a step-by-step view.

**Dependencies:** [Slice 5](05-recipe-detail.md) (recipe detail redesign).

## Acceptance criteria

- [ ] **Entry:** A sticky "Start cooking" button appears at the bottom of the recipe detail view on screens < 768px
- [ ] **Cooking mode view:** Full-screen overlay with:
  - Current step number and total ("Step 3 of 6")
  - Large instruction text (1.1rem+, high contrast)
  - Cook's note below instruction if present
  - "Previous" / "Next" navigation buttons at the bottom
  - Swipe left/right to advance/go back
  - "Exit" button (X) in top corner returns to the full recipe view
- [ ] **Progress:** A thin progress bar at the top showing how far through the recipe you are
- [ ] **Keep screen awake:** Add `navigator.wakeLock` API request when cooking mode is active (with proper error handling for unsupported browsers)
- [ ] **Step completion:** Tapping the step content (or a checkbox) marks it as done (strikethrough + muted color)
