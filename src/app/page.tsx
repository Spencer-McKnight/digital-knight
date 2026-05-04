import { Suspense } from 'react';
import type { Metadata } from 'next';
import { Hero } from '@/components/home/Hero';
import { Services } from '@/components/home/Services';
import { MeetSpencer } from '@/components/home/MeetSpencer';
import { LetsTalk, LetsTalkSkeleton } from '@/components/home/LetsTalk';

export const metadata: Metadata = {

  title: 'Digital Knight — Next-gen strategic website design, AI evolutions & automation.',
  description:
    'Next-gen websites, AI automation and strategic vision for digital businesses. Design, infrastructure and modern development.',
  openGraph: {
    title: 'Digital Knight — Next-gen websites, AI automation and strategic vision for digital businesses.',
    description:
      'Next-gen websites, AI automation and strategic vision for digital businesses. Design, infrastructure and modern development.',
  },
};

/**
 * `/` — the home page (`home.md`).
 *
 *   A short film in five beats (`design.md` §9):
 *     1. Entry  — Hero (Page)
 *     2. Call   — Let's Talk (Stone)
 *     3. Act    — Services (Page)
 *     4. Act    — Meet Spencer (Stone)
 *        Landing — Footer (Stone)
 *
 *   Ground alternates Page → Stone to mark act changes. Every section is
 *   self-contained and ground-agnostic: the transitions belong to the page.
 */
export default function HomePage() {
  return (
    <main>
      <Hero />
      <Suspense fallback={<LetsTalkSkeleton />}>
        <LetsTalk />
      </Suspense>
      <Services />
      <MeetSpencer />
    </main>
  );
}
