'use client';

import Link from 'next/link';
import { useId, useState } from 'react';
import { BlockHead } from '@/components/BlockHead/BlockHead';
import styles from './Concordance.module.scss';

export type ConcordanceCase = { slug: string; href: string; client: string; kind: string };

export type ConcordanceProps = {
  folio: string;
  title: string;
  lede?: string;
  /** Every term, with the slugs of the cases that used it. */
  terms: ReadonlyArray<{ term: string; slugs: ReadonlyArray<string> }>;
  cases: ReadonlyArray<ConcordanceCase>;
  /** "{term}: used in {cases}." for screen readers. */
  announce: string;
};

/** The proof, browsed by technology. A term lights the cases that used it. */
export function Concordance({ folio, title, lede, terms, cases, announce }: ConcordanceProps) {
  const [active, setActive] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const base = useId();
  const lit = terms.find((t) => t.term === (pinned ?? active));
  const litSlugs = new Set(lit?.slugs ?? []);
  const byslug = new Map(cases.map((c) => [c.slug, c]));

  const clientsOf = (slugs: ReadonlyArray<string>) =>
    slugs.map((s) => byslug.get(s)?.client).filter(Boolean).join(', ');

  return (
    <section className={styles.root} data-ground="paper">
      <div className={styles.inner}>
        <BlockHead folio={folio} title={title} lede={lede} className={styles.head} />

        <ul className={styles.terms} onMouseLeave={() => setActive(null)}>
          {terms.map((t, i) => {
            const open = (pinned ?? active) === t.term;
            return (
              <li key={t.term} className={styles.termItem}>
                <button
                  type="button"
                  className={styles.term}
                  aria-expanded={pinned === t.term}
                  aria-controls={`${base}-${i}`}
                  data-lit={open || undefined}
                  onMouseEnter={() => setActive(t.term)}
                  onFocus={() => setActive(t.term)}
                  onBlur={() => setActive(null)}
                  onClick={() => setPinned((p) => (p === t.term ? null : t.term))}
                >
                  {t.term}
                </button>
                <ul id={`${base}-${i}`} className={styles.inline} hidden={pinned !== t.term}>
                  {t.slugs.map((slug) => {
                    const c = byslug.get(slug);
                    return c ? (
                      <li key={slug}>
                        <Link href={c.href} className={styles.inlineLink}>
                          {c.client}
                        </Link>
                      </li>
                    ) : null;
                  })}
                </ul>
              </li>
            );
          })}
        </ul>

        <ul className={styles.cases} data-lit={lit ? '' : undefined}>
          {cases.map((c) => (
            <li key={c.slug} className={styles.case} data-on={litSlugs.has(c.slug) || undefined}>
              <Link href={c.href} className={styles.caseLink}>
                <span className={styles.client}>{c.client}</span>
                <span className={styles.kind}>{c.kind}</span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="sr-only" aria-live="polite">
          {lit ? announce.replace('{term}', lit.term).replace('{cases}', clientsOf(lit.slugs)) : ''}
        </p>
      </div>
    </section>
  );
}
