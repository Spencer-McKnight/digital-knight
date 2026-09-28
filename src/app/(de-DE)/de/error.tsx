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
        <h1 className={styles.title}>Diese Seite konnte nicht geladen werden.</h1>
        <ErrorBar>Auf dem Server ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder schreiben Sie an hello@digital-knight.au.</ErrorBar>
        <button type="button" onClick={reset} className={styles.button}>
          Erneut versuchen
        </button>
      </div>
    </section>
  );
}
