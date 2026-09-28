import { BlockHead } from '@/components/BlockHead/BlockHead';
import styles from './Ledger.module.scss';

export type LedgerProps = {
  variant: 'stack' | 'terms';
  folio: string;
  title: string;
  lede?: string;
  rows: ReadonlyArray<{ term: string; detail: string }>;
};

/** Things that can be looked up: the stack a case ran on, the terms of the work. */
export function Ledger({ variant, folio, title, lede, rows }: LedgerProps) {
  return (
    <section className={styles.root} data-variant={variant} data-ground="paper">
      <div className={styles.inner}>
        <BlockHead folio={folio} title={title} lede={lede} className={styles.head} />
        <dl className={styles.rows}>
          {rows.map((row) => (
            <div key={row.term} className={styles.row}>
              <dt className={styles.term}>{row.term}</dt>
              <dd className={styles.detail}>{row.detail}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
