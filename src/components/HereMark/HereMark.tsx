import styles from './HereMark.module.scss';

/**
 * "You are here": a small square pin, the same shape as the market pin.
 * It marks where a visitor stands, never a sequence.
 */
export function HereMark({ className }: { className?: string }) {
  return <span className={className ? `${styles.root} ${className}` : styles.root} aria-hidden="true" />;
}
