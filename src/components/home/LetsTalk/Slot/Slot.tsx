'use client';

import { forwardRef } from 'react';
import styles from './Slot.module.scss';

/**
 * Slot — one cell in the week grid.
 *
 *   State is driven purely by `data-state`. The parent grid owns layout and
 *   selection; the cell owns visual affordance and focus behaviour. Cells
 *   are intentionally empty — the time headers and day rail provide context.
 *   Hover fills the cell with color to signal availability.
 */

export type SlotState = 'free' | 'taken' | 'past' | 'selected' | 'submitting';

export type SlotProps = {
  state: SlotState;
  /** Localised slot range for accessibility, e.g. "Wed 29 Apr · 10:30–11:00". */
  label: string;
  onSelect?: () => void;
};

export const Slot = forwardRef<HTMLButtonElement, SlotProps>(function Slot(
  { state, label, onSelect },
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
      <span className={styles.fill} aria-hidden />
    </button>
  );
});
