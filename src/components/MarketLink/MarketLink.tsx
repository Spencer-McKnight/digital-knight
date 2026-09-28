'use client';

import { usePathname } from 'next/navigation';
import { pairedHref, type Locale } from '@/content/routes';

/** A link to this page in the other market, written in that market's language. */
export function MarketLink({
  children,
  lang,
  hrefLang,
  className,
}: {
  children: React.ReactNode;
  lang: string;
  hrefLang: Locale;
  className?: string;
}) {
  const pathname = usePathname() ?? '/';
  return (
    <a href={pairedHref(pathname)} lang={lang} hrefLang={hrefLang} className={className}>
      {children}
    </a>
  );
}
