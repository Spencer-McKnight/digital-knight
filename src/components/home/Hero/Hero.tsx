'use client';

import dynamic from 'next/dynamic';
import { Button } from '@/components/Button';
import styles from './Hero.module.scss';

// The R3F canvas is client-only and heavyweight — load it off the critical
// path. The section stands up fine for the first paint without it.
const ForgeSeal = dynamic(() => import('./ForgeSeal').then((m) => m.ForgeSeal), {
  ssr: false,
  loading: () => null,
});

export function Hero() {
  return (
    <section
      id="top"
      data-ground="page"
      className={styles.root}
      aria-labelledby="hero-title"
    >
      <div className={styles.ground}>
        <ForgeSeal />
      </div>

      <div className={styles.grid}>
        <h1 id="hero-title" className={styles.title}>
          Digital Knight
        </h1>

        <p className={styles.lede}>
          Knowledge and strength to create.
          <br />
          Strategic vision that invites the future.
          <br />
          Courage to consider what is right.
        </p>

        <div className={styles.actions}>
          <Button href="/#talk" variant="secondary" size="md">
            Free Strategy Consult
          </Button>
        </div>
      </div>

    </section>
  );
}
