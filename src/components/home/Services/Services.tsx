'use client';

import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { SERVICES } from './content';
import styles from './Services.module.scss';

/**
 * Services — Systematic Partnership (`services.md`).
 *
 *   Four monuments — Listen, Ideate, Create, Evolve — each with its own
 *   content. As the reader scrolls, each monument enters large, then
 *   "raises" and slots into a vertical portfolio-style stack at the
 *   top-left. Prior monuments persist at their slots for the full
 *   section. Content for the active phase fades in; as the next phase
 *   takes over, prior content fades away.
 *
 *   Layout (two layers, one timeline)
 *   ---------------------------------
 *   The Stack is a two-column grid:
 *
 *     [ .monuments (sticky) ]  [ .contents (in flow) ]
 *
 *   `.monuments` holds all four monument headings stacked vertically and
 *   is `position: sticky` inside `.stack`, so the whole column remains
 *   pinned at the top of the viewport for the section's entire scroll
 *   length. That's the mechanism behind "prior monuments persist at
 *   their slots".
 *
 *   `.contents` is a normal-flow column of four tall content blocks — one
 *   per phase. GSAP ScrollTrigger watches each content block and drives:
 *     - The matching monument's entry reveal (rise + fade).
 *     - The matching monument's `--monument-compact` 0→1 as it exits.
 *     - The matching content block's fade-out as it exits (except the
 *       final phase — Evolve holds open).
 *
 *   On narrow viewports the grid collapses to a single column and the
 *   monuments column becomes a slim header-stack above the content —
 *   still sticky, still stacked. The reveal, compact, and content-fade
 *   rails continue to work because they read scroll position only.
 *
 *   Reduced motion collapses the scrub rails to simple enter-once fades.
 */
export function Services() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = gsap.context(() => {
      const contents = gsap.utils.toArray<HTMLElement>(`.${styles.content}`);
      const monuments = gsap.utils.toArray<HTMLElement>(`.${styles.monument}`);

      contents.forEach((content, i) => {
        const monument = monuments[i];
        if (!monument) return;

        const isLast = i === contents.length - 1;

        // Entry reveal — the monument rises + fades in as its matching
        // content block crosses into view. Plays once per phase.
        gsap.fromTo(
          monument,
          { yPercent: prefersReduced ? 0 : 30, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: prefersReduced ? 0.3 : 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: content,
              start: 'top 85%',
              once: true,
            },
          },
        );

        gsap.fromTo(
          content.querySelector(`.${styles.contentInner}`),
          { y: prefersReduced ? 0 : 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: prefersReduced ? 0.3 : 0.8,
            delay: prefersReduced ? 0 : 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: content,
              start: 'top 75%',
              once: true,
            },
          },
        );

        // Handover — as the phase exits, the monument compacts into its
        // slot and the content fades. Evolve (last phase) holds open so
        // the footer beneath lands quietly.
        if (!prefersReduced && !isLast) {
          gsap.to(monument, {
            '--monument-compact': 1,
            ease: 'none',
            scrollTrigger: {
              trigger: content,
              start: 'bottom 70%',
              end: 'bottom 30%',
              scrub: true,
            },
          });

          gsap.to(content.querySelector(`.${styles.contentInner}`), {
            opacity: 0,
            y: -12,
            ease: 'none',
            scrollTrigger: {
              trigger: content,
              start: 'bottom 60%',
              end: 'bottom 25%',
              scrub: true,
            },
          });
        }
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

      <div className={styles.stack}>
        <ol className={styles.monuments} role="list" aria-label="Phases">
          {SERVICES.map((service, i) => (
            <li
              key={service.id}
              className={styles.monument}
              style={{ ['--i' as string]: i }}
              data-service={service.id}
            >
              <span className={styles.monumentInner} aria-hidden="true">
                <span className={styles.monumentGhost}>{service.label}</span>
                <span className={styles.monumentLabel}>{service.label}</span>
              </span>
              <span className={styles.srOnly}>{service.label}</span>
            </li>
          ))}
        </ol>

        <div className={styles.contents}>
          {SERVICES.map((service, i) => (
            <article
              key={service.id}
              className={styles.content}
              style={{ ['--i' as string]: i }}
              data-service={service.id}
              aria-labelledby={`service-${service.id}`}
            >
              <div className={styles.contentInner}>
                <h3 id={`service-${service.id}`} className={styles.contentLabel}>
                  {service.label}
                </h3>
                {service.lede ? <p className={styles.lede}>{service.lede}</p> : null}
                {service.body?.map((p, idx) => (
                  <p key={idx} className={styles.body}>
                    {p}
                  </p>
                ))}
                {service.pop ? <Pop pop={service.pop} /> : null}
              </div>
            </article>
          ))}
        </div>
      </div>
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
