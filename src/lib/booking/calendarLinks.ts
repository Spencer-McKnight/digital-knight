/**
 * Add-to-calendar deep-links — built client-side from the booking result.
 *
 *   Google and Outlook use pre-filled event URLs (zero dependencies). Apple
 *   (and any ICS-capable calendar) gets a `data:` URI built from the base64
 *   ICS blob the server returns.
 */

export type CalendarLinkInput = {
  title: string;
  description: string;
  /** Physical/virtual location — surfaces as `location` in Google/Outlook compose pages. */
  location?: string;
  /** UTC ISO 8601 start. */
  startUTC: string;
  /** UTC ISO 8601 end. */
  endUTC: string;
};

/** YYYYMMDDTHHMMSSZ — Google / Outlook's preferred UTC format. */
function toCompactUTC(iso: string): string {
  return iso.replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

export function googleLink({ title, description, location, startUTC, endUTC }: CalendarLinkInput): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    details: description,
    dates: `${toCompactUTC(startUTC)}/${toCompactUTC(endUTC)}`,
  });
  if (location) params.set('location', location);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function outlookLink({ title, description, location, startUTC, endUTC }: CalendarLinkInput): string {
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    startdt: startUTC,
    enddt: endUTC,
    subject: title,
    body: description,
  });
  if (location) params.set('location', location);
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

/** `data:` URI for Apple Calendar / any ICS-capable client. */
export function appleLink(icsBase64: string): string {
  return `data:text/calendar;charset=utf-8;base64,${icsBase64}`;
}

export type CalendarLinks = {
  google: string;
  outlook: string;
  apple: string;
};

export function buildCalendarLinks(
  input: CalendarLinkInput,
  icsBase64: string,
): CalendarLinks {
  return {
    google: googleLink(input),
    outlook: outlookLink(input),
    apple: appleLink(icsBase64),
  };
}
