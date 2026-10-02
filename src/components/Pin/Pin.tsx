/* eslint-disable @next/next/no-img-element -- a small decorative cut-out under live text */
import styles from './Pin.module.scss';

/** A square enamel pin pressed onto a picture, with a word on its face. */
export function Pin({ label, className }: { label: string; className?: string }) {
  return (
    <span className={className ? `${styles.root} ${className}` : styles.root}>
      <img src="/images/objects/pin.webp" alt="" className={styles.face} width={687} height={666} />
      <span className={styles.label}>{label}</span>
    </span>
  );
}
