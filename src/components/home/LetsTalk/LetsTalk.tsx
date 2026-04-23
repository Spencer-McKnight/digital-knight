import styles from './LetsTalk.module.scss';

/**
 * LetsTalk — the Call beat (`design.md` §9 beat 2).
 *
 *   Framing only: background + hairline. The booking block is being
 *   rebuilt from `talk.md` — do not restore the previous draft.
 */
export function LetsTalk() {
  return (
    <section
      id="talk"
      data-ground="stone"
      className={styles.root}
      aria-label="Call"
    >
      <div className={styles.inner} />
    </section>
  );
}
