import { useUiStore } from '@/store/ui';

/**
 * Reads `loadingComplete` from the UI store.
 *
 *   const loaded = useLoadGate();
 *   useEffect(() => { if (loaded) openTimeline.play(); }, [loaded]);
 *
 * Subscribed components re-render only when the gate flips — Zustand selector
 * semantics — so `loadingComplete` is safe to pipe through cinematic
 * components without render storms.
 */
export function useLoadGate(): boolean {
  return useUiStore((state) => state.loadingComplete);
}
