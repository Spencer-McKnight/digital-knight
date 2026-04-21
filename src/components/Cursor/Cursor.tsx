'use client';

import styles from './Cursor.module.scss';

/**
 * Custom cursor.
 *
 * Spec — `design.md` §6:
 *   Small iron ring on pointer-fine devices. Fills ember over interactables.
 *   Touch devices keep the native cursor — this component mounts nothing
 *   there.
 *
 * Implementation contract:
 *  • pointer position updated via rAF-batched `gsap.quickTo` for <1ms lag
 *  • `cursorVariant` read from the Zustand store; maps to data-attribute
 *    on the root so CSS handles the visual transition
 *  • `matchMedia('(pointer: fine)')` gates mount
 */
export function Cursor() {
  return <div className={styles.root} aria-hidden />;
}
