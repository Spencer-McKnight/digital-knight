import { describe, expect, it } from 'vitest';
import { nextFreeSlot, windowOnVisitorDay } from '@/lib/booking/hours';

const base = { businessTZ: 'Australia/Melbourne', days: [1, 2, 3, 4], startHour: 10, endHour: 15 };

describe('windowOnVisitorDay', () => {
  it('maps the Melbourne window into Berlin summer time (02:00 to 07:00)', () => {
    // Tuesday 2 June 2026, 12:00 in Berlin.
    const spans = windowOnVisitorDay({ ...base, dayMs: Date.UTC(2026, 5, 2, 10), visitorTZ: 'Europe/Berlin' });
    expect(spans).toEqual([{ from: 2 * 60, to: 7 * 60 }]);
  });

  it('maps it into Berlin winter time (00:00 to 05:00)', () => {
    // Tuesday 10 February 2026.
    const spans = windowOnVisitorDay({ ...base, dayMs: Date.UTC(2026, 1, 10, 11), visitorTZ: 'Europe/Berlin' });
    expect(spans).toEqual([{ from: 0, to: 5 * 60 }]);
  });

  it('shows the in-between weeks when only one country has changed its clocks', () => {
    // Tuesday 14 April 2026: Melbourne on standard time, Berlin on summer time.
    const spans = windowOnVisitorDay({ ...base, dayMs: Date.UTC(2026, 3, 14, 10), visitorTZ: 'Europe/Berlin' });
    expect(spans).toEqual([{ from: 2 * 60, to: 7 * 60 }]);
    // Tuesday 13 October 2026: Melbourne on summer time, Berlin still on summer time.
    const october = windowOnVisitorDay({ ...base, dayMs: Date.UTC(2026, 9, 13, 10), visitorTZ: 'Europe/Berlin' });
    expect(october).toEqual([{ from: 1 * 60, to: 6 * 60 }]);
  });

  it('splits a window across the visitor midnight and skips non-business days', () => {
    // Monday 1 June 2026 in New York: Tuesday's Melbourne window starts 20:00
    // Monday; Monday's own window ended before this day began.
    const spans = windowOnVisitorDay({ ...base, dayMs: Date.UTC(2026, 5, 1, 16), visitorTZ: 'America/New_York' });
    expect(spans).toEqual([{ from: 20 * 60, to: 24 * 60 }]);
    // Sunday in Melbourne has no window.
    const sunday = windowOnVisitorDay({ ...base, dayMs: Date.UTC(2026, 5, 7, 2), visitorTZ: 'Australia/Melbourne' });
    expect(sunday).toEqual([]);
  });
});

describe('nextFreeSlot', () => {
  const week = {
    weekISO: '2026-W23',
    weekStartUTC: '2026-05-31T14:00:00.000Z', // Monday 1 June 2026, 00:00 Melbourne
    businessTimezone: 'Australia/Melbourne',
    bookedSlotsUTC: [] as string[],
    horizonReached: false,
    atCurrentWeek: true,
    slotTokens: {} as Record<string, string>,
    minNoticeMs: 24 * 3_600_000,
  };

  it('takes the earliest slot that holds a token', () => {
    const avail = { ...week, slotTokens: { '2026-06-03T01:30:00.000Z': 't2', '2026-06-02T00:00:00.000Z': 't1' } };
    expect(nextFreeSlot(avail)).toBe('2026-06-02T00:00:00.000Z');
  });

  it('without a backend, offers the first slot past the notice window that is not booked', () => {
    // Sunday 31 May, 12:00 Melbourne: the morning slots on Monday fall inside
    // 24 hours' notice, and Monday 12:00 is booked, so 12:30 is next.
    const now = Date.UTC(2026, 4, 31, 2);
    const avail = { ...week, bookedSlotsUTC: ['2026-06-01T02:00:00.000Z'] };
    expect(nextFreeSlot(avail, now)).toBe('2026-06-01T02:30:00.000Z');
  });
});
