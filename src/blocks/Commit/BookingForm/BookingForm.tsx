'use client';

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { ErrorBar } from '@/components/ErrorBar/ErrorBar';
import type { CommitCopy } from '../copy';
import styles from './BookingForm.module.scss';

/**
 * Name and email, shown once a free slot is chosen. The chosen time sits on
 * top as reassurance. A hidden `company` field and the time between mount and
 * submit go to the server as spam signals; neither is visible to people.
 */

export type BookingFormExtras = {
  formDwellMs: number;
  company: string;
};

export type BookingFormProps = {
  copy: CommitCopy['form'];
  dateLabel: string;
  timeLabel: string;
  name: string;
  email: string;
  submitting: boolean;
  compact?: boolean;
  error?: string;
  onChange: (patch: { name?: string; email?: string }) => void;
  onSubmit: (extras: BookingFormExtras) => void;
};

export function BookingForm({
  copy,
  dateLabel,
  timeLabel,
  name,
  email,
  submitting,
  compact,
  error,
  onChange,
  onSubmit,
}: BookingFormProps) {
  const nameId = useId();
  const emailId = useId();
  const companyId = useId();
  const [company, setCompany] = useState('');

  // `performance.now()` is monotonic, so tab switches cannot skew the dwell.
  const mountedAtRef = useRef<number | null>(null);
  useEffect(() => {
    if (mountedAtRef.current === null) mountedAtRef.current = performance.now();
  }, []);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    const mountedAt = mountedAtRef.current ?? performance.now();
    onSubmit({ formDwellMs: Math.max(0, performance.now() - mountedAt), company });
  }

  return (
    <form className={styles.root} onSubmit={handleSubmit} noValidate>
      <div className={styles.slot}>
        <p className={styles.slotDate}>{dateLabel}</p>
        <p className={styles.slotTime}>{timeLabel}</p>
      </div>

      {compact ? (
        <p className={styles.compact}>
          {copy.bookingFor} <strong>{name}</strong> ({email})
        </p>
      ) : (
        <div className={styles.fields}>
          <label className={styles.field} htmlFor={nameId}>
            <span className={styles.label}>{copy.name}</span>
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
              placeholder={copy.namePlaceholder}
            />
          </label>
          <label className={styles.field} htmlFor={emailId}>
            <span className={styles.label}>{copy.email}</span>
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
              placeholder={copy.emailPlaceholder}
            />
          </label>
        </div>
      )}

      {/* Not display:none, which some bots skip. Humans never see or reach it. */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor={companyId}>{copy.honeypot}</label>
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

      {error ? <ErrorBar>{error}</ErrorBar> : null}

      <button
        type="submit"
        disabled={submitting || !name.trim() || !email.trim()}
        className={styles.submit}
        data-pending={submitting || undefined}
      >
        {submitting ? copy.submitting : copy.submit}
      </button>
    </form>
  );
}
