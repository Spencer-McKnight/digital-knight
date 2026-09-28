'use client';

import { useEffect } from 'react';
import styles from './error.module.scss';

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[route error]', error);
    }
  }, [error]);

  return (
    <div className={styles.root}>
      <div className={styles.inner}>
        <p className={styles.eyebrow}>Error</p>
        <h1 className={styles.heading}>
          Broke it.. <em className={styles.ember}>sorry!</em>.
        </h1>
        <p className={styles.note}>
          I&apos;m testing new features — this one slipped through. Email{' '}
          <a href="mailto:hello@digital-knight.au">hello@digital-knight.au</a>
          {' '}and I&apos;ll get you sorted directly.
        </p>
        <button type="button" onClick={reset} className={styles.button}>
          Try again
        </button>
      </div>
    </div>
  );
}
