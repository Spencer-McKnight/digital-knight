'use client';

import styles from './WeekNav.module.scss';

/** One week-navigation arrow. Rendered either side of the day headers. */
export function NavArrow({
  direction,
  label,
  disabled,
  onClick,
  pending,
  className,
}: {
  direction: 'prev' | 'next';
  label: string;
  disabled: boolean;
  onClick: () => void;
  pending?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      data-pending={pending || undefined}
      className={[styles.btn, className].filter(Boolean).join(' ')}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" focusable="false">
        <path d={direction === 'prev' ? 'M11 3L5 9l6 6' : 'M7 3l6 6-6 6'} stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </button>
  );
}
