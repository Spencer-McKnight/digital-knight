import { BlockHead } from '@/components/BlockHead/BlockHead';
import styles from './Agenda.module.scss';

export type AgendaProps = {
  folio: string;
  title: string;
  lede?: string;
  /** The length of the call, set at the end of the bar. */
  length: string;
  parts: ReadonlyArray<{ title: string; detail: string }>;
};

/** What the call holds, as one bar in parts, before anyone commits. */
export function Agenda({ folio, title, lede, length, parts }: AgendaProps) {
  return (
    <section className={styles.root} data-ground="carbon">
      <div className={styles.inner}>
        <BlockHead folio={folio} title={title} lede={lede} className={styles.head} />
        <div className={styles.bar}>
          <ol className={styles.parts}>
            {parts.map((part) => (
              <li key={part.title} className={styles.part}>
                <h3 className={styles.partTitle}>{part.title}</h3>
                <p className={styles.partDetail}>{part.detail}</p>
              </li>
            ))}
          </ol>
          <p className={styles.length}>{length}</p>
        </div>
      </div>
    </section>
  );
}
