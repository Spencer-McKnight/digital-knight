'use client';

import { track } from '@vercel/analytics';
import {
  useCallback,
  useMemo,
  useReducer,
  useSyncExternalStore,
  useTransition,
  type CSSProperties,
} from 'react';
import { fromAbsolute } from '@internationalized/date';
import { createBooking, getWeekAvailability } from '@/app/_actions/booking';
import type { WeekAvailability } from '@/app/_actions/booking.types';
import { ErrorBar } from '@/components/ErrorBar/ErrorBar';
import type { Locale } from '@/content/routes';
import type { CalendarLinks } from '@/lib/booking/calendarLinks';
import { BUSINESS_DAYS, BUSINESS_HOUR_START, SLOTS_PER_DAY, SLOT_MINUTES } from '@/lib/booking/config';
import { formatWeekRange, fromWeekISO, shiftWeek, toWeekISO, visitorTimezone } from '@/lib/booking/week';
import { BookingForm, type BookingFormExtras } from '../BookingForm/BookingForm';
import { BookingPopup } from '../BookingPopup/BookingPopup';
import { Confirmation } from '../Confirmation/Confirmation';
import { NavArrow } from '../WeekNav/WeekNav';
import { Slot, type SlotState } from '../Slot/Slot';
import { fill, type CommitCopy } from '../copy';
import styles from './WeekGrid.module.scss';

/**
 * The booking grid. Owns week navigation, slot selection, form state, the
 * server-action calls and the confirmation swap. Every child is presentational.
 * Contract in `talk.md`: slot identity is the UTC instant, tokens come from
 * the server, spam and validation failures read the same.
 */

export type WeekGridProps = {
  locale: Locale;
  copy: CommitCopy;
  /** Server-rendered availability for the opening week. */
  initial: WeekAvailability;
  hostEmail: string;
  /** Lets the parent replace its whole layout on success. */
  onConfirmed?: (payload: ConfirmationPayload) => void;
  /** Name and email from an earlier step; the form then skips its fields. */
  prefilled?: { name: string; email: string };
};

type Phase =
  | { kind: 'browsing' }
  | { kind: 'submitting' }
  | { kind: 'confirmed'; confirmation: ConfirmationPayload }
  | { kind: 'error'; message: string };

export type ConfirmationPayload = {
  dateLabel: string;
  timeLabel: string;
  name: string;
  email: string;
  links: CalendarLinks;
  emailSent: boolean;
};

type State = {
  phase: Phase;
  weekISO: string;
  weekCache: Record<string, WeekAvailability>;
  selectedSlotUTC: string | null;
  form: { name: string; email: string };
  formError?: string;
};

type Action =
  | { type: 'setWeek'; weekISO: string; availability: WeekAvailability }
  | { type: 'selectSlot'; startAtUTC: string | null }
  | { type: 'patchForm'; patch: { name?: string; email?: string } }
  | { type: 'formError'; message: string }
  | { type: 'submitStart' }
  | { type: 'submitFailure'; phase: Phase; clearSelection: boolean }
  | { type: 'confirm'; confirmation: ConfirmationPayload }
  | { type: 'reset' };

function initialState(initial: WeekAvailability, prefilled?: { name: string; email: string }): State {
  return {
    phase: { kind: 'browsing' },
    weekISO: initial.weekISO,
    weekCache: { [initial.weekISO]: initial },
    selectedSlotUTC: null,
    form: prefilled ? { ...prefilled } : { name: '', email: '' },
  };
}

function createReducer(prefilled?: { name: string; email: string }) {
  const defaultForm = prefilled ? { ...prefilled } : { name: '', email: '' };

  return function reducer(state: State, action: Action): State {
    switch (action.type) {
      case 'setWeek':
        return {
          ...state,
          weekISO: action.weekISO,
          weekCache: { ...state.weekCache, [action.weekISO]: action.availability },
          selectedSlotUTC: null,
          formError: undefined,
        };
      case 'selectSlot':
        return { ...state, phase: { kind: 'browsing' }, selectedSlotUTC: action.startAtUTC, formError: undefined };
      case 'patchForm':
        return { ...state, form: { ...state.form, ...action.patch }, formError: undefined };
      case 'formError':
        return { ...state, formError: action.message };
      case 'submitStart':
        return { ...state, phase: { kind: 'submitting' }, formError: undefined };
      case 'submitFailure':
        return {
          ...state,
          phase: action.phase,
          selectedSlotUTC: action.clearSelection ? null : state.selectedSlotUTC,
        };
      case 'confirm':
        return { ...state, phase: { kind: 'confirmed', confirmation: action.confirmation } };
      case 'reset':
        return { ...state, phase: { kind: 'browsing' }, selectedSlotUTC: null, form: defaultForm, formError: undefined };
    }
  };
}

// Stable references for useSyncExternalStore; neither value changes after mount.
const subscribeNoop = () => () => {};
const getTrue = () => true;
const getFalse = () => false;

export function WeekGrid({ locale, copy, initial, hostEmail, onConfirmed, prefilled }: WeekGridProps) {
  const [state, dispatch] = useReducer(createReducer(prefilled), initial, (init) => initialState(init, prefilled));
  const [isNavPending, startNavTransition] = useTransition();

  // The server renders in the business zone; the client takes over after
  // hydration with the visitor's own zone.
  const visitorTZ = useSyncExternalStore(subscribeNoop, visitorTimezone, () => initial.businessTimezone);
  const mounted = useSyncExternalStore(subscribeNoop, getTrue, getFalse);

  const availability = state.weekCache[state.weekISO] ?? initial;

  const weekRangeLabel = useMemo(() => {
    const start = fromAbsolute(new Date(availability.weekStartUTC).getTime(), availability.businessTimezone);
    return formatWeekRange(start, visitorTZ, locale);
  }, [availability, visitorTZ, locale]);

  const slots = useMemo(() => buildSlotModels(availability, visitorTZ, locale), [availability, visitorTZ, locale]);
  const selectedSlot = slots.find((s) => s.utc === state.selectedSlotUTC) ?? null;

  const goToWeek = useCallback(
    (delta: number) => {
      const target = toWeekISO(shiftWeek(fromWeekISO(state.weekISO, availability.businessTimezone), delta));
      const cached = state.weekCache[target];
      if (cached) {
        dispatch({ type: 'setWeek', weekISO: target, availability: cached });
        return;
      }
      startNavTransition(async () => {
        try {
          const next = await getWeekAvailability(target);
          dispatch({ type: 'setWeek', weekISO: next.weekISO, availability: next });
        } catch (e) {
          console.error('[Commit] week nav failed', e);
        }
      });
    },
    [state.weekISO, state.weekCache, availability.businessTimezone],
  );

  const handleSelect = useCallback(
    (slotUTC: string) => {
      if (state.phase.kind === 'submitting' || state.phase.kind === 'confirmed') return;
      dispatch({ type: 'selectSlot', startAtUTC: state.selectedSlotUTC === slotUTC ? null : slotUTC });
    },
    [state.phase.kind, state.selectedSlotUTC],
  );

  const handleFormChange = useCallback((patch: { name?: string; email?: string }) => {
    dispatch({ type: 'patchForm', patch });
  }, []);

  const handleSubmit = useCallback(
    async (extras: BookingFormExtras) => {
      if (!state.selectedSlotUTC) return;
      const { name, email } = state.form;

      if (!name.trim()) {
        dispatch({ type: 'formError', message: copy.errors.name });
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        dispatch({ type: 'formError', message: copy.errors.email });
        return;
      }

      // No token means the slot was drawn before the week refreshed.
      const slotToken = availability.slotTokens?.[state.selectedSlotUTC];
      if (!slotToken) {
        dispatch({ type: 'formError', message: copy.errors.expired });
        return;
      }

      dispatch({ type: 'submitStart' });

      try {
        const result = await createBooking({
          name: name.trim(),
          email: email.trim(),
          startAtUTC: state.selectedSlotUTC,
          visitorTimezone: visitorTZ,
          slotToken,
          formDwellMs: extras.formDwellMs,
          company: extras.company,
          locale,
        });

        if (!result.ok) {
          if (result.reason === 'slot_taken') {
            try {
              const refreshed = await getWeekAvailability(state.weekISO);
              dispatch({ type: 'setWeek', weekISO: refreshed.weekISO, availability: refreshed });
            } catch {
              // The error below still tells the visitor what to do.
            }
            dispatch({ type: 'submitFailure', clearSelection: true, phase: { kind: 'error', message: copy.errors.taken } });
            return;
          }
          // Spam reads the same as a validation failure; telling bots which
          // check tripped would help them.
          dispatch({
            type: 'submitFailure',
            clearSelection: false,
            phase: {
              kind: 'error',
              message: result.reason === 'validation' || result.reason === 'spam' ? copy.errors.details : copy.errors.server,
            },
          });
          return;
        }

        track('booking_created', { locale });

        const payload: ConfirmationPayload = {
          dateLabel: selectedSlot?.dateLabel ?? '',
          timeLabel: selectedSlot?.timeLabel ?? '',
          name: name.trim(),
          email: email.trim(),
          links: result.links,
          emailSent: result.emailSent,
        };
        if (onConfirmed) onConfirmed(payload);
        else dispatch({ type: 'confirm', confirmation: payload });
      } catch (e) {
        console.error('[Commit] submit failed', e);
        dispatch({ type: 'submitFailure', clearSelection: false, phase: { kind: 'error', message: copy.errors.network } });
      }
    },
    [state.selectedSlotUTC, state.form, state.weekISO, selectedSlot, visitorTZ, availability.slotTokens, onConfirmed, copy, locale],
  );

  const handleCancel = useCallback(() => dispatch({ type: 'reset' }), []);

  const busy = state.phase.kind === 'submitting';
  const prevDisabled = availability.atCurrentWeek || isNavPending || busy;
  const nextDisabled = availability.horizonReached || isNavPending || busy;
  const confirmed = state.phase.kind === 'confirmed' ? state.phase.confirmation : null;

  return (
    <div className={styles.root} data-phase={state.phase.kind}>
      {confirmed ? (
        <Confirmation copy={copy.confirmed} {...confirmed} />
      ) : (
        <>
          <p className={styles.range}>{weekRangeLabel}</p>
          <div
            className={styles.gridFrame}
            aria-busy={isNavPending || undefined}
            style={{ '--_day-cols': BUSINESS_DAYS.length, '--_time-rows': SLOTS_PER_DAY } as CSSProperties}
          >
            <NavArrow
              direction="prev"
              label={copy.prevWeek}
              disabled={prevDisabled}
              onClick={() => goToWeek(-1)}
              pending={isNavPending}
              className={styles.prevArrow}
            />

            <div className={styles.dayHeaders} aria-hidden="true">
              {slots
                .filter((s) => s.slotIndex === 0)
                .map((s) => (
                  <div key={s.dayIndex} className={styles.dayHeader}>
                    <span className={styles.dayName}>{s.dayName}</span>
                    <span className={styles.dayDate}>{s.dayDate}</span>
                  </div>
                ))}
            </div>

            <NavArrow
              direction="next"
              label={copy.nextWeek}
              disabled={nextDisabled}
              onClick={() => goToWeek(1)}
              pending={isNavPending}
              className={styles.nextArrow}
            />

            <div className={styles.timeRail} aria-hidden="true">
              {slots
                .filter((s) => s.dayIndex === 0)
                .map((s) => (
                  <div key={s.slotIndex} className={styles.timeTick}>
                    {s.timeShort}
                  </div>
                ))}
            </div>

            <div className={styles.grid} role="group" aria-label={fill(copy.gridLabel, { range: weekRangeLabel })}>
              {reorderSlotsForGrid(slots).map((s) => (
                <Slot
                  key={s.utc}
                  state={resolveSlotState(s, state, availability, mounted)}
                  label={s.fullLabel}
                  onSelect={() => handleSelect(s.utc)}
                />
              ))}
            </div>
          </div>

          {state.phase.kind === 'error' && !state.selectedSlotUTC ? (
            <ErrorBar className={styles.error}>{state.phase.message}</ErrorBar>
          ) : null}

          <BookingPopup open={!!selectedSlot} onClose={handleCancel} label={copy.form.dialog} closeLabel={copy.form.close}>
            {selectedSlot ? (
              <BookingForm
                copy={copy.form}
                dateLabel={selectedSlot.dateLabel}
                timeLabel={selectedSlot.timeLabel}
                name={state.form.name}
                email={state.form.email}
                submitting={busy}
                compact={!!prefilled}
                error={state.formError ?? (state.phase.kind === 'error' ? state.phase.message : undefined)}
                onChange={handleFormChange}
                onSubmit={handleSubmit}
              />
            ) : null}
          </BookingPopup>
        </>
      )}

      <noscript>
        <p className={styles.noscript}>{fill(copy.noscript, { email: hostEmail })}</p>
      </noscript>

      <span className="sr-only" aria-live="polite">
        {busy ? copy.live.submitting : confirmed ? fill(copy.live.confirmed, { when: `${confirmed.dateLabel}, ${confirmed.timeLabel}` }) : ''}
      </span>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

type SlotModel = {
  utc: string;
  absoluteMs: number;
  dayIndex: number;
  slotIndex: number;
  dayName: string;
  dayDate: string;
  /** Visitor time, e.g. "02:30" or "10:30 am". */
  timeShort: string;
  /** "Tue 1 Oct" */
  dateLabel: string;
  /** "02:30–03:00 (CEST)" */
  timeLabel: string;
  fullLabel: string;
};

function buildSlotModels(avail: WeekAvailability, visitorTZ: string, locale: Locale): SlotModel[] {
  const weekStartMs = new Date(avail.weekStartUTC).getTime();
  const dayName = new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: visitorTZ });
  const dayDate = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', timeZone: visitorTZ });
  const time = new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit', timeZone: visitorTZ });
  const zoneName = new Intl.DateTimeFormat(locale, { timeZone: visitorTZ, timeZoneName: 'short' });

  // Walk the grid in business-local units so DST is handled by the calendar.
  const dayZero = fromAbsolute(weekStartMs, avail.businessTimezone).set({
    hour: BUSINESS_HOUR_START,
    minute: 0,
    second: 0,
    millisecond: 0,
  });

  const slots: SlotModel[] = [];
  BUSINESS_DAYS.forEach((_, dayIndex) => {
    for (let slotIndex = 0; slotIndex < SLOTS_PER_DAY; slotIndex++) {
      const ms = dayZero.add({ days: dayIndex, minutes: slotIndex * SLOT_MINUTES }).toDate().getTime();
      const date = new Date(ms);
      const end = new Date(ms + SLOT_MINUTES * 60_000);
      const tz = zoneName.formatToParts(date).find((p) => p.type === 'timeZoneName')?.value ?? visitorTZ;
      const dateLabel = `${dayName.format(date)} ${dayDate.format(date)}`;
      const timeLabel = `${time.format(date)}–${time.format(end)} (${tz})`;
      slots.push({
        utc: date.toISOString(),
        absoluteMs: ms,
        dayIndex,
        slotIndex,
        dayName: dayName.format(date),
        dayDate: dayDate.format(date),
        timeShort: time.format(date),
        dateLabel,
        timeLabel,
        fullLabel: `${dateLabel} · ${timeLabel}`,
      });
    }
  });
  return slots;
}

function resolveSlotState(s: SlotModel, state: State, avail: WeekAvailability, mounted: boolean): SlotState {
  const booked = new Set(avail.bookedSlotsUTC.map((iso) => new Date(iso).getTime()));
  // Past gating waits for mount so server and client render the same grid.
  if (mounted && s.absoluteMs < Date.now() + avail.minNoticeMs) return 'past';
  if (booked.has(s.absoluteMs)) return 'taken';
  if (state.selectedSlotUTC && new Date(state.selectedSlotUTC).getTime() === s.absoluteMs) {
    return state.phase.kind === 'submitting' ? 'submitting' : 'selected';
  }
  return 'free';
}

/** Day-major to time-major, so the CSS grid reads days across and times down. */
function reorderSlotsForGrid(slots: SlotModel[]): SlotModel[] {
  const out: SlotModel[] = [];
  for (let slotIndex = 0; slotIndex < SLOTS_PER_DAY; slotIndex++) {
    for (let dayIndex = 0; dayIndex < BUSINESS_DAYS.length; dayIndex++) {
      const slot = slots.find((s) => s.dayIndex === dayIndex && s.slotIndex === slotIndex);
      if (slot) out.push(slot);
    }
  }
  return out;
}
