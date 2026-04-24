/**
 * Root-level loading boundary. Streaming fallback during server work.
 *
 * Stays empty by design. The page shell renders immediately and keeps its
 * own layout reservations, so this fallback should never inject a second UI
 * layer that could flash or shift content.
 */
export default function Loading() {
  return null;
}
