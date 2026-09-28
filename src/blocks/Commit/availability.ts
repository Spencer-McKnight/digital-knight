import 'server-only';
import { connection } from 'next/server';
import { cache } from 'react';
import { getFirstAvailableWeek } from '@/app/_actions/booking';
import type { WeekAvailability } from '@/app/_actions/booking.types';
import { env } from '@/lib/env';
import { currentWeekStart, toWeekISO } from '@/lib/booking/week';

/**
 * The first week with a free slot, loaded once per request. Slot tokens are
 * signed per request and expire, so pages that call this render on demand.
 * With no backend configured, an empty week keeps the page working.
 */
export const loadAvailability = cache(async (): Promise<WeekAvailability> => {
  await connection();
  const tz = env.BUSINESS_TIMEZONE;
  try {
    return await getFirstAvailableWeek();
  } catch (e) {
    console.warn('[Commit] availability unavailable, using an empty week', e);
    const week = currentWeekStart(tz);
    return {
      weekISO: toWeekISO(week),
      weekStartUTC: week.toDate().toISOString(),
      businessTimezone: tz,
      bookedSlotsUTC: [],
      horizonReached: false,
      atCurrentWeek: true,
      slotTokens: {},
      minNoticeMs: env.BOOKING_MIN_NOTICE_HOURS * 3_600_000,
    };
  }
});
