import type { Metadata } from 'next';
import { Hero } from '@/components/home/Hero';
import { ServiceCards } from '@/components/home/ServiceCards';
import { MeetSpencer } from '@/components/home/MeetSpencer';
import { Work } from '@/components/home/Work';

export const metadata: Metadata = {
  title: 'Digital Knight — Strategic Web Design & AI Automation, Melbourne',
  description:
    'Tactical digital systems that solve and evolve. A Melbourne digital agency building next-gen websites, AI automation and strategic digital infrastructure.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Digital Knight — Tactical digital systems that solve and evolve',
    description:
      'Next-gen websites, AI automation and strategic vision for digital businesses. Design, infrastructure and modern development.',
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
