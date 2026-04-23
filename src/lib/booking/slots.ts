import { CalendarDateTime, toZoned } from '@internationalized/date';
import type { ZonedDateTime } from '@internationalized/date';
import {
  BUSINESS_DAYS,
  BUSINESS_HOUR_END,
  BUSINESS_HOUR_START,
  SLOT_MINUTES,
  SLOTS_PER_DAY,
} from './config';

/**
 * Slot generation.
 *
 *   Availability is **generated**, never stored. For a given week the grid
 *   is a pure function of (weekStart, businessTZ). The server treats the
 *   bookings table as the subtractive set of "taken" slots.
 */

export type Slot = {
  /** UTC-anchored absolute ms — the canonical identity of the slot. */
  absoluteMs: number;
  /** UTC ISO 8601 string for wire / storage. */
  utc: string;
  /** Same instant, expressed in the business timezone. */
  businessZoned: ZonedDateTime;
  /** Column index 0–(days-1), within the week. */
  dayIndex: number;
  /** Row index 0–(slotsPerDay-1), within the day. */
  slotIndex: number;
};

/** Generate all 40 slots (4 × 10) for the week starting at `weekStart`. */
export function generateWeekSlots(weekStart: ZonedDateTime): Slot[] {
  const slots: Slot[] = [];

  BUSINESS_DAYS.forEach((_, dayIndex) => {
    for (let slotIndex = 0; slotIndex < SLOTS_PER_DAY; slotIndex++) {
      const hour = BUSINESS_HOUR_START + Math.floor((slotIndex * SLOT_MINUTES) / 60);
      const minute = (slotIndex * SLOT_MINUTES) % 60;

      // Build the instant from its components in the business tz. `toZoned`
      // handles DST disambiguation — defaults to `compatible`, which is the
      // right choice for forward transitions.
      const local = new CalendarDateTime(
        weekStart.year,
        weekStart.month,
        weekStart.day,
        hour,
        minute,
      ).add({ days: dayIndex });

      const zoned = toZoned(local, weekStart.timeZone);
      const absoluteMs = zoned.toDate().getTime();

      slots.push({
        absoluteMs,
        utc: new Date(absoluteMs).toISOString(),
        businessZoned: zoned,
        dayIndex,
        slotIndex,
      });
    }
  });

  return slots;
}

/** True if `startAtUTC` ISO string corresponds to a valid slot in the grid. */
export function isValidSlot(startAtUTC: string, weekStart: ZonedDateTime): boolean {
  const t = new Date(startAtUTC).getTime();
  if (Number.isNaN(t)) return false;

  // Bound check first — cheaper than iterating.
  const weekStartMs = weekStart.toDate().getTime();
  const weekEndMs = weekStartMs + 7 * 24 * 60 * 60 * 1000;
  if (t < weekStartMs || t >= weekEndMs) return false;

  const slots = generateWeekSlots(weekStart);
  return slots.some((s) => s.absoluteMs === t);
}

/** End of the meeting window for a given slot start. */
export function slotEndISO(startAtUTC: string, durationMin = SLOT_MINUTES): string {
  return new Date(new Date(startAtUTC).getTime() + durationMin * 60_000).toISOString();
}

/** Slot-count per day, for clients that want to lay out a grid without computing. */
export { SLOTS_PER_DAY, BUSINESS_HOUR_START, BUSINESS_HOUR_END };
