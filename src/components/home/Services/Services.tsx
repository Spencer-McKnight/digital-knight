'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import styles from './Services.module.scss';

type Service = {
  n: string;
  title: string;
  ember: string; // one ember word inside the title
  body: string;
  rail: ReadonlyArray<string>;
};

const SERVICES: ReadonlyArray<Service> = [
  {
    n: '01',
    title: 'Long-term digital partnerships.',
    ember: 'partnerships',
    body: 'Advisory, ideation, strategy and development under one continuing engagement — so the work compounds instead of resetting every quarter.',
    rail: ['Advisory', 'Ideation', 'Strategy', 'Development'],
  },
  {
    n: '02',
    title: 'Websites built as the pillar of the business.',
    ember: 'pillar',
    body: 'Design, build, evolve and maintain — a single surface the rest of your digital work can relate through. No CMS sprawl, no template drift.',
    rail: ['Design', 'Build', 'Evolve', 'Maintain'],
  },
  {
    n: '03',
    title: 'Process integrations that evolve past manual labour.',
    ember: 'evolve',
    body: 'Agents, pipelines and production tooling wired into the business you actually run — prepared to build on ideas, not just demo them.',
    rail: ['Agents', 'Pipelines', 'Operations', 'Tooling'],
  },
  {
    n: '04',
    title: 'Evolution research — understand the market, set the trend.',
    ember: 'trend',
    body: 'Specialist market and technology research. Input new ideas. Pressure-test assumptions. Inform every other decision in the engagement.',
    rail: ['Markets', 'Signals', 'Reports', 'Briefs'],
  },
];

/**
 * Services — a four-pillar act (`design.md` §9).
 *
 *   Numbered, structured, trustable — Supernova clarity crossed with the
 *   studio's forge aesthetic. One idea per row, one ember word per row. Each
 *   pillar has a horizontal "rail" of its constituent verbs, drawing in as
 *   the row enters view.
 *
 *   Kinetic: a single reveal per row on enter. No compounding between rows.
 */
export function Services() {
  const rootRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const rows = root.querySelectorAll<HTMLElement>('[data-row]');
      rows.forEach((row) => {
        const n = row.querySelector('[data-row-n]');
        const title = row.querySelector('[data-row-title]');
        const rule = row.querySelector('[data-row-rule]');
        const body = row.querySelector('[data-row-body]');
        const chips = row.querySelectorAll('[data-row-chip]');

        gsap.set([n, title, body], { y: 20, opacity: 0 });
        gsap.set(rule, { scaleX: 0, transformOrigin: 'left center' });
        gsap.set(chips, { y: 10, opacity: 0 });

        ScrollTrigger.create({
          trigger: row,
          start: 'top 78%',
          once: true,
          animation: gsap
            .timeline({ defaults: { ease: 'expo.out' } })
            .to(rule, { scaleX: 1, duration: 0.6 })
            .to(n, { y: 0, opacity: 1, duration: 0.65 }, '<')
            .to(title, { y: 0, opacity: 1, duration: 0.85 }, '<+0.08')
            .to(body, { y: 0, opacity: 1, duration: 0.7 }, '<+0.15')
            .to(
              chips,
              { y: 0, opacity: 1, duration: 0.55, stagger: 0.08 },
              '<+0.05',
            ),
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="services"
      data-ground="page"
      className={styles.root}
      aria-labelledby="services-title"
    >
      <header className={styles.header}>
        <h2 id="services-title" className={styles.sectionTitle}>
          Spencer McKnight&apos;s agency,
          <br />
          built around <span className={styles.sectionEmber}>four commitments</span>.
        </h2>
      </header>

      <ol className={styles.list}>
        {SERVICES.map((s) => (
          <li key={s.n} data-row className={styles.row}>
            <span data-row-rule className={styles.rowRule} aria-hidden />

            <span data-row-n className={styles.rowN}>
              {s.n}
            </span>

            <div className={styles.rowContent}>
              <h3 data-row-title className={styles.rowTitle}>
                {renderWithEmber(s.title, s.ember)}
              </h3>
              <p data-row-body className={styles.rowBody}>
                {s.body}
              </p>
            </div>

            <ul className={styles.rowRail}>
              {s.rail.map((r) => (
                <li key={r} data-row-chip className={styles.rowChip}>
                  {r}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
}

function renderWithEmber(text: string, ember: string) {
  const lower = text.toLowerCase();
  const idx = lower.indexOf(ember.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className={styles.emberWord}>{text.slice(idx, idx + ember.length)}</span>
      {text.slice(idx + ember.length)}
    </>
  );
}
