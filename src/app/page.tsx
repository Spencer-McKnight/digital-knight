import type { Metadata } from 'next';
import { Hero } from '@/components/home/Hero';
import { Proof } from '@/components/home/Proof';
import { Services } from '@/components/home/Services';
import { Tech } from '@/components/home/Tech';
import { Turn } from '@/components/home/Turn';
import { LetsTalk } from '@/components/home/LetsTalk';

export const metadata: Metadata = {
  title: 'Digital Knight — Strategy, design, code that prevails.',
  description:
    'An independent studio for long-term digital partnerships. Strategy, design, development and AI — forged for businesses that intend to be here in a decade.',
};

/**
 * `/` — the home page (`home.md`).
 *
 *   A short film in six beats (`design.md` §9):
 *     1. Entry  — Hero (Page)
 *     2. Proof  — Proof (Stone)
 *     3. Act    — Services (Page)
 *     4. Act    — Tech (Stone)
 *     5. Turn   — Brief Forge (Page)
 *     6. Call   — Let's Talk (Stone)    ─┐
 *        Landing — Footer (Stone)       ─┘ continuous ground, landing lock
 *
 *   Ground alternates Page → Stone to mark act changes. Every section is
 *   self-contained and ground-agnostic: the transitions belong to the page.
 */
export default function HomePage() {
  return (
    <main>
      <Hero />
      <Proof />
      <Services />
      <Tech />
      <Turn />
      <LetsTalk />
    </main>
  );
}
