/**
 * Reduced-motion detection.
 *
 * Reads `prefers-reduced-motion` once on the client and exposes a subscribe
 * helper for stores and components that need to react to runtime changes
 * (users can toggle the OS setting without reloading).
 *
 * The UI store (`store/ui.ts`) owns the canonical `reducedMotion` value —
 * this module is its source of truth.
 */

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

export function onReducedMotionChange(listener: (reduced: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => undefined;

  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  const handler = (event: MediaQueryListEvent) => listener(event.matches);
  mq.addEventListener('change', handler);
  return () => mq.removeEventListener('change', handler);
}
