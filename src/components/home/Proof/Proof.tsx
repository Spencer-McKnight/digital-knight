'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import styles from './Proof.module.scss';

/**
 * Proof — beat 2 (`design.md` §9).
 *
 *   One figure that demonstrates the promise. A kinetic pull-quote on Stone,
 *   flanked by a column of tabular "receipts" — the evidence of the studio's
 *   stance rendered as data, not words.
 *
 *   Kinetic rail: a single scroll-linked reveal. No compounding — the quote
 *   opens and the receipts count. That is the whole figure.
 */
const RECEIPTS = [
  { n: '1', label: 'Operator · Designer · Engineer' },
  { n: '12', label: 'Years shipping on the web' },
  { n: '01', label: 'Engagements at a time' },
  { n: '2026', label: 'Year of this build' },
] as const;

export function Proof() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const words = root.querySelectorAll<HTMLElement>('[data-quote-word]');
      const stats = root.querySelectorAll<HTMLElement>('[data-stat]');
      const rule = root.querySelector<HTMLElement>('[data-rule]');

      gsap.set(words, { opacity: 0.08, y: 6 });
      gsap.set(stats, { opacity: 0, y: 16 });
      if (rule) gsap.set(rule, { scaleX: 0, transformOrigin: 'left center' });

      ScrollTrigger.create({
        id: 'proof-entry',
        trigger: root,
        start: 'top 75%',
        end: 'bottom 60%',
        scrub: 0.6,
        animation: gsap.timeline()
          .to(words, { opacity: 1, y: 0, stagger: 0.02, ease: 'power2.out' })
          .to(rule, { scaleX: 1, duration: 0.5, ease: 'power2.out' }, '<')
          .to(stats, { opacity: 1, y: 0, stagger: 0.08, ease: 'power2.out' }, '<+0.1'),
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const quote =
    'A site that should still feel considered in five years is built differently from one that must perform this quarter. We build for the former.';

  return (
    <section ref={rootRef} className={styles.root} aria-labelledby="proof-title">
      <div className={styles.grid}>
        <div className={styles.eyebrowBlock}>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowDot} aria-hidden />
            Proof · 01
          </p>
          <h2 id="proof-title" className={styles.srOnly}>
            The stance
          </h2>
        </div>

        <p className={styles.quote}>
          {quote.split(/\s+/).map((w, i) => (
            <span key={`${w}-${i}`} data-quote-word className={styles.qWord}>
              {w}{' '}
            </span>
          ))}
        </p>

        <span className={styles.rule} data-rule aria-hidden />

        <ul className={styles.receipts}>
          {RECEIPTS.map((r) => (
            <li key={r.label} data-stat className={styles.receipt}>
              <span className={styles.receiptN}>{r.n}</span>
              <span className={styles.receiptLabel}>{r.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
