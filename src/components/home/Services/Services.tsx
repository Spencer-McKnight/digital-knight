'use client';

import { useCallback, useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { SERVICES } from './content';
import styles from './Services.module.scss';

/**
 * Services — Systematic Partnership (`services.md`).
 *
 *   Four monuments — Listen, Ideate, Create, Evolve — stacked as a
 *   portfolio assembly. As the reader scrolls, each phase slides up from
 *   below and pins at its slot: monument first, content beneath it. The
 *   next phase pins at the next slot down, visually burying the prior
 *   phase's content behind its own opaque [monument + content] pair.
 *   All prior monuments remain visible in the top-left stack.
 *
 *   Sticky-stack mechanics (pure CSS, see Services.module.scss)
 *   -----------------------------------------------------------
 *   Every `.phase` is `position: sticky` inside a single parent `.phases`:
 *
 *     .phase[i] { top: calc(nav + i * slot); z-index: 1 + i; background: page; }
 *
 *   - `.phases` is the shared sticky boundary, so every phase can remain
 *     stuck simultaneously for the full section height.
 *   - `top` increases with index, placing each monument one slot lower
 *     than the previous one — that's the vertical stack.
 *   - `z-index` increases with index, so later phases paint over earlier
 *     ones. With each phase's `background: var(--ink-page)`, the later
 *     phase's opaque pair covers the prior phase's content.
 *   - The phase's `min-height` determines scroll-length-before-handover.
 *     Kept tight (just over one slot of slack) so the next card arrives
 *     early — per the brief, we want pace, not scrub.
 *
 *   Animations (GSAP)
 *   -----------------
 *   Reveal is reversible by design: `toggleActions` on ScrollTrigger
 *   replays on enter, rewinds on leave-back. No `once: true`. Scroll up
 *   restores the rested state. `prefers-reduced-motion` collapses the
 *   rails to instant opacity fades.
 *
 *   Click-to-scroll
 *   ---------------
 *   Each monument is a button that scrolls the page to the point where
 *   its phase begins pinning — i.e., the natural top of the phase minus
 *   the slot-adjusted nav offset. Feels like opening a drawer: the phase
 *   lands in its slot with its content fully visible.
 */

export function Services() {
  const rootRef = useRef<HTMLElement | null>(null);
  const phasesRef = useRef<HTMLOListElement | null>(null);

  const scrollToPhase = useCallback((index: number) => {
    const phases = phasesRef.current?.querySelectorAll<HTMLElement>(`.${styles.phase}`);
    const phase = phases?.[index];
    if (!phase) return;

    // Land scroll at the point where the phase's natural top hits its
    // sticky pin line. `getComputedStyle(phase).top` resolves the
    // `calc(nav + i * slot)` to a px value, so we don't have to
    // re-compute the calc in JS.
    const pinLine = parseFloat(getComputedStyle(phase).top) || 0;
    const top = phase.getBoundingClientRect().top + window.scrollY - pinLine - 1;

    window.scrollTo({ top, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const phases = gsap.utils.toArray<HTMLElement>(`.${styles.phase}`);

      phases.forEach((phase) => {
        const content = phase.querySelector<HTMLElement>(`.${styles.contentInner}`);
        const monument = phase.querySelector<HTMLElement>(`.${styles.monument}`);
        if (!content || !monument) return;

        // Entry reveal. Reversible by design — `toggleActions: play none
        // none reverse` replays on scroll-down entry and rewinds on
        // scroll-up exit, so the animation honours the scroll axis.
        gsap.fromTo(
          monument,
          { yPercent: prefersReduced ? 0 : 18, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: prefersReduced ? 0.25 : 0.7,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: phase,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          },
        );

        gsap.fromTo(
          content,
          { y: prefersReduced ? 0 : 16, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: prefersReduced ? 0.25 : 0.65,
            delay: prefersReduced ? 0 : 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: phase,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          },
        );
      });

      // Re-measure once fonts/images settle so triggers align with the
      // final layout. Cheap; prevents first-scroll misalignment.
      const t = window.setTimeout(() => ScrollTrigger.refresh(), 120);
      return () => window.clearTimeout(t);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services"
      data-ground="page"
      className={styles.root}
      aria-labelledby="services-heading"
      ref={rootRef}
    >
      <header className={styles.intro}>
        <p className={styles.eyebrow}>The partnership</p>
        <h2 id="services-heading" className={styles.heading}>
          Systematic <span className={styles.ember}>Partnership</span>
        </h2>
      </header>

      <ol
        className={styles.phases}
        role="list"
        aria-label="Phases"
        ref={phasesRef}
      >
        {SERVICES.map((service, i) => (
          <li
            key={service.id}
            className={styles.phase}
            style={{ ['--i' as string]: i }}
            data-service={service.id}
          >
            <button
              type="button"
              className={styles.monument}
              onClick={() => scrollToPhase(i)}
              aria-label={`Open ${service.label}`}
            >
              <span className={styles.monumentInner} aria-hidden="true">
                <span className={styles.monumentGhost}>{service.label}</span>
                <span className={styles.monumentLabel}>{service.label}</span>
              </span>
              <span className={styles.srOnly}>{service.label}</span>
            </button>

            <div className={styles.content} aria-labelledby={`service-${service.id}`}>
              <span id={`service-${service.id}`} className={styles.srOnly}>
                {service.label}
              </span>
              <div className={styles.contentInner}>
                {service.lede ? <p className={styles.lede}>{service.lede}</p> : null}
                {service.body?.map((p, idx) => (
                  <p key={idx} className={styles.body}>
                    {p}
                  </p>
                ))}
                {service.pop ? <Pop pop={service.pop} /> : null}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Pop({ pop }: { pop: NonNullable<(typeof SERVICES)[number]['pop']> }) {
  if (pop.kind === 'questions') {
    return (
      <div className={styles.popQuestions}>
        {pop.heading ? <p className={styles.popHeading}>{pop.heading}</p> : null}
        <ul className={styles.questionList} role="list">
          {pop.items.map((q) => (
            <li key={q} className={styles.question}>
              {q}
              <span className={styles.questionMark} aria-hidden="true">
                ?
              </span>
            </li>
          ))}
        </ul>
        {pop.coda ? <p className={styles.popCoda}>{pop.coda}</p> : null}
      </div>
    );
  }

  if (pop.kind === 'tags') {
    return (
      <div className={styles.popTags}>
        {pop.heading ? <p className={styles.popHeading}>{pop.heading}</p> : null}
        <ul className={styles.tagList} role="list">
          {pop.items.map((t) => (
            <li key={t} className={styles.tag}>
              {t}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <ul className={styles.marks} role="list">
      {pop.items.map((m) => (
        <li key={m} className={styles.mark}>
          <span className={styles.markDash} aria-hidden="true" />
          <span>{m}</span>
        </li>
      ))}
    </ul>
  );
}
