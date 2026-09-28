import { BlockHead } from '@/components/BlockHead/BlockHead';
import { Rich } from '@/components/Rich/Rich';
import type { Paragraph } from '@/content/types';
import styles from './Narrative.module.scss';

type Base = { folio: string; title: string };

export type NarrativeProps =
  | (Base & { variant: 'context' | 'outcomes'; paragraphs: ReadonlyArray<Paragraph> })
  | (Base & { variant: 'criteria'; items: ReadonlyArray<string> })
  | (Base & { variant: 'engagements'; entries: ReadonlyArray<{ name: string; description: string }> });

/** One part of an engagement's story, told in prose or as a short list. */
export function Narrative(props: NarrativeProps) {
  return (
    <section className={styles.root} data-variant={props.variant} data-ground="paper">
      <div className={styles.inner}>
        <BlockHead folio={props.folio} title={props.title} className={styles.head} />
        <div className={styles.body}>
          {props.variant === 'context' || props.variant === 'outcomes' ? (
            <Rich paragraphs={props.paragraphs} className={styles.paragraph} linkClass={styles.link} />
          ) : null}
          {props.variant === 'criteria' ? (
            <ul className={styles.list}>
              {props.items.map((item) => (
                <li key={item} className={styles.item}>
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
          {props.variant === 'engagements' ? (
            <dl className={styles.list}>
              {props.entries.map((e) => (
                <div key={e.name} className={styles.entry}>
                  <dt className={styles.entryName}>{e.name}</dt>
                  <dd className={styles.entryText}>{e.description}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </div>
    </section>
  );
}
