import { loadAvailability } from '@/blocks/Commit/availability';
import { BUSINESS_DAYS, BUSINESS_HOUR_END, BUSINESS_HOUR_START } from '@/lib/booking/config';
import { nextFreeSlot } from '@/lib/booking/hours';
import type { Locale } from '@/content/routes';
import { HoursView, type HoursCopy } from './HoursView';

export type { HoursCopy } from './HoursView';

export type HoursProps = {
  variant?: 'full' | 'compact';
  locale: Locale;
  folio?: string;
  title?: string;
  copy: HoursCopy;
};

/** When calls happen, in the visitor's own time, and the next free slot. */
export async function Hours({ variant = 'full', locale, folio, title, copy }: HoursProps) {
  const availability = await loadAvailability();
  return (
    <HoursView
      variant={variant}
      locale={locale}
      folio={folio}
      title={title}
      copy={copy}
      businessTimezone={availability.businessTimezone}
      days={BUSINESS_DAYS}
      startHour={BUSINESS_HOUR_START}
      endHour={BUSINESS_HOUR_END}
      nextFreeUTC={nextFreeSlot(availability)}
    />
  );
}
