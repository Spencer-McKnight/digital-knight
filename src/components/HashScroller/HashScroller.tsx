'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { scrollToElement } from '@/lib/scroll';

export function HashScroller() {
  const pathname = usePathname();
  const previous = useRef(pathname);

  useEffect(() => {
    const changed = previous.current !== pathname;
    previous.current = pathname;
    if (!changed) return;

    const hash = window.location.hash.slice(1);
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
