import type { CallProps } from '@/blocks/Call/Call';
import type { LedgerProps } from '@/blocks/Ledger/Ledger';
import type { LoupeProps } from '@/blocks/Loupe/Loupe';
import type { NarrativeProps } from '@/blocks/Narrative/Narrative';
import type { PlatesProps } from '@/blocks/Plates/Plates';
import type { ProofProps } from '@/blocks/Proof/Proof';
import type { StatementProps } from '@/blocks/Statement/Statement';
import type { CaseCopy, CaseCopyMap } from './case-copy';
import { CASES } from './cases';
import { getChrome } from './chrome';
import { absoluteUrl, href, SITE_URL, type CaseSlug, type Locale } from './routes';
import { cases as enCases } from './en-AU/cases';
import { caseLabels as enLabels } from './en-AU/common';
import { cases as deCases } from './de-DE/cases';
import { caseLabels as deLabels } from './de-DE/common';

type Labels = typeof enLabels;

const COPY: Record<Locale, CaseCopyMap> = { 'en-AU': enCases, 'de-DE': deCases };
const LABELS: Record<Locale, Labels> = { 'en-AU': enLabels, 'de-DE': deLabels };

export function caseCopy(locale: Locale, slug: CaseSlug): CaseCopy {
  return COPY[locale][slug];
}

/** Everything a case page renders, in page order. */
export function casePage(locale: Locale, slug: CaseSlug) {
  const shared = CASES[slug];
  const copy = COPY[locale][slug];
  const t = LABELS[locale];
  const kind = getChrome(locale).kinds[shared.kind];

  const statement: StatementProps = {
    variant: 'case',
    folio: t.folio,
    client: shared.client,
    kind,
    title: copy.h1,
    tagline: copy.tagline,
    site: { href: shared.siteUrl, label: copy.siteLabel },
  };

  const proof: ProofProps = {
    folio: t.proof,
    title: copy.headline,
    client: shared.client,
    kind,
    built: copy.built,
    image: { ...shared.lead, alt: copy.alt.lead },
  };

  const loupe: LoupeProps | null =
    shared.loupe && copy.alt.before && copy.alt.after
      ? {
          folio: t.loupeFolio,
          title: t.loupe,
          lede: t.loupeLede,
          before: { ...shared.loupe.before, alt: copy.alt.before },
          after: { ...shared.loupe.after, alt: copy.alt.after },
          beforeLabel: t.before,
          afterLabel: t.after,
          rangeLabel: t.range,
        }
      : null;

  const context: NarrativeProps = { variant: 'context', folio: t.context, title: t.context, paragraphs: copy.context };
  const criteria: NarrativeProps = { variant: 'criteria', folio: t.criteria, title: t.criteria, items: copy.criteria };
  const engagements: NarrativeProps | null = copy.engagements
    ? { variant: 'engagements', folio: t.engagements, title: t.engagements, entries: copy.engagements }
    : null;
  const outcomes: NarrativeProps = { variant: 'outcomes', folio: t.outcomes, title: t.outcomes, paragraphs: copy.outcomes };

  const plates: PlatesProps = {
    folio: t.plates,
    title: t.plates,
    plates: shared.plates.map((p) => ({
      src: p.src,
      width: p.width,
      height: p.height,
      alt: copy.alt[p.key] ?? '',
      caption: copy.captions?.[p.key],
    })),
  };

  const stack: LedgerProps = {
    variant: 'stack',
    folio: t.stack,
    title: t.stack,
    rows: shared.stack.map((technology, i) => ({ term: technology, detail: copy.stackUse[i] ?? '' })),
  };

  const next = CASES[shared.next];
  const nextCase: CallProps = {
    variant: 'quiet',
    lead: t.next,
    link: { href: href('case', locale, next.slug), label: `${next.client}: ${COPY[locale][next.slug].line}` },
  };
  const call: CallProps = { lead: t.callLead, link: { href: href('partnership', locale), label: t.call } };

  return { statement, proof, loupe, context, criteria, engagements, outcomes, plates, stack, nextCase, call };
}

/** CreativeWork and breadcrumbs for one case. */
export function caseGraph(locale: Locale, slug: CaseSlug) {
  const shared = CASES[slug];
  const copy = COPY[locale][slug];
  const url = absoluteUrl(href('case', locale, slug));
  const home = absoluteUrl(href('home', locale));
  const work = absoluteUrl(href('work', locale));
  const chrome = getChrome(locale);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: copy.h1,
        description: copy.meta.description,
        inLanguage: locale,
        isPartOf: { '@id': `${home}#website` },
        primaryImageOfPage: `${SITE_URL}${shared.lead.src}`,
        mainEntity: { '@id': `${url}#work` },
      },
      {
        '@type': 'CreativeWork',
        '@id': `${url}#work`,
        name: copy.h1,
        headline: copy.h1,
        abstract: copy.tagline,
        url,
        image: `${SITE_URL}${shared.lead.src}`,
        keywords: shared.terms.join(', '),
        inLanguage: locale,
        creator: { '@id': `${SITE_URL}/#organization` },
        about: shared.terms.map((name) => ({ '@type': 'Thing', name })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: chrome.colophon.home, item: home },
          { '@type': 'ListItem', position: 2, name: chrome.nav.work, item: work },
          { '@type': 'ListItem', position: 3, name: shared.client, item: url },
        ],
      },
    ],
  };
}
