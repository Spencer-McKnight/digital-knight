import 'server-only';
import { createEvent, type EventAttributes } from 'ics';

/**
 * ICS file generation.
 *
 *   The `ics` package takes a date tuple in local time plus a `startInputType`
 *   of 'utc' to serialise in UTC reliably. We do all math on the UTC instant
 *   so the resulting VEVENT is timezone-unambiguous — clients translate to
 *   their local when rendering.
 *
 *   Returns a base64 string so the action's transport layer stays JSON-safe.
 */

export type BuildICSInput = {
  uid: string;
  title: string;
  description: string;
  startUTC: string;
  endUTC: string;
  organizer: { name: string; email: string };
  attendee: { name: string; email: string };
  domain: string;
};

type Tuple = [number, number, number, number, number];

function toTuple(iso: string): Tuple {
  const d = new Date(iso);
  return [
    d.getUTCFullYear(),
    d.getUTCMonth() + 1,
    d.getUTCDate(),
    d.getUTCHours(),
    d.getUTCMinutes(),
  ];
}

export function buildICS(input: BuildICSInput): string {
  const event: EventAttributes = {
    uid: `${input.uid}@${input.domain}`,
    title: input.title,
    description: input.description,
    start: toTuple(input.startUTC),
    end: toTuple(input.endUTC),
    startInputType: 'utc',
    startOutputType: 'utc',
    endInputType: 'utc',
    endOutputType: 'utc',
    status: 'CONFIRMED',
    busyStatus: 'BUSY',
    productId: `-//Digital Knight//Booking//EN`,
    organizer: { name: input.organizer.name, email: input.organizer.email },
    attendees: [
      {
        name: input.attendee.name,
        email: input.attendee.email,
        rsvp: false,
        partstat: 'ACCEPTED',
        role: 'REQ-PARTICIPANT',
      },
    ],
  };

  const { error, value } = createEvent(event);
  if (error || !value) {
    throw new Error(`Failed to build ICS: ${error?.message ?? 'unknown error'}`);
  }

  return Buffer.from(value, 'utf8').toString('base64');
}
