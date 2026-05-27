'use client';

import { useState, useTransition } from 'react';
import { getFirstAvailableWeek } from '@/app/_actions/booking';
import type { WeekAvailability } from '@/app/_actions/booking.types';
import { WeekGrid } from '@/components/home/LetsTalk/WeekGrid/WeekGrid';
import { Button } from '@/components/Button';
import styles from './ContactSuccess.module.scss';

type ContactSuccessProps = {
  name: string;
  email: string;
  hostEmail: string;
  onReset: () => void;
};

type Phase = 'confirmed' | 'loading' | 'booking' | 'error';

export function ContactSuccess({
  name,
  email,
  hostEmail,
  onReset,
}: ContactSuccessProps) {
  const [phase, setPhase] = useState<Phase>('confirmed');
  const [availability, setAvailability] = useState<WeekAvailability | null>(null);
  const [, startTransition] = useTransition();

  function handleBookNow() {
    setPhase('loading');
    startTransition(async () => {
      try {
        const data = await getFirstAvailableWeek();
        setAvailability(data);
        setPhase('booking');
      } catch {
        setPhase('error');
      }
    });
  }

  if (phase === 'booking' && availability) {
    return (
      <div className={styles.bookingView}>
        <div className={styles.bookingContext}>
          <p className={styles.bookingAs}>
            Booking as <strong>{name}</strong>
          </p>
          <button
            type="button"
            onClick={() => setPhase('confirmed')}
            className={styles.backLink}
          >
            Back
          </button>
        </div>

        <WeekGrid
          initial={availability}
          hostEmail={hostEmail}
          prefilled={{ name, email }}
        />
      </div>
    );
  }

  return (
    <div className={styles.card} role="status" aria-live="polite">
      <span className={styles.rule} aria-hidden />

      <h3 className={styles.heading}>Message sent.</h3>

      <p className={styles.body}>
        We&rsquo;ll be in touch shortly.
      </p>

      <span className={styles.divider} aria-hidden />

      <p className={styles.upsell}>
        Want to discuss your project sooner?
      </p>

      <Button
        variant="secondary"
        fullWidth
        onClick={handleBookNow}
        disabled={phase === 'loading'}
      >
        {phase === 'loading'
          ? 'Loading calendar…'
          : 'Book a free 30-minute consultation'}
      </Button>

      {phase === 'error' ? (
        <p className={styles.errorMsg} role="alert">
          Could not load the calendar. Please try again.
        </p>
      ) : null}
    </div>
  );
}
