import type { CommitCopy } from '@/blocks/Commit/copy';
import type { Locale } from '@/content/routes';
import { env } from '@/lib/env';
import { EnquiryForm } from './EnquiryForm';
import type { EnquiryCopy } from './copy';
import styles from './Enquiry.module.scss';

export type { EnquiryCopy } from './copy';

export type EnquiryProps = {
  locale: Locale;
  copy: EnquiryCopy;
  /** The booking grid offered once a message is sent. */
  commit: CommitCopy;
};

/** A written channel for people not ready to pick a time. */
export function Enquiry({ locale, copy, commit }: EnquiryProps) {
  return (
    <section className={styles.root} data-ground="paper">
      <div className={styles.inner}>
        <EnquiryForm locale={locale} copy={copy} commit={commit} hostEmail={env.BOOKING_HOST_EMAIL} />
      </div>
    </section>
  );
}
