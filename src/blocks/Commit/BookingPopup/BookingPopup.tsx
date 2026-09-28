'use client';

import { useCallback, useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styles from './BookingPopup.module.scss';

/**
 * The booking form as a modal. Focus moves in on open and back on close;
 * Escape and the backdrop close it; the page behind cannot scroll.
 */
export function BookingPopup({
  open,
  onClose,
  label,
  closeLabel,
  children,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
  closeLabel: string;
  children: ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previous = useRef<Element | null>(null);

  useEffect(() => {
    if (open) {
      previous.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      containerRef.current
        ?.querySelector<HTMLElement>('input:not([tabindex="-1"]), button[type="submit"]')
        ?.focus();
    } else {
      document.body.style.overflow = '';
      if (previous.current instanceof HTMLElement) previous.current.focus();
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
      // Keep Tab inside the dialog.
      if (e.key === 'Tab' && containerRef.current) {
        const items = containerRef.current.querySelectorAll<HTMLElement>(
          'button:not(:disabled), input:not([tabindex="-1"]):not(:disabled), a[href]',
        );
        const first = items[0];
        const last = items[items.length - 1];
        if (!first || !last) return;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const onBackdrop = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  if (typeof window === 'undefined' || !open) return null;

  return createPortal(
    <div className={styles.overlay} onClick={onBackdrop} data-ground="carbon">
      <div ref={containerRef} className={styles.container} role="dialog" aria-modal="true" aria-label={label} data-ground="paper">
        <button type="button" onClick={onClose} className={styles.close} aria-label={closeLabel}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.closeIcon} aria-hidden="true">
            <path d="M6 6l12 12M6 18L18 6" />
          </svg>
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
}
