import type { Metadata } from 'next';

/**
 * One route map for both markets. Canonicals, `alternates.languages`, the
 * sitemap, the Trail, the market pin and the colophon all read from here.
 */

export const SITE_URL = 'https://digital-knight.au';

export const LOCALES = ['en-AU', 'de-DE'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en-AU';

export const CASE_SLUGS = ['sogif', 'dyflex', 'propertyinvesting', 'stevemcknight', 'inlight'] as const;
export type CaseSlug = (typeof CASE_SLUGS)[number];

export type PageId =
  | 'home'
  | 'services'
  | 'work'
  | 'case'
  | 'partnership'
  | 'talk'
  | 'contact'
  | 'privacy'
  | 'imprint';

type Robots = 'index' | 'noindex' | 'noindex-follow';

type PageDef = {
  paths: Record<Locale, string | null>;
  robots: Robots;
  /** Funnel stage, 1 to 4. Home and the side door have none. */
  stage?: 1 | 2 | 3 | 4;
};

const PAGES: Record<PageId, PageDef> = {
  home: { paths: { 'en-AU': '/', 'de-DE': '/de' }, robots: 'index' },
  services: { paths: { 'en-AU': '/services', 'de-DE': '/de/leistungen' }, robots: 'index', stage: 1 },
  work: { paths: { 'en-AU': '/work', 'de-DE': '/de/referenzen' }, robots: 'index', stage: 2 },
  case: { paths: { 'en-AU': '/work/[slug]', 'de-DE': '/de/referenzen/[slug]' }, robots: 'index', stage: 2 },
  partnership: { paths: { 'en-AU': '/partnership', 'de-DE': '/de/zusammenarbeit' }, robots: 'index', stage: 3 },
  talk: { paths: { 'en-AU': '/talk', 'de-DE': '/de/erstgespraech' }, robots: 'index', stage: 4 },
  contact: { paths: { 'en-AU': '/contact', 'de-DE': '/de/kontakt' }, robots: 'index' },
  privacy: { paths: { 'en-AU': '/privacy', 'de-DE': '/de/datenschutz' }, robots: 'noindex' },
  imprint: { paths: { 'en-AU': null, 'de-DE': '/de/impressum' }, robots: 'noindex-follow' },
};

export const PAGE_IDS = Object.keys(PAGES) as PageId[];

/** The four funnel stops, in order. */
export const FUNNEL: ReadonlyArray<Exclude<PageId, 'case'>> = ['services', 'work', 'partnership', 'talk'];

export function stageOf(id: PageId): number | null {
  return PAGES[id].stage ?? null;
}

export function robotsOf(id: PageId): Robots {
  return PAGES[id].robots;
}

export function isCaseSlug(slug: string): slug is CaseSlug {
  return (CASE_SLUGS as ReadonlyArray<string>).includes(slug);
}

/** Path for a page in a locale, or null where the market has no such page. */
export function pathFor(id: PageId, locale: Locale, slug?: string): string | null {
  const pattern = PAGES[id].paths[locale];
  if (pattern === null) return null;
  if (pattern.includes('[slug]')) {
    if (!slug) throw new Error(`routes: "${id}" needs a slug`);
    return pattern.replace('[slug]', slug);
  }
  return pattern;
}

/** Like `pathFor`, for pages that exist in the locale. */
export function href(id: PageId, locale: Locale, slug?: string): string {
  const path = pathFor(id, locale, slug);
  if (path === null) throw new Error(`routes: "${id}" has no ${locale} page`);
  return path;
}

export function absoluteUrl(path: string): string {
  return path === '/' ? SITE_URL : `${SITE_URL}${path}`;
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'en-AU' ? 'de-DE' : 'en-AU';
}

/** Resolve a pathname back to its page, locale and slug. */
export function resolvePath(pathname: string): { id: PageId; locale: Locale; slug?: string } | null {
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  for (const id of PAGE_IDS) {
    for (const locale of LOCALES) {
      const pattern = PAGES[id].paths[locale];
      if (pattern === null) continue;
      if (!pattern.includes('[slug]')) {
        if (pattern === clean) return { id, locale };
        continue;
      }
      const prefix = pattern.replace('[slug]', '');
      if (clean.startsWith(prefix)) {
        const slug = clean.slice(prefix.length);
        if (isCaseSlug(slug)) return { id, locale, slug };
      }
    }
  }
  return null;
}

export function localeOfPath(pathname: string): Locale {
  return pathname === '/de' || pathname.startsWith('/de/') ? 'de-DE' : 'en-AU';
}

/**
 * The same page in the other market. Pages the other market lacks fall back
 * to its home page; unknown paths do too.
 */
export function pairedHref(pathname: string): string {
  const here = resolvePath(pathname);
  const target = otherLocale(here?.locale ?? localeOfPath(pathname));
  if (!here) return href('home', target);
  return pathFor(here.id, target, here.slug) ?? href('home', target);
}

// ── Metadata ─────────────────────────────────────────────────────────────────

const OG_LOCALE: Record<Locale, string> = { 'en-AU': 'en_AU', 'de-DE': 'de_DE' };

export function alternatesFor(id: PageId, locale: Locale, slug?: string): Metadata['alternates'] {
  const canonical = href(id, locale, slug);
  const en = pathFor(id, 'en-AU', slug);
  const de = pathFor(id, 'de-DE', slug);
  if (!en || !de) return { canonical };
  return {
    canonical,
    languages: { 'en-AU': en, 'de-DE': de, 'x-default': en },
  };
}

function robotsMeta(id: PageId): Metadata['robots'] {
  const robots = PAGES[id].robots;
  if (robots === 'index') {
    return {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
    };
  }
  return { index: false, follow: robots === 'noindex-follow' };
}

type PageMetadataInput = {
  id: PageId;
  locale: Locale;
  slug?: string;
  /** Rendered through the `%s | Digital Knight` template. */
  title: string;
  /** Home sets its title in full, bypassing the template. */
  absoluteTitle?: boolean;
  description: string;
};

export function pageMetadata({ id, locale, slug, title, absoluteTitle, description }: PageMetadataInput): Metadata {
  const url = href(id, locale, slug);
  const fullTitle = absoluteTitle ? title : `${title} | Digital Knight`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: alternatesFor(id, locale, slug),
    robots: robotsMeta(id),
    openGraph: {
      type: id === 'case' ? 'article' : 'website',
      url,
      siteName: 'Digital Knight',
      locale: OG_LOCALE[locale],
      alternateLocale: [OG_LOCALE[otherLocale(locale)]],
      title: fullTitle,
      description,
    },
    twitter: { card: 'summary_large_image', title: fullTitle, description },
  };
}

/** ContactPage graph for the contact route in a market. */
export function contactGraph(locale: Locale, meta: { title: string; description: string }) {
  const url = absoluteUrl(href('contact', locale));
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${url}#contactpage`,
    url,
    name: meta.title,
    description: meta.description,
    inLanguage: locale,
    about: { '@id': `${SITE_URL}/#organization` },
    mainEntity: { '@id': `${SITE_URL}/#organization` },
  };
}
