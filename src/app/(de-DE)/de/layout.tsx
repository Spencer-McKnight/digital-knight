import '@/styles/index.scss';
import { SiteShell, siteMetadata, siteViewport } from '@/components/SiteShell/SiteShell';

export const metadata = siteMetadata();
export const viewport = siteViewport;

// No Google Analytics under de-DE. Vercel Analytics is cookieless.
export default function GermanLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell locale="de-DE">{children}</SiteShell>;
}
