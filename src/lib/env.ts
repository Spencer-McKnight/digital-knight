import 'server-only';
import { z } from 'zod';

/**
 * Environment configuration.
 *
 *   Validated with Zod. Booking-service variables are marked `optional()` so
 *   the server can render the Let's Talk block without a configured Supabase
 *   or Resend — the action layer enforces presence at the moment it needs
 *   each value (see `requireEnv()` below).
 *
 *   Guarded with `import 'server-only'`; any client-bundle import is a
 *   compile-time error.
 */

// Slot-token signing key — deny-by-default in production, soft-land in dev.
//
// The key guards the HMAC that binds every bookable slot to a server-issued
// token. In production it is mandatory (schema enforces `min(32)`). In dev
// we pre-populate a deterministic fallback so a fresh clone can `pnpm dev`
// without a one-liner of setup; we log a loud warning so nobody ships it.
const IS_PROD = process.env.NODE_ENV === 'production';
const DEV_SLOT_SIGNING_KEY =
  'dev-fallback-do-not-use-in-production-00000000000000000000';

if (!process.env.BOOKING_SLOT_SIGNING_KEY && !IS_PROD) {
  process.env.BOOKING_SLOT_SIGNING_KEY = DEV_SLOT_SIGNING_KEY;
  console.warn(
    '[env] BOOKING_SLOT_SIGNING_KEY is missing — using a deterministic ' +
      'DEV fallback. Generate a real key with `openssl rand -hex 32` and ' +
      'add it to .env.local. This fallback will refuse to load in production.',
  );
}

const schema = z.object({
  // Supabase — server-only. The anon key is intentionally absent: this
  // feature owns zero client-side data paths.
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),

  // Resend
  RESEND_API_KEY: z.string().min(1).optional(),
  BOOKING_FROM_EMAIL: z.string().email().optional(),
  BOOKING_HOST_EMAIL: z.string().email().default('hello@digital-knight.au'),

  // Booking config — all have defaults, none are required to boot.
  BUSINESS_TIMEZONE: z.string().default('Australia/Melbourne'),
  BOOKING_HORIZON_WEEKS: z.coerce.number().int().min(1).max(26).default(8),
  BOOKING_HOST_NAME: z.string().default('Digital Knight'),
  BOOKING_HOST_DOMAIN: z.string().default('digital-knight.au'),

  // Minimum hours between now and the earliest bookable slot. Prevents
  // last-second bookings the host can't prepare for.
  BOOKING_MIN_NOTICE_HOURS: z.coerce.number().min(0).max(168).default(24),

  // HMAC key that signs per-slot booking tokens (see `lib/booking/slotToken`).
  // Required in production; dev fallback is wired in above.
  BOOKING_SLOT_SIGNING_KEY: z.string().min(32),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  // Only hit in dev if someone sets a malformed value. Shape errors are
  // never masked — the booking feature is too load-bearing for silent
  // fallbacks to make sense on misconfiguration (as opposed to omission).
  const issues = parsed.error.issues
    .map((i) => `  · ${i.path.join('.')}: ${i.message}`)
    .join('\n');
  throw new Error(
    `Invalid booking environment:\n${issues}\n` +
      'Populate these in .env.local (see talk.md §10).',
  );
}

export const env = parsed.data;
export type Env = typeof env;

/**
 * Assert that a given env key is present. Use at the seam where a missing
 * value would cause the call to do the wrong thing silently (e.g. sending
 * an email without an API key).
 */
export function requireEnv<K extends keyof Env>(key: K): NonNullable<Env[K]> {
  const value = env[key];
  if (value === undefined || value === null || value === '') {
    throw new Error(
      `Missing required env: ${String(key)}. Populate it in .env.local.`,
    );
  }
  return value as NonNullable<Env[K]>;
}
