'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import { gsap } from '@/lib/gsap';
import { useUiStore, type CursorVariant } from '@/store/ui';
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
 *   Iron ring. Ember fill over interactables. The native system cursor is
 *   suppressed globally on pointer-fine devices (`_base.scss`), so the ring
 *   is the *only* cursor on screen — which means every affordance the OS
 *   would have carried (pointer, grab, I-beam, press) has to be expressed
 *   here as a distinct variant:
 *
 *     default      · 22px hollow ring, iron stroke.
 *     interactive  · 40px ember disc, over anchors / buttons.
 *     grab         · 32px ring + centred dot, over `[data-cursor="grab"]`
 *                    (the hero seal). Signals "this is directly draggable."
 *     grabbing     · 22px filled disc, while the pointer is held down on a
 *                    grab target — the ring "closes" around the subject.
 *     text         · vertical I-beam, over text inputs and contenteditables.
 *     hidden       · opacity 0, while the pointer is outside the window.
 *
 *   Pointer position is moved with `gsap.quickTo` so there's no React
 *   re-render on every mouse event — only variant transitions (which are
 *   rare) bubble through the store.
 *
 *   The ring uses `mix-blend-mode: difference` so it keeps contrast over
 *   every ground the page uses (Page, Stone, figure duotones) without the
 *   component needing to know which ground it's over.
 */
const TEXT_SELECTOR = [
  'input:not([type="button"]):not([type="submit"]):not([type="reset"])',
  ':not([type="checkbox"]):not([type="radio"]):not([type="range"])',
  ':not([type="color"]):not([type="file"]):not([type="image"])',
  ', textarea, [contenteditable=""], [contenteditable="true"]',
  ', [data-cursor="text"]',
].join('');

const GRAB_SELECTOR = '[data-cursor="grab"]';

const INTERACTIVE_SELECTOR =
  'a, button, select, summary, [role="button"], [data-interactive], [data-cursor="interactive"]';

function resolveVariant(target: Element | null, pressed: boolean): CursorVariant {
  if (!target) return 'default';
  if (target.closest(GRAB_SELECTOR)) return pressed ? 'grabbing' : 'grab';
  if (target.closest(INTERACTIVE_SELECTOR)) return 'interactive';
  if (target.closest(TEXT_SELECTOR)) return 'text';
  return 'default';
}

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

    // Kept on refs so the grab↔grabbing transition on pointerdown/up can
    // re-resolve against the last known target without waiting for another
    // pointermove event.
    const lastTarget: { current: Element | null } = { current: null };
    const pressed = { current: false };

    const apply = () => {
      setCursorVariant(resolveVariant(lastTarget.current, pressed.current));
    };

    const onMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };
    const onOver = (e: PointerEvent) => {
      lastTarget.current = e.target as Element | null;
      apply();
    };
    const onDown = (e: PointerEvent) => {
      lastTarget.current = e.target as Element | null;
      pressed.current = true;
      apply();
    };
    const onUp = () => {
      pressed.current = false;
      apply();
    };
    const onLeave = () => setCursorVariant('hidden');
    const onEnter = () => {
      pressed.current = false;
      apply();
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    window.addEventListener('pointercancel', onUp, { passive: true });
    window.addEventListener('blur', onUp);
    document.addEventListener('pointerleave', onLeave);
    document.addEventListener('pointerenter', onEnter);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      window.removeEventListener('blur', onUp);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('pointerenter', onEnter);
    };
  }, [mounted, setCursorVariant]);

  if (!mounted) return null;

  return (
    <div ref={rootRef} className={styles.root} data-variant={variant} aria-hidden>
      <span className={styles.ring} />
      <span className={styles.dot} />
      <span className={styles.beam} />
    </div>
  );
}
