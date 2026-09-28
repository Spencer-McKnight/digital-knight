import { Folio } from '@/components/Folio/Folio';
import { Heading } from '@/components/Heading/Heading';
import { NextMark } from '@/components/NextMark/NextMark';
import type { TicketContent, Tilt } from '../Ticket/TicketStub';
import { StatementCover, type CoverArt } from './StatementCover';
import styles from './Statement.module.scss';

export type { CoverArt } from './StatementCover';

type Cover = {
  variant: 'cover';
  folio: string;
  title: string;
  art: CoverArt;
  ticket: { content: TicketContent; href: string; tilt: Tilt };
};

type Page = {
  variant: 'page';
  folio: string;
  title: string;
  lede?: string;
  ground?: 'paper' | 'carbon';
};

type Case = {
  variant: 'case';
  folio: string;
  client: string;
  kind: string;
  title: string;
  tagline: string;
  site: { href: string; label: string };
};

export type StatementProps = Cover | Page | Case;

/** One claim, one action. The page's H1 lives here. */
export function Statement(props: StatementProps) {
  if (props.variant === 'cover') return <StatementCover {...props} />;

  if (props.variant === 'case') {
    return (
      <section className={styles.root} data-variant="case" data-ground="paper">
        <div className={styles.inner}>
          <Folio label={props.folio} />
          <p className={styles.client}>
            <span>{props.client}</span>
            <span className={styles.kind}>{props.kind}</span>
          </p>
          <Heading as="h1" text={props.title} className={styles.title} />
          <p className={styles.lede}>{props.tagline}</p>
          <a href={props.site.href} className={styles.site} target="_blank" rel="noopener noreferrer">
            {props.site.label}
            <NextMark />
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.root} data-variant="page" data-ground={props.ground ?? 'paper'}>
      <div className={styles.inner}>
        <Folio label={props.folio} />
        <Heading as="h1" text={props.title} className={styles.title} />
        {props.lede ? <p className={styles.lede}>{props.lede}</p> : null}
      </div>
    </section>
  );
}
