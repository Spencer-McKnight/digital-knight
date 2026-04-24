'use client';

import styles from './WeekNav.module.scss';

/**
 * NavArrow — a single week-navigation arrow.
 *
 *   Rendered twice inside the WeekGrid frame so the arrows flank the day
 *   headers directly. Accessible labels still announce direction.
 */

export type NavArrowProps = {
  direction: 'prev' | 'next';
  disabled: boolean;
  onClick: () => void;
  pending?: boolean;
  className?: string;
};

export function NavArrow({
  direction,
  disabled,
  onClick,
  pending,
  className,
}: NavArrowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'prev' ? 'Previous week' : 'Next week'}
      data-pending={pending || undefined}
      className={[styles.btn, className].filter(Boolean).join(' ')}
    >
      <Chevron direction={direction === 'prev' ? 'left' : 'right'} />
    </button>
  );
}

function Chevron({ direction }: { direction: 'left' | 'right' }) {
  const d = direction === 'left' ? 'M11 3L5 9l6 6' : 'M7 3l6 6-6 6';
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden focusable="false">
      <path d={d} stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}
