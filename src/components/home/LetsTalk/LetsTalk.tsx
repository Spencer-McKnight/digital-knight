import styles from './LetsTalk.module.scss';

/**
 * LetsTalk — the Call beat (`design.md` §9 beat 2).
 *
 *   Framing only: background, hairline, heading. The booking block itself
 *   is being rebuilt from `talk.md` — do not restore the previous draft.
 */
export function LetsTalk() {
  return (
    <section
      id="talk"
      data-ground="stone"
      className={styles.root}
      aria-labelledby="talk-title"
    >
      <div className={styles.inner}>
        <header className={styles.header}>
          <h2 id="talk-title" className={styles.title}>
            Free thirty-minute
            <br />
            <span className={styles.titleEmber}>digital strategy</span> meeting.
          </h2>
        </header>
      </div>
    </section>
  );
}
