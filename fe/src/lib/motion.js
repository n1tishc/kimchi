// Zeroes out duration/delay when the user prefers reduced motion, so every
// Framer Motion transition collapses to instant instead of just disappearing.
export function reducedTransition(prefersReducedMotion, transition) {
  return prefersReducedMotion ? { ...transition, duration: 0, delay: 0 } : transition
}
