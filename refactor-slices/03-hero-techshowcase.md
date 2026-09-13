# Slice 3: Hero Redesign + TechShowcase Section

[← Back to REFACTOR_SPEC.md](../REFACTOR_SPEC.md)

**Goal:** Make the landing page prove the ML pipeline and impress technical visitors.

**Dependencies:** [Slice 2](02-design-system.md) (design tokens should be in place first).

## Acceptance criteria

- [x] **Hero section:** Two-column layout.
  - Left: Headline ("Photograph your ingredients. Get real recipes."), subhead ("A fine-tuned vision model detects what's on your counter. An LLM turns it into three cookable recipes."), primary CTA button.
  - Right: Product screenshot/mockup showing the app's 3 phases (upload → detected chips → recipe card). This can be a static composite image, or a CSS-animated sequence cycling through the 3 phases on a 6-second loop. No abstract SVG.
- [x] **TechShowcase section** (below hero): "How it works under the hood"
  - Clean horizontal pipeline diagram: `📸 Photo` → `🔬 SmolVLM2-500M (fine-tuned)` → `🧾 Ingredient List` → `🤖 LLM Recipe Gen` → `🍽️ 3 Ranked Recipes`
  - Stat cards: "82% recall on 51 ingredient classes" / "LoRA fine-tuned SmolVLM2-500M" / "Sub-30s end-to-end"
  - Link to the model card on HuggingFace: `LongGrainRice/kimchi-test`
  - This section can be built as an SVG diagram or HTML/Tailwind layout
- [x] **Remove** the old `HomeScanVisual` SVG (geometric rectangles + hexagon aperture)
- [x] **Keep** the "How it works" phase cards section below TechShowcase, but redesign per [Slice 2](02-design-system.md) styling

### Implementation notes / interpreted calls

- **Static composite, not a 6s loop**: criterion 1 offers either a static composite or a looping CSS animation. Went static: there's no `product-shot.png` asset and no image-generation tool available to make one, so the mockup had to be built from real HTML/Tailwind rather than an image either way; a literal infinite 6-second loop would also conflict with main spec §3.5 ("No infinite loops except the loading spinner"), and the app's existing global `prefers-reduced-motion` rule (`app.css`) clamps `animation-iteration-count` to 1, which would freeze a cycling animation on an arbitrary, possibly illegible frame for reduced-motion users. A static composite showing all three phases at once (upload → ingredients → recipe, stacked with divider arrows inside one app-window-style frame) satisfies "showing the app's 3 phases" without either issue.
- **Mockup uses plain `div`/`span` elements, not the real `Chip`/`Card` components**: the preview lives inside `aria-hidden="true"` (it's decorative, mirroring how `HomeScanVisual` was already `aria-hidden`). `Chip.jsx` renders a real focusable "remove" `<button>` with its own `aria-label`; embedding it here would put an interactive control inside a block screen readers are told to skip. Used styled spans that echo the same tokens (`tomato-wash`/`leaf-wash`/`cobalt-wash`, pill radius) instead.
- **TechShowcase stat cards are plain sans text, not JetBrains Mono**, despite main spec §3.3 listing "technical stats" as a mono use case. This slice draws on [Slice 2](02-design-system.md)'s own narrower, already-implemented typography rule ("Mono for badges and step numbers only") — the same rule that drove de-mono-ing the recipe meta pills in Slice 2's review-fix pass. Kept consistent with that established precedent rather than reopening it here.
- **No new eyebrow copy for TechShowcase**: the criterion specifies the section's own heading text ("How it works under the hood"), the pipeline, the stat cards, and the HF link — nothing else. Rather than inventing supporting microcopy the spec doesn't ask for, the section is just `h2` → pipeline → stats → link.
- **Pipeline diagram switches from horizontal (→) to vertical (↓) at `max-[760px]`** — the same breakpoint used everywhere else in the app — so the 5-node diagram doesn't overflow on tablet/mobile widths.
- **HF link**: built as `https://huggingface.co/LongGrainRice/kimchi-test` from the literal repo id in the criterion, styled `text-cobalt` per §3.2's "blue: link blue only," and opens in a new tab (`target="_blank" rel="noreferrer"`) since it navigates off-site.
- **Hero eyebrow ("Your tiny kitchen co-pilot") and CTA button/caption left unchanged** — not named by this slice's criteria.
- **HowItWorks required no restyling** — it already carries Slice 2's tokens (`rounded-xl`, `shadow-soft`, `border-line`, `tracking-tight`, `gap-6`, de-uppercased eyebrow); the only change needed for criterion 4 was the reorder below.
- **Reordered `HomePage.jsx`**: `Hero` → `TechShowcase` → `HowItWorks` → bottom CTA (was `Hero` → `HowItWorks` → CTA), per "keep phase cards below TechShowcase."

**Verification caveat**: the Chrome browser extension was unavailable again this session (third session running with "Browser extension is not connected"), so this was verified via `npm run build`/`npm run lint`, grepping the built JS bundle to confirm the new copy/HF link compiled in and the old headline is gone, and a dev-server curl of `?demo=1`. As with Slice 2, this is a purely visual slice, so a manual `npm run dev` pass across desktop/tablet/mobile is recommended before merging — specifically to confirm the 5-node pipeline diagram and the hero mockup render as intended at all three breakpoints.
