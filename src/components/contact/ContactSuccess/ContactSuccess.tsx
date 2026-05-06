'use client';

import styles from './ContactSuccess.module.scss';

type ContactSuccessProps = {
  onReset: () => void;
};

export function ContactSuccess({ onReset }: ContactSuccessProps) {
  return (
    <div className={styles.card} role="status" aria-live="polite">
      <span className={styles.rule} aria-hidden />

      <h3 className={styles.heading}>Message sent.</h3>

      <p className={styles.body}>
        We&rsquo;ll be in touch shortly.
      </p>

      <button type="button" onClick={onReset} className={styles.reset}>
        Send another message
      </button>
    </div>
  );
}
