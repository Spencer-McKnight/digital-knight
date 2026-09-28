'use client';

import Link from 'next/link';
import { NextMark } from '@/components/NextMark/NextMark';
import type { CalendarLinks } from '@/lib/booking/calendarLinks';
import type { CommitCopy } from '../copy';
import styles from './Confirmation.module.scss';

/** After a booking: the time, the name, and the calendar exports. */
export function Confirmation({
  copy,
  dateLabel,
  timeLabel,
  name,
  email,
  emailSent,
  links,
}: {
  copy: CommitCopy['confirmed'];
  dateLabel: string;
  timeLabel: string;
  name: string;
  email: string;
  emailSent: boolean;
  links: CalendarLinks;
}) {
  return (
    <div className={styles.root} role="status" aria-live="polite">
      <h2 className={styles.title}>{copy.title}</h2>
      <p className={styles.lede}>{emailSent ? copy.lede : copy.emailFailed}</p>

      <dl className={styles.details}>
        <div className={styles.detail}>
          <dt className={styles.detailLabel}>{copy.when}</dt>
          <dd className={styles.detailValue}>
            {dateLabel}
            <span className={styles.detailSub}>{timeLabel}</span>
          </dd>
        </div>
        <div className={styles.detail}>
          <dt className={styles.detailLabel}>{copy.who}</dt>
          <dd className={styles.detailValue}>
            {name}
            <span className={styles.detailSub}>{email}</span>
          </dd>
        </div>
      </dl>

      <div className={styles.add}>
        <p className={styles.addLabel}>{copy.add}</p>
        <ul className={styles.addList}>
          <li>
            <a href={links.google} target="_blank" rel="noopener noreferrer" className={styles.addLink}>
              {copy.google}
            </a>
          </li>
          <li>
            <a href={links.outlook} target="_blank" rel="noopener noreferrer" className={styles.addLink}>
              {copy.outlook}
            </a>
          </li>
          <li>
            <a href={links.apple} download="digital-knight-strategy-call.ics" className={styles.addLink}>
              {copy.apple}
            </a>
          </li>
        </ul>
      </div>

      <Link href={copy.next.href} className={styles.next}>
        {copy.next.label}
        <NextMark />
      </Link>
    </div>
  );
}
