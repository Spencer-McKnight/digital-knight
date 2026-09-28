import type { MetadataRoute } from 'next';
import { CASE_SLUGS, LOCALES, PAGE_IDS, absoluteUrl, pathFor, robotsOf, type PageId } from '@/content/routes';

const PRIORITY: Partial<Record<PageId, number>> = {
  home: 1,
  services: 0.9,
  work: 0.9,
  talk: 0.9,
  case: 0.8,
  partnership: 0.8,
  contact: 0.6,
};

/** Every indexable page in both markets, each with its language alternates. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const id of PAGE_IDS) {
    if (robotsOf(id) !== 'index') continue;
    const slugs: ReadonlyArray<string | undefined> = id === 'case' ? CASE_SLUGS : [undefined];

    for (const slug of slugs) {
      const en = pathFor(id, 'en-AU', slug);
      const de = pathFor(id, 'de-DE', slug);
      const languages =
        en && de ? { 'en-AU': absoluteUrl(en), 'de-DE': absoluteUrl(de), 'x-default': absoluteUrl(en) } : undefined;

      for (const locale of LOCALES) {
        const path = pathFor(id, locale, slug);
        if (!path) continue;
        entries.push({
          url: absoluteUrl(path),
          lastModified: now,
          changeFrequency: id === 'home' || id === 'work' ? 'weekly' : 'monthly',
          priority: PRIORITY[id] ?? 0.5,
          alternates: languages ? { languages } : undefined,
        });
      }
    }
  }

  return entries;
}
