'use client';

import styles from './WeekNav.module.scss';

/**
 * WeekNav — previous / next week arrows with a range label between.
 *
 *   Arrows are labelled for assistive tech and disabled at the current-week
 *   boundary and the horizon. The range label is the week summary rendered
 *   in the visitor's timezone.
 */

export type WeekNavProps = {
  rangeLabel: string;
  prevDisabled: boolean;
  nextDisabled: boolean;
  onPrev: () => void;
  onNext: () => void;
  /** When true, mirror the navigation as a subtle indicator. */
  pending?: boolean;
};

export function WeekNav({
  rangeLabel,
  prevDisabled,
  nextDisabled,
  onPrev,
  onNext,
  pending,
}: WeekNavProps) {
  return (
    <nav className={styles.root} aria-label="Week navigation" data-pending={pending || undefined}>
      <button
        type="button"
        onClick={onPrev}
        disabled={prevDisabled}
        aria-label="Previous week"
        className={styles.btn}
      >
        <Chevron direction="left" />
      </button>

      <span className={styles.range} aria-live="polite">
        {rangeLabel}
      </span>

      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        aria-label="Next week"
        className={styles.btn}
      >
        <Chevron direction="right" />
      </button>
    </nav>
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
