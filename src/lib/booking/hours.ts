import { CalendarDate, fromAbsolute, toZoned, CalendarDateTime } from '@internationalized/date';
import type { WeekAvailability } from '@/app/_actions/booking.types';
import { generateWeekSlots } from './slots';

/**
 * The call window seen from a visitor's time zone, and the next free slot.
 * Pure functions: the Hours block and its tests both use them.
 */

export type Span = { from: number; to: number };

const DAY = 24 * 60;

/**
 * Minutes of the visitor's calendar day (0 to 1440) covered by the call
 * window, given the business days and hours. Handles windows that cross the
 * visitor's midnight and days either side of the business date.
 */
export function windowOnVisitorDay(opts: {
  /** Any instant inside the visitor day to draw. */
  dayMs: number;
  visitorTZ: string;
  businessTZ: string;
  days: ReadonlyArray<number>;
  startHour: number;
  endHour: number;
}): Span[] {
  const { dayMs, visitorTZ, businessTZ, days, startHour, endHour } = opts;
  const v = fromAbsolute(dayMs, visitorTZ);
  const dayStart = toZoned(new CalendarDateTime(v.year, v.month, v.day), visitorTZ).toDate().getTime();
  const dayEnd = toZoned(new CalendarDateTime(v.year, v.month, v.day).add({ days: 1 }), visitorTZ).toDate().getTime();

  const b = fromAbsolute(dayMs, businessTZ);
  const spans: Span[] = [];
  for (const offset of [-1, 0, 1]) {
    const date = new CalendarDate(b.year, b.month, b.day).add({ days: offset });
    const iso = ((date.toDate(businessTZ).getDay() + 6) % 7) + 1;
    if (!days.includes(iso)) continue;
    const start = toZoned(new CalendarDateTime(date.year, date.month, date.day, startHour), businessTZ).toDate().getTime();
    const end = toZoned(new CalendarDateTime(date.year, date.month, date.day, endHour), businessTZ).toDate().getTime();
    const from = Math.max(start, dayStart);
    const to = Math.min(end, dayEnd);
    if (to > from) {
      const scale = DAY / (dayEnd - dayStart);
      spans.push({ from: Math.round((from - dayStart) * scale), to: Math.round((to - dayStart) * scale) });
    }
  }
  return spans.sort((a, c) => a.from - c.from);
}

/** Minute of the visitor's day for an instant. */
export function minuteOfDay(ms: number, tz: string): number {
  const z = fromAbsolute(ms, tz);
  return z.hour * 60 + z.minute;
}

/** The earliest bookable slot in a week of availability, as a UTC ISO. */
export function nextFreeSlot(avail: WeekAvailability, nowMs = Date.now()): string | null {
  const tokens = Object.keys(avail.slotTokens ?? {});
  if (tokens.length) return tokens.sort()[0] ?? null;

  // No backend in this environment: offer the first slot the grid would.
  const weekStart = fromAbsolute(new Date(avail.weekStartUTC).getTime(), avail.businessTimezone);
  const booked = new Set(avail.bookedSlotsUTC.map((iso) => new Date(iso).getTime()));
  const slot = generateWeekSlots(weekStart).find(
    (s) => s.absoluteMs >= nowMs + avail.minNoticeMs && !booked.has(s.absoluteMs),
  );
  return slot?.utc ?? null;
}
