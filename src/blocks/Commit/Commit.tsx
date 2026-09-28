import { BlockHead } from '@/components/BlockHead/BlockHead';
import type { Locale } from '@/content/routes';
import { BUSINESS_DAYS, BUSINESS_HOUR_END, BUSINESS_HOUR_START } from '@/lib/booking/config';
import { env } from '@/lib/env';
import { loadAvailability } from './availability';
import { CommitClient } from './CommitClient';
import type { CommitCopy } from './copy';
import styles from './Commit.module.scss';

export type { CommitCopy } from './copy';

export type CommitProps = {
  locale: Locale;
  folio: string;
  title: string;
  copy: CommitCopy;
};

/**
 * The last stage of the funnel: a week of free slots and one click to take
 * one. The booking contract is `talk.md`; this block only presents it.
 */
export async function Commit({ locale, folio, title, copy }: CommitProps) {
  const initial = await loadAvailability();
  return (
    <section className={styles.root} data-ground="carbon" id="book">
      <div className={styles.inner}>
        <CommitClient
          locale={locale}
          copy={copy}
          initial={initial}
          hostEmail={env.BOOKING_HOST_EMAIL}
          head={<BlockHead folio={folio} title={title} />}
          hours={{ days: [...BUSINESS_DAYS], start: BUSINESS_HOUR_START, end: BUSINESS_HOUR_END }}
        />
      </div>
    </section>
  );
}
