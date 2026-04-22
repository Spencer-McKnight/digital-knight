'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import styles from './Tech.module.scss';

type Rail = {
  role: string;
  intent: string;
  picks: ReadonlyArray<{ name: string; version?: string; note?: string }>;
};

const RAILS: ReadonlyArray<Rail> = [
  {
    role: 'Runtime',
    intent: 'The shell is instant; the experience hydrates.',
    picks: [
      { name: 'Next.js', version: '16', note: 'App Router, Server Components' },
      { name: 'React', version: '19', note: 'Transitions, useActionState' },
      { name: 'TypeScript', version: '6', note: 'Strict, isolated modules' },
      { name: 'Turbopack', note: 'Dev HMR' },
    ],
  },
  {
    role: 'Styling',
    intent: 'Bespoke authorship. No utility classes arguing with design.',
    picks: [
      { name: 'SCSS', note: 'Dart Sass, canonical' },
      { name: 'CSS Modules', note: 'Scope without runtime' },
      { name: 'Design tokens', note: 'Three-layer cascade' },
      { name: 'Ground inversion', note: 'A mixin, not a prop' },
    ],
  },
  {
    role: 'Motion',
    intent: 'Motion acknowledges change. Nothing is loud for sport.',
    picks: [
      { name: 'GSAP', version: '3', note: 'Timelines, cursor' },
      { name: 'ScrollTrigger', note: 'Native scroll, linked' },
      { name: 'SplitText', note: 'Per-word heading reveals' },
      { name: 'Reduced motion', note: 'One gate, one fallback' },
    ],
  },
  {
    role: 'Dimension',
    intent: 'Matte metal where it earns its fold. Not a particle field.',
    picks: [
      { name: 'R3F', note: 'React renderer for Three' },
      { name: 'drei', note: 'Environment, Float, suspense' },
      { name: 'three.js', note: 'WebGL substrate' },
    ],
  },
  {
    role: 'State',
    intent: 'Global signals stay small. Everything else stays local.',
    picks: [
      { name: 'Zustand', version: '5', note: 'No providers, no boilerplate' },
      { name: 'useReducer', note: 'Per-feature UI machines' },
      { name: 'useActionState', note: 'Server actions, typed' },
    ],
  },
  {
    role: 'Data',
    intent: 'The booking is its own service. Writes through the server, only.',
    picks: [
      { name: 'Supabase', note: 'Postgres + RLS' },
      { name: 'Server Actions', note: 'Typed boundary' },
      { name: 'Resend', note: 'React Email templates' },
      { name: '@internationalized/date', note: 'Timezone-safe week math' },
    ],
  },
];

/**
 * Tech — the studio's stack as a "loom" (`design.md §9` second Act).
 *
 *   Six rails, each a named role. Each rail draws as you enter its row and
 *   the chips lock into position. Hovering a chip highlights its rail — the
 *   loom holds together because the rails share rhythm, not because they
 *   share colour.
 *
 *   Ground: Stone (inversion). Ember is reserved for the active rail's rule
 *   and the "forge" cursor hover treatment.
 */
export function Tech() {
  const rootRef = useRef<HTMLElement>(null);
  const [activeRail, setActiveRail] = useState<number | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const rows = root.querySelectorAll<HTMLElement>('[data-rail]');
      rows.forEach((row) => {
        const rule = row.querySelector('[data-rail-rule]');
        const role = row.querySelector('[data-rail-role]');
        const intent = row.querySelector('[data-rail-intent]');
        const picks = row.querySelectorAll('[data-rail-pick]');

        gsap.set(rule, { scaleX: 0, transformOrigin: 'left center' });
        gsap.set([role, intent], { opacity: 0, y: 12 });
        gsap.set(picks, { opacity: 0, x: 16 });

        ScrollTrigger.create({
          trigger: row,
          start: 'top 82%',
          once: true,
          animation: gsap
            .timeline({ defaults: { ease: 'expo.out' } })
            .to(rule, { scaleX: 1, duration: 0.7 })
            .to(role, { y: 0, opacity: 1, duration: 0.6 }, '<+0.1')
            .to(intent, { y: 0, opacity: 1, duration: 0.6 }, '<+0.1')
            .to(picks, { x: 0, opacity: 1, duration: 0.55, stagger: 0.06 }, '<+0.05'),
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="tech" className={styles.root} aria-labelledby="tech-title">
      <header className={styles.header}>
        <p className={styles.eyebrow}>
          <span className={styles.eyebrowDot} aria-hidden />
          Tech · The stack, stated
        </p>
        <h2 id="tech-title" className={styles.title}>
          A modern React stack, argued <span className={styles.emberWord}>into</span>{' '}
          its parts.
        </h2>
        <p className={styles.lede}>
          Every choice is defensible. Each row is a role with one stance. No
          frameworks chosen because they&apos;re popular; each is chosen because it is
          correct for its role on this site.
        </p>
      </header>

      <ol className={styles.loom}>
        {RAILS.map((rail, i) => {
          const active = activeRail === i;
          return (
            <li
              key={rail.role}
              data-rail
              data-active={active || undefined}
              className={styles.rail}
              onMouseEnter={() => setActiveRail(i)}
              onMouseLeave={() => setActiveRail(null)}
              onFocus={() => setActiveRail(i)}
              onBlur={() => setActiveRail(null)}
              tabIndex={0}
            >
              <span data-rail-rule className={styles.railRule} aria-hidden />
              <p data-rail-role className={styles.railRole}>
                <span className={styles.railIndex}>R/{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.railName}>{rail.role}</span>
              </p>
              <p data-rail-intent className={styles.railIntent}>
                {rail.intent}
              </p>
              <ul className={styles.railPicks} aria-label={`${rail.role} selections`}>
                {rail.picks.map((pick) => (
                  <li
                    key={pick.name}
                    data-rail-pick
                    className={styles.pick}
                  >
                    <span className={styles.pickName}>{pick.name}</span>
                    {pick.version ? (
                      <span className={styles.pickVersion}>
                        v{pick.version}
                      </span>
                    ) : null}
                    {pick.note ? (
                      <span className={styles.pickNote}>{pick.note}</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
