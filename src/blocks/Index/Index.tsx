import Image from 'next/image';
import Link from 'next/link';
import { BlockHead } from '@/components/BlockHead/BlockHead';
import type { Picture } from '@/content/types';
import styles from './Index.module.scss';

export type IndexRow = {
  href: string;
  client: string;
  title: string;
  kind: string;
  image?: Picture;
};

export type IndexProps = {
  variant: 'compact' | 'full';
  folio: string;
  title: string;
  rows: ReadonlyArray<IndexRow>;
};

/** All the evidence, one row each, so a visitor can choose. */
export function Index({ variant, folio, title, rows }: IndexProps) {
  return (
    <section className={styles.root} data-variant={variant} data-ground="paper">
      <div className={styles.inner}>
        <BlockHead folio={folio} title={title} className={styles.head} />
        <ul className={styles.rows}>
          {rows.map((row) => (
            <li key={row.href}>
              <Link href={row.href} className={styles.row}>
                {variant === 'full' && row.image ? (
                  <span className={styles.thumb}>
                    <Image
                      src={row.image.src}
                      alt=""
                      width={row.image.width}
                      height={row.image.height}
                      sizes="(min-width: 48rem) 12rem, 30vw"
                      className={styles.thumbImage}
                    />
                  </span>
                ) : null}
                <span className={styles.client}>{row.client}</span>
                <span className={styles.title}>{row.title}</span>
                <span className={styles.kind}>{row.kind}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
