'use client';

import { useState, useCallback, useEffect } from 'react';
import type { WeekAvailability } from '@/app/_actions/booking.types';
import { Reveal } from '@/components/Reveal';
import { WeekGrid, type ConfirmationPayload } from './WeekGrid/WeekGrid';
import { Confirmation } from './Confirmation/Confirmation';
import { Typewriter } from './Typewriter';
import styles from './LetsTalk.module.scss';

/**
 * LetsTalkClient — owns the post-booking transition.
 *
 *   When a slot is confirmed the entire inner layout (header copy + calendar)
 *   is replaced by the Confirmation surface. The section shell (`LetsTalk`)
 *   stays mounted so the ember hairline and section padding persist.
 */

type LetsTalkClientProps = {
  initial: WeekAvailability;
  hostEmail: string;
};

export function LetsTalkClient({ initial, hostEmail }: LetsTalkClientProps) {
  const [confirmed, setConfirmed] = useState<ConfirmationPayload | null>(null);

  const handleConfirmed = useCallback((payload: ConfirmationPayload) => {
    setConfirmed(payload);
  }, []);

  useEffect(() => {
    if (confirmed) document.getElementById('talk')?.scrollIntoView({ behavior: 'smooth' });
  }, [confirmed]);

  if (confirmed) {
    return (
      <div className={styles.innerConfirmed}>
        <Confirmation
          slotLabel={confirmed.slotLabel}
          name={confirmed.name}
          email={confirmed.email}
          emailSent={confirmed.emailSent}
          links={confirmed.links}
          hostEmail={hostEmail}
        />
      </div>
    );
  }

  return (
    <div className={styles.inner}>
      <Reveal as="header" className={styles.header} amount="md">
        <h2 id="talk-title" className={styles.title}>
          Free strategy consult.
          <br />
          <span className={styles.emberWord}>30 mins</span>, great ideas.
        </h2>
      </Reveal>

      <div className={styles.canvas}>
        <WeekGrid
          initial={initial}
          hostEmail={hostEmail}
          onConfirmed={handleConfirmed}
        />
      </div>

      <Reveal as="div" className={styles.ledeBlock} amount="md">
        <p className={styles.ledePrompt}>
          You need
          <br />
          <Typewriter className={styles.typewriter} />
        </p>
        <p className={styles.lede}>
          I need to awesome clients like you.
          <br />
          My proposal? Let&apos;s talk.
        </p>
      </Reveal>
    </div>
  );
}
