import styles from './LetsTalk.module.scss';

export function LetsTalkSkeleton() {
  return (
    <section data-ground="stone" className={styles.root} aria-hidden>
      <div className={styles.inner} />
    </section>
  );
}
