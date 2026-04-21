import type { Metadata, Viewport } from 'next';
import { aeonik } from './fonts';
import './globals.scss';

export const metadata: Metadata = {
  metadataBase: new URL('https://digitalknight.com'),
  title: {
    default: 'Digital Knight — Strategy, design, code that prevails.',
    template: '%s · Digital Knight',
  },
  description:
    'Digital Knight is a studio for long-term digital partnerships. Strategy, design, development and AI — forged for businesses that intend to prevail.',
  applicationName: 'Digital Knight',
  authors: [{ name: 'Digital Knight' }],
  openGraph: {
    type: 'website',
    siteName: 'Digital Knight',
    title: 'Digital Knight',
    description: 'Strategy, design, code that prevails.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Knight',
    description: 'Strategy, design, code that prevails.',
  },
  icons: {
    icon: '/favicon.ico',
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
    { media: '(prefers-color-scheme: dark)',  color: '#403D39' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={aeonik.variable}>
      <body>{children}</body>
    </html>
  );
}
