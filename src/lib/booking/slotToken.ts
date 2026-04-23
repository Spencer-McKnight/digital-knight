import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { env } from '@/lib/env';

/**
 * Signed slot tokens.
 *
 *   Every free slot surfaced by `getWeekAvailability` is handed a fresh,
 *   server-signed token. `createBooking` will not accept a request without
 *   a token that verifies against the exact `startAtUTC` being booked.
 *
 *   This closes the direct-call attack path: knowing the UTC timestamp of
 *   a slot is not enough to book it — you also need a token, and tokens
 *   cannot be forged without the server-only signing key.
 *
 *   Format:  `${issuedAtMs}.${hmacHex}`
 *   Where:   hmacHex = HMAC-SHA256(key, `${startAtUTC}.${issuedAtMs}`)
 *            truncated to 16 bytes / 32 hex chars.
 *
 *   Constant-time compare on verify. Deny-by-default on any error.
 *   The signing key is server-only; this file is too (see `server-only`).
 */

const HMAC_HEX_LEN = 32; // 16 bytes of output, hex-encoded

function getSigningKey(): string {
  // `env.ts` preloads a dev fallback when missing in non-production; in
  // production the Zod schema will have already thrown at boot.
  const key = env.BOOKING_SLOT_SIGNING_KEY;
  if (!key || key.length < 32) {
    throw new Error('BOOKING_SLOT_SIGNING_KEY is missing or too short.');
  }
  return key;
}

function computeHmacHex(startAtUTC: string, issuedAtMs: number): string {
  const mac = createHmac('sha256', getSigningKey());
  mac.update(`${startAtUTC}.${issuedAtMs}`);
  return mac.digest('hex').slice(0, HMAC_HEX_LEN);
}

export function signSlotToken(startAtUTC: string): string {
  const issuedAtMs = Date.now();
  const hmacHex = computeHmacHex(startAtUTC, issuedAtMs);
  return `${issuedAtMs}.${hmacHex}`;
}

/**
 * Verify a slot token. Deny-by-default: any malformed input, key error, or
 * comparison throw returns `false` rather than propagating.
 */
export function verifySlotToken(
  startAtUTC: string,
  token: string,
  maxAgeMs: number,
): boolean {
  try {
    if (typeof token !== 'string') return false;
    const dot = token.indexOf('.');
    if (dot <= 0 || dot === token.length - 1) return false;

    const issuedAtStr = token.slice(0, dot);
    const providedHex = token.slice(dot + 1);

    // Accept only integer ms (no exponents, no leading zeros masking NaN).
    if (!/^\d{10,16}$/.test(issuedAtStr)) return false;
    const issuedAtMs = Number(issuedAtStr);
    if (!Number.isFinite(issuedAtMs)) return false;

    if (providedHex.length !== HMAC_HEX_LEN) return false;
    if (!/^[0-9a-f]+$/i.test(providedHex)) return false;

    const now = Date.now();
    // Reject tokens issued in the future beyond a small clock-skew tolerance,
    // and tokens older than `maxAgeMs`. Both guards are one-liners.
    if (issuedAtMs - now > 60_000) return false;
    if (now - issuedAtMs > maxAgeMs) return false;

    const expectedHex = computeHmacHex(startAtUTC, issuedAtMs);
    const a = Buffer.from(providedHex, 'hex');
    const b = Buffer.from(expectedHex, 'hex');
    if (a.length !== b.length) return false;

    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
