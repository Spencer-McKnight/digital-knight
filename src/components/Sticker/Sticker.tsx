import styles from './Sticker.module.scss';

type Tilt = -3 | -2 | -1 | 0 | 1 | 2 | 3;

/**
 * A round signal-yellow vinyl dot pressed onto a picture, one edge lifting.
 * It names the kind of work, never a figure.
 */
export function Sticker({ label, tilt = 2, className }: { label: string; tilt?: Tilt; className?: string }) {
  return (
    <span className={className ? `${styles.root} ${className}` : styles.root} data-tilt={tilt}>
      <span className={styles.face}>{label}</span>
    </span>
  );
}
