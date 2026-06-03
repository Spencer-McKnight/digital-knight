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
const brandLogoIcon = {
  url: '/images/svg-logo.svg',
  type: 'image/svg+xml',
};

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: 'Digital Knight — Strategic Web Design & AI Automation, Melbourne',
    template: '%s · Digital Knight',
  },
  description:
    'Next-gen websites, AI automation and strategic vision for digital businesses. Design, infrastructure and modern development — forged by Digital Knight.',
  applicationName: 'Digital Knight',
  authors: [{ name: 'Digital Knight' }],
  icons: {
    icon: [brandLogoIcon],
    shortcut: [brandLogoIcon],
    apple: [brandLogoIcon],
    other: [
      {
        rel: 'mask-icon',
        url: brandLogoIcon.url,
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
      'Next-gen websites, AI automation and strategic vision for digital businesses. Design, infrastructure and modern development.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Knight',
    description:
      'Next-gen websites, AI automation and strategic vision for digital businesses. Design, infrastructure and modern development.',
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" className={`${serif.variable} ${sans.variable}`} style={{ backgroundColor: '#FFEDD7' }}>
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <StructuredData />
      </head>
      <body>
        <HashScroller />
        <div style={{ minHeight: '100vh', backgroundColor: '#FFEDD7' }}>
          <Nav />
          {children}
        </div>
        <Footer />
        <Analytics />
      </body>
      <GtagLazyClient gaId="G-FDR2H865P2" />
    </html>
  );
}
