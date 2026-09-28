import type { Locale } from './routes';
import { site as enAU } from './en-AU/site';
import { site as deDE } from './de-DE/site';

export type Site = {
  /** Organisation description for structured data and `llms.txt`. */
  description: string;
  slogan: string;
  jobTitle: string;
  practices: ReadonlyArray<{ name: string; description: string }>;
  navName: string;
};

const SITES: Record<Locale, Site> = { 'en-AU': enAU, 'de-DE': deDE };

export function getSite(locale: Locale): Site {
  return SITES[locale];
}
