import type { CalendarLinks } from '@/lib/booking/calendarLinks';

/**
 * Public types for the booking Server Actions.
 *
 *   These live outside `booking.ts` on purpose: Turbopack (Next.js 16.1.x)
 *   incorrectly registers `export type` declarations inside a `'use server'`
 *   file as runtime Server Actions, producing errors like:
 *
 *     Export `WeekAvailability` doesn't exist in target module
 *
 *   See https://github.com/vercel/next.js/issues/92461. Keeping all
 *   type-only exports in this separate module is the recommended workaround
 *   and a no-op for TypeScript (types are erased at build time).
 */

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
  /** Market the booking came from; picks the confirmation email's language. */
  locale?: 'en-AU' | 'de-DE';
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
