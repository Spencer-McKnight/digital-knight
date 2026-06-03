'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { scrollToElement } from '@/lib/scroll';

/**
 * Returns the canonical fragment for the current URL. A well-formed URL has at
 * most one fragment, but stacked navigations can leave behind values like
 * "services#work" — in that case we keep only the final segment, which is the
 * destination the user actually clicked.
 */
function readHash(): string {
  const raw = window.location.hash.slice(1);
  if (!raw) return '';
  const segments = raw.split('#').filter(Boolean);
  return segments.length ? segments[segments.length - 1] : '';
}

/**
 * Collapses any stacked fragment in the address bar down to a single, valid
 * hash so element lookups keep working. Returns the cleaned hash.
 */
function normalizeStackedHash(): string {
  const raw = window.location.hash.slice(1);
  const clean = readHash();
  if (raw !== clean) {
    const target = clean
      ? `${window.location.pathname}${window.location.search}#${clean}`
      : window.location.pathname + window.location.search;
    window.history.replaceState(null, '', target);
  }
  return clean;
}

export function HashScroller() {
  const pathname = usePathname();
  const previous = useRef(pathname);

  // Keep the address bar free of stacked fragments at all times — covers
  // back/forward, manual edits, and any race the router might introduce.
  useEffect(() => {
    const sanitize = () => normalizeStackedHash();
    sanitize();
    window.addEventListener('hashchange', sanitize);
    window.addEventListener('popstate', sanitize);
    return () => {
      window.removeEventListener('hashchange', sanitize);
      window.removeEventListener('popstate', sanitize);
    };
  }, []);

  useEffect(() => {
    const changed = previous.current !== pathname;
    previous.current = pathname;
    if (!changed) return;

    const hash = normalizeStackedHash();
    if (!hash) return;

    const scroll = () => {
      const el = document.getElementById(hash);
      if (!el) return false;
      scrollToElement(el, 'instant');
      return true;
    };

    if (scroll()) return;

    const mo = new MutationObserver(() => {
      if (scroll()) mo.disconnect();
    });
    mo.observe(document.body, { childList: true, subtree: true });
    const timeout = setTimeout(() => mo.disconnect(), 2000);

    return () => {
      mo.disconnect();
      clearTimeout(timeout);
    };
  }, [pathname]);

  return null;
}
