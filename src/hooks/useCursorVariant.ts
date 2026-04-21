import { useCallback } from 'react';
import { useUiStore, type CursorVariant } from '@/store/ui';

/**
 * Declarative cursor-variant handle.
 *
 *   const setVariant = useCursorVariant();
 *   <a onMouseEnter={() => setVariant('interactive')}
 *      onMouseLeave={() => setVariant('default')}>…</a>
 *
 * The custom Cursor component subscribes to the store and translates the
 * variant into visual state — consumers never touch DOM.
 */
export function useCursorVariant(): (variant: CursorVariant) => void {
  const setCursorVariant = useUiStore((state) => state.setCursorVariant);
  return useCallback((variant: CursorVariant) => setCursorVariant(variant), [setCursorVariant]);
}
