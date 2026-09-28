import '@/styles/index.scss';
import { SiteShell, siteMetadata, siteViewport } from '@/components/SiteShell/SiteShell';
import { GtagLazyClient } from '@/lib/google/GtagLazyClient';

export const metadata = siteMetadata();
export const viewport = siteViewport;

const isProd = process.env.NODE_ENV === 'production';

// Google Analytics runs on en-AU only, pending Spencer's call (04-legal.md).
export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteShell locale="en-AU" after={isProd ? <GtagLazyClient gaId="G-FDR2H865P2" /> : null}>
      {children}
    </SiteShell>
  );
}
