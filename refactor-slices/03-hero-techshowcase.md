# Slice 3: Hero Redesign + TechShowcase Section

[← Back to REFACTOR_SPEC.md](../REFACTOR_SPEC.md)

**Goal:** Make the landing page prove the ML pipeline and impress technical visitors.

**Dependencies:** [Slice 2](02-design-system.md) (design tokens should be in place first).

## Acceptance criteria

- [ ] **Hero section:** Two-column layout.
  - Left: Headline ("Photograph your ingredients. Get real recipes."), subhead ("A fine-tuned vision model detects what's on your counter. An LLM turns it into three cookable recipes."), primary CTA button.
  - Right: Product screenshot/mockup showing the app's 3 phases (upload → detected chips → recipe card). This can be a static composite image, or a CSS-animated sequence cycling through the 3 phases on a 6-second loop. No abstract SVG.
- [ ] **TechShowcase section** (below hero): "How it works under the hood"
  - Clean horizontal pipeline diagram: `📸 Photo` → `🔬 SmolVLM2-500M (fine-tuned)` → `🧾 Ingredient List` → `🤖 LLM Recipe Gen` → `🍽️ 3 Ranked Recipes`
  - Stat cards: "82% recall on 51 ingredient classes" / "LoRA fine-tuned SmolVLM2-500M" / "Sub-30s end-to-end"
  - Link to the model card on HuggingFace: `LongGrainRice/kimchi-test`
  - This section can be built as an SVG diagram or HTML/Tailwind layout
- [ ] **Remove** the old `HomeScanVisual` SVG (geometric rectangles + hexagon aperture)
- [ ] **Keep** the "How it works" phase cards section below TechShowcase, but redesign per [Slice 2](02-design-system.md) styling
