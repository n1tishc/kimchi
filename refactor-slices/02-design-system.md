# Slice 2: Design System Migration

[← Back to REFACTOR_SPEC.md](../REFACTOR_SPEC.md)

**Goal:** Apply the new design tokens, typography, and visual language from [Section 3 — Target Design Direction](../REFACTOR_SPEC.md#3-target-design-direction) in the main spec.

**Dependencies:** [Slice 1](01-scaffold-tailwind.md) (Tailwind must be set up first).

## Acceptance criteria

- [ ] Replace Google Fonts import: remove DM Sans, Newsreader, DM Mono → add Inter and JetBrains Mono
- [ ] Apply new color palette from Section 3.2 as Tailwind theme values
- [ ] Buttons: 12px border-radius, no hard shadows. Primary = accent red fill. Secondary = border only. Ghost = text only.
- [ ] Cards: 12px border-radius, subtle shadow or 1px border, no hard offset shadow
- [ ] Input fields: 8px border-radius, 1px border, focus ring in accent color
- [ ] Ingredient chips: 20px border-radius (pill shape), accent-wash background for detected, green-wash for pantry, gold-wash for "need to grab"
- [ ] Typography: Inter 700 for all headings. No serif. Body at Inter 400/500. Mono for badges and step numbers only.
- [ ] Remove all uppercase eyebrow labels. Replace with normal-case small bold text.
- [ ] Max-width 1080px. 24px grid gap.
- [ ] All text left-aligned (no centered hero copy)
