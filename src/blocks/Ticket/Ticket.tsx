import Image from 'next/image';
import { BlockHead } from '@/components/BlockHead/BlockHead';
import type { Picture } from '@/content/types';
import { TicketStub, type TicketContent, type Tilt } from './TicketStub';
import styles from './Ticket.module.scss';

export type { TicketContent, Tilt } from './TicketStub';

export type TicketProps = {
  folio: string;
  title: string;
  lede?: string;
  ticket: { content: TicketContent; href: string; tilt: Tilt };
  /** The photographed surface the ticket is pressed onto. */
  art?: Picture;
};

/** The free call as an object you can take, pressed onto a surface. */
export function Ticket({ folio, title, lede, ticket, art }: TicketProps) {
  return (
    <section className={styles.block} data-ground={art ? 'photo' : 'carbon'} data-art={art ? '' : undefined}>
      {art ? (
        <div className={styles.surface}>
          <Image src={art.src} alt={art.alt} fill sizes="100vw" className={styles.surfaceImage} />
        </div>
      ) : null}
      <div className={styles.blockInner}>
        <BlockHead folio={folio} title={title} lede={lede} className={styles.blockHead} />
        <div className={styles.blockStub}>
          <TicketStub content={ticket.content} href={ticket.href} tilt={ticket.tilt} />
        </div>
      </div>
    </section>
  );
}
