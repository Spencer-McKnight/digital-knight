/**
 * Booking configuration — shape + constants.
 *
 *   Pure constants, safely importable from client and server alike. No
 *   environment access lives here; anything env-derived must flow in through
 *   the public `WeekAvailability` payload returned by the server action.
 */

/** Days of the week the booking grid offers. Monday = 1 … Sunday = 7 (ISO). */
export const BUSINESS_DAYS = [1, 2, 3, 4] as const; // Mon, Tue, Wed, Thu
export type BusinessDay = (typeof BUSINESS_DAYS)[number];

/** Start / end hours in the business timezone. Half-open: [start, end). */
export const BUSINESS_HOUR_START = 10;
export const BUSINESS_HOUR_END = 15;

/** Fixed slot granularity. 30 minutes is a product invariant. */
export const SLOT_MINUTES = 30;

/** Count of slots per business day — derived, not a second source of truth. */
export const SLOTS_PER_DAY =
  ((BUSINESS_HOUR_END - BUSINESS_HOUR_START) * 60) / SLOT_MINUTES;

/** Count of slots per week. 4 days × 10 slots = 40. */
export const SLOTS_PER_WEEK = BUSINESS_DAYS.length * SLOTS_PER_DAY;

/** Meeting title + description used across ICS, emails, calendar links. */
export const MEETING_TITLE = 'Digital Knight — Strategy Call';
export const MEETING_DESCRIPTION =
  'Free 30-minute digital strategy meeting. ' +
  "We'll cover project goals, pain points, and questions about digital. " +
  'You leave with ideas to align your website or tooling with your strategy, ' +
  'recommendations and plans, and future scoping opportunities.';
