import Link from 'next/link';
import { BlockHead } from '@/components/BlockHead/BlockHead';
import { NextMark } from '@/components/NextMark/NextMark';
import type { LinkTo } from '@/content/types';
import styles from './Offer.module.scss';

export type Practice = {
  name: string;
  summary: string;
  items?: ReadonlyArray<string>;
  proof?: ReadonlyArray<LinkTo>;
};

export type OfferProps = {
  variant: 'compact' | 'full';
  folio: string;
  title: string;
  lede?: string;
  practices: ReadonlyArray<Practice>;
  proofLabel?: string;
  more?: LinkTo;
};

/** What is for sale, set like a magazine's contents page. */
export function Offer({ variant, folio, title, lede, practices, proofLabel, more }: OfferProps) {
  return (
    <section className={styles.root} data-variant={variant} data-ground="paper">
      <div className={styles.inner}>
        <BlockHead folio={folio} title={title} lede={lede} className={styles.head} />

        <ul className={styles.practices}>
          {practices.map((p) => (
            <li key={p.name} className={styles.practice}>
              <h3 className={styles.name}>{p.name}</h3>
              <p className={styles.summary}>{p.summary}</p>
              {variant === 'full' && p.items?.length ? (
                <ul className={styles.items}>
                  {p.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
              {variant === 'full' && p.proof?.length ? (
                <p className={styles.proof}>
                  <span className={styles.proofLabel}>{proofLabel}</span>
                  {p.proof.map((link, i) => (
                    <span key={link.href}>
                      {i > 0 ? ', ' : null}
                      <Link href={link.href} className={styles.link}>
                        {link.label}
                      </Link>
                    </span>
                  ))}
                </p>
              ) : null}
            </li>
          ))}
        </ul>

        {more ? (
          <Link href={more.href} className={styles.more}>
            {more.label}
            <NextMark />
          </Link>
        ) : null}
      </div>
    </section>
  );
}
