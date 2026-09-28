import styles from './Folio.module.scss';

/**
 * Magazine furniture: the block's number on the page and its intention,
 * "02 Proof". The number is a CSS counter, so page order sets it.
 */
export function Folio({ label, className }: { label: string; className?: string }) {
  return (
    <p className={className ? `${styles.root} ${className}` : styles.root}>
      <span className={styles.number} aria-hidden="true" />
      <span>{label}</span>
    </p>
  );
}
