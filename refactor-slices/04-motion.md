# Slice 4: Micro-Interactions + Motion

[← Back to REFACTOR_SPEC.md](../REFACTOR_SPEC.md)

**Goal:** Add delight to the key moments: ingredient detection reveal, phase transitions, recipe appearance.

**Reference:** See [Section 3.5 — Motion principles](../REFACTOR_SPEC.md#35-motion-principles) in the main spec.

**Dependencies:** [Slice 1](01-scaffold-tailwind.md) (component structure) must be done.

## Acceptance criteria

- [ ] Install `framer-motion` (or use CSS-only `@starting-style` + transitions if preferred — agent's choice)
- [ ] **Phase transitions:** When moving between upload → ingredients → recipes, the outgoing view fades out (150ms) and the incoming view fades in with a slight upward slide (200ms, ease-out). Replace the current `settle`/`settleBack` keyframes.
- [ ] **Ingredient chip stagger:** When detection completes (or demo mode resolves), chips animate in one at a time with 60ms stagger. Each chip: `opacity 0→1, scale 0.85→1, translateY 8px→0` over 250ms.
- [ ] **Recipe card entrance:** When recipes load, the three picker cards stagger in (100ms apart) with a subtle scale-up.
- [ ] **Skeleton → content crossfade:** Instead of a hard swap, the skeleton fades out (150ms) and the real content fades in (200ms) with overlap.
- [ ] **Scan button loading state:** Replace the simple spinner with a progress-bar-style animation inside the button (an indeterminate stripe that sweeps left to right).
- [ ] **All motion wrapped in `prefers-reduced-motion` checks** — if reduced motion is preferred, all transitions are instant.
