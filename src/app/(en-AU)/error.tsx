'use client';

import { useEffect } from 'react';
import { ErrorBar } from '@/components/ErrorBar/ErrorBar';
import styles from './error.module.scss';

export default function RouteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') console.error('[route error]', error);
  }, [error]);

  return (
    <section className={styles.root} data-ground="paper">
      <div className={styles.inner}>
        <h1 className={styles.title}>This page did not load.</h1>
        <ErrorBar>Something went wrong on the server. Try again, or email hello@digital-knight.au.</ErrorBar>
        <button type="button" onClick={reset} className={styles.button}>
          Try again
        </button>
      </div>
    </section>
  );
}
