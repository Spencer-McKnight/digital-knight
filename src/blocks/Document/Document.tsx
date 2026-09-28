import { Folio } from '@/components/Folio/Folio';
import { Rich } from '@/components/Rich/Rich';
import type { Paragraph } from '@/content/types';
import styles from './Document.module.scss';

export type DocBlock =
  | { type: 'p'; text: Paragraph }
  | { type: 'list'; items: ReadonlyArray<Paragraph> }
  | { type: 'table'; head: ReadonlyArray<string>; rows: ReadonlyArray<ReadonlyArray<string>> }
  /** Address-style lines. Empty lines are dropped, so unfilled fields render nothing. */
  | { type: 'lines'; lines: ReadonlyArray<string | null | undefined> };

export type DocSection = { heading?: string; blocks: ReadonlyArray<DocBlock> };

export type DocumentProps = {
  folio: string;
  title: string;
  updated?: string;
  sections: ReadonlyArray<DocSection>;
};

/** Long legal text, set to be read rather than skimmed. */
export function Document({ folio, title, updated, sections }: DocumentProps) {
  return (
    <article className={styles.root} data-ground="paper">
      <div className={styles.inner}>
        <header className={styles.head}>
          <Folio label={folio} />
          <h1 className={styles.title}>{title}</h1>
          {updated ? <p className={styles.updated}>{updated}</p> : null}
        </header>

        <div className={styles.body}>
          {sections.map((section, i) => {
            const blocks = section.blocks.filter(hasContent);
            if (!blocks.length) return null;
            return (
              <section key={section.heading ?? i} className={styles.section}>
                {section.heading ? <h2 className={styles.heading}>{section.heading}</h2> : null}
                {blocks.map((block, j) => (
                  <Block key={j} block={block} />
                ))}
              </section>
            );
          })}
        </div>
      </div>
    </article>
  );
}

function hasContent(block: DocBlock): boolean {
  if (block.type === 'lines') return block.lines.some(Boolean);
  if (block.type === 'list') return block.items.length > 0;
  if (block.type === 'table') return block.rows.length > 0;
  return block.text.length > 0;
}

function Block({ block }: { block: DocBlock }) {
  switch (block.type) {
    case 'p':
      return <Rich paragraphs={[block.text]} className={styles.p} linkClass={styles.link} />;
    case 'list':
      return (
        <ul className={styles.list}>
          {block.items.map((item, i) => (
            <li key={i}>
              <Rich paragraphs={[item]} className={styles.p} linkClass={styles.link} />
            </li>
          ))}
        </ul>
      );
    case 'lines':
      return (
        <p className={styles.lines}>
          {block.lines.filter(Boolean).map((line, i) => (
            <span key={i}>{line}</span>
          ))}
        </p>
      );
    case 'table':
      return (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                {block.head.map((h) => (
                  <th key={h} scope="col">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (j === 0 ? <th key={j} scope="row">{cell}</th> : <td key={j}>{cell}</td>))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}
