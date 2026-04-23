import {
  CalendarDateTime,
  fromAbsolute,
  getLocalTimeZone,
  now,
  parseAbsolute,
  startOfWeek,
  toCalendarDate,
  toZoned,
} from '@internationalized/date';
import type { CalendarDate, ZonedDateTime } from '@internationalized/date';

/**
 * Week math.
 *
 *   The booking grid lives on a Monday-aligned ISO week in the **business**
 *   timezone. All math flows through `@internationalized/date` so DST and tz
 *   quirks are handled without special cases.
 *
 *   The week identifier on the wire is ISO week (e.g. `2026-W17`) — stable,
 *   sortable, timezone-free, and round-trippable into a `ZonedDateTime` given
 *   a business timezone.
 */

export type WeekISO = `${number}-W${number}`;

// Locale doesn't matter once `firstDayOfWeek: 'mon'` is supplied explicitly,
// but passing something stable keeps the call site intention-clear.
const WEEK_LOCALE = 'en-GB';

/** Monday 00:00 of the week containing `instant`, in `instant`'s timezone. */
export function weekStart(instant: ZonedDateTime): ZonedDateTime {
  const mondayDate = startOfWeek(toCalendarDate(instant), WEEK_LOCALE, 'mon');
  return toZoned(
    new CalendarDateTime(mondayDate.year, mondayDate.month, mondayDate.day),
    instant.timeZone,
  );
}

/** Monday 00:00 of the current week in the business timezone. */
export function currentWeekStart(businessTZ: string): ZonedDateTime {
  return weekStart(now(businessTZ));
}

/** Shift a Monday-aligned week start by `n` weeks, re-aligning at midnight. */
export function shiftWeek(week: ZonedDateTime, n: number): ZonedDateTime {
  return weekStart(week.add({ weeks: n }));
}

/** ISO-8601 week number (1–53) of the given calendar date. */
export function isoWeekNumber(date: CalendarDate): number {
  const d = new Date(Date.UTC(date.year, date.month - 1, date.day));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/** ISO-8601 week year (may differ from calendar year at year boundaries). */
export function isoWeekYear(date: CalendarDate): number {
  const d = new Date(Date.UTC(date.year, date.month - 1, date.day));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  return d.getUTCFullYear();
}

/** Serialize a Monday-aligned week start to its ISO-week identifier. */
export function toWeekISO(week: ZonedDateTime): WeekISO {
  const cd = toCalendarDate(week);
  const year = isoWeekYear(cd);
  const w = isoWeekNumber(cd);
  return `${year}-W${String(w).padStart(2, '0')}` as WeekISO;
}

/** Parse an ISO-week identifier back into a Monday-00:00 in `businessTZ`. */
export function fromWeekISO(iso: string, businessTZ: string): ZonedDateTime {
  const match = /^(\d{4})-W(\d{2})$/.exec(iso);
  if (!match) throw new Error(`Invalid weekISO: ${iso}`);
  const year = Number(match[1]);
  const week = Number(match[2]);

  // ISO: week 1 is the week containing Jan 4th. Take its Monday, then add
  // (week - 1) weeks to land on the requested week's Monday.
  const jan4 = new CalendarDateTime(year, 1, 4);
  const week1Monday = startOfWeek(jan4, WEEK_LOCALE, 'mon');
  const targetMonday = week1Monday.add({ weeks: week - 1 });
  return toZoned(targetMonday, businessTZ);
}

/** Whole-weeks distance between two instants (`b - a`, in business weeks). */
export function weeksBetween(a: ZonedDateTime, b: ZonedDateTime): number {
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  return Math.round((b.toDate().getTime() - a.toDate().getTime()) / msPerWeek);
}

/** UTC ISO string → ZonedDateTime in `tz`. */
export function zonedFromUTC(iso: string, tz: string): ZonedDateTime {
  return parseAbsolute(iso, tz);
}

/** Visitor's resolved IANA timezone, with a safe fallback for SSR. */
export function visitorTimezone(): string {
  if (typeof Intl === 'undefined') return 'UTC';
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? getLocalTimeZone();
  } catch {
    return getLocalTimeZone();
  }
}

/** "27 Apr – 03 May" — week range in the visitor's timezone and locale. */
export function formatWeekRange(
  weekStartBusinessTZ: ZonedDateTime,
  visitorTZ: string,
  locale = 'en-GB',
): string {
  const startAbs = weekStartBusinessTZ.toDate().getTime();
  const endAbs = startAbs + 6 * 24 * 60 * 60 * 1000;

  const visStart = fromAbsolute(startAbs, visitorTZ);
  const visEnd = fromAbsolute(endAbs, visitorTZ);

  const monthFmt = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    timeZone: visitorTZ,
  });
  const dayFmt = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    timeZone: visitorTZ,
  });

  if (visStart.month === visEnd.month) {
    return `${dayFmt.format(new Date(startAbs))} – ${monthFmt.format(new Date(endAbs))}`;
  }
  return `${monthFmt.format(new Date(startAbs))} – ${monthFmt.format(new Date(endAbs))}`;
}
