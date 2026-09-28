'use client';

import styles from './Slot.module.scss';

export type SlotState = 'free' | 'taken' | 'past' | 'selected' | 'submitting';

/**
 * One cell of the week grid, driven by `data-state`. The grid owns layout and
 * selection. Choosing a slot fills it with signal, left to right.
 */
export function Slot({
  state,
  label,
  onSelect,
}: {
  state: SlotState;
  /** Localised slot range, e.g. "Tue 1 Oct · 02:00–02:30 (CEST)". */
  label: string;
  onSelect?: () => void;
}) {
  const interactive = state === 'free' || state === 'selected';
  return (
    <button
      type="button"
      data-state={state}
      aria-label={label}
      aria-pressed={state === 'selected' || state === 'submitting' ? true : undefined}
      disabled={state === 'taken' || state === 'past'}
      onClick={interactive ? onSelect : undefined}
      className={styles.root}
    >
      <span className={styles.fill} aria-hidden="true" />
    </button>
  );
}
