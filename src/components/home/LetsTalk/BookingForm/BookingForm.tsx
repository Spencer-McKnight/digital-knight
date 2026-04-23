'use client';

import { useId, type FormEvent } from 'react';
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
 */

export type BookingFormProps = {
  slotLabel: string;
  name: string;
  email: string;
  submitting: boolean;
  error?: string;
  onChange: (patch: { name?: string; email?: string }) => void;
  onSubmit: () => void;
  onCancel: () => void;
};

export function BookingForm({
  slotLabel,
  name,
  email,
  submitting,
  error,
  onChange,
  onSubmit,
  onCancel,
}: BookingFormProps) {
  const nameId = useId();
  const emailId = useId();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    onSubmit();
  }

  return (
    <form className={styles.root} onSubmit={handleSubmit} noValidate>
      <div className={styles.header}>
        <p className={styles.eyebrow}>Selected</p>
        <p className={styles.slotLabel}>{slotLabel}</p>
      </div>

      <div className={styles.fields}>
        <label className={styles.field} htmlFor={nameId}>
          <span className={styles.label}>Name</span>
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
            placeholder="Your name"
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

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}

      <div className={styles.actions}>
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className={styles.cancel}
        >
          Change slot
        </button>

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
