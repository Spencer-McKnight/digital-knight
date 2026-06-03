import type { Metadata } from 'next';
import { Hero } from '@/components/home/Hero';
import { ServiceCards } from '@/components/home/ServiceCards';
import { MeetSpencer } from '@/components/home/MeetSpencer';
import { Work } from '@/components/home/Work';

export const metadata: Metadata = {
  description:
    'Create tactical digital systems that solve and evolve. Guaranteed expert innovation for websites, AI, business processes, complex integrations.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Digital Knight: Tactical digital systems that solve and evolve',
    description:
      'Create tactical digital systems that solve and evolve. Guaranteed expert innovation for websites, AI, business processes, complex integrations.',
  },
};

export default function HomePage() {
  return (
    <main>
      <Hero />
      <ServiceCards />
      <Work />
      <MeetSpencer />
    </main>
  );
}
