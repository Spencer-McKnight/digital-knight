import type { IndexRow } from '@/blocks/Index/Index';
import type { ProofProps } from '@/blocks/Proof/Proof';
import type { ConcordanceProps } from '@/blocks/Concordance/Concordance';
import { caseCopy } from './case-page';
import { CASE_ORDER, CASES } from './cases';
import { getChrome } from './chrome';
import { href, type CaseSlug, type Locale } from './routes';
import type { LinkTo } from './types';

/** The Proof block for one case, in a market's words. */
export function proofOf(locale: Locale, slug: CaseSlug, folio: string, link: LinkTo): ProofProps {
  const shared = CASES[slug];
  const copy = caseCopy(locale, slug);
  return {
    folio,
    title: copy.headline,
    client: shared.client,
    kind: getChrome(locale).kinds[shared.kind],
    built: copy.built,
    image: { ...shared.lead, alt: copy.alt.lead },
    link,
  };
}

/** One row per case, in the house order. */
export function indexRows(locale: Locale): IndexRow[] {
  const kinds = getChrome(locale).kinds;
  return CASE_ORDER.map((slug) => {
    const shared = CASES[slug];
    const copy = caseCopy(locale, slug);
    return {
      href: href('case', locale, slug),
      client: shared.client,
      title: copy.line,
      kind: copy.indexKind ?? kinds[shared.kind],
      image: { ...shared.lead, alt: '' },
    };
  });
}

/** Every technology term with the cases that used it, alphabetical. */
export function concordanceData(locale: Locale): Pick<ConcordanceProps, 'terms' | 'cases'> {
  const kinds = getChrome(locale).kinds;
  const map = new Map<string, string[]>();
  for (const slug of CASE_ORDER) {
    for (const term of CASES[slug].terms) {
      map.set(term, [...(map.get(term) ?? []), slug]);
    }
  }
  const terms = [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b, locale, { sensitivity: 'base' }))
    .map(([term, slugs]) => ({ term, slugs }));
  const cases = CASE_ORDER.map((slug) => ({
    slug,
    href: href('case', locale, slug),
    client: CASES[slug].client,
    kind: caseCopy(locale, slug).indexKind ?? kinds[CASES[slug].kind],
  }));
  return { terms, cases };
}
