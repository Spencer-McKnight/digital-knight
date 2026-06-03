'use client';

import {
  createElement,
  useEffect,
  useId,
  useState,
  type CSSProperties,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from 'react';
import styles from './Reveal.module.scss';

/**
 * Reveal — subtle, upward fade-in on scroll-into-view.
 *
 *   Uses IntersectionObserver (one-shot, then disconnects) rather than
 *   ScrollTrigger. Lighter, and entry motion only ever needs to fire once.
 *   Honors `prefers-reduced-motion` by collapsing to an opacity fade.
 *
 *   `immediate` bypasses IO entirely and plays a CSS @keyframes animation
 *   on first paint — use for above-fold content that should never flash
 *   invisible.
 */

type Amount = 'sm' | 'md' | 'lg';

type RevealOwnProps = {
  children: ReactNode;
  className?: string;
  /** Kill-switch: when false (default) the wrapper renders with no animation. */
  enabled?: boolean;
  /** Play on first paint via CSS keyframes instead of waiting for IO. */
  immediate?: boolean;
  /** Opacity-only — no vertical translate. */
  fadeOnly?: boolean;
  /** Stagger after intersection, in ms. */
  delay?: number;
  /** Translate distance preset. Default `md` (1.25rem). */
  amount?: Amount;
  /** Visibility ratio at which to fire. Default 0.15. */
  threshold?: number;
  /** Margin around the viewport bounding box. Default biases reveal slightly later. */
  rootMargin?: string;
};

type RevealProps<T extends ElementType> = RevealOwnProps & {
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, keyof RevealOwnProps | 'as'>;

export function Reveal<T extends ElementType = 'div'>(props: RevealProps<T>) {
  const {
    children,
    as,
    className,
    enabled = false,
    immediate = false,
    fadeOnly = false,
    delay = 0,
    amount = 'md',
    threshold = 0.03,
    rootMargin = '0px 0px -4% 0px',
    ...rest
  } = props;
  const Tag = as ?? 'div';
  const generatedId = useId();
  const elementId = (rest as { id?: string }).id ?? generatedId;

  const useIO = enabled && !immediate;
  const [revealed, setRevealed] = useState(!useIO);

  useEffect(() => {
    if (revealed) return;
    if (typeof document === 'undefined') return;
    const node = document.getElementById(elementId);
    if (!node) return;

    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setRevealed(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold, rootMargin },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [elementId, revealed, threshold, rootMargin]);

  const cls = [
    enabled && !immediate && styles.reveal,
    enabled && !immediate && !fadeOnly && styles[amount],
    enabled && !immediate && fadeOnly && styles.fadeOnly,
    enabled && immediate && !fadeOnly && styles.immediate,
    enabled && immediate && !fadeOnly && styles[`immediate_${amount}`],
    enabled && immediate && fadeOnly && styles.immediateFade,
    className,
  ].filter(Boolean).join(' ');

  const style: CSSProperties = {};
  if (delay && !immediate) style.transitionDelay = `${delay}ms`;
  if (delay && immediate) style.animationDelay = `${delay}ms`;

  return createElement(
    Tag,
    {
      id: elementId,
      className: cls,
      style: Object.keys(style).length ? style : undefined,
      'data-revealed': revealed ? 'true' : undefined,
      ...rest,
    } as ComponentPropsWithoutRef<T>,
    children,
  );
}
