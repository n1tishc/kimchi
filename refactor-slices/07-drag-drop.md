# Slice 7: Upload Zone Drag-and-Drop Fix

[← Back to REFACTOR_SPEC.md](../REFACTOR_SPEC.md)

**Goal:** The upload zone says "or drag an image here" but has no drag handlers. Fix it.

## Acceptance criteria

- [ ] Add `onDragOver`, `onDragEnter`, `onDragLeave`, `onDrop` handlers to the dropzone
- [ ] Visual feedback on drag-over: border changes to accent color dashed, background subtly highlights
- [ ] Accepts only image files (`image/*`). Shows error toast/message if non-image is dropped.
- [ ] Dropping a file triggers the same `pick()` logic as the file input `onChange`
- [ ] Works on desktop browsers. Mobile can ignore drag events (they don't apply).
