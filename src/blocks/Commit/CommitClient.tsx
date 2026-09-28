'use client';

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import type { WeekAvailability } from '@/app/_actions/booking.types';
import type { Locale } from '@/content/routes';
import { visitorTimezone } from '@/lib/booking/week';
import { Confirmation } from './Confirmation/Confirmation';
import { WeekGrid, type ConfirmationPayload } from './WeekGrid/WeekGrid';
import { fill, type CommitCopy } from './copy';
import styles from './Commit.module.scss';

const noop = () => () => {};

/** The heading, the subtitle naming both zones, then the grid or the confirmation. */
export function CommitClient({
  locale,
  copy,
  initial,
  hostEmail,
  head,
  hours,
}: {
  locale: Locale;
  copy: CommitCopy;
  initial: WeekAvailability;
  hostEmail: string;
  head: ReactNode;
  hours: { days: number[]; start: number; end: number };
}) {
  const [confirmed, setConfirmed] = useState<ConfirmationPayload | null>(null);
  const zone = useSyncExternalStore(noop, visitorTimezone, () => initial.businessTimezone);
  const rootRef = useRef<HTMLDivElement>(null);
  const onConfirmed = useCallback((p: ConfirmationPayload) => setConfirmed(p), []);

  useEffect(() => {
    if (confirmed) rootRef.current?.scrollIntoView({ block: 'start' });
  }, [confirmed]);

  const weekday = (iso: number) =>
    new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone: 'UTC' }).format(Date.UTC(2024, 0, iso));
  const days = fill(copy.dayRange, { first: weekday(hours.days[0]!), last: weekday(hours.days[hours.days.length - 1]!) });
  const pad = (h: number) => `${String(h).padStart(2, '0')}:00`;
  const subtitle = fill(copy.subtitle, {
    zone: zone.replace(/_/g, ' '),
    days,
    start: pad(hours.start),
    end: pad(hours.end),
  });

  if (confirmed) {
    return (
      <div ref={rootRef}>
        <Confirmation copy={copy.confirmed} {...confirmed} />
      </div>
    );
  }

  return (
    <div ref={rootRef} className={styles.layout}>
      <div className={styles.head}>
        {head}
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
      <div className={styles.grid}>
        <WeekGrid locale={locale} copy={copy} initial={initial} hostEmail={hostEmail} onConfirmed={onConfirmed} />
      </div>
    </div>
  );
}
