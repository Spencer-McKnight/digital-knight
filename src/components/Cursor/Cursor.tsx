'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import { gsap } from '@/lib/gsap';
import { useUiStore } from '@/store/ui';
import styles from './Cursor.module.scss';

const POINTER_FINE_QUERY = '(pointer: fine)';

function subscribePointerFine(callback: () => void) {
  if (typeof window === 'undefined') return () => undefined;
  const mq = window.matchMedia(POINTER_FINE_QUERY);
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
}

function getPointerFine(): boolean {
  return window.matchMedia(POINTER_FINE_QUERY).matches;
}

function getPointerFineServer(): boolean {
  return false;
}

/**
 * Custom cursor (`design.md` §6).
 *
 *   Small iron ring. Fills ember over interactables. Mounts only on
 *   pointer-fine devices.
 *
 *  • Pointer position is moved with `gsap.quickTo` so there's no React
 *    re-render on every mouse event (the store would storm otherwise).
 *  • Interactables are inferred from a selector list — any element matching
 *    it promotes the cursor to the `interactive` variant on enter.
 *  • The ring dims while the cursor is off-screen (mouse leaves the window).
 */
const INTERACTIVE_SELECTOR =
  'a, button, input, textarea, select, [role="button"], [data-interactive]';

export function Cursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const setCursorVariant = useUiStore((s) => s.setCursorVariant);
  const variant = useUiStore((s) => s.cursorVariant);
  const mounted = useSyncExternalStore(
    subscribePointerFine,
    getPointerFine,
    getPointerFineServer,
  );

  useEffect(() => {
    if (!mounted) return;
    const el = rootRef.current;
    if (!el) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.2, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.2, ease: 'power3.out' });

    const onMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };
    const onOver = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (target?.closest(INTERACTIVE_SELECTOR)) {
        setCursorVariant('interactive');
      } else {
        setCursorVariant('default');
      }
    };
    const onLeave = () => setCursorVariant('hidden');
    const onEnter = () => setCursorVariant('default');

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    document.addEventListener('pointerenter', onEnter);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('pointerenter', onEnter);
    };
  }, [mounted, setCursorVariant]);

  if (!mounted) return null;

  return (
    <div ref={rootRef} className={styles.root} data-variant={variant} aria-hidden>
      <span className={styles.ring} />
    </div>
  );
}
