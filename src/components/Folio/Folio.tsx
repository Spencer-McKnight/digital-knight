import styles from './Folio.module.scss';

/** Magazine furniture: the block's intention in a word or two, set at meta size. */
export function Folio({ label, className }: { label: string; className?: string }) {
  return <p className={className ? `${styles.root} ${className}` : styles.root}>{label}</p>;
}
