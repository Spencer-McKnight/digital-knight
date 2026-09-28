import Link from 'next/link';
import { NextMark } from '@/components/NextMark/NextMark';
import type { LinkTo } from '@/content/types';
import styles from './Call.module.scss';

export type CallProps = {
  variant?: 'default' | 'quiet';
  /** A short line that says why to go on. */
  lead?: string;
  link: LinkTo;
  ground?: 'paper' | 'carbon';
};

/** One next move at the end of a page, one verb per destination. */
export function Call({ variant = 'default', lead, link, ground = 'paper' }: CallProps) {
  return (
    <section className={styles.root} data-variant={variant} data-ground={ground}>
      <div className={styles.inner}>
        {lead ? <p className={styles.lead}>{lead}</p> : null}
        <Link href={link.href} className={styles.link}>
          <span className={styles.label}>{link.label}</span>
          <NextMark className={styles.mark} />
        </Link>
      </div>
    </section>
  );
}
