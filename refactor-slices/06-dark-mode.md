# Slice 6: Dark Mode

[← Back to REFACTOR_SPEC.md](../REFACTOR_SPEC.md)

**Goal:** Add theme toggle with system preference detection.

**Dependencies:** [Slice 2](02-design-system.md) (design tokens, including dark palette in Section 3.2).

## Acceptance criteria

- [ ] `useTheme` hook that:
  - Reads `prefers-color-scheme` media query on mount
  - Stores preference in `localStorage` (key: `kimchi-theme`, values: `light` | `dark` | `system`)
  - Applies a `dark` class to `<html>` element
- [ ] `ThemeToggle` component in the header (sun/moon icon, no text)
- [ ] All design tokens have dark variants via Tailwind `dark:` prefix
- [ ] Dark palette from [Section 3.2](../REFACTOR_SPEC.md#32-design-tokens--departing-from-the-ai-default-cluster) applied:
  - Background: #141414
  - Elevated surfaces: #1E1E1E
  - Text: #E8E8E8
  - Accent: #FF5449 (brighter red for dark backgrounds)
  - Cards: #1E1E1E with 1px border #2D2D2D
- [ ] Test all views in both themes: home, upload, ingredients, recipes, recipe detail, skeleton
- [ ] Respect system preference by default, allow manual override
