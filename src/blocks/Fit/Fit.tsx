'use client';

import Link from 'next/link';
import { useId, useState } from 'react';
import { BlockHead } from '@/components/BlockHead/BlockHead';
import { NextMark } from '@/components/NextMark/NextMark';
import type { LinkTo } from '@/content/types';
import styles from './Fit.module.scss';

export type FitProps = {
  folio: string;
  title: string;
  lede?: string;
  fits: { label: string; items: ReadonlyArray<string> };
  wont: { label: string; items: ReadonlyArray<string> };
  /** Read to screen readers as the tally changes, e.g. "{n} of {total} apply". */
  tally: string;
  link: LinkTo;
};

/** A visitor qualifies themselves before reading on. A mark lands, the tally updates. */
export function Fit({ folio, title, lede, fits, wont, tally, link }: FitProps) {
  const [ticked, setTicked] = useState<ReadonlySet<number>>(new Set());
  const base = useId();
  const count = ticked.size;
  const total = fits.items.length;

  const toggle = (i: number) =>
    setTicked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <section className={styles.root} data-ground="paper">
      <div className={styles.inner}>
        <BlockHead folio={folio} title={title} lede={lede} className={styles.head} />

        <fieldset className={styles.fits}>
          <legend className={styles.label}>{fits.label}</legend>
          {fits.items.map((item, i) => (
            <label key={item} className={styles.row} htmlFor={`${base}-${i}`}>
              <input
                id={`${base}-${i}`}
                type="checkbox"
                className={styles.input}
                checked={ticked.has(i)}
                onChange={() => toggle(i)}
              />
              <span className={styles.box} aria-hidden="true">
                <svg viewBox="0 0 20 20" className={styles.tick}>
                  <path d="M4 10.5L8.2 14.5L16 5.5" />
                </svg>
              </span>
              <span className={styles.statement}>{item}</span>
            </label>
          ))}
        </fieldset>

        <div className={styles.wont}>
          <p className={styles.label}>{wont.label}</p>
          <ul>
            {wont.items.map((item) => (
              <li key={item} className={styles.wontItem}>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.tally}>
          <span className={styles.boxes} aria-hidden="true">
            {fits.items.map((_, i) => (
              <span key={i} className={styles.cell} data-on={i < count || undefined} />
            ))}
          </span>
          <span className="sr-only" aria-live="polite">
            {tally.replace('{n}', String(count)).replace('{total}', String(total))}
          </span>
          <Link href={link.href} className={styles.next}>
            {link.label}
            <NextMark />
          </Link>
        </div>
      </div>
    </section>
  );
}
