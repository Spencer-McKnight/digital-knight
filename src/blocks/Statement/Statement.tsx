import Image from 'next/image';
import type { CSSProperties } from 'react';
import { Folio } from '@/components/Folio/Folio';
import { Heading } from '@/components/Heading/Heading';
import { NextMark } from '@/components/NextMark/NextMark';
import { Pin } from '@/components/Pin/Pin';
import { Sticker } from '@/components/Sticker/Sticker';
import type { Picture } from '@/content/types';
import { TicketStub, type TicketContent, type Tilt } from '../Ticket/TicketStub';
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

/** One object pressed onto the photograph, at a point in image coordinates. */
export type PageObject =
  | { kind: 'pin'; label: string; at: readonly [number, number] }
  | { kind: 'sticker'; label: string; at: readonly [number, number] }
  | { kind: 'ticket'; content: TicketContent; href: string; tilt: Tilt; at: readonly [number, number] };

type Page = {
  variant: 'page';
  folio: string;
  title: string;
  lede?: string;
  ground?: 'paper' | 'carbon';
  /** A 16:9 photograph whose upper left is dark, with its one object. */
  art?: { picture: Picture; object: PageObject };
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

  const { art } = props;
  return (
    <section
      className={styles.root}
      data-variant="page"
      data-ground={art ? 'photo' : (props.ground ?? 'paper')}
      data-art={art ? '' : undefined}
    >
      {art ? (
        <div className={styles.band}>
          <Image
            src={art.picture.src}
            alt={art.picture.alt}
            fill
            preload
            sizes="100vw"
            className={styles.bandImage}
          />
          <div
            className={styles.object}
            data-kind={art.object.kind}
            style={{ '--x': `${art.object.at[0] * 100}%`, '--y': `${art.object.at[1] * 100}%` } as CSSProperties}
          >
            <PressedObject object={art.object} />
          </div>
        </div>
      ) : null}
      <div className={styles.inner}>
        <Folio label={props.folio} />
        <Heading as="h1" text={props.title} className={styles.title} />
        {props.lede ? <p className={styles.lede}>{props.lede}</p> : null}
      </div>
    </section>
  );
}

function PressedObject({ object }: { object: PageObject }) {
  if (object.kind === 'pin') return <Pin label={object.label} />;
  if (object.kind === 'sticker') return <Sticker label={object.label} tilt={-2} />;
  return <TicketStub content={object.content} href={object.href} tilt={object.tilt} />;
}
