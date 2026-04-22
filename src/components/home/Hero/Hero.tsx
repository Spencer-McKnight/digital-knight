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

const IDEALS = ['Strategy', 'Courage', 'Vision', 'Strength'] as const;

/**
 * Hero — the Entry beat (`design.md` §9 beat 1).
 *
 *   Asymmetric layout. The seal holds the right; the promise holds the left.
 *   One monument headline, one ember word ("prevail"). The four ideals run a
 *   quiet meta-caption beneath, each letterform a token of its own.
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
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const idealsRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!loaded) return;
    const title = titleRef.current;
    if (!title) return;

    const ctx = gsap.context(() => {
      const words = title.querySelectorAll<HTMLElement>('[data-word]');

      gsap.set(words, { yPercent: 110, opacity: 0 });
      gsap.set([eyebrowRef.current, ledeRef.current, actionsRef.current, idealsRef.current], {
        y: 16,
        opacity: 0,
      });

      const tl = gsap.timeline({
        id: 'hero-entry',
        defaults: { ease: 'expo.out' },
      });

      tl.to(eyebrowRef.current, { y: 0, opacity: 1, duration: 0.7 })
        .to(
          words,
          { yPercent: 0, opacity: 1, duration: 1.05, stagger: 0.06 },
          '<+0.05',
        )
        .to(ledeRef.current, { y: 0, opacity: 1, duration: 0.75 }, '-=0.55')
        .to(actionsRef.current, { y: 0, opacity: 1, duration: 0.65 }, '-=0.4')
        .to(idealsRef.current, { y: 0, opacity: 1, duration: 0.65 }, '-=0.45');
    }, rootRef);

    return () => ctx.revert();
  }, [loaded]);

  return (
    <section ref={rootRef} id="top" className={styles.root} aria-labelledby="hero-title">
      <div className={styles.ground}>
        <ForgeSeal />
      </div>

      <div className={styles.grid}>
        <p ref={eyebrowRef} className={styles.eyebrow}>
          <span className={styles.eyebrowDot} aria-hidden />
          Digital Knight <span className={styles.eyebrowSlash}>/</span> independent studio
        </p>

        <h1 id="hero-title" ref={titleRef} className={styles.title}>
          {['Digital', 'work,'].map((w, i) => (
            <span key={`a-${i}`} className={styles.line}>
              <span data-word className={styles.word}>
                {w}
              </span>{' '}
            </span>
          ))}
          <span className={styles.line}>
            <span data-word className={styles.word}>
              forged
            </span>{' '}
            <span data-word className={styles.word}>
              to
            </span>{' '}
            <span data-word className={styles.wordEmber}>
              prevail
            </span>
            <span className={styles.stop}>.</span>
          </span>
        </h1>

        <p ref={ledeRef} className={styles.lede}>
          Strategy that cuts through. Design that holds up. Code that outlasts the trend
          cycle. A one-desk studio for businesses that intend to be here in a decade.
        </p>

        <div ref={actionsRef} className={styles.actions}>
          <Button href="/#talk" variant="primary" size="lg">
            Book a strategy call
          </Button>
          <Button href="/#services" variant="ghost">
            See the work
          </Button>
        </div>
      </div>

      <ul ref={idealsRef} className={styles.ideals} aria-label="Guiding ideals">
        {IDEALS.map((ideal, i) => (
          <li key={ideal} className={styles.ideal}>
            <span className={styles.idealIndex}>{String(i + 1).padStart(2, '0')}</span>
            <span className={styles.idealLabel}>{ideal}</span>
          </li>
        ))}
      </ul>

      <p className={styles.scrollHint} aria-hidden>
        Scroll <span className={styles.scrollRule} />
      </p>
    </section>
  );
}
