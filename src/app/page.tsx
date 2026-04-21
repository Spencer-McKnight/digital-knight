import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Digital Knight — Strategy, design, code that prevails.',
  description:
    'A studio showcase. Long-term digital partnerships, bespoke web craft, AI integration, market research.',
};

/**
 * `/` — the home page. Atmosphere first, reading second.
 *
 * The home is the reference for all tech and design selection (see `home.md`).
 * Every beat — Entry, Proof, Acts, Turn, Call, Landing — is authored here
 * before it migrates to interior pages.
 *
 * Intentionally empty. The principal-architect scaffolding lands the frame;
 * the page is its own canvas.
 */
export default function HomePage() {
  return <main />;
}
