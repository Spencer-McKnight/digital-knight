'use client';

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import styles from './BookingForm.module.scss';

/**
 * BookingForm — name + email, shown once a free slot is selected.
 *
 *   Intentionally tight: two fields, one primary action. The selected-slot
 *   label is shown above the fields as reassurance (no "are you sure?" step).
 *
 *   The form is controlled by the parent so form state can be part of the
 *   same `useReducer` that drives the grid. Parent owns submission — this
 *   component just emits structured events.
 *
 *   Anti-spam hooks (invisible to humans):
 *     · A honeypot `company` input, off-screen and aria-hidden.
 *     · `formDwellMs` — time between mount and submit, measured via
 *       `performance.now()`. Server treats it as a soft signal.
 *   The form collects both and hands them to `onSubmit` so the parent can
 *   forward them to the Server Action alongside name/email.
 */

export type BookingFormExtras = {
  formDwellMs: number;
  company: string;
};

export type BookingFormProps = {
  dateLabel: string;
  timeLabel: string;
  name: string;
  email: string;
  submitting: boolean;
  error?: string;
  onChange: (patch: { name?: string; email?: string }) => void;
  onSubmit: (extras: BookingFormExtras) => void;
};

export function BookingForm({
  dateLabel,
  timeLabel,
  name,
  email,
  submitting,
  error,
  onChange,
  onSubmit,
}: BookingFormProps) {
  const nameId = useId();
  const emailId = useId();
  const companyId = useId();

  // Honeypot field — local state so it doesn't leak into the parent's form
  // reducer (and thus doesn't accidentally get surfaced by typos later).
  const [company, setCompany] = useState('');

  // Dwell-time ref — records `performance.now()` once on mount, then the
  // submit handler diffs against it. `performance.now()` is monotonic, so
  // tab-switches and DST swings cannot perturb it.
  const mountedAtRef = useRef<number | null>(null);
  useEffect(() => {
    if (mountedAtRef.current === null) {
      mountedAtRef.current = performance.now();
    }
  }, []);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    const mountedAt = mountedAtRef.current ?? performance.now();
    const formDwellMs = Math.max(0, performance.now() - mountedAt);
    onSubmit({ formDwellMs, company });
  }

  return (
    <form className={styles.root} onSubmit={handleSubmit} noValidate>
      <div className={styles.header}>
        <p className={styles.slotDate}>{dateLabel}</p>
        <p className={styles.slotTime}>{timeLabel}</p>
      </div>

      <div className={styles.fields}>
        <label className={styles.field} htmlFor={nameId}>
          <span className={styles.label}>Name / Business</span>
          <input
            id={nameId}
            type="text"
            name="name"
            autoComplete="name"
            required
            maxLength={120}
            value={name}
            disabled={submitting}
            onChange={(e) => onChange({ name: e.target.value })}
            className={styles.input}
            placeholder="Your name and business"
          />
        </label>

        <label className={styles.field} htmlFor={emailId}>
          <span className={styles.label}>Email</span>
          <input
            id={emailId}
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            required
            maxLength={254}
            value={email}
            disabled={submitting}
            onChange={(e) => onChange({ email: e.target.value })}
            className={styles.input}
            placeholder="you@domain.com"
          />
        </label>
      </div>

      {/*
        Honeypot — not `display: none` (some bots skip those). Visually
        hidden, aria-hidden, tab-index -1, label innocuous. Any non-empty
        value is a signal that an automated agent filled the form.
      */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor={companyId}>Company (leave blank)</label>
        <input
          id={companyId}
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}

      <div className={styles.actions}>
        <button
          type="submit"
          disabled={submitting || !name.trim() || !email.trim()}
          className={styles.submit}
          data-pending={submitting || undefined}
        >
          <span className={styles.submitLabel}>
            {submitting ? 'Booking…' : 'Confirm the call'}
          </span>
        </button>
      </div>
    </form>
  );
}
