import styles from './Footer.module.scss';

/**
 * Footer — the Landing beat.
 *
 * Spec — `design.md` §8:
 *  • Stone ground (applied via `ground-invert` mixin at the root)
 *  • locks to the bottom once fully in view — landing, not sticky
 *  • ember hairline mirrors the nav's active-route marker at its top edge
 */
export function Footer() {
  return <footer className={styles.root} />;
}
