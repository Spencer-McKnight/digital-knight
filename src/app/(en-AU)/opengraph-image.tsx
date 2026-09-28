import { OG_SIZE, ogCard } from '@/og/card';

export const alt = 'Digital Knight: digital systems that solve, then evolve.';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return ogCard({ kicker: 'Independent digital studio, Melbourne', title: 'Digital systems that solve, then evolve.' });
}
