'use client';

/**
 * Last-resort error boundary. Wraps the entire tree including the root layout,
 * so it must ship its own <html>/<body>. No fonts, no tokens, no globals —
 * assume everything downstream is broken.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  if (process.env.NODE_ENV !== 'production') {
    console.error('[global error]', error);
  }

  return (
    <html lang="en">
      <body>
        <main>
          <button type="button" onClick={reset}>
            Reload
          </button>
        </main>
      </body>
    </html>
  );
}
