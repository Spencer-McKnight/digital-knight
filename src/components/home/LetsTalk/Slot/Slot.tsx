'use client';

import { forwardRef } from 'react';
import styles from './Slot.module.scss';

/**
 * Slot — one cell in the 4×10 week grid.
 *
 *   State is driven purely by `data-state`. The parent grid owns layout and
 *   selection; the cell owns visual affordance, focus behaviour, and the
 *   on-hover label.
 */

export type SlotState = 'free' | 'taken' | 'past' | 'selected' | 'submitting';

export type SlotProps = {
  state: SlotState;
  /** Localised slot range, e.g. "Wed 29 Apr · 10:30–11:00 (Melbourne 10:30)". */
  label: string;
  /** Short label rendered inside the cell when free ("10:30"). */
  timeShort: string;
  onSelect?: () => void;
};

export const Slot = forwardRef<HTMLButtonElement, SlotProps>(function Slot(
  { state, label, timeShort, onSelect },
  ref,
) {
  const interactive = state === 'free' || state === 'selected';

  return (
    <button
      ref={ref}
      type="button"
      data-state={state}
      aria-label={label}
      aria-disabled={!interactive || undefined}
      disabled={state === 'taken' || state === 'past'}
      onClick={interactive ? onSelect : undefined}
      className={styles.root}
    >
      <span className={styles.time} aria-hidden>
        {timeShort}
      </span>
      <span className={styles.fill} aria-hidden />
      <span className={styles.tooltip} role="tooltip">
        {label}
      </span>
    </button>
  );
});
