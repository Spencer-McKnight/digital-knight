'use client';

import {
  useCallback,
  useMemo,
  useReducer,
  useRef,
  useSyncExternalStore,
  useTransition,
} from 'react';
import { fromAbsolute } from '@internationalized/date';
import {
  createBooking,
  getWeekAvailability,
  type WeekAvailability,
} from '@/app/_actions/booking';
import type { CalendarLinks } from '@/lib/booking/calendarLinks';
import {
  BUSINESS_DAYS,
  SLOTS_PER_DAY,
  SLOT_MINUTES,
} from '@/lib/booking/config';
import {
  formatWeekRange,
  fromWeekISO,
  shiftWeek,
  toWeekISO,
  visitorTimezone,
} from '@/lib/booking/week';
import { Slot, type SlotState } from '../Slot/Slot';
import { WeekNav } from '../WeekNav/WeekNav';
import { BookingForm } from '../BookingForm/BookingForm';
import { Confirmation } from '../Confirmation/Confirmation';
import styles from './WeekGrid.module.scss';

/**
 * WeekGrid — the beating heart of Let's Talk.
 *
 *   Owns: week navigation, slot selection, form state, server-action
 *   dispatch, confirmation swap. Every child is presentational; the grid
 *   has no dependencies on global state.
 */

// ── PROPS ────────────────────────────────────────────────────────────────────

export type WeekGridProps = {
  /** SSR-rendered payload for the current week. */
  initial: WeekAvailability;
  /** Host email — surfaced in the soft-error fallback. */
  hostEmail: string;
};

// ── STATE ────────────────────────────────────────────────────────────────────

type Phase =
  | { kind: 'browsing' }
  | { kind: 'submitting' }
  | { kind: 'confirmed'; confirmation: ConfirmationPayload }
  | { kind: 'error'; message: string };

type ConfirmationPayload = {
  slotLabel: string;
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

function initialState(initial: WeekAvailability): State {
  return {
    phase: { kind: 'browsing' },
    weekISO: initial.weekISO,
    weekCache: { [initial.weekISO]: initial },
    selectedSlotUTC: null,
    form: { name: '', email: '' },
  };
}

function reducer(state: State, action: Action): State {
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
      return { ...state, selectedSlotUTC: action.startAtUTC, formError: undefined };
    case 'patchForm':
      return {
        ...state,
        form: { ...state.form, ...action.patch },
        formError: undefined,
      };
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
      return {
        ...state,
        phase: { kind: 'browsing' },
        selectedSlotUTC: null,
        form: { name: '', email: '' },
        formError: undefined,
      };
  }
}

// ── EXTERNAL-STORE HELPERS ───────────────────────────────────────────────────
//
// Stable references keep `useSyncExternalStore` happy without triggering
// re-subscriptions. The snapshot getters are pure.

const subscribeNoop = () => () => {};
const getTrueSnapshot = () => true;
const getFalseSnapshot = () => false;
const getVisitorTZSnapshot = () => visitorTimezone();

// ── COMPONENT ────────────────────────────────────────────────────────────────

export function WeekGrid({ initial, hostEmail }: WeekGridProps) {
  const [state, dispatch] = useReducer(reducer, initial, initialState);
  const [isNavPending, startNavTransition] = useTransition();

  // The visitor's timezone and "now this moment" are purely-client facts.
  // `useSyncExternalStore` gives us the React-sanctioned shape: the server
  // snapshot is deterministic (business timezone, not-yet-mounted) and the
  // client snapshot takes over after hydration without causing a cascading
  // render. Neither value ever changes during the component's lifetime.
  const visitorTZ = useSyncExternalStore(
    subscribeNoop,
    getVisitorTZSnapshot,
    () => initial.businessTimezone,
  );
  const mounted = useSyncExternalStore(
    subscribeNoop,
    getTrueSnapshot,
    getFalseSnapshot,
  );

  const availability = state.weekCache[state.weekISO] ?? initial;

  const weekRangeLabel = useMemo(() => {
    const weekStartZoned = fromAbsolute(
      new Date(availability.weekStartUTC).getTime(),
      availability.businessTimezone,
    );
    return formatWeekRange(weekStartZoned, visitorTZ);
  }, [availability, visitorTZ]);

  const slots = useMemo(() => buildSlotModels(availability, visitorTZ), [
    availability,
    visitorTZ,
  ]);

  const selectedSlot = slots.find((s) => s.utc === state.selectedSlotUTC) ?? null;

  // ── Handlers ───────────────────────────────────────────────────────────

  const goToWeek = useCallback(
    (deltaWeeks: number) => {
      // Derive the next week precisely via the shared week helpers — the
      // math threads through @internationalized/date so DST and year
      // boundaries are handled exactly as on the server.
      const activeWeek = fromWeekISO(state.weekISO, availability.businessTimezone);
      const target = toWeekISO(shiftWeek(activeWeek, deltaWeeks));

      // Hit the local cache first for instant navigation.
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
          console.error('[LetsTalk] week nav failed', e);
        }
      });
    },
    [state.weekISO, state.weekCache, availability.businessTimezone],
  );

  const handleSelect = useCallback(
    (slotUTC: string) => {
      if (state.phase.kind !== 'browsing') return;
      dispatch({
        type: 'selectSlot',
        startAtUTC: state.selectedSlotUTC === slotUTC ? null : slotUTC,
      });
    },
    [state.phase.kind, state.selectedSlotUTC],
  );

  const handleFormChange = useCallback(
    (patch: { name?: string; email?: string }) => {
      dispatch({ type: 'patchForm', patch });
    },
    [],
  );

  const handleSubmit = useCallback(async () => {
    if (!state.selectedSlotUTC) return;
    const { name, email } = state.form;

    if (!name.trim()) {
      dispatch({ type: 'formError', message: 'Please add your name.' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      dispatch({ type: 'formError', message: 'Please check the email address.' });
      return;
    }

    dispatch({ type: 'submitStart' });

    try {
      const result = await createBooking({
        name: name.trim(),
        email: email.trim(),
        startAtUTC: state.selectedSlotUTC,
        visitorTimezone: visitorTZ,
      });

      if (!result.ok) {
        if (result.reason === 'slot_taken') {
          // Pull the latest availability — the slot was taken by someone else.
          try {
            const refreshed = await getWeekAvailability(state.weekISO);
            dispatch({ type: 'setWeek', weekISO: refreshed.weekISO, availability: refreshed });
          } catch {
            // Fall through; UI already shows an error.
          }
          dispatch({
            type: 'submitFailure',
            clearSelection: true,
            phase: {
              kind: 'error',
              message: 'That time was just taken — please pick another.',
            },
          });
          return;
        }
        dispatch({
          type: 'submitFailure',
          clearSelection: false,
          phase: {
            kind: 'error',
            message:
              result.reason === 'validation'
                ? result.message ?? 'Please check the details.'
                : 'Something went wrong. Try again in a moment.',
          },
        });
        return;
      }

      const slotLabel = selectedSlot?.fullLabel ?? 'Your call';
      dispatch({
        type: 'confirm',
        confirmation: {
          slotLabel,
          name: name.trim(),
          email: email.trim(),
          links: result.links,
          emailSent: result.emailSent,
        },
      });
    } catch (e) {
      console.error('[LetsTalk] submit failed', e);
      dispatch({
        type: 'submitFailure',
        clearSelection: false,
        phase: {
          kind: 'error',
          message: 'Network error. Please try again.',
        },
      });
    }
  }, [state.selectedSlotUTC, state.form, state.weekISO, selectedSlot, visitorTZ]);

  const handleCancel = useCallback(() => {
    dispatch({ type: 'reset' });
  }, []);

  const handleBookAnother = useCallback(() => {
    dispatch({ type: 'reset' });
  }, []);

  // ── Derived state for children ─────────────────────────────────────────

  const prevDisabled = availability.atCurrentWeek || isNavPending || state.phase.kind === 'submitting';
  const nextDisabled = availability.horizonReached || isNavPending || state.phase.kind === 'submitting';

  const isSubmitting = state.phase.kind === 'submitting';
  const confirmed = state.phase.kind === 'confirmed' ? state.phase.confirmation : null;

  const metaSubtitle = useMemo(
    () =>
      `Shown in your time (${visitorTZ}) · Business hours ${
        availability.businessTimezone
      } 10:00–15:00`,
    [visitorTZ, availability.businessTimezone],
  );

  // ── Render ─────────────────────────────────────────────────────────────

  const gridRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={gridRef} className={styles.root} data-phase={state.phase.kind}>
      {confirmed ? (
        <>
          <Confirmation
            slotLabel={confirmed.slotLabel}
            name={confirmed.name}
            email={confirmed.email}
            emailSent={confirmed.emailSent}
            links={confirmed.links}
            hostEmail={hostEmail}
          />
          <div className={styles.bookAgain}>
            <button type="button" onClick={handleBookAnother} className={styles.bookAgainBtn}>
              Book another time
            </button>
          </div>
        </>
      ) : (
        <>
          <div className={styles.subtitle}>{metaSubtitle}</div>

          <div className={styles.navRow}>
            <WeekNav
              rangeLabel={weekRangeLabel}
              prevDisabled={prevDisabled}
              nextDisabled={nextDisabled}
              onPrev={() => goToWeek(-1)}
              onNext={() => goToWeek(1)}
              pending={isNavPending}
            />
          </div>

          <div className={styles.gridFrame} aria-busy={isNavPending || undefined}>
            {/* Day headers */}
            <div className={styles.dayHeaders} role="presentation">
              {slots
                .filter((s) => s.slotIndex === 0)
                .map((s) => (
                  <div key={s.dayIndex} className={styles.dayHeader}>
                    <span className={styles.dayName}>{s.dayName}</span>
                    <span className={styles.dayDate}>{s.dayDate}</span>
                  </div>
                ))}
            </div>

            {/* Time rail */}
            <div className={styles.timeRail} aria-hidden>
              {slots
                .filter((s) => s.dayIndex === 0)
                .map((s) => (
                  <div key={s.slotIndex} className={styles.timeTick}>
                    {s.timeShortBusiness}
                  </div>
                ))}
            </div>

            {/* Grid */}
            <div
              className={styles.grid}
              role="grid"
              aria-label={`Available times, week of ${weekRangeLabel}`}
            >
              {slots.map((s) => (
                <Slot
                  key={s.utc}
                  state={resolveSlotState(s, state, availability, mounted)}
                  label={s.fullLabel}
                  timeShort={s.timeShort}
                  onSelect={() => handleSelect(s.utc)}
                />
              ))}
            </div>
          </div>

          {state.phase.kind === 'error' && !state.selectedSlotUTC ? (
            <p className={styles.error} role="alert">
              {state.phase.message}
            </p>
          ) : null}

          {selectedSlot ? (
            <div className={styles.formSurface}>
              <BookingForm
                slotLabel={selectedSlot.fullLabel}
                name={state.form.name}
                email={state.form.email}
                submitting={isSubmitting}
                error={
                  state.formError ??
                  (state.phase.kind === 'error' ? state.phase.message : undefined)
                }
                onChange={handleFormChange}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
              />
            </div>
          ) : null}
        </>
      )}

      <noscript>
        <p className={styles.noscript}>
          The live calendar needs JavaScript. Email{' '}
          <a href={`mailto:${hostEmail}`}>{hostEmail}</a> to book — same response time.
        </p>
      </noscript>

      <span className={styles.srOnly} aria-live="polite">
        {state.phase.kind === 'submitting'
          ? 'Booking your call…'
          : state.phase.kind === 'confirmed'
            ? `Booked — ${confirmed?.slotLabel}. A confirmation email is on its way.`
            : ''}
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
  /** Short label in the visitor's timezone, e.g. "10:30". */
  timeShort: string;
  /** Short label in the business timezone, for the time rail. */
  timeShortBusiness: string;
  /** Full accessible label, visitor-local + business hours. */
  fullLabel: string;
};

function buildSlotModels(avail: WeekAvailability, visitorTZ: string): SlotModel[] {
  const weekStartMs = new Date(avail.weekStartUTC).getTime();
  const businessTZ = avail.businessTimezone;

  const slots: SlotModel[] = [];

  const dayNameFmt = new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    timeZone: visitorTZ,
  });
  const dayDateFmt = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    timeZone: visitorTZ,
  });
  const visitorTimeFmt = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: visitorTZ,
  });
  const businessTimeFmt = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: businessTZ,
  });

  BUSINESS_DAYS.forEach((_, dayIndex) => {
    for (let slotIndex = 0; slotIndex < SLOTS_PER_DAY; slotIndex++) {
      // Align to business-zone grid via offsetting from the week start in
      // its business-local clock — the server guarantees these are real
      // 10:00–15:00 slots in that zone.
      const approximateMs =
        weekStartMs +
        dayIndex * 24 * 60 * 60 * 1000 +
        10 * 60 * 60 * 1000 + // 10:00 anchor
        slotIndex * SLOT_MINUTES * 60 * 1000;

      // Re-resolve the instant precisely through the business tz using
      // @internationalized/date to guard DST transitions.
      const businessZoned = fromAbsolute(approximateMs, businessTZ);
      // If a DST shift moved us off the 10:00 boundary, re-anchor.
      const hourOffset = businessZoned.hour - 10;
      const correctedMs = approximateMs - hourOffset * 60 * 60 * 1000;

      const date = new Date(correctedMs);
      const utc = date.toISOString();

      const dayName = dayNameFmt.format(date);
      const dayDate = dayDateFmt.format(date);
      const timeShort = visitorTimeFmt.format(date);
      const timeShortBusiness = businessTimeFmt.format(date);

      const endDate = new Date(correctedMs + SLOT_MINUTES * 60 * 1000);
      const endShort = visitorTimeFmt.format(endDate);

      const fullLabel = `${dayName} ${dayDate} · ${timeShort}–${endShort} (your time)`;

      slots.push({
        utc,
        absoluteMs: correctedMs,
        dayIndex,
        slotIndex,
        dayName,
        dayDate,
        timeShort,
        timeShortBusiness,
        fullLabel,
      });
    }
  });

  return slots;
}

function resolveSlotState(
  s: SlotModel,
  state: State,
  avail: WeekAvailability,
  mounted: boolean,
): SlotState {
  const booked = new Set(avail.bookedSlotsUTC.map((iso) => new Date(iso).getTime()));

  // Past gating uses the wall clock, so we defer it until after mount to
  // avoid hydration mismatches between the server's "now" and the client's.
  if (mounted && s.absoluteMs < Date.now()) return 'past';
  if (booked.has(s.absoluteMs)) return 'taken';
  if (state.selectedSlotUTC && new Date(state.selectedSlotUTC).getTime() === s.absoluteMs) {
    return state.phase.kind === 'submitting' ? 'submitting' : 'selected';
  }
  return 'free';
}

