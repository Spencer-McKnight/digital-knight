'use client';

import styles from './Confirmation.module.scss';
import type { CalendarLinks } from '@/lib/booking/calendarLinks';

/**
 * Confirmation — success surface, shown after a booking commits.
 *
 *   Presents the confirmed time and three calendar CTAs: Google, Outlook,
 *   Apple. The Apple link is a `data:` URI (attachment / download), Google
 *   and Outlook open pre-filled compose pages in a new tab.
 *
 *   Emits a one-shot ember draw across the word "Booked" via CSS.
 */

export type ConfirmationProps = {
  slotLabel: string;
  name: string;
  email: string;
  emailSent: boolean;
  links: CalendarLinks;
  hostEmail: string;
};

export function Confirmation({
  slotLabel,
  name,
  email,
  emailSent,
  links,
  hostEmail,
}: ConfirmationProps) {
  return (
    <div className={styles.root} role="status" aria-live="polite">
      <h3 className={styles.title}>
        Meeting confirmed.
        <br />
        Check your email for the google meets link, or add it to your calendar.
      </h3>

      <dl className={styles.details}>
        <div className={styles.detail}>
          <dt className={styles.detailLabel}>When</dt>
          <dd className={styles.detailValue}>{slotLabel}</dd>
        </div>
        <div className={styles.detail}>
          <dt className={styles.detailLabel}>Who</dt>
          <dd className={styles.detailValue}>
            {name}
            <span className={styles.detailSub}>{email}</span>
          </dd>
        </div>
      </dl>

      <div className={styles.add}>
        <p className={styles.addLabel}>Add to calendar</p>
        <ul className={styles.addList}>
          <li>
            <a href={links.google} target="_blank" rel="noopener noreferrer" className={styles.addLink}>
              <span className={styles.addName}>Google</span>
              <ArrowOut />
            </a>
          </li>
          <li>
            <a href={links.outlook} target="_blank" rel="noopener noreferrer" className={styles.addLink}>
              <span className={styles.addName}>Outlook</span>
              <ArrowOut />
            </a>
          </li>
          <li>
            <a href={links.apple} download="digital-knight-strategy-call.ics" className={styles.addLink}>
              <span className={styles.addName}>Apple / ICS</span>
              <ArrowOut />
            </a>
          </li>
        </ul>
      </div>

      {!emailSent ? (
        <p className={styles.softNotice}>
          The booking is saved, but the confirmation email didn&apos;t send. Reach
          me at{' '}
          <a href={`mailto:${hostEmail}`} className={styles.mailLink}>
            {hostEmail}
          </a>{' '}
          if you need anything.
        </p>
      ) : null}
    </div>
  );
}

function ArrowOut() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
      focusable="false"
    >
      <path d="M4 10L10 4M10 4H5M10 4V9" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}
