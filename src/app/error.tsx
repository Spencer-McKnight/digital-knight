'use client';

import { useEffect } from 'react';

/**
 * Route-segment error boundary — catches uncaught rendering errors inside the
 * app tree. Global `global-error.tsx` (sibling) catches errors that leak out
 * of this boundary itself, including layout-level faults.
 */
export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Wire to a real reporter (Sentry, Vercel Analytics, etc.) once selected.
    // Digest lets us correlate with server logs without leaking the stack.
    if (process.env.NODE_ENV !== 'production') {
      console.error('[route error]', error);
    }
  }, [error]);

  return (
    <main>
      <button type="button" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
