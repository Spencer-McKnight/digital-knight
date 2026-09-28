'use client';

import { track } from '@vercel/analytics';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { resolvePath } from '@/content/routes';

/** `funnel_step` on every page view outside the legal pages. Cookieless. */
export function FunnelTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const here = pathname ? resolvePath(pathname) : null;
    if (!here || here.id === 'privacy' || here.id === 'imprint') return;
    track('funnel_step', { page: here.id, locale: here.locale });
  }, [pathname]);

  return null;
}
