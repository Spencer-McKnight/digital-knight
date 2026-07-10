import type { Metadata, Viewport } from 'next';
import { serif, sans } from './fonts';
import { GtagLazyClient } from '@/lib/google/GtagLazyClient';
import './globals.scss';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { HashScroller } from '@/components/HashScroller';
import { StructuredData } from '@/components/StructuredData';
import { Analytics } from '@vercel/analytics/next';

const siteUrl = new URL('https://digital-knight.au');

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: 'Digital Knight: Evolve Online Strategy - AI & Websites',
    template: 'Digital Knight | %s',
  },
  description:
    'Create tactical digital systems that solve and evolve. Guaranteed expert innovation for websites, AI, business processes, complex integrations.',
  applicationName: 'Digital Knight',
  authors: [{ name: 'Digital Knight' }],
  icons: {
    icon: [
      { url: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
      { url: '/icon-48.png', type: 'image/png', sizes: '48x48' },
      { url: '/images/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: [{ url: '/icon-48.png', type: 'image/png' }],
    apple: [{ url: '/apple-icon.png', type: 'image/png', sizes: '180x180' }],
    other: [
      {
        rel: 'mask-icon',
        url: '/images/svg-logo.svg',
        color: '#DD6637',
      },
    ],
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Digital Knight',
    title: 'Digital Knight',
    description:
      'Create tactical digital systems that solve and evolve. Guaranteed expert innovation for websites, AI, business processes, complex integrations.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Knight',
    description:
      'Create tactical digital systems that solve and evolve. Guaranteed expert innovation for websites, AI, business processes, complex integrations.',
  },
  manifest: '/site.webmanifest',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFEDD7' },
    { media: '(prefers-color-scheme: dark)', color: '#403D39' },
  ],
};

const isProd = process.env.NODE_ENV === 'production';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" className={`${serif.variable} ${sans.variable}`} style={{ backgroundColor: '#FFEDD7' }}>
      <head>
        {isProd && (
          <>
            <link rel="preconnect" href="https://www.googletagmanager.com" />
            <link rel="preconnect" href="https://www.google-analytics.com" />
          </>
        )}
        <link rel="llms-txt" href="/llms.txt" />
        <StructuredData />
      </head>
      <body>
        <HashScroller />
        <div style={{ minHeight: '100svh', backgroundColor: '#FFEDD7' }}>
          <Nav />
          {children}
        </div>
        <Footer />
        <Analytics />
      </body>
      {isProd && <GtagLazyClient gaId="G-FDR2H865P2" />}
    </html>
  );
}
