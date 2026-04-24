import { beforeAll, describe, expect, it, vi } from 'vitest';

// The signing key must be set *before* `slotToken.ts` imports `env`, which
// happens at module-evaluation time. Set a deterministic test key and then
// use a dynamic import.
beforeAll(() => {
  process.env.BOOKING_SLOT_SIGNING_KEY =
    'test-key-test-key-test-key-test-key-test-key-00';
});

// Dynamic import so the env var above is picked up by `env.ts`.
const { signSlotToken, verifySlotToken } = await import('@/lib/booking/slotToken');

const MAX_AGE_MS = 30 * 60 * 1000;
const START_A = '2026-04-27T00:00:00.000Z';
const START_B = '2026-04-27T00:30:00.000Z';

describe('slotToken', () => {
  it('verifies a freshly-signed token for the same startAtUTC', () => {
    const token = signSlotToken(START_A);
    expect(verifySlotToken(START_A, token, MAX_AGE_MS)).toBe(true);
  });

  it('rejects a token signed for a different startAtUTC', () => {
    const token = signSlotToken(START_A);
    expect(verifySlotToken(START_B, token, MAX_AGE_MS)).toBe(false);
  });

  it('rejects a token whose HMAC suffix has been tampered with', () => {
    const token = signSlotToken(START_A);
    const [issuedAt, mac] = token.split('.');
    // Flip the last hex nibble so length stays the same but MAC differs.
    const lastChar = mac!.slice(-1);
    const flipped = lastChar === '0' ? '1' : '0';
    const tampered = `${issuedAt}.${mac!.slice(0, -1)}${flipped}`;
    expect(verifySlotToken(START_A, tampered, MAX_AGE_MS)).toBe(false);
  });

  it('rejects a token that is older than maxAgeMs', () => {
    vi.useFakeTimers();
    try {
      const base = new Date('2026-04-27T12:00:00.000Z').getTime();
      vi.setSystemTime(base);
      const token = signSlotToken(START_A);
      // Jump forward past the TTL.
      vi.setSystemTime(base + MAX_AGE_MS + 1);
      expect(verifySlotToken(START_A, token, MAX_AGE_MS)).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });

  it('denies by default on malformed input', () => {
    // Deliberately garbage shapes — all must resolve to false, never throw.
    expect(verifySlotToken(START_A, '', MAX_AGE_MS)).toBe(false);
    expect(verifySlotToken(START_A, 'no-dot', MAX_AGE_MS)).toBe(false);
    expect(verifySlotToken(START_A, '.missing-issued', MAX_AGE_MS)).toBe(false);
    expect(verifySlotToken(START_A, '1700000000000.', MAX_AGE_MS)).toBe(false);
    expect(verifySlotToken(START_A, 'abc.deadbeef', MAX_AGE_MS)).toBe(false);
    expect(verifySlotToken(START_A, '1700000000000.zzzz', MAX_AGE_MS)).toBe(false);
  });
});
