'use server';

import 'server-only';
import { unstable_cache, updateTag } from 'next/cache';
import { fromAbsolute } from '@internationalized/date';
import { z } from 'zod';
import { Resend } from 'resend';
import { env, requireEnv } from '@/lib/env';
import { supabaseAdmin } from '@/lib/supabase/server';
import {
  MEETING_DESCRIPTION,
  MEETING_TITLE,
  SLOT_MINUTES,
} from '@/lib/booking/config';
import {
  currentWeekStart,
  fromWeekISO,
  toWeekISO,
  weekStart as weekStartOf,
  weeksBetween,
} from '@/lib/booking/week';
import { isValidSlot, slotEndISO } from '@/lib/booking/slots';
import { buildICS } from '@/lib/booking/ics';
import { buildCalendarLinks } from '@/lib/booking/calendarLinks';
import { isDisposableEmail } from '@/lib/booking/disposableEmailDomains';
import BookingConfirmation from '@/emails/BookingConfirmation';
import type {
  BookingInput,
  BookingResult,
  WeekAvailability,
} from './booking.types';

/**
 * Server Actions — booking.
 *
 *   Two entry points, both typed end-to-end:
 *
 *     getWeekAvailability(weekISO) -> WeekAvailability
 *     createBooking(input)         -> BookingResult
 *
 *   Hard rules carried from `talk.md`:
 *   - Slot identity is the UTC timestamp.
 *   - The client never holds a Supabase key — everything here is service role.
 *   - Email failure does NOT roll back a booking. A stored row is authoritative.
 */

// Public types live in `./booking.types` — see that file for the rationale.
// This module is `'use server'`, so it may only export async functions.

// ── INPUT SCHEMAS ────────────────────────────────────────────────────────────

const weekISOSchema = z
  .string()
  .regex(/^\d{4}-W\d{2}$/, 'Expected ISO-week format: YYYY-Www');

const bookingInputSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().toLowerCase().email().max(254),
  startAtUTC: z.string().datetime({ offset: true }),
  visitorTimezone: z.string().min(1).max(64),
  formDwellMs: z.number().finite().min(0).max(7 * 24 * 60 * 60 * 1000),
  company: z.string().max(200).optional().default(''),
});

/** Minimum form dwell in ms. Below this is almost certainly a bot. */
const MIN_FORM_DWELL_MS = 1500;

// ── CACHE KEYS ───────────────────────────────────────────────────────────────

const weekTag = (iso: string) => `bookings:${iso}`;

// ── HELPERS ──────────────────────────────────────────────────────────────────

async function fetchBookedSlotsFromDB(weekStartUTCms: number): Promise<string[]> {
  // Service not configured yet → report an empty booked-set so the grid
  // shows every slot as free. Submitting a booking will still fail loudly
  // at the insertion site.
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return [];
  }

  const supabase = supabaseAdmin();
  const { data, error } = await supabase.rpc('get_week_availability', {
    week_start_utc: new Date(weekStartUTCms).toISOString(),
  });
  if (error) {
    throw new Error(`get_week_availability failed: ${error.message}`);
  }
  const rows = (data as Array<{ start_at: string }> | null) ?? [];
  return rows.map((r) => new Date(r.start_at).toISOString());
}

// ── PUBLIC ACTIONS ───────────────────────────────────────────────────────────

export async function getWeekAvailability(weekISO: string): Promise<WeekAvailability> {
  const parsed = weekISOSchema.safeParse(weekISO);
  if (!parsed.success) {
    throw new Error(`Invalid weekISO: ${weekISO}`);
  }

  const tz = env.BUSINESS_TIMEZONE;
  const horizon = env.BOOKING_HORIZON_WEEKS;

  const current = currentWeekStart(tz);
  const requested = fromWeekISO(parsed.data, tz);

  const delta = weeksBetween(current, requested);
  if (delta < 0) {
    // Clamp past weeks to the current week — the UI must not allow this, but
    // the action is the last line of defence.
    return getWeekAvailability(toWeekISO(current));
  }
  if (delta > horizon) {
    throw new Error(
      `weekISO ${weekISO} is beyond BOOKING_HORIZON_WEEKS (${horizon}).`,
    );
  }

  const weekStartMs = requested.toDate().getTime();

  // Per-week cache, invalidated by `createBooking` via `revalidateTag`.
  const cached = unstable_cache(
    async () => fetchBookedSlotsFromDB(weekStartMs),
    ['booking-week', parsed.data],
    { tags: [weekTag(parsed.data)], revalidate: 60 },
  );
  const bookedSlotsUTC = await cached();

  return {
    weekISO: parsed.data,
    weekStartUTC: new Date(weekStartMs).toISOString(),
    businessTimezone: tz,
    bookedSlotsUTC,
    horizonReached: delta === horizon,
    atCurrentWeek: delta === 0,
  };
}

/**
 * Find the first week (starting from current) that has at least one free slot.
 * This ensures the calendar opens on a week with availability rather than
 * potentially showing a fully booked current week.
 */
export async function getFirstAvailableWeek(): Promise<WeekAvailability> {
  const tz = env.BUSINESS_TIMEZONE;
  const horizon = env.BOOKING_HORIZON_WEEKS;
  const totalSlotsPerWeek = 40; // 4 days × 10 slots

  let week = currentWeekStart(tz);

  for (let i = 0; i <= horizon; i++) {
    const weekISO = toWeekISO(week);
    const availability = await getWeekAvailability(weekISO);

    // Count past slots in the current week (they're not bookable)
    let pastSlots = 0;
    if (i === 0) {
      const now = Date.now();
      pastSlots = availability.bookedSlotsUTC.length; // start with booked
      // Also need to count actual past slots based on time
      const weekStartMs = new Date(availability.weekStartUTC).getTime();
      const dayZeroStart = fromAbsolute(weekStartMs, tz).set({
        hour: 10,
        minute: 0,
        second: 0,
        millisecond: 0,
      });

      // Count how many slots are in the past
      pastSlots = 0;
      for (let dayIndex = 0; dayIndex < 4; dayIndex++) {
        for (let slotIndex = 0; slotIndex < 10; slotIndex++) {
          const slotZoned = dayZeroStart.add({
            days: dayIndex,
            minutes: slotIndex * 30,
          });
          if (slotZoned.toDate().getTime() < now) {
            pastSlots++;
          }
        }
      }
    }

    const bookedCount = availability.bookedSlotsUTC.length;
    const unavailableCount = Math.max(pastSlots, bookedCount);
    const freeSlots = totalSlotsPerWeek - unavailableCount;

    if (freeSlots > 0) {
      return availability;
    }

    // Move to next week
    week = week.add({ weeks: 1 });
  }

  // If all weeks are full, return the current week anyway
  return getWeekAvailability(toWeekISO(currentWeekStart(tz)));
}

export async function createBooking(input: BookingInput): Promise<BookingResult> {
  // 1. Validate input shape.
  const parsed = bookingInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      reason: 'validation',
      message: parsed.error.issues.map((i) => i.message).join('; '),
    };
  }
  const data = parsed.data;

  // 2. Spam filters. Order is deliberate: cheapest first, and we never leak
  //    which check tripped. All three funnel to the generic `spam` reason so
  //    the UI can render the same neutral message as a validation failure.
  //
  //    a) Honeypot — a hidden <input name="company"> that humans can't see.
  if (data.company && data.company.trim().length > 0) {
    console.warn('[booking] rejected: honeypot');
    return { ok: false, reason: 'spam' };
  }
  //    b) Dwell-time floor. Trivial for humans; drive-by bots tend to submit
  //       immediately on mount. Value is untrusted — treat as a soft signal.
  if (data.formDwellMs < MIN_FORM_DWELL_MS) {
    console.warn('[booking] rejected: dwell');
    return { ok: false, reason: 'spam' };
  }
  //    c) Disposable-email-domain blocklist.
  if (isDisposableEmail(data.email)) {
    console.warn('[booking] rejected: disposable');
    return { ok: false, reason: 'spam' };
  }

  const tz = env.BUSINESS_TIMEZONE;
  const startAtMs = new Date(data.startAtUTC).getTime();
  if (Number.isNaN(startAtMs)) {
    return { ok: false, reason: 'validation', message: 'Invalid startAtUTC' };
  }

  // 3. Slot validity — rebuild the week grid and confirm membership.
  const slotZoned = fromAbsolute(startAtMs, tz);
  const weekStart = weekStartOf(slotZoned);
  if (!isValidSlot(new Date(startAtMs).toISOString(), weekStart)) {
    return { ok: false, reason: 'slot_invalid' };
  }

  // Also reject slots in the past — cheap last-mile guard against stale UIs.
  if (startAtMs < Date.now()) {
    return { ok: false, reason: 'slot_invalid', message: 'Slot is in the past' };
  }

  // 4. Insert the booking. Unique (start_at) is the concurrency guard.
  const startAtISO = new Date(startAtMs).toISOString();
  const supabase = supabaseAdmin();
  const { data: inserted, error } = await supabase
    .from('bookings')
    .insert({
      start_at: startAtISO,
      duration_min: SLOT_MINUTES,
      name: data.name,
      email: data.email,
    })
    .select('id, start_at')
    .single();

  if (error) {
    // Postgres unique violation → slot_taken.
    if ((error as { code?: string }).code === '23505') {
      return { ok: false, reason: 'slot_taken' };
    }
    return { ok: false, reason: 'server', message: error.message };
  }

  // 5. Build ICS + calendar links.
  const endAtISO = slotEndISO(startAtISO, SLOT_MINUTES);
  let icsBase64 = '';
  try {
    icsBase64 = buildICS({
      uid: inserted.id,
      title: MEETING_TITLE,
      description: MEETING_DESCRIPTION,
      startUTC: startAtISO,
      endUTC: endAtISO,
      organizer: { name: env.BOOKING_HOST_NAME, email: env.BOOKING_HOST_EMAIL },
      attendee: { name: data.name, email: data.email },
      domain: env.BOOKING_HOST_DOMAIN,
    });
  } catch (e) {
    // If ICS generation fails the booking still stands — the confirmation
    // email's calendar attachment is a convenience, not a contract.
    console.error('[booking] ICS build failed', e);
  }

  const links = buildCalendarLinks(
    {
      title: MEETING_TITLE,
      description: MEETING_DESCRIPTION,
      startUTC: startAtISO,
      endUTC: endAtISO,
    },
    icsBase64,
  );

  // 6. Send confirmation email. Non-blocking for the booking result itself.
  const emailSent = await sendConfirmation({
    name: data.name,
    email: data.email,
    startAtUTC: startAtISO,
    endAtUTC: endAtISO,
    visitorTimezone: data.visitorTimezone,
    icsBase64,
  }).catch((e) => {
    console.error('[booking] Resend failed', e);
    return false;
  });

  // 7. Invalidate the week cache for all open tabs.
  //    `updateTag` is the Server-Action flavour; it enables read-your-own-
  //    writes in the same request cycle.
  const weekISO = toWeekISO(weekStart);
  updateTag(weekTag(weekISO));

  return {
    ok: true,
    id: inserted.id,
    startAtUTC: startAtISO,
    endAtUTC: endAtISO,
    icsBase64,
    links,
    emailSent,
  };
}

// ── INTERNAL: EMAIL ──────────────────────────────────────────────────────────

type SendConfirmationInput = {
  name: string;
  email: string;
  startAtUTC: string;
  endAtUTC: string;
  visitorTimezone: string;
  icsBase64: string;
};

async function sendConfirmation(payload: SendConfirmationInput): Promise<boolean> {
  if (!env.RESEND_API_KEY || !env.BOOKING_FROM_EMAIL) {
    console.warn('[booking] Resend env not configured — skipping email.');
    return false;
  }

  const resend = new Resend(requireEnv('RESEND_API_KEY'));

  const whenVisitor = formatMeetingTime(payload.startAtUTC, payload.visitorTimezone);
  const whenBusiness = formatMeetingTime(payload.startAtUTC, env.BUSINESS_TIMEZONE);

  const { error } = await resend.emails.send({
    from: `${env.BOOKING_HOST_NAME} <${requireEnv('BOOKING_FROM_EMAIL')}>`,
    to: payload.email,
    bcc: env.BOOKING_HOST_EMAIL,
    subject: 'Your Digital Knight strategy call is booked',
    replyTo: env.BOOKING_HOST_EMAIL,
    react: BookingConfirmation({
      name: payload.name,
      whenVisitor,
      whenBusiness,
      visitorTimezone: payload.visitorTimezone,
      hostEmail: env.BOOKING_HOST_EMAIL,
    }),
    attachments: payload.icsBase64
      ? [
          {
            filename: 'digital-knight-strategy-call.ics',
            content: payload.icsBase64,
            contentType: 'text/calendar',
          },
        ]
      : undefined,
  });

  if (error) {
    console.error('[booking] Resend error', error);
    return false;
  }
  return true;
}

/** "Wed 29 Apr 2026 · 10:30 – 11:00 AM" in the given timezone. */
function formatMeetingTime(startAtUTC: string, tz: string): string {
  const start = new Date(startAtUTC);
  const end = new Date(start.getTime() + SLOT_MINUTES * 60_000);

  const dayFmt = new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: tz,
  });
  const timeFmt = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: tz,
  });

  return `${dayFmt.format(start)} · ${timeFmt.format(start)}–${timeFmt.format(end)} ${tz}`;
}
