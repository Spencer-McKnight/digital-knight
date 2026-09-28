import type { CaseKind } from './cases';
import type { Locale, PageId } from './routes';
import { chrome as enAU } from './en-AU/chrome';
import { chrome as deDE } from './de-DE/chrome';

export type TrailStop = {
  id: Extract<PageId, 'services' | 'work' | 'partnership' | 'talk'>;
  label: string;
  promise: string;
};

export type Chrome = {
  homeLabel: string;
  skip: string;
  nav: {
    start: string;
    work: string;
    contact: string;
    book: string;
    menu: string;
    close: string;
    primary: string;
  };
  trail: ReadonlyArray<TrailStop>;
  trailLabel: string;
  trailOpen: string;
  /** Market pin, pointing at the other market. */
  pin: { text: string; label: string; lang: string; hrefLang: Locale };
  /** Colophon line, in the other market's language. */
  marketLine: string;
  /** English pages only: shown when the browser prefers German. */
  hint?: { text: string; dismiss: string };
  colophon: {
    sign: string;
    start: string;
    work: string;
    studio: string;
    legal: string;
    home: string;
    contact: string;
    privacy: string;
    imprint?: string;
    location: string;
    rights: string;
  };
  kinds: Record<CaseKind, string>;
};

const CHROME: Record<Locale, Chrome> = { 'en-AU': enAU, 'de-DE': deDE };

export function getChrome(locale: Locale): Chrome {
  return CHROME[locale];
}
