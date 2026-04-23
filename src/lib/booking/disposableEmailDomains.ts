/**
 * Disposable-email-domain blocklist.
 *
 *   Small, hand-picked list of the common throwaway providers the booking
 *   form sees. Deliberately tiny — a 50k-entry list has a maintenance tax
 *   (and false-positive tax) that isn't worth it for a 30-min consult form.
 *
 *   Entries are lowercased domain parts ("mailinator.com", not "@mailinator"
 *   or full email). Matching happens on the lowercased suffix of the local-
 *   part-stripped email.
 */

export const DISPOSABLE_EMAIL_DOMAINS: ReadonlySet<string> = new Set([
  'mailinator.com',
  'guerrillamail.com',
  'guerrillamail.net',
  '10minutemail.com',
  '10minutemail.net',
  'tempmail.com',
  'trashmail.com',
  'yopmail.com',
  'sharklasers.com',
  'dispostable.com',
  'maildrop.cc',
  'mintemail.com',
  'getnada.com',
  'throwaway.email',
  'mailnesia.com',
]);

/** True if the email's domain part is in the blocklist. Safe against malformed input. */
export function isDisposableEmail(email: string): boolean {
  const at = email.lastIndexOf('@');
  if (at < 0 || at === email.length - 1) return false;
  const domain = email.slice(at + 1).trim().toLowerCase();
  return DISPOSABLE_EMAIL_DOMAINS.has(domain);
}
