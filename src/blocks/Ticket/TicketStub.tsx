/* eslint-disable @next/next/no-img-element -- the ticket's photographed face under live text */
import Link from 'next/link';
import { NextMark } from '@/components/NextMark/NextMark';
import styles from './Ticket.module.scss';

export type Tilt = -3 | -2 | -1 | 0 | 1 | 2 | 3;

export type TicketContent = {
  admit: string;
  terms: ReadonlyArray<string>;
  action: string;
};

/**
 * The free call as an object you can take. On wide screens it is the
 * photographed card, pressed onto a surface at a fixed tilt; it lifts under the
 * pointer and presses on click. On narrow screens it lies flat as a
 * full-width tap target drawn in CSS.
 */
export function TicketStub({ content, href, tilt = -2 }: { content: TicketContent; href: string; tilt?: Tilt }) {
  return (
    <Link href={href} className={styles.stub} data-tilt={tilt}>
      <span className={styles.face}>
        <img src="/images/objects/ticket.webp" alt="" className={styles.photo} width={1020} height={355} />
        <span className={styles.body}>
          <span className={styles.admit}>{content.admit}</span>
          <span className={styles.terms}>
            {content.terms.map((term, i) => (
              <span key={term}>
                {i > 0 ? <span aria-hidden="true"> · </span> : null}
                {term}
              </span>
            ))}
          </span>
        </span>
        <span className={styles.tear}>
          <span className={styles.action}>{content.action}</span>
          <NextMark className={styles.mark} />
        </span>
      </span>
    </Link>
  );
}
