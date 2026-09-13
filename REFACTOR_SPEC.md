# Kimchi Frontend Refactor Spec

> **Purpose:** This document is the single source of truth for refactoring the Kimchi frontend. It contains the audit findings, the target design direction, a component architecture map, and implementation slices ordered for vertical delivery. An agent can pick up any slice and ship it end-to-end.

> **Live site:** https://kimchi-weld.vercel.app  
> **Repo:** https://github.com/n1tishc/kimchi  
> **Frontend path:** `fe/`  
> **Current stack:** React 19 + Vite 8 + vanilla CSS (single file)  
> **Target stack:** React 19 + Vite 8 + Tailwind CSS v4 + Framer Motion

---

## 1. Current State — What Exists

### 1.1 File structure (entire frontend)

```
fe/src/
  App.jsx      — 1,022 lines. ALL app logic, state, views, icons, skeletons.
  App.css      — 131 dense lines (~3,500 CSS declarations packed single-line).
  main.jsx     — 4 lines. ReactDOM.createRoot entry.
```

### 1.2 App architecture (current)

The app has two top-level views toggled by a `view` state variable:

- **`home`** — Landing page with hero, "how it works" phase cards, signoff CTA.
- **`workflow`** — Three-phase linear flow controlled by a `phase` state variable:
  - `upload` — Image picker + "Scan ingredients" button → POST /predict
  - `ingredients` — Detected ingredient chips + manual add/remove + cuisine picker → POST /recipes
  - `recipes` — Recipe picker (3 cards) + selected recipe detail (full structured view)

### 1.3 What works well (keep these)

- **Demo mode** — `?demo=1` or `VITE_DEMO=1` renders all screens with hardcoded data. Preserve this.
- **Abort controller pattern** — Proper request cancellation with timeout handling. Don't touch.
- **Phase stepper** — The 3-step progress indicator concept is good. Redesign visually, keep the interaction.
- **Ingredient type badges** — "Detected / Pantry / Need to grab" categorization is a genuinely useful UX feature.
- **Skeleton loader** — The recipe loading skeleton with shimmer is well-built. Keep and improve.
- **Accessibility** — Skip link, aria labels, focus-visible outlines, reduced-motion media query. Preserve all of this.

---

## 2. Audit Findings — What's Wrong

### 2.1 Architecture

| # | Problem | Impact |
|---|---------|--------|
| A1 | **God component** — 1,022-line App.jsx contains all state, logic, views, and 12 inline icon components | Signals "built in a hurry" to any engineer reviewing the repo. Impossible to test or iterate on individual views. |
| A2 | **Single CSS file with compressed rules** — 131 lines, but each line contains 5–15 declarations. No comments, no logical grouping, ~40% dead styles. | Unmaintainable. Dead code for a `chefGuide` SVG character, `heroVisual`, `kitchenVisual`, `counterStillLife` scenes that are never rendered in JSX. |
| A3 | **Zero dependencies beyond React** — No animation library, no CSS framework, no component library | Everything is hand-rolled, which is fine for a prototype but means every visual improvement requires writing raw CSS from scratch. |
| A4 | **Client-rendered SPA with empty HTML shell** — Vercel serves a blank `<body>` with no SSR/SSG content | Google sees nothing. First-load shows a blank page before React hydrates. Bad for portfolio discoverability. |

### 2.2 Visual design

| # | Problem | Impact |
|---|---------|--------|
| V1 | **Hero uses abstract SVG placeholder instead of product shot** — `HomeScanVisual` is a geometric pattern (rectangles, hexagon, scan lines) that communicates nothing about the product | Visitor has no idea what the app does until they click "Start cooking." First impression is generic. |
| V2 | **No ML story / technical credibility section** — The landing page reads as a consumer cooking app. Zero mention of the fine-tuned VLM, 82% recall, architecture, or that this is an ML portfolio project. | For a portfolio piece targeting ML Engineer roles, this is the single biggest missed opportunity. A recruiter sees "cute cooking app" not "shipped ML pipeline." |
| V3 | **Design falls in the AI-generated default cluster** — Warm cream background (#fff8ed), DM Sans + Newsreader serif, terracotta accent (#b54225), hard-shadow cards, tracked-out uppercase eyebrows, monospace meta font, `01 / 02 / 03` numbered markers | Matches almost exactly the "AI design tell" described in professional design guidance: cream + serif + terracotta + broadsheet layout. Not distinctive. |
| V4 | **Phase cards are visually identical** — Three boxes with line-art SVG icons, same layout, different tinted backgrounds | Nothing draws the eye or communicates the unique personality of each step. |
| V5 | **Recipe detail is a dense wall of text** — Title → summary → meta pills → ingredients list → equipment → numbered steps → chef tips → level up, all in one scrolling card with no visual breathing room | On mobile (the actual kitchen use case), this is an endless scroll with no way to quickly find a specific step. |
| V6 | **No dark mode** — Single light theme only | Table stakes for 2026. The warm palette would translate beautifully to dark. |

### 2.3 Interaction design

| # | Problem | Impact |
|---|---------|--------|
| I1 | **Phase transitions are a 300ms opacity+translateY fade** — Bare minimum. No celebration, no choreography. | Moving from "scanning" to "ingredients found" should feel like a reveal. Moving to recipes should feel like a payoff. Currently it's a state swap. |
| I2 | **Ingredient chips appear instantly with no stagger** — When detection completes, all chips pop in at once | A staggered reveal (each chip animating in 50ms apart) would sell the "AI just read your photo" moment. |
| I3 | **Skeleton → content transition is a hard swap** — Loading skeleton disappears and real content appears with no crossfade or choreography | Jarring. Should morph or crossfade. |
| I4 | **No mobile cooking mode** — On a phone in a kitchen, you scroll through the full recipe card | Step-by-step mode (one step at a time, large text, tap to advance, persistent timer) would be a standout feature. |
| I5 | **No drag-and-drop on the upload zone** — The `dropzone` label has hover/focus states but no actual drag event handlers | The CSS class is named `dropzone` and the copy says "or drag an image here" but there's no `onDragOver`/`onDrop`. Misleading. |

---

## 3. Target Design Direction

### 3.1 Design brief

Kimchi is a **portfolio project for an ML engineer**. The audience is **technical recruiters, engineering managers, and fellow engineers** visiting from a resume, GitHub, or LinkedIn. The primary job of the frontend is to:

1. **Prove the ML pipeline works** — within 5 seconds of landing, the visitor should understand "this app uses a custom vision model to detect ingredients from a photo."
2. **Look production-grade** — the quality bar is "I would believe a small team shipped this," not "one person hacked this together."
3. **Be memorable** — when someone has reviewed 30 portfolios, they should remember "the cooking app where you take a photo and it makes recipes."

### 3.2 Design tokens — departing from the AI-default cluster

Move away from the cream-paper / terracotta / broadsheet look. New direction: **"kitchen counter at golden hour"** — warmer, bolder, more photographic.

```
/* Base */
--bg:           #FAFAF7;      /* warm white, not yellowed cream */
--bg-elevated:  #FFFFFF;
--bg-sunken:    #F2F0EB;
--ink:          #1A1A1A;      /* true near-black, not brown-black */
--ink-secondary:#6B6B6B;
--ink-tertiary: #9C9C9C;

/* Accent — a richer, more saturated red than terracotta */
--accent:       #D93025;      /* tomato red, confident */
--accent-hover: #B71C1C;
--accent-wash:  #FFEAE8;

/* Supporting */
--green:        #1B7A4A;      /* fresh herb green */
--green-wash:   #E6F4EC;
--gold:         #E8A817;      /* saffron / turmeric gold */
--gold-wash:    #FFF8E1;
--blue:         #1A73E8;      /* link blue only */

/* Dark mode overrides */
--dark-bg:          #141414;
--dark-bg-elevated: #1E1E1E;
--dark-bg-sunken:   #0A0A0A;
--dark-ink:         #E8E8E8;
--dark-ink-secondary:#A0A0A0;
--dark-accent:      #FF5449;
--dark-accent-wash: #2D1515;
```

### 3.3 Typography

Replace DM Sans + Newsreader + DM Mono with a tighter system:

- **Display/Headlines:** `Inter` at weight 700, tight letter-spacing (-0.03em). Clean, modern, confident.
- **Body:** `Inter` at weight 400/500. One family for everything except code.
- **Mono/Meta:** `JetBrains Mono` for ingredient badges, step numbers, technical stats.

> Rationale: Inter is ubiquitous but also genuinely excellent. The goal is to look like a real product, not a design experiment. Serif display text is one of the strongest AI-design tells — drop it.

### 3.4 Layout principles

- **Max content width:** 1080px (down from 1120px). Tighter.
- **No hard-shadow box-shadow.** Use subtle `box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)` or border-only cards.
- **Border radius:** 12px for cards, 8px for inputs/buttons, 20px for pills/badges. Not 0 (brutalist) and not 24px+ (bubbly).
- **Grid:** 12-column fluid grid with 24px gap.
- **Alignment:** Left-aligned text throughout. No centered hero copy.

### 3.5 Motion principles

- **One orchestrated entrance per view transition** — the content entering a new phase gets a staggered reveal.
- **Ingredient chip stagger** — 50ms delay between each chip animating in (scale + opacity).
- **No scroll-triggered animations.** No parallax. No infinite loops except the loading spinner.
- **All motion respects `prefers-reduced-motion`.**

---

## 4. Target Component Architecture

```
fe/src/
├── main.jsx
├── App.jsx                      — Shell: header + view router (home vs workflow)
├── app.css                      — Tailwind @import + any CSS custom properties
│
├── components/
│   ├── layout/
│   │   ├── Header.jsx           — Masthead: wordmark + nav actions
│   │   └── Footer.jsx           — Minimal footer (GitHub link, "Built with SmolVLM2")
│   │
│   ├── home/
│   │   ├── Hero.jsx             — Hero section: copy + product screenshot/animation
│   │   ├── HowItWorks.jsx       — Three-phase cards section
│   │   ├── TechShowcase.jsx     — NEW: ML architecture diagram + stats
│   │   └── Cta.jsx              — Bottom CTA section
│   │
│   ├── workflow/
│   │   ├── Stepper.jsx          — Phase progress indicator
│   │   ├── UploadCard.jsx       — Image picker with real drag-and-drop
│   │   ├── IngredientEditor.jsx — Chip list + add form + cuisine picker
│   │   ├── RecipePicker.jsx     — Three recipe option cards
│   │   ├── RecipeDetail.jsx     — Full recipe view (ingredients, steps, tips)
│   │   ├── RecipeSkeleton.jsx   — Loading skeleton
│   │   └── CookingMode.jsx      — NEW: Step-by-step mobile cooking view
│   │
│   └── ui/
│       ├── Button.jsx           — Shared button component (variants: primary, secondary, ghost)
│       ├── Badge.jsx            — Ingredient type badge
│       ├── Card.jsx             — Base card wrapper
│       ├── Chip.jsx             — Ingredient chip with remove
│       ├── Select.jsx           — Styled select dropdown
│       ├── Spinner.jsx          — Loading spinner
│       └── ThemeToggle.jsx      — Dark mode toggle
│
├── icons/                       — One file per icon, all named exports
│   ├── CameraIcon.jsx
│   ├── UploadIcon.jsx
│   ├── ScanIcon.jsx
│   ├── ClockIcon.jsx
│   ├── ChevronIcon.jsx
│   ├── ArrowLeftIcon.jsx
│   ├── ArrowRightIcon.jsx
│   ├── CheckIcon.jsx
│   ├── SparkIcon.jsx
│   └── CloseIcon.jsx
│
├── hooks/
│   ├── useImageUpload.js        — File pick + drag-drop + preview URL lifecycle
│   ├── useScan.js               — POST /predict with abort + timeout + demo mode
│   ├── useRecipes.js            — POST /recipes with abort + timeout + demo mode
│   └── useTheme.js              — Dark mode state + system preference detection
│
├── lib/
│   ├── api.js                   — API_URL, fetch wrappers, errorMessage helper
│   ├── constants.js             — CUISINES, INGREDIENT_TYPE_LABELS, PHASES, STEPS
│   └── demo.js                  — DEMO_MODE flag, DEMO_IMAGE, DEMO_ITEMS, DEMO_RECIPES
│
└── assets/
    └── product-shot.png         — Screenshot of the app in action (for hero)
```

### 4.1 State management

No external state library. Use React context for theme only. All workflow state stays in the top-level `App.jsx` (or a `WorkflowPage.jsx`) and is passed down as props. The custom hooks (`useScan`, `useRecipes`, `useImageUpload`) encapsulate the async logic and return `{ data, loading, error, execute, abort }` tuples.

### 4.2 Routing

No React Router. Keep the current `view` state approach (`home` | `workflow`). The app is a single flow, not a multi-page site. This avoids a dependency and keeps the URL clean.

---

## 5. Implementation Slices

Each slice is a **shippable vertical increment** — it can be merged and deployed independently. They are ordered by priority and dependency. Each slice's full acceptance criteria live in its own file, linked below.

| Slice | Goal | Depends on |
|---|---|---|
| [1. Scaffold + Component Decomposition + Tailwind](refactor-slices/01-scaffold-tailwind.md) | Break the monolith, set up Tailwind, same UI from the new file structure | — |
| [2. Design System Migration](refactor-slices/02-design-system.md) | Apply new design tokens, typography, and visual language | Slice 1 |
| [3. Hero Redesign + TechShowcase Section](refactor-slices/03-hero-techshowcase.md) | Make the landing page prove the ML pipeline | Slice 2 |
| [4. Micro-Interactions + Motion](refactor-slices/04-motion.md) | Add delight to detection reveal, phase transitions, recipe appearance | Slice 1 |
| [5. Recipe Detail Redesign](refactor-slices/05-recipe-detail.md) | Make the recipe view scannable, breathable, kitchen-usable | Slice 2 |
| [6. Dark Mode](refactor-slices/06-dark-mode.md) | Theme toggle with system preference detection | Slice 2 |
| [7. Upload Zone Drag-and-Drop Fix](refactor-slices/07-drag-drop.md) | Wire up the drag handlers the copy already promises | — |
| [8. Mobile Cooking Mode](refactor-slices/08-cooking-mode.md) | Step-by-step full-screen cooking view on mobile | Slice 5 |

---

## 6. Files to Delete

After all slices are complete, these files should no longer exist:

- `fe/src/App.css` — replaced by Tailwind utilities
- All dead CSS class references: `.chefGuide`, `.chefShadow`, `.chefCounter`, `.chefCounterEdge`, `.chefBody`, `.chefSleeve`, `.chefApron`, `.chefApronLine`, `.chefMouth`, `.chefHatLine`, `.chefSteam`, `.chefNeck`, `.chefFace`, `.chefEar`, `.chefHand`, `.chefHair`, `.chefHat`, `.chefEye`, `.chefProp`, `.chefCamera`, `.chefSpoon`, `.chefPan`, `.chefSparkles`, `.chefArm`, `.heroVisual`, `.heroSun`, `.counterScribble`, `.kitchenVisual`, `.counterScene`, `.counterStillLife`, `.stillBoard`, `.stillBoardLine`, `.stillTomato`, `.stillLeaf`, `.stillLemon`, `.stillLemonLine`, `.stillCucumberDots`, `.stillOnionLine`, `.stillSpark`, `.stillCucumber`, `.stillOnion`, `.stillPaperShadow`, `.stillPaper`, `.stillPhoto`, `.stillFrame`, `.stillAperture`, `.stillLens`, `.stillTag`, `.stillRecipeLine`, `.stillRecipeTitle`

---

## 7. Non-Goals / Explicit Scope Boundaries

- **No SSR/SSG migration.** We're not moving to Next.js or Astro. The SPA on Vercel is fine.
- **No backend changes.** The FastAPI server and model are out of scope.
- **No new features beyond what's listed.** No user accounts, no saving recipes, no sharing.
- **No React Router.** Keep the `view` state pattern.
- **No external state management library.** React state + context for theme is enough.
- **Demo mode must keep working.** `?demo=1` must render all phases with hardcoded data at every point during the refactor.

---

## 8. Testing Checklist (per slice)

After completing any slice, verify:

- [ ] `npm run build` succeeds with zero errors
- [ ] `npm run dev` renders the app correctly
- [ ] Demo mode (`?demo=1`) works end-to-end: home → upload → scan → ingredients → recipes → recipe detail
- [ ] All three responsive breakpoints render correctly: desktop (1200px+), tablet (760px), mobile (480px)
- [ ] Keyboard navigation works: Tab through all interactive elements, Enter/Space activates buttons
- [ ] `prefers-reduced-motion` is respected (no animations when enabled)
- [ ] No console errors or warnings
- [ ] Lighthouse accessibility score ≥ 90
