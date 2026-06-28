'use client';

import { useEffect, useId, useRef, useState, useTransition, type FormEvent } from 'react';
import { submitContact, type ContactResult } from '@/app/_actions/contact';
import { FIELD_LIMITS } from './contactConfig';
import { ContactSuccess } from '../ContactSuccess/ContactSuccess';
import { Button } from '@/components/Button';
import styles from './ContactForm.module.scss';

type Phase = 'idle' | 'submitting' | 'success' | 'error';

type ContactFormProps = {
  hostEmail: string;
};

export function ContactForm({ hostEmail }: ContactFormProps) {
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();
  const honeypotId = useId();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
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
        email,
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
    setEmail('');
    setMessage('');
    setWebsite('');
    setErrorMsg('');
    setPhase('idle');
    mountedAtRef.current = performance.now();
  }

  if (phase === 'success') {
    return (
      <ContactSuccess
        name={name}
        email={email}
        hostEmail={hostEmail}
        onReset={handleReset}
      />
    );
  }

  const submitting = phase === 'submitting' || isPending;

  return (
    <form className={styles.card} onSubmit={handleSubmit}>
      <label className={styles.field} htmlFor={nameId}>
        <span className={styles.label}>Name</span>
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

      <label className={styles.field} htmlFor={emailId}>
        <span className={styles.label}>Email</span>
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

      <label className={styles.field} htmlFor={messageId}>
        <span className={styles.label}>Message</span>
        <textarea
          id={messageId}
          name="message"
          required
          maxLength={FIELD_LIMITS.message}
          rows={4}
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

      <Button type="submit" variant="secondary" fullWidth disabled={submitting}>
        {submitting ? 'Sending…' : 'Send Message'}
      </Button>
    </form>
  );
}
