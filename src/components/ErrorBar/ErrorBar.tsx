import styles from './ErrorBar.module.scss';

/** Errors are neither signal nor red: an inverted bar, a "!" and one plain sentence. */
export function ErrorBar({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={className ? `${styles.root} ${className}` : styles.root} role="alert">
      <span className={styles.glyph} aria-hidden="true">
        !
      </span>
      <span>{children}</span>
    </p>
  );
}
