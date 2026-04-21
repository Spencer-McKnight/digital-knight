import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Talk',
  description: 'Book a call. Direct to calendar, timezone detected.',
};

/**
 * `/talk` — the single conversion CTA of the site.
 *
 * Hosts the Cal.com embed (see `stack.md`). The page grammar collapses to
 * Entry → Call — a short film made of one action.
 */
export default function TalkPage() {
  return <main />;
}
