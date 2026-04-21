import { create } from 'zustand';

/**
 * Cursor variants — declared as a const tuple so the type stays exhaustive
 * and CSS data-attributes map one-to-one.
 */
export const CURSOR_VARIANTS = ['default', 'interactive', 'ember', 'hidden'] as const;
export type CursorVariant = (typeof CURSOR_VARIANTS)[number];

interface UiState {
  /** True once the DK → DIGITAL KNIGHT loading sequence has settled. */
  loadingComplete: boolean;
  /** Current cursor ring treatment — drives the custom cursor. */
  cursorVariant: CursorVariant;
  /** Mirror of `prefers-reduced-motion`; read from `lib/motion.ts` on boot. */
  reducedMotion: boolean;

  setLoadingComplete: (value: boolean) => void;
  setCursorVariant: (variant: CursorVariant) => void;
  setReducedMotion: (value: boolean) => void;
}

/**
 * Global UI store. Intentionally small — anything that belongs to a single
 * component stays in local state. This store is for cross-cutting signals
 * that multiple independent components must read.
 */
export const useUiStore = create<UiState>((set) => ({
  loadingComplete: false,
  cursorVariant: 'default',
  reducedMotion: false,

  setLoadingComplete: (value) => set({ loadingComplete: value }),
  setCursorVariant: (variant) => set({ cursorVariant: variant }),
  setReducedMotion: (value) => set({ reducedMotion: value }),
}));
