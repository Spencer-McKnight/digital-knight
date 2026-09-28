'use client';

import { useEffect, useId, useRef, useState, useTransition, type FormEvent } from 'react';
import { submitContact, type ContactResult } from '@/app/_actions/contact';
import { ErrorBar } from '@/components/ErrorBar/ErrorBar';
import type { CommitCopy } from '@/blocks/Commit/copy';
import type { Locale } from '@/content/routes';
import { FIELD_LIMITS } from '@/lib/contact/config';
import { EnquirySuccess } from './EnquirySuccess';
import type { EnquiryCopy } from './copy';
import styles from './Enquiry.module.scss';

type Phase = 'idle' | 'submitting' | 'success' | 'error';

export function EnquiryForm({
  locale,
  copy,
  commit,
  hostEmail,
}: {
  locale: Locale;
  copy: EnquiryCopy;
  commit: CommitCopy;
  hostEmail: string;
}) {
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
    if (mountedAtRef.current === null) mountedAtRef.current = performance.now();
  }, []);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isPending || phase === 'submitting') return;
    setPhase('submitting');
    setErrorMsg('');
    const formDwellMs = Math.max(0, performance.now() - (mountedAtRef.current ?? performance.now()));

    startTransition(async () => {
      const result: ContactResult = await submitContact({ name, email, message, website, formDwellMs, locale });
      if (result.ok) {
        setPhase('success');
        return;
      }
      setPhase('error');
      // Spam reads as a generic retry, never which check tripped.
      setErrorMsg(
        result.reason === 'validation'
          ? copy.errors.details
          : result.reason === 'spam'
            ? copy.errors.retry
            : copy.errors.server,
      );
    });
  }

  if (phase === 'success') {
    return <EnquirySuccess locale={locale} name={name} email={email} copy={copy.success} commit={commit} hostEmail={hostEmail} />;
  }

  const submitting = phase === 'submitting' || isPending;

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.field} htmlFor={nameId}>
        <span className={styles.label}>{copy.name}</span>
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
        <span className={styles.label}>{copy.email}</span>
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
      <label className={`${styles.field} ${styles.wide}`} htmlFor={messageId}>
        <span className={styles.label}>{copy.message}</span>
        <textarea
          id={messageId}
          name="message"
          required
          maxLength={FIELD_LIMITS.message}
          rows={6}
          value={message}
          disabled={submitting}
          onChange={(e) => setMessage(e.target.value)}
          className={styles.textarea}
        />
      </label>

      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor={honeypotId}>{copy.honeypot}</label>
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

      {errorMsg ? <ErrorBar className={styles.wide}>{errorMsg}</ErrorBar> : null}

      <button type="submit" className={styles.submit} disabled={submitting}>
        {submitting ? copy.submitting : copy.submit}
      </button>
    </form>
  );
}
