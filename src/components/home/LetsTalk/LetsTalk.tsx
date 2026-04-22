import { Fragment } from 'react';
import { Button } from '@/components/Button';
import styles from './LetsTalk.module.scss';

/**
 * LetsTalk — the Call beat (`design.md` §9 beat 5).
 *
 *   Per project instructions this block ships the framing only — copy,
 *   hairlines, the meta rails around the calendar. The bespoke week-grid
 *   booking feature is specified in `talk.md` and will be slotted in to
 *   the `<CalendarSlot />` region below by a future pass.
 *
 *   This file is intentionally a Server Component. The calendar, when it
 *   lands, will be its own client island.
 */
const RECEIVE = [
  'Ideas to align your website or digital tooling with your strategy.',
  'Recommendations and plans that survive contact with the real business.',
  'Future-scoping opportunities — where to invest, where not to.',
] as const;

const INTRO = [
  'Project goals and ideals',
  'Pain points in the current setup',
  'Questions about digital, at any depth',
] as const;

export function LetsTalk() {
  return (
    <section id="talk" className={styles.root} aria-labelledby="talk-title">
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowDot} aria-hidden />
            Call · 05
          </p>
          <h2 id="talk-title" className={styles.title}>
            Free thirty-minute
            <br />
            <span className={styles.titleEmber}>digital strategy</span> meeting.
          </h2>
          <p className={styles.lede}>
            No obligation. A conversation about websites and digital business —
            about whether what you&apos;re doing is pulling its weight, and what might.
          </p>
        </header>

        <div className={styles.grid}>
          <aside className={styles.brief} aria-labelledby="talk-brief-title">
            <p className={styles.sectionEyebrow}>First, tell me about the business</p>
            <h3 id="talk-brief-title" className={styles.sectionTitle}>
              Come with a scrap of the problem — that&apos;s enough.
            </h3>
            <ul className={styles.list}>
              {INTRO.map((i) => (
                <li key={i} className={styles.listItem}>
                  <span className={styles.listRule} aria-hidden />
                  {i}
                </li>
              ))}
            </ul>

            <p className={styles.sectionEyebrow} style={{ marginTop: 'var(--space-6)' }}>
              You receive
            </p>
            <ul className={styles.list}>
              {RECEIVE.map((i) => (
                <li key={i} className={styles.listItem}>
                  <span className={styles.listRule} aria-hidden />
                  {i}
                </li>
              ))}
            </ul>

            <div className={styles.briefMeta}>
              <p className={styles.metaLine}>
                <span className={styles.metaLabel}>Hours</span>
                <span className={styles.metaValue}>Mon–Thu · 10:00 — 15:00</span>
              </p>
              <p className={styles.metaLine}>
                <span className={styles.metaLabel}>Duration</span>
                <span className={styles.metaValue}>30 minutes</span>
              </p>
              <p className={styles.metaLine}>
                <span className={styles.metaLabel}>Format</span>
                <span className={styles.metaValue}>Video call</span>
              </p>
              <p className={styles.metaLine}>
                <span className={styles.metaLabel}>Cost</span>
                <span className={styles.metaValue}>Nothing</span>
              </p>
            </div>
          </aside>

          <div className={styles.calendar} aria-labelledby="talk-calendar-title">
            <div className={styles.calendarHead}>
              <p className={styles.sectionEyebrow}>Pick a time</p>
              <h3 id="talk-calendar-title" className={styles.sectionTitle}>
                One click books it — the click is the commit.
              </h3>
            </div>

            {/*
              The bespoke week-grid booking UI lives here. Spec: talk.md §6.
              The wrapper below is the styled host — the inner region is a
              placeholder until the feature lands.
            */}
            <div className={styles.calendarSlot} role="region" aria-label="Booking calendar">
              <CalendarSlotPlaceholder />
            </div>

            <p className={styles.calendarFoot}>
              Can&apos;t find a time?{' '}
              <Button
                href="mailto:hello@digitalknight.com"
                variant="ghost"
              >
                Reach out directly
              </Button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * CalendarSlotPlaceholder — a styled "coming" frame.
 *
 *   Mirrors the calendar's eventual geometry (4 day columns × 10 slot rows,
 *   per `talk.md` §4). Sits inert behind a forge-veined overlay so visitors
 *   understand the intent without interacting with something that cannot
 *   yet book them in. Replaced in full by the real booking UI.
 */
function CalendarSlotPlaceholder() {
  const COLS = ['Mon', 'Tue', 'Wed', 'Thu'];
  const ROWS = [
    '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30',
  ];

  return (
    <div className={styles.phantom}>
      <div className={styles.phantomHead}>
        <span className={styles.phantomNav} aria-hidden>‹</span>
        <span className={styles.phantomRange} aria-hidden>This week · Placeholder</span>
        <span className={styles.phantomNav} aria-hidden>›</span>
      </div>

      <div className={styles.phantomGrid} aria-hidden>
        <div className={styles.phantomCorner} />
        {COLS.map((c) => (
          <div key={c} className={styles.phantomColHead}>
            {c}
          </div>
        ))}

        {ROWS.map((r, ri) => (
          <Fragment key={r}>
            <div className={styles.phantomRowHead}>{r}</div>
            {COLS.map((c) => (
              <div
                key={`${c}-${r}`}
                className={styles.phantomCell}
                data-state={ri % 7 === 3 ? 'taken' : 'free'}
              />
            ))}
          </Fragment>
        ))}
      </div>

      <p className={styles.phantomNote}>
        <span className={styles.phantomDot} aria-hidden />
        Booking interface — landing in the next release. Spec: <code>talk.md</code>.
      </p>
    </div>
  );
}
