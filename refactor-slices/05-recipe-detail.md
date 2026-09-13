# Slice 5: Recipe Detail Redesign

[← Back to REFACTOR_SPEC.md](../REFACTOR_SPEC.md)

**Goal:** Make the recipe view scannable, breathable, and usable in a kitchen.

**Dependencies:** [Slice 2](02-design-system.md) (design tokens).

## Acceptance criteria

- [ ] **Recipe header:** Large title + summary + meta row (servings, time, difficulty as separate badge-style pills with icons)
- [ ] **Ingredients section:** Table-like layout with:
  - Each ingredient on its own row: name (bold), quantity (secondary text), and type badge
  - Type badges get color-coded left borders in addition to the background color (red for detected, green for pantry, gold for extra)
  - Group ingredients by type (Detected first, then Pantry, then Need to grab) with section subheadings
- [ ] **Steps section:** Timeline layout with:
  - Large step numbers (accent color, JetBrains Mono, 1.5rem)
  - Instruction text clearly separated from the "Cook's note" callout
  - Cook's note gets a distinct callout card style (left border + subtle background, icon)
  - Optional "mark as done" checkbox per step (local state only, not persisted)
- [ ] **Equipment:** Horizontal pill list (current style is fine, just ensure it uses new design tokens)
- [ ] **Chef tips:** Callout card with a light background
- [ ] **Level up:** Callout card with gold/amber accent
- [ ] **Spacing:** At least 32px vertical padding between each recipe section
