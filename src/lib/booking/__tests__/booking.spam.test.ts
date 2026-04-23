import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * Contract-level tests for the spam filters in `createBooking`. The
 * Supabase client is mocked end-to-end so we can assert the action layer
 * without a network or database.
 */

beforeAll(() => {
  process.env.BUSINESS_TIMEZONE = 'Australia/Melbourne';
  process.env.BOOKING_HORIZON_WEEKS = '8';
  // Deliberately unset so the action skips Resend entirely.
  delete process.env.RESEND_API_KEY;
  delete process.env.BOOKING_FROM_EMAIL;
});

const insertSingle = vi.fn();
vi.mock('@/lib/supabase/server', () => ({
  supabaseAdmin: () => ({
    from: () => ({
      insert: () => ({
        select: () => ({
          single: insertSingle,
        }),
      }),
    }),
  }),
}));

vi.mock('next/cache', () => ({
  unstable_cache: (fn: unknown) => fn,
  updateTag: vi.fn(),
  revalidateTag: vi.fn(),
}));

const { createBooking } = await import('@/app/_actions/booking');

// AEST = UTC+10 in May (no DST), so a Monday 10:00 Melbourne slot is
// 00:00 UTC. We pin `Date.now()` to a Sunday so the slot is in the future.
const FAKE_NOW = new Date('2026-05-03T00:00:00.000Z');
const VALID_START_UTC = '2026-05-04T00:00:00.000Z';

function validPayload() {
  return {
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    startAtUTC: VALID_START_UTC,
    visitorTimezone: 'Europe/London',
    formDwellMs: 5000,
    company: '',
  };
}

beforeEach(() => {
  insertSingle.mockReset();
  insertSingle.mockResolvedValue({
    data: { id: '00000000-0000-4000-8000-000000000001', start_at: VALID_START_UTC },
    error: null,
  });
  vi.useFakeTimers();
  vi.setSystemTime(FAKE_NOW);
});

describe('createBooking — spam filters', () => {
  it('rejects with reason "spam" when the honeypot is filled', async () => {
    const result = await createBooking({ ...validPayload(), company: 'Acme Bot Co' });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe('spam');
    expect(insertSingle).not.toHaveBeenCalled();
  });

  it('rejects with reason "spam" when formDwellMs < 1500', async () => {
    const result = await createBooking({ ...validPayload(), formDwellMs: 250 });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe('spam');
    expect(insertSingle).not.toHaveBeenCalled();
  });

  it('rejects with reason "spam" when the email is on the disposable blocklist', async () => {
    const result = await createBooking({
      ...validPayload(),
      email: 'nope@mailinator.com',
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe('spam');
    expect(insertSingle).not.toHaveBeenCalled();
  });
});

describe('createBooking — happy path', () => {
  it('succeeds with clean inputs', async () => {
    const result = await createBooking(validPayload());
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.id).toBe('00000000-0000-4000-8000-000000000001');
      expect(result.startAtUTC).toBe(VALID_START_UTC);
      expect(result.links).toBeDefined();
    }
    expect(insertSingle).toHaveBeenCalledTimes(1);
  });
});
