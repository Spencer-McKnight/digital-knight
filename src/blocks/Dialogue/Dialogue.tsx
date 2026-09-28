import { BlockHead } from '@/components/BlockHead/BlockHead';
import { Rich } from '@/components/Rich/Rich';
import type { Paragraph } from '@/content/types';
import styles from './Dialogue.module.scss';

export type Exchange = { question: string; answer: ReadonlyArray<Paragraph> };

export type DialogueProps = {
  folio: string;
  title: string;
  exchanges: ReadonlyArray<Exchange>;
};

/** What a buyer asks before agreeing to a call, answered in full on the page. */
export function Dialogue({ folio, title, exchanges }: DialogueProps) {
  return (
    <section className={styles.root} data-ground="paper">
      <div className={styles.inner}>
        <BlockHead folio={folio} title={title} className={styles.head} />
        <div className={styles.exchanges}>
          {exchanges.map((x) => (
            <article key={x.question} className={styles.exchange}>
              <h3 className={styles.question}>{x.question}</h3>
              <div className={styles.answer}>
                <Rich paragraphs={x.answer} linkClass={styles.link} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
