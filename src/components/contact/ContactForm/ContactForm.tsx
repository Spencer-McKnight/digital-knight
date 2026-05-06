'use client';

import { useEffect, useId, useRef, useState, useTransition, type FormEvent } from 'react';
import { submitContact, type ContactResult } from '@/app/_actions/contact';
import { BUDGET_OPTIONS, FIELD_LIMITS } from './contactConfig';
import { ContactSuccess } from '../ContactSuccess/ContactSuccess';
import styles from './ContactForm.module.scss';

type Phase = 'idle' | 'submitting' | 'success' | 'error';

export function ContactForm() {
  const nameId = useId();
  const orgId = useId();
  const emailId = useId();
  const budgetId = useId();
  const messageId = useId();
  const honeypotId = useId();

  const [name, setName] = useState('');
  const [organisation, setOrganisation] = useState('');
  const [email, setEmail] = useState('');
  const [budget, setBudget] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState('');

  const [phase, setPhase] = useState<Phase>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [isPending, startTransition] = useTransition();

  const mountedAtRef = useRef<number | null>(null);
  useEffect(() => {
    if (mountedAtRef.current === null) {
      mountedAtRef.current = performance.now();
    }
  }, []);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isPending || phase === 'submitting') return;

    setPhase('submitting');
    setErrorMsg('');

    const mountedAt = mountedAtRef.current ?? performance.now();
    const formDwellMs = Math.max(0, performance.now() - mountedAt);

    startTransition(async () => {
      const result: ContactResult = await submitContact({
        name,
        organisation,
        email,
        budget,
        message,
        website,
        formDwellMs,
      });

      if (result.ok) {
        setPhase('success');
      } else {
        setPhase('error');
        if (result.reason === 'spam') {
          setErrorMsg('Something went wrong. Please try again.');
        } else if (result.reason === 'validation') {
          setErrorMsg(result.message ?? 'Please check your details and try again.');
        } else {
          setErrorMsg('Something went wrong on our end. Please try again shortly.');
        }
      }
    });
  }

  function handleReset() {
    setName('');
    setOrganisation('');
    setEmail('');
    setBudget('');
    setMessage('');
    setWebsite('');
    setErrorMsg('');
    setPhase('idle');
    mountedAtRef.current = performance.now();
  }

  if (phase === 'success') {
    return <ContactSuccess onReset={handleReset} />;
  }

  const submitting = phase === 'submitting' || isPending;
  const canSubmit = name.trim() && email.trim() && message.trim() && !submitting;

  return (
    <form className={styles.card} onSubmit={handleSubmit} noValidate>
      <label className={styles.field} htmlFor={nameId}>
        <span className={styles.label}>Name *</span>
        <input
          id={nameId}
          type="text"
          name="name"
          autoComplete="name"
          required
          maxLength={FIELD_LIMITS.name}
          value={name}
          disabled={submitting}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
        />
      </label>

      <label className={styles.field} htmlFor={orgId}>
        <span className={styles.label}>Organisation</span>
        <input
          id={orgId}
          type="text"
          name="organisation"
          autoComplete="organization"
          maxLength={FIELD_LIMITS.organisation}
          value={organisation}
          disabled={submitting}
          onChange={(e) => setOrganisation(e.target.value)}
          className={styles.input}
        />
      </label>

      <label className={styles.field} htmlFor={emailId}>
        <span className={styles.label}>Email *</span>
        <input
          id={emailId}
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          required
          maxLength={FIELD_LIMITS.email}
          value={email}
          disabled={submitting}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />
      </label>

      <label className={styles.field} htmlFor={budgetId}>
        <span className={styles.label}>Budget</span>
        <div className={styles.selectWrap}>
          <select
            id={budgetId}
            name="budget"
            value={budget}
            disabled={submitting}
            onChange={(e) => setBudget(e.target.value)}
            className={styles.select}
            data-empty={!budget || undefined}
          >
            <option value="">Select one...</option>
            {BUDGET_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <svg
            className={styles.chevron}
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M1 1.5L6 6.5L11 1.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="square"
            />
          </svg>
        </div>
      </label>

      <label className={styles.field} htmlFor={messageId}>
        <span className={styles.label}>Message *</span>
        <textarea
          id={messageId}
          name="message"
          required
          maxLength={FIELD_LIMITS.message}
          rows={5}
          value={message}
          disabled={submitting}
          onChange={(e) => setMessage(e.target.value)}
          className={styles.textarea}
        />
      </label>

      {/* Honeypot */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor={honeypotId}>Website (leave blank)</label>
        <input
          id={honeypotId}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      {errorMsg ? (
        <p className={styles.error} role="alert">
          {errorMsg}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={!canSubmit}
        className={styles.submit}
        data-pending={submitting || undefined}
      >
        <span className={styles.submitLabel}>
          {submitting ? 'Sending…' : 'Send Message'}
        </span>
      </button>
    </form>
  );
}
