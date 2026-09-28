import styles from './NextMark.module.scss';

/**
 * The house arrow ↳, the knight's L. Drawn rather than set, because neither
 * Hubot nor Mona carries the glyph. Every "next move" uses it, nothing else.
 */
export function NextMark({ className }: { className?: string }) {
  return (
    <svg
      className={className ? `${styles.root} ${className}` : styles.root}
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M3.5 1.5V10.5H13M9.5 7L13 10.5L9.5 14" />
    </svg>
  );
}
