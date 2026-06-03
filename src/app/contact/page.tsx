import type { Metadata } from 'next';
import { env } from '@/lib/env';
import { ContactSection } from '@/components/contact/ContactSection/ContactSection';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Start with a free 30-minute digital strategy conversation. Tell Digital Knight about your business goals, pain points and questions about digital, and get ideas, recommendations and future scoping.',
  alternates: { canonical: '/contact' },
  openGraph: {
    type: 'website',
    url: '/contact',
    title: 'Contact · Digital Knight',
    description:
      'Start with a free 30-minute digital strategy conversation with Digital Knight, a Melbourne digital agency.',
  },
};

const contactGraph = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  '@id': 'https://digital-knight.au/contact#contactpage',
  url: 'https://digital-knight.au/contact',
  name: 'Contact Digital Knight',
  description:
    'Start with a free 30-minute digital strategy conversation with Digital Knight, a Melbourne digital agency.',
  inLanguage: 'en-AU',
  about: { '@id': 'https://digital-knight.au/#organization' },
  mainEntity: {
    '@id': 'https://digital-knight.au/#organization',
  },
};

export default function ContactPage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactGraph) }}
      />
      <ContactSection hostEmail={env.BOOKING_HOST_EMAIL} />
    </main>
  );
}
