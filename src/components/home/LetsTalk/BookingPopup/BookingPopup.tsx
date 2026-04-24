'use client';

import { useCallback, useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styles from './BookingPopup.module.scss';

/**
 * BookingPopup — portal-based modal for the booking form.
 *
 *   Renders into the document body to escape layout constraints. Uses a
 *   div-based overlay instead of native dialog showModal() to stay below
 *   the custom cursor in the stacking order. Handles focus management,
 *   escape key, and overlay clicks.
 */

export type BookingPopupProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function BookingPopup({ open, onClose, children }: BookingPopupProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<Element | null>(null);

  useEffect(() => {
    if (open) {
      previousActiveElement.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      
      const firstFocusable = containerRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    } else {
      document.body.style.overflow = '';
      if (previousActiveElement.current instanceof HTMLElement) {
        previousActiveElement.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose],
  );

  if (typeof window === 'undefined' || !open) {
    return null;
  }

  return createPortal(
    <div
      className={styles.overlay}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Complete your booking"
    >
      <div ref={containerRef} className={styles.container}>
        <button
          type="button"
          onClick={onClose}
          className={styles.close}
          aria-label="Close"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className={styles.closeIcon}
          >
            <path d="M6 6l12 12M6 18L18 6" />
          </svg>
        </button>
        <div className={styles.content}>{children}</div>
      </div>
    </div>,
    document.body,
  );
}
