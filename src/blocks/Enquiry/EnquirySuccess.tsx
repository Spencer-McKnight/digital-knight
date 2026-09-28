'use client';

import { useState, useTransition } from 'react';
import { getFirstAvailableWeek } from '@/app/_actions/booking';
import type { WeekAvailability } from '@/app/_actions/booking.types';
import { WeekGrid } from '@/blocks/Commit/WeekGrid/WeekGrid';
import type { CommitCopy } from '@/blocks/Commit/copy';
import { ErrorBar } from '@/components/ErrorBar/ErrorBar';
import { NextMark } from '@/components/NextMark/NextMark';
import type { Locale } from '@/content/routes';
import type { EnquiryCopy } from './copy';
import styles from './Enquiry.module.scss';

type Phase = 'sent' | 'loading' | 'booking' | 'error';

/** Sent. The booking grid is one step away, with name and email carried over. */
export function EnquirySuccess({
  locale,
  name,
  email,
  copy,
  commit,
  hostEmail,
}: {
  locale: Locale;
  name: string;
  email: string;
  copy: EnquiryCopy['success'];
  commit: CommitCopy;
  hostEmail: string;
}) {
  const [phase, setPhase] = useState<Phase>('sent');
  const [availability, setAvailability] = useState<WeekAvailability | null>(null);
  const [, startTransition] = useTransition();

  function openCalendar() {
    setPhase('loading');
    startTransition(async () => {
      try {
        setAvailability(await getFirstAvailableWeek());
        setPhase('booking');
      } catch {
        setPhase('error');
      }
    });
  }

  if (phase === 'booking' && availability) {
    return (
      <div className={styles.booking} data-ground="carbon">
        <div className={styles.bookingBar}>
          <p className={styles.bookingAs}>
            {copy.bookingAs} <strong>{name}</strong>
          </p>
          <button type="button" onClick={() => setPhase('sent')} className={styles.back}>
            {copy.back}
          </button>
        </div>
        <WeekGrid locale={locale} copy={commit} initial={availability} hostEmail={hostEmail} prefilled={{ name, email }} />
      </div>
    );
  }

  return (
    <div className={styles.success} role="status" aria-live="polite">
      <h2 className={styles.successTitle}>{copy.title}</h2>
      <p className={styles.successBody}>{copy.body}</p>
      <p className={styles.offer}>{copy.offer}</p>
      <button type="button" onClick={openCalendar} disabled={phase === 'loading'} className={styles.book}>
        {phase === 'loading' ? copy.loading : copy.book}
        <NextMark />
      </button>
      {phase === 'error' ? <ErrorBar>{copy.calendarError}</ErrorBar> : null}
    </div>
  );
}
