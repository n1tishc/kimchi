# Slice 2: Design System Migration

[← Back to REFACTOR_SPEC.md](../REFACTOR_SPEC.md)

**Goal:** Apply the new design tokens, typography, and visual language from [Section 3 — Target Design Direction](../REFACTOR_SPEC.md#3-target-design-direction) in the main spec.

**Dependencies:** [Slice 1](01-scaffold-tailwind.md) (Tailwind must be set up first).

## Acceptance criteria

- [x] Replace Google Fonts import: remove DM Sans, Newsreader, DM Mono → add Inter and JetBrains Mono
- [x] Apply new color palette from Section 3.2 as Tailwind theme values
- [x] Buttons: 12px border-radius, no hard shadows. Primary = accent red fill. Secondary = border only. Ghost = text only.
- [x] Cards: 12px border-radius, subtle shadow or 1px border, no hard offset shadow
- [x] Input fields: 8px border-radius, 1px border, focus ring in accent color
- [x] Ingredient chips: 20px border-radius (pill shape), accent-wash background for detected, green-wash for pantry, gold-wash for "need to grab"
- [x] Typography: Inter 700 for all headings. No serif. Body at Inter 400/500. Mono for badges and step numbers only.
- [x] Remove all uppercase eyebrow labels. Replace with normal-case small bold text.
- [x] Max-width 1080px. 24px grid gap.
- [x] All text left-aligned (no centered hero copy)

### Implementation notes / interpreted calls

- **Button radius conflict**: this slice's criterion says 12px; main spec §3.4 says "8px for inputs/buttons." Went with this slice's 12px for buttons (`rounded-xl`) and reserved 8px (`rounded-lg`) for inputs, since a slice's own acceptance criteria are the operative spec for that slice.
- **"Ingredient chips" mapped to two components**: `Badge.jsx` (the per-ingredient Detected/Pantry/Need-to-grab tag in the recipe view) got the literal three-way wash mapping (`tomato-wash`/`leaf-wash`/`gold-wash`) plus pill radius. `Chip.jsx` (the removable tag in the ingredient-editing step) carries no type data from the scan API, so it was given a single `tomato-wash` (accent) fill + pill radius, on the reasoning that everything in that list is, definitionally, a freshly-detected ingredient.
- **Kept a distinct `danger` token** (`#C0392B`/wash) rather than collapsing error state into the `tomato` accent — §3.2 doesn't define a separate error color, but reusing the brand accent for both the primary CTA and form errors would make them visually indistinguishable.
- **Kept a derived `line` token** (`#E4E1D9`) for 1px borders — §3.2 has no border color, and `ink-tertiary` (#9C9C9C) is too dark for a hairline.
- **Focus rings**: scoped the new accent (tomato) ring to actual form controls only (ingredient text input, cuisine select, the upload dropzone's file input) per criterion 5. Buttons, links, and chip/back-link controls keep the blue (`cobalt`) ring, since §3.2 marks blue as "link blue only" and criterion 5 only calls out input fields.
- **24px grid gap** applied to the repeating card grids (`HowItWorks` phase cards, `RecipePicker` recipe cards, `Hero`'s two-column layout) rather than sitewide — intra-component spacing (chip lists, form grids, the stepper) was left alone since forcing 24px there would visibly break those layouts.
- **Left-aligned text** was already true of the existing copy; no change needed beyond leaving the upload dropzone's icon+label stack centered (that's a centered icon widget, not hero/heading copy).
- **Radius scope**: 12px/8px/pill radii were applied only to things the criteria name (buttons, cards, inputs, chips/badges). Decorative boxes not covered by any bullet (the upload dropzone shell, the hero SVG frame) were left square-cornered rather than rounded-ified by inference.

### Review-driven fixes

A two-axis code review against this slice's own criteria (not just the interpreted calls above) caught two real gaps in the first pass, both fixed:

- **Mono/uppercase leftovers**: this slice's own typography criterion says "Mono for badges and step numbers only" — stricter than main spec §3.3's broader "badges, step numbers, technical stats." The first pass missed several non-badge, non-step-number spots still carrying `font-mono`/`uppercase`: the ingredient-editor's "Cuisine" label, the recipe meta pills (servings/time/difficulty), the "Level up:" inline label, and two plain captions (`RecipePicker`'s time/difficulty line, `Hero`'s "Takes about a minute" line). All converted to plain sans body text. Left as mono: `Badge.jsx`, the `Stepper`'s step numbers, `HowItWorks`'s phase numbers, and `RecipePicker`'s `#1/#2/#3` index marker (a numeric index in the same spirit as a step number).
- **Repeated tracking value**: the new `-0.03em` heading tracking (§3.3) had landed as a raw arbitrary Tailwind value (`tracking-[-0.03em]`) repeated verbatim across 8 files instead of as a token — flagged as Primitive Obsession. Extracted into `--tracking-tight: -0.03em` in `app.css`'s `@theme` (overriding Tailwind's default `tracking-tight` value), and every site now uses the plain `tracking-tight` utility.

Left unfixed (judgement call, not urgent): `HowItWorks`'s and `RecipePicker`'s hover-lift treatment (`hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(0,0,0,.1)]`) converged to the same value across those two files. Only 2 occurrences — a `<Card as="button">` composition would be the natural fix, but that's a component-structure change beyond this token-migration slice.

**Verification caveat**: the Chrome browser extension was unavailable again this session ("Browser extension is not connected"), so this was verified via `npm run build`/`npm run lint`, and by grepping the generated CSS bundle to confirm the new fonts (Inter, JetBrains Mono) and hex values actually compiled in — not by an actual rendered/visual pass. Since this slice is purely visual, that's a materially weaker verification than usual. Please do a manual pass with `npm run dev` + `?demo=1` across desktop/tablet/mobile before merging.
