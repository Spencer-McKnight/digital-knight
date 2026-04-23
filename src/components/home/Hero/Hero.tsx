'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { Button } from '@/components/Button';
import { useLoadGate } from '@/hooks/useLoadGate';
import styles from './Hero.module.scss';

// The R3F canvas is client-only and heavyweight — load it off the critical
// path. The section stands up fine for the first paint without it.
const ForgeSeal = dynamic(() => import('./ForgeSeal').then((m) => m.ForgeSeal), {
  ssr: false,
  loading: () => null,
});

/**
 * Hero — the Entry beat (`design.md` §9 beat 1).
 *
 *   Asymmetric layout. The seal holds the right; the promise holds the left.
 *   One monument headline, one ember word ("prevail").
 *
 *   Kinetic treatment (`design.md` §3):
 *   A single word-by-word reveal on the headline, gated by `loadingComplete`.
 *   No compounding — the seal carries its own long-loop elsewhere.
 */
export function Hero() {
  const loaded = useLoadGate();
  const rootRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const ledeRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loaded) return;
    const title = titleRef.current;
    if (!title) return;

    const ctx = gsap.context(() => {
      const words = title.querySelectorAll<HTMLElement>('[data-word]');

      gsap.set(words, { yPercent: 110, opacity: 0 });
      gsap.set([ledeRef.current, actionsRef.current], {
        y: 16,
        opacity: 0,
      });

      const tl = gsap.timeline({
        id: 'hero-entry',
        defaults: { ease: 'expo.out' },
      });

      tl.to(
        words,
        { yPercent: 0, opacity: 1, duration: 1.05, stagger: 0.06 },
        '<+0.05',
      )
        .to(ledeRef.current, { y: 0, opacity: 1, duration: 0.75 }, '-=0.55')
        .to(actionsRef.current, { y: 0, opacity: 1, duration: 0.65 }, '-=0.4');
    }, rootRef);

    return () => ctx.revert();
  }, [loaded]);

  return (
    <section
      ref={rootRef}
      id="top"
      data-ground="page"
      className={styles.root}
      aria-labelledby="hero-title"
    >
      <div className={styles.ground}>
        <ForgeSeal />
      </div>

      <div className={styles.grid}>
        <h1 id="hero-title" ref={titleRef} className={styles.title}>
          Digital Knight
        </h1>

        <p ref={ledeRef} className={styles.lede}>
          Knowledge and strength to create.
          <br />
          Strategic vision that invites the future.
          <br />
          Courage to consider what is right.
        </p>

        <div ref={actionsRef} className={styles.actions}>
          <Button href="/#talk" variant="secondary" size="md">
            Free Digital Consultation
          </Button>
        </div>
      </div>

    </section>
  );
}
