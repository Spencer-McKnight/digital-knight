/**
 * Legal details, one source for the Impressum and both privacy policies.
 * Empty fields render nothing. Spencer to supply the address, and optionally
 * a phone number and ABN (`redesign/04-legal.md`, "Spencer to supply").
 */
export const legal = {
  controller: 'Spencer McKnight',
  tradingName: 'Digital Knight',
  address: {
    street: '',
    postcode: '',
    city: '',
  },
  email: 'hello@digital-knight.au',
  phone: '',
  abn: '',
  /** Spencer to set. */
  retention: { bookings: '', enquiries: '', serverLogs: '', analytics: '', googleAnalytics: '' },
  /** Spencer to confirm. */
  supabaseRegion: '',
  updated: { 'en-AU': '28 September 2026', 'de-DE': '28. September 2026' },
} as const;

const REQUIRED: ReadonlyArray<[string, string]> = [
  ['address.street', legal.address.street],
  ['address.postcode', legal.address.postcode],
  ['address.city', legal.address.city],
];

let warned = false;

/** Logs once per build while required legal fields are still empty. */
export function warnMissingLegal() {
  if (warned) return;
  warned = true;
  const missing = REQUIRED.filter(([, v]) => !v).map(([k]) => k);
  if (missing.length) {
    console.warn(
      `[legal] Impressum and privacy policy are missing: ${missing.join(', ')}. ` +
        'They render nothing until filled in src/content/legal.ts.',
    );
  }
}

/** Postcode and city on one line, or nothing. */
export function cityLine(): string {
  return [legal.address.postcode, legal.address.city].filter(Boolean).join(' ');
}
