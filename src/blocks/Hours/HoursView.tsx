'use client';

import { useSyncExternalStore } from 'react';
import { BlockHead } from '@/components/BlockHead/BlockHead';
import { NextMark } from '@/components/NextMark/NextMark';
import type { Locale } from '@/content/routes';
import { minuteOfDay, windowOnVisitorDay } from '@/lib/booking/hours';
import styles from './Hours.module.scss';

export type HoursCopy = {
  /** "Calls run {days}, {start} to {end} in {city}." */
  window: string;
  /** "That is {start} to {end} your time ({zone})." */
  yours: string;
  /** "Next free: {visitor} your time ({business} {city})" */
  nextFree: string;
  /** Shown when no slot is free inside the booking horizon. */
  none: string;
  /** "{first} to {last}" */
  dayRange: string;
  city: string;
  now: string;
  /** Caption for the strip, "{day}, your time" */
  strip: string;
};

type Props = {
  variant: 'full' | 'compact';
  locale: Locale;
  folio?: string;
  title?: string;
  copy: HoursCopy;
  businessTimezone: string;
  days: ReadonlyArray<number>;
  startHour: number;
  endHour: number;
  nextFreeUTC: string | null;
};

const noop = () => () => {};
const visitorZone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;
// Rounded to the minute so the snapshot stays stable between reads.
const thisMinute = () => Math.floor(Date.now() / 60_000) * 60_000;

const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (_, k: string) => values[k] ?? '');

export function HoursView(props: Props) {
  const { variant, locale, folio, title, copy, businessTimezone, days, startHour, endHour, nextFreeUTC } = props;
  const zone = useSyncExternalStore(noop, visitorZone, () => businessTimezone);
  const nowMs = useSyncExternalStore(noop, thisMinute, () => 0);

  // German sets 24-hour times with two digits; English keeps its own clock.
  const hour = locale === 'de-DE' ? '2-digit' : 'numeric';
  const time = (ms: number, tz: string) =>
    new Intl.DateTimeFormat(locale, { hour, minute: '2-digit', timeZone: tz }).format(ms);
  const dayTime = (ms: number, tz: string) =>
    new Intl.DateTimeFormat(locale, { weekday: 'short', hour, minute: '2-digit', timeZone: tz }).format(ms);
  const weekday = (iso: number) =>
    new Intl.DateTimeFormat(locale, { weekday: 'long', timeZone: 'UTC' }).format(Date.UTC(2024, 0, iso));

  const nextMs = nextFreeUTC ? new Date(nextFreeUTC).getTime() : null;
  const refMs = nextMs ?? nowMs;
  const spans = windowOnVisitorDay({ dayMs: refMs, visitorTZ: zone, businessTZ: businessTimezone, days, startHour, endHour });

  const dayList =
    days.length > 1
      ? fill(copy.dayRange, { first: weekday(days[0]!), last: weekday(days[days.length - 1]!) })
      : weekday(days[0]!);
  const pad = (h: number) => `${String(h).padStart(2, '0')}:00`;
  const windowLine = fill(copy.window, { days: dayList, start: pad(startHour), end: pad(endHour), city: copy.city });

  const first = spans[0];
  const last = spans[spans.length - 1];
  const hhmm = (m: number) => `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
  const yoursLine =
    first && last && zone !== businessTimezone
      ? fill(copy.yours, { start: hhmm(first.from), end: hhmm(last.to), zone: zone.replace(/_/g, ' ') })
      : null;

  const nextLine = nextMs
    ? fill(copy.nextFree, { visitor: dayTime(nextMs, zone), business: time(nextMs, businessTimezone), city: copy.city })
    : copy.none;

  const sameDay = (a: number, b: number) =>
    new Intl.DateTimeFormat('en-CA', { timeZone: zone }).format(a) === new Intl.DateTimeFormat('en-CA', { timeZone: zone }).format(b);
  const nowMinute = nowMs && sameDay(nowMs, refMs) ? minuteOfDay(nowMs, zone) : null;
  const nextMinute = nextMs ? minuteOfDay(nextMs, zone) : null;
  const stripDay = new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long', timeZone: zone }).format(refMs);
  const pct = (m: number) => `${(m / 1440) * 100}%`;

  return (
    <section className={styles.root} data-variant={variant} data-ground={variant === 'compact' ? 'paper' : 'carbon'}>
      <div className={styles.inner}>
        {folio && title ? <BlockHead folio={folio} title={title} className={styles.head} /> : null}

        <p className={styles.next}>
          <NextMark />
          {nextLine}
        </p>

        {variant === 'full' ? (
          <figure className={styles.figure}>
            <div className={styles.strip} aria-hidden="true">
              {Array.from({ length: 24 }, (_, h) => (
                <span key={h} className={styles.cell} />
              ))}
              {spans.map((s) => (
                <span key={s.from} className={styles.band} style={{ left: pct(s.from), width: pct(s.to - s.from) }} />
              ))}
              {nextMinute !== null ? <span className={styles.slot} style={{ left: pct(nextMinute) }} /> : null}
              {nowMinute !== null ? (
                <span className={styles.now} style={{ left: pct(nowMinute) }}>
                  <span className={styles.nowLabel}>{copy.now}</span>
                </span>
              ) : null}
              {[0, 6, 12, 18, 24].map((h) => (
                <span key={h} className={styles.hour} style={{ left: pct(h * 60) }}>
                  {String(h).padStart(2, '0')}
                </span>
              ))}
            </div>
            <figcaption className={styles.caption}>{fill(copy.strip, { day: stripDay })}</figcaption>
          </figure>
        ) : null}

        <p className={styles.windowLine}>
          {windowLine}
          {yoursLine ? ` ${yoursLine}` : null}
        </p>
      </div>
    </section>
  );
}
