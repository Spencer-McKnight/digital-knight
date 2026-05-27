import type { Metadata } from 'next';
import { Hero } from '@/components/home/Hero';
import { ServiceCards } from '@/components/home/ServiceCards';
import { MeetSpencer } from '@/components/home/MeetSpencer';

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

export default function HomePage() {
  return (
    <main>
      <Hero />
      <ServiceCards />
      <MeetSpencer />
    </main>
  );
}
