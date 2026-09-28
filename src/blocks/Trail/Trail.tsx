'use client';

import Link from 'next/link';
import { useId, useState } from 'react';
import { HereMark } from '@/components/HereMark/HereMark';
import { NextMark } from '@/components/NextMark/NextMark';
import { getChrome, type TrailStop } from '@/content/chrome';
import { href, type Locale } from '@/content/routes';
import styles from './Trail.module.scss';

export type TrailProps = {
  locale: Locale;
  current: TrailStop['id'];
  ground?: 'paper' | 'carbon';
};

/**
 * Where the visitor stands on the way in, and the next stop. A strip of the
 * four stops on wide screens; one line on narrow ones that opens all four.
 */
export function Trail({ locale, current, ground = 'paper' }: TrailProps) {
  const t = getChrome(locale);
  const [open, setOpen] = useState(false);
  const listId = useId();
  const index = t.trail.findIndex((s) => s.id === current);
  const here = t.trail[index];
  const next = t.trail[index + 1];

  return (
    <nav className={styles.root} data-ground={ground} aria-label={t.trailLabel}>
      <div className={styles.inner}>
        <button
          type="button"
          className={styles.summary}
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={styles.summaryHere}>
            <HereMark />
            {here?.label}
          </span>
          {next ? (
            <span className={styles.summaryNext}>
              <NextMark />
              {next.label}
            </span>
          ) : null}
          <span className="sr-only">{t.trailOpen}</span>
          <span className={styles.caret} aria-hidden="true" />
        </button>

        <ol id={listId} className={styles.stops} data-open={open || undefined}>
          {t.trail.map((stop, i) => {
            const state = i === index ? 'current' : i === index + 1 ? 'next' : i < index ? 'past' : undefined;
            return (
              <li key={stop.id} className={styles.stop} data-state={state}>
                <Link
                  href={href(stop.id, locale)}
                  className={styles.link}
                  aria-current={state === 'current' ? 'step' : undefined}
                >
                  <span className={styles.label}>
                    {state === 'current' ? <HereMark /> : null}
                    {state === 'next' ? <NextMark /> : null}
                    {stop.label}
                  </span>
                  <span className={styles.promise}>{stop.promise}</span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
