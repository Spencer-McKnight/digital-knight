import styles from './Nav.module.scss';

/**
 * Navigation (top-left wordmark, top-right links).
 *
 * Spec — `design.md` §8:
 *  • transparent over Page, hairline over Stone
 *  • shrinks on scroll-down, restores on scroll-up
 *  • ember hairline marks the active route
 *  • mirrored by an ember hairline at the top of the footer
 *
 * Structure is stubbed intentionally. Interaction, scroll-shrink and the
 * active-route hairline land in a follow-up pass.
 */
export function Nav() {
  return <nav className={styles.root} aria-label="Primary" />;
}
