'use server';

import 'server-only';
import { unstable_cache, updateTag } from 'next/cache';
import { fromAbsolute, type ZonedDateTime } from '@internationalized/date';
import { z } from 'zod';
import { Resend } from 'resend';
import { env, requireEnv } from '@/lib/env';
import { supabaseAdmin } from '@/lib/supabase/server';
import {
  BUSINESS_DAYS,
  BUSINESS_HOUR_START,
  MEETING_FULL_DESCRIPTION,
  MEETING_LOCATION_URL,
  MEETING_TITLE,
  SLOTS_PER_DAY,
  SLOTS_PER_WEEK,
  SLOT_MINUTES,
} from '@/lib/booking/config';
import {
  currentWeekStart,
  fromWeekISO,
  toWeekISO,
  weekStart as weekStartOf,
  weeksBetween,
} from '@/lib/booking/week';
import { generateWeekSlots, isValidSlot, slotEndISO } from '@/lib/booking/slots';
import { buildICS } from '@/lib/booking/ics';
import { buildCalendarLinks, type CalendarLinks } from '@/lib/booking/calendarLinks';
import { signSlotToken, verifySlotToken } from '@/lib/booking/slotToken';
import { isDisposableEmail } from '@/lib/booking/disposableEmailDomains';
import BookingConfirmation from '@/emails/BookingConfirmation';

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

// ── PUBLIC TYPES ─────────────────────────────────────────────────────────────

export type WeekAvailability = {
  weekISO: string;
  /** Monday 00:00, business-timezone, as a UTC ISO (for grid reconstruction). */
  weekStartUTC: string;
  businessTimezone: string;
  /** UTC ISOs of booked slots. Rendered as `taken` in the grid. */
  bookedSlotsUTC: string[];
  /** True when `weekISO === current + BOOKING_HORIZON_WEEKS`. */
  horizonReached: boolean;
  /** True when `weekISO` is the current week (prev should be disabled). */
  atCurrentWeek: boolean;
  /**
   * Freshly-signed tokens keyed by the slot's UTC ISO string. Only free,
   * bookable slots are included — booked and past slots are omitted. The
   * client must echo the matching token back on `createBooking`.
   *
   * Issued per request; never cached alongside the booked-slots payload.
   */
  slotTokens: Record<string, string>;
  /** Minimum notice period in ms. Slots before `now + minNoticeMs` are unbookable. */
  minNoticeMs: number;
};

export type BookingInput = {
  name: string;
  email: string;
  startAtUTC: string;
  visitorTimezone: string;
  /** Echoed from `WeekAvailability.slotTokens[startAtUTC]`. */
  slotToken: string;
  /** Client-measured ms between BookingForm mount and submit. Soft spam signal. */
  formDwellMs: number;
  /** Honeypot — a hidden field humans never fill in. Leave empty. */
  company?: string;
};

export type BookingResult =
  | {
      ok: true;
      id: string;
      startAtUTC: string;
      endAtUTC: string;
      icsBase64: string;
      links: CalendarLinks;
      emailSent: boolean;
    }
  | {
      ok: false;
      reason: 'slot_taken' | 'slot_invalid' | 'validation' | 'server' | 'spam';
      message?: string;
    };

// ── INPUT SCHEMAS ────────────────────────────────────────────────────────────

const weekISOSchema = z
  .string()
  .regex(/^\d{4}-W\d{2}$/, 'Expected ISO-week format: YYYY-Www');

const bookingInputSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().toLowerCase().email().max(254),
  startAtUTC: z.string().datetime({ offset: true }),
  visitorTimezone: z.string().min(1).max(64),
  slotToken: z.string().min(1).max(128),
  formDwellMs: z.number().finite().min(0).max(7 * 24 * 60 * 60 * 1000),
  company: z.string().max(200).optional().default(''),
});

/** Max token age honoured by `verifySlotToken`. Matches the 30-min slot size. */
const SLOT_TOKEN_MAX_AGE_MS = 30 * 60 * 1000;
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
  // The cache wraps ONLY the DB read — tokens must be freshly signed on every
  // request so their issuedAt clock lives outside the cache.
  const cached = unstable_cache(
    async () => fetchBookedSlotsFromDB(weekStartMs),
    ['booking-week', parsed.data],
    { tags: [weekTag(parsed.data)], revalidate: 60 },
  );
  const bookedSlotsUTC = await cached();

  // Issue slot tokens for every *free* slot in the week. Booked or past
  // slots are deliberately absent so the UI can't pass a token for a slot
  // it shouldn't offer in the first place.
  const minNoticeMs = env.BOOKING_MIN_NOTICE_HOURS * 3_600_000;
  const slotTokens = issueSlotTokens(requested, bookedSlotsUTC, minNoticeMs);

  return {
    weekISO: parsed.data,
    weekStartUTC: new Date(weekStartMs).toISOString(),
    businessTimezone: tz,
    bookedSlotsUTC,
    horizonReached: delta === horizon,
    atCurrentWeek: delta === 0,
    slotTokens,
    minNoticeMs,
  };
}

/**
 * Sign a fresh token for every bookable slot in the week. Returns a map
 * keyed by the slot's canonical UTC ISO string. Booked and past slots
 * are skipped.
 */
function issueSlotTokens(
  weekStartZoned: ZonedDateTime,
  bookedSlotsUTC: string[],
  minNoticeMs: number,
): Record<string, string> {
  const booked = new Set(bookedSlotsUTC.map((iso) => new Date(iso).getTime()));
  const cutoffMs = Date.now() + minNoticeMs;
  const out: Record<string, string> = {};
  for (const slot of generateWeekSlots(weekStartZoned)) {
    if (slot.absoluteMs < cutoffMs) continue;
    if (booked.has(slot.absoluteMs)) continue;
    out[slot.utc] = signSlotToken(slot.utc);
  }
  return out;
}

/**
 * Find the first week (starting from current) that has at least one free slot.
 * This ensures the calendar opens on a week with availability rather than
 * potentially showing a fully booked current week.
 */
export async function getFirstAvailableWeek(): Promise<WeekAvailability> {
  const tz = env.BUSINESS_TIMEZONE;
  const horizon = env.BOOKING_HORIZON_WEEKS;

  let week = currentWeekStart(tz);

  for (let i = 0; i <= horizon; i++) {
    const weekISO = toWeekISO(week);
    const availability = await getWeekAvailability(weekISO);

    // Count unbookable slots (past + within the notice window)
    let pastSlots = 0;
    if (i === 0) {
      const cutoffMs = Date.now() + env.BOOKING_MIN_NOTICE_HOURS * 3_600_000;
      const weekStartMs = new Date(availability.weekStartUTC).getTime();
      const dayZeroStart = fromAbsolute(weekStartMs, tz).set({
        hour: BUSINESS_HOUR_START,
        minute: 0,
        second: 0,
        millisecond: 0,
      });

      for (let dayIndex = 0; dayIndex < BUSINESS_DAYS.length; dayIndex++) {
        for (let slotIndex = 0; slotIndex < SLOTS_PER_DAY; slotIndex++) {
          const slotZoned = dayZeroStart.add({
            days: dayIndex,
            minutes: slotIndex * SLOT_MINUTES,
          });
          if (slotZoned.toDate().getTime() < cutoffMs) {
            pastSlots++;
          }
        }
      }
    }

    const bookedCount = availability.bookedSlotsUTC.length;
    const unavailableCount = Math.max(pastSlots, bookedCount);
    const freeSlots = SLOTS_PER_WEEK - unavailableCount;

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

  // 3. Verify the server-issued slot token. Deny by default — a throw here
  //    surfaces as a `false` from `verifySlotToken`, not a 500. An invalid
  //    or expired token is semantically a `slot_invalid`.
  if (!verifySlotToken(data.startAtUTC, data.slotToken, SLOT_TOKEN_MAX_AGE_MS)) {
    return { ok: false, reason: 'slot_invalid' };
  }

  // 4. Slot validity — rebuild the week grid and confirm membership.
  const slotZoned = fromAbsolute(startAtMs, tz);
  const weekStart = weekStartOf(slotZoned);
  if (!isValidSlot(new Date(startAtMs).toISOString(), weekStart)) {
    return { ok: false, reason: 'slot_invalid' };
  }

  // Reject slots that fall within the minimum notice window.
  const minNoticeMs = env.BOOKING_MIN_NOTICE_HOURS * 3_600_000;
  if (startAtMs < Date.now() + minNoticeMs) {
    return { ok: false, reason: 'slot_invalid', message: 'Slot is too soon' };
  }

  // 5. Insert the booking. Unique (start_at) is the concurrency guard.
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

  // 6. Build ICS + calendar links.
  const endAtISO = slotEndISO(startAtISO, SLOT_MINUTES);
  let icsBase64 = '';
  try {
    icsBase64 = buildICS({
      uid: inserted.id,
      title: MEETING_TITLE,
      description: MEETING_FULL_DESCRIPTION,
      location: MEETING_LOCATION_URL,
      url: MEETING_LOCATION_URL,
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
      description: MEETING_FULL_DESCRIPTION,
      location: MEETING_LOCATION_URL,
      startUTC: startAtISO,
      endUTC: endAtISO,
    },
    icsBase64,
  );

  // 7. Send confirmation email. Non-blocking for the booking result itself.
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

  // 8. Invalidate the week cache for all open tabs.
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
