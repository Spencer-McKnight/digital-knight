'use client';

import styles from './Loader.module.scss';

/**
 * Loader — the first-visit cinematic beat.
 *
 * Spec — `design.md` §5:
 *   `DK` appears centred → expands to `DIGITAL KNIGHT` at monument scale →
 *   holds → contracts and settles into the top-left nav position → an ember
 *   hairline draws beneath the nav and persists as the active-route marker,
 *   mirrored at the top of the footer.
 *
 * Implementation contract:
 *  • GSAP timeline with id `'loader-sequence'` (stack.md Naming)
 *  • publishes `loadingComplete` to the Zustand store when settled
 *  • session-storage check skips straight to the settle on revisits
 *  • `prefers-reduced-motion` resolves to an opacity-only fallback
 */
export function Loader() {
  return <div className={styles.root} aria-hidden />;
}
