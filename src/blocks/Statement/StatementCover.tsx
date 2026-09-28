'use client';

import { getImageProps } from 'next/image';
import { useMemo, useRef } from 'react';
import { Folio } from '@/components/Folio/Folio';
import { Nightlight, type NightlightArt, type Pt } from '@/components/Nightlight/Nightlight';
import { TicketStub, type TicketContent, type Tilt } from '../Ticket/TicketStub';
import styles from './Statement.module.scss';

type Rendition = { src: string; width: number; height: number; rest: Pt; knight?: Pt };

export type CoverArt = {
  alt: string;
  /** Landscape screens. */
  wide: Rendition;
  /** Portrait screens: an edit of the wide art, never a crop. */
  tall: Rendition;
};

// Keep in step with `$cover-tall` in Statement.module.scss.
const TALL_MEDIA = '(max-aspect-ratio: 5/4)';
const LONG = 44;

export function StatementCover({
  folio,
  title,
  art,
  ticket,
}: {
  folio: string;
  title: string;
  art: CoverArt;
  ticket: { content: TicketContent; href: string; tilt: Tilt };
}) {
  const host = useRef<HTMLElement>(null);
  const still = useRef<HTMLImageElement>(null);

  const common = { alt: art.alt, sizes: '100vw' };
  const { props: { srcSet: tallSet } } = getImageProps({ ...common, ...pick(art.tall) });
  const { props: wideProps } = getImageProps({ ...common, ...pick(art.wide), fetchPriority: 'high', loading: 'eager' });

  const arts = useMemo<NightlightArt[]>(
    () => [
      { aspect: art.wide.width / art.wide.height, rest: art.wide.rest, knight: art.wide.knight },
      { aspect: art.tall.width / art.tall.height, rest: art.tall.rest, knight: art.tall.knight },
    ],
    [art],
  );

  return (
    <section ref={host} className={styles.root} data-variant="cover" data-ground="photo">
      <div className={styles.media}>
        <picture>
          <source media={TALL_MEDIA} srcSet={tallSet} />
          {/* eslint-disable-next-line jsx-a11y/alt-text -- alt arrives through getImageProps */}
          <img {...wideProps} ref={still} className={styles.still} />
        </picture>
        <Nightlight host={host} image={still} arts={arts} />
      </div>

      <div className={styles.head}>
        <Folio label={folio} />
        <h1 className={styles.monument} data-length={title.length > LONG ? 'long' : undefined}>
          {title}
        </h1>
      </div>

      <div className={styles.action}>
        <TicketStub content={ticket.content} href={ticket.href} tilt={ticket.tilt} />
      </div>
    </section>
  );
}

const pick = ({ src, width, height }: Rendition) => ({ src, width, height });
