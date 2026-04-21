import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lost ground',
};

/**
 * 404 boundary. Global to the app tree.
 *
 * Intentionally minimal — the bespoke treatment is authored in a future pass.
 * At minimum, render a landing point and a route home.
 */
export default function NotFound() {
  return <main />;
}
