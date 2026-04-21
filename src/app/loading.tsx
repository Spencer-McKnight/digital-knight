/**
 * Root-level loading boundary. Streaming fallback during server work.
 *
 * Stays empty by design — the loading *experience* for first-visit is the
 * `Loader` component (DK → DIGITAL KNIGHT sequence). This boundary is a
 * quiet hand-off, not a second beat.
 */
export default function Loading() {
  return null;
}
