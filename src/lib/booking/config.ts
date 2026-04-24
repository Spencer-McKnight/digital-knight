/**
 * Booking configuration — shape + constants.
 *
 *   Pure constants, safely importable from client and server alike. No
 *   environment access lives here; anything env-derived must flow in through
 *   the public `WeekAvailability` payload returned by the server action.
 */

/**
 * Single source of truth for when calls are offered.
 *
 *   Change `BUSINESS_DAYS`, `BUSINESS_HOUR_START`, or `BUSINESS_HOUR_END` here
 *   and the grid, slot generator, server action, styling, and accessible
 *   labels all follow. Nothing downstream should hardcode day-counts, hour
 *   bounds, or slots-per-day — derive from these constants.
 */

/**
 * Days of the week the booking grid offers, in render order.
 * Monday = 1 … Sunday = 7 (ISO).
 */
export const BUSINESS_DAYS = [1, 2, 3, 4, 5] as const; // Mon, Tue, Wed, Thu, Fri
export type BusinessDay = (typeof BUSINESS_DAYS)[number];

/** Start / end hours in the business timezone. Half-open: [start, end). */
export const BUSINESS_HOUR_START = 10;
export const BUSINESS_HOUR_END = 15;

/** Fixed slot granularity. 30 minutes is a product invariant. */
export const SLOT_MINUTES = 30;

/** Count of slots per business day — derived, not a second source of truth. */
export const SLOTS_PER_DAY =
  ((BUSINESS_HOUR_END - BUSINESS_HOUR_START) * 60) / SLOT_MINUTES;

/** Count of slots per week — derived from `BUSINESS_DAYS` and `SLOTS_PER_DAY`. */
export const SLOTS_PER_WEEK = BUSINESS_DAYS.length * SLOTS_PER_DAY;

/** Meeting title + description used across ICS, emails, calendar links. */
export const MEETING_TITLE = 'Digital Knight — Strategy Call';
export const MEETING_DESCRIPTION =
  'Free 30-minute digital strategy meeting. ' +
  "We'll cover project goals, pain points, and questions about digital. " +
  'You leave with ideas to align your website or tooling with your strategy, ' +
  'recommendations and plans, and future scoping opportunities.';

/** Google Meet room — permanent, shared across all bookings. */
export const MEETING_LOCATION_URL = 'https://meet.google.com/brt-npuu-dwp';
/** Human-readable form (shown in labels). */
export const MEETING_LOCATION_LABEL = 'meet.google.com/brt-npuu-dwp';
/** Phone-in fallback for when a browser / camera isn't available. */
export const MEETING_DIAL_IN_COUNTRY = 'AU';
export const MEETING_DIAL_IN_NUMBER = '+61 3 8594 6925';
export const MEETING_PIN = '283 854 978#';

/**
 * Join block appended to the meeting description in ICS + calendar deep-links.
 * Kept as plain text so it renders legibly in every calendar client.
 */
export const MEETING_JOIN_BLOCK =
  `Join Google Meet: ${MEETING_LOCATION_URL}\n` +
  `Dial-in (${MEETING_DIAL_IN_COUNTRY}): ${MEETING_DIAL_IN_NUMBER} · PIN: ${MEETING_PIN}\n` +
  `Need to reschedule? Just reply to the confirmation email.`;

/** Full description bundled into ICS + Google/Outlook links. Join block leads so it's the first thing visible when the event opens. */
export const MEETING_FULL_DESCRIPTION = `${MEETING_JOIN_BLOCK}\n\n${MEETING_DESCRIPTION}`;
