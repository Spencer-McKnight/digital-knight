import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/next';
import { fontVariables } from '@/app/fonts';
import { Colophon } from '@/blocks/Colophon/Colophon';
import { Masthead } from '@/blocks/Masthead/Masthead';
import { FunnelTracker } from '@/components/FunnelTracker/FunnelTracker';
import { StructuredData } from '@/components/StructuredData';
import { SITE_URL, type Locale } from '@/content/routes';
import { PALETTE } from '@/styles/palette';

export const siteViewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: PALETTE.carbon,
  colorScheme: 'light',
};

export function siteMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: 'Digital Knight', template: '%s | Digital Knight' },
    applicationName: 'Digital Knight',
    authors: [{ name: 'Spencer McKnight' }],
    icons: {
      icon: [
        { url: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
        { url: '/icon-48.png', type: 'image/png', sizes: '48x48' },
        { url: '/images/favicon.svg', type: 'image/svg+xml' },
      ],
      shortcut: [{ url: '/icon-48.png', type: 'image/png' }],
      apple: [{ url: '/apple-icon.png', type: 'image/png', sizes: '180x180' }],
    },
    manifest: '/site.webmanifest',
  };
}

/** The document both root layouts render: masthead, page, colophon. */
export function SiteShell({ locale, children, after }: { locale: Locale; children: ReactNode; after?: ReactNode }) {
  return (
    <html lang={locale} className={fontVariables}>
      {/* eslint-disable-next-line @next/next/no-head-element -- App Router root layout owns <head>. */}
      <head>
        <link rel="llms-txt" href="/llms.txt" />
        <StructuredData locale={locale} />
      </head>
      <body>
        <Masthead locale={locale} />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Colophon locale={locale} />
        <FunnelTracker />
        <Analytics />
        {after}
      </body>
    </html>
  );
}
