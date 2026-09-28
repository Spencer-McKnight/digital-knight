import { Folio } from '@/components/Folio/Folio';
import { Heading } from '@/components/Heading/Heading';
import styles from './BlockHead.module.scss';

/** The folio, the heading and an optional lede that open most blocks. */
export function BlockHead({
  folio,
  title,
  lede,
  id,
  className,
}: {
  folio: string;
  title: string;
  lede?: string;
  id?: string;
  className?: string;
}) {
  return (
    <header className={className ? `${styles.root} ${className}` : styles.root}>
      <Folio label={folio} />
      <Heading as="h2" id={id} text={title} className={styles.title} />
      {lede ? <p className={styles.lede}>{lede}</p> : null}
    </header>
  );
}
