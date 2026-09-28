import Link from 'next/link';
import { BlockHead } from '@/components/BlockHead/BlockHead';
import { Rich } from '@/components/Rich/Rich';
import type { LinkTo, Paragraph } from '@/content/types';
import styles from './Method.module.scss';

export type Phase = {
  name: string;
  lede: string;
  body?: ReadonlyArray<Paragraph>;
  tags?: ReadonlyArray<string>;
  questions?: { heading: string; items: ReadonlyArray<string> };
  proof?: LinkTo;
};

export type MethodProps = {
  folio: string;
  title: string;
  lede?: string;
  phases: ReadonlyArray<Phase>;
};

/** How the work proceeds, from the first conversation to ongoing change. */
export function Method({ folio, title, lede, phases }: MethodProps) {
  return (
    <section className={styles.root} data-ground="paper">
      <div className={styles.inner}>
        <BlockHead folio={folio} title={title} lede={lede} className={styles.head} />
        <ol className={styles.phases}>
          {phases.map((phase) => (
            <li key={phase.name} className={styles.phase}>
              <h3 className={styles.name}>{phase.name}</h3>
              <div className={styles.content}>
                <p className={styles.lede}>{phase.lede}</p>
                {phase.body ? (
                  <div className={styles.body}>
                    <Rich paragraphs={phase.body} linkClass={styles.link} />
                  </div>
                ) : null}
                {phase.questions ? (
                  <div className={styles.questions}>
                    <p className={styles.questionsHeading}>{phase.questions.heading}</p>
                    <ul className={styles.questionList}>
                      {phase.questions.items.map((q) => (
                        <li key={q}>{q}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {phase.tags?.length ? (
                  <ul className={styles.tags}>
                    {phase.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                ) : null}
                {phase.proof ? (
                  <Link href={phase.proof.href} className={styles.proof}>
                    {phase.proof.label}
                  </Link>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
