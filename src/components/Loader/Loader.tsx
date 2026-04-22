'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { useUiStore } from '@/store/ui';
import { prefersReducedMotion } from '@/lib/motion';
import styles from './Loader.module.scss';

const SESSION_KEY = 'dk:loader-played';

/**
 * Loader — the first-visit cinematic beat (`design.md` §5).
 *
 *   DK appears centred → expands to DIGITAL KNIGHT at monument scale → holds
 *   → a settle handoff flips the page into its steady state as the loader
 *   fades; the wordmark has *already* been owned by the Nav from mount.
 *
 * Notes on choices:
 *  • We never animate the wordmark *from* the loader into the Nav element
 *    (measurement-based FLIP is fragile across route changes and reflow).
 *    Instead the Nav wordmark renders invisibly until `loadingComplete` and
 *    simply fades up with the rest of the UI — the perceived handoff.
 *  • `sessionStorage` skips straight to the settle on revisits: the brand
 *    moment is cinema, not a toll booth.
 *  • Reduced motion resolves to an opacity fade of the hold frame.
 */
export function Loader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dkRef = useRef<HTMLSpanElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const hairlineRef = useRef<HTMLSpanElement>(null);
  const setLoadingComplete = useUiStore((s) => s.setLoadingComplete);

  useEffect(() => {
    const root = rootRef.current;
    const dk = dkRef.current;
    const word = wordRef.current;
    const hairline = hairlineRef.current;
    if (!root || !dk || !word || !hairline) return;

    const reduced = prefersReducedMotion();
    const alreadyPlayed =
      typeof window !== 'undefined' && sessionStorage.getItem(SESSION_KEY) === '1';

    const finish = () => {
      setLoadingComplete(true);
      try {
        sessionStorage.setItem(SESSION_KEY, '1');
      } catch {
        // Private mode / SSR — harmless.
      }
    };

    if (alreadyPlayed || reduced) {
      gsap.set(root, { autoAlpha: 0 });
      finish();
      return;
    }

    // Prevent body scroll while the sequence holds centre-stage.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const tl = gsap.timeline({
      id: 'loader-sequence',
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        document.body.style.overflow = prevOverflow;
        finish();
      },
    });

    gsap.set(dk, { autoAlpha: 0, y: 12 });
    gsap.set(word, { autoAlpha: 0, letterSpacing: '0.6em', y: 8 });
    gsap.set(hairline, { scaleX: 0, transformOrigin: 'left center' });

    tl.to(dk, { autoAlpha: 1, y: 0, duration: 0.55 })
      .to(dk, { autoAlpha: 0, duration: 0.35, delay: 0.35 }, '>')
      .to(
        word,
        {
          autoAlpha: 1,
          y: 0,
          letterSpacing: '0.12em',
          duration: 0.85,
          ease: 'expo.out',
        },
        '<+0.05',
      )
      .to(
        hairline,
        {
          scaleX: 1,
          duration: 0.6,
          ease: 'expo.out',
        },
        '<+0.25',
      )
      .to({}, { duration: 0.45 })
      .to(
        root,
        {
          autoAlpha: 0,
          duration: 0.55,
          ease: 'power2.inOut',
        },
        '>',
      );

    return () => {
      tl.kill();
      document.body.style.overflow = prevOverflow;
    };
  }, [setLoadingComplete]);

  return (
    <div ref={rootRef} className={styles.root} aria-hidden>
      <div className={styles.stage}>
        <span ref={dkRef} className={styles.dk}>
          DK
        </span>
        <span ref={wordRef} className={styles.word}>
          DIGITAL KNIGHT
        </span>
        <span ref={hairlineRef} className={styles.hairline} />
      </div>
    </div>
  );
}
