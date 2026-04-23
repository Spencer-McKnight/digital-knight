import { env } from '@/lib/env';
import { getWeekAvailability, type WeekAvailability } from '@/app/_actions/booking';
import { currentWeekStart, toWeekISO } from '@/lib/booking/week';
import { WeekGrid } from './WeekGrid/WeekGrid';
import styles from './LetsTalk.module.scss';

/**
 * LetsTalk — the Call beat (`design.md` §9).
 *
 *   Server component. Composes the section copy, pre-fetches the current
 *   week's availability with the service-role client, and hands the payload
 *   to the client-side `WeekGrid`.
 *
 *   Design posture (`talk.md`):
 *   - The calendar is the focus; copy is short, bold, centred.
 *   - One-click commit from the grid; form appears only when a slot is
 *     selected.
 *   - Ember is reserved for the selected slot and the confirmation draw.
 *
 *   Failure mode: if the booking backend isn't configured in this
 *   environment, we render an empty (no bookings) week rather than crashing
 *   the page. The UI still behaves; the action will surface a server error
 *   at submit time.
 */

async function loadInitialAvailability(): Promise<WeekAvailability> {
  const tz = env.BUSINESS_TIMEZONE;
  const fallback: WeekAvailability = {
    weekISO: toWeekISO(currentWeekStart(tz)),
    weekStartUTC: currentWeekStart(tz).toDate().toISOString(),
    businessTimezone: tz,
    bookedSlotsUTC: [],
    horizonReached: false,
    atCurrentWeek: true,
  };

  try {
    return await getWeekAvailability(fallback.weekISO);
  } catch (e) {
    console.warn('[LetsTalk] initial availability unavailable, using fallback', e);
    return fallback;
  }
}

export async function LetsTalk() {
  const initial = await loadInitialAvailability();

  return (
    <section
      id="talk"
      data-ground="stone"
      className={styles.root}
      aria-labelledby="talk-title"
    >
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowDot} aria-hidden />
            Free · 30 minutes · One click
          </p>
          <h2 id="talk-title" className={styles.title}>
            Let&apos;s <span className={styles.emberWord}>talk</span> digital.
          </h2>
          <p className={styles.lede}>
            Pick a time. I&apos;ll bring strategy, recommendations, and an
            honest read on what to build next.
          </p>
        </header>

        <div className={styles.canvas}>
          <WeekGrid initial={initial} hostEmail={env.BOOKING_HOST_EMAIL} />
        </div>
      </div>
    </section>
  );
}
