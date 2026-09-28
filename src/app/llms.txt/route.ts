import { CASE_ORDER, CASES } from '@/content/cases';
import { caseCopy } from '@/content/case-page';
import { getChrome } from '@/content/chrome';
import { absoluteUrl, href, type Locale } from '@/content/routes';
import { getSite } from '@/content/site';

export const dynamic = 'force-static';

function market(locale: Locale, heading: string) {
  const site = getSite(locale);
  const t = getChrome(locale);
  const pages = [
    `- [${t.colophon.home}](${absoluteUrl(href('home', locale))})`,
    ...t.trail.map((s) => `- [${s.label}](${absoluteUrl(href(s.id, locale))}): ${s.promise}`),
    `- [${t.nav.contact}](${absoluteUrl(href('contact', locale))})`,
  ];
  const work = CASE_ORDER.map((slug) => {
    const copy = caseCopy(locale, slug);
    return `- [${CASES[slug].client}](${absoluteUrl(href('case', locale, slug))}): ${copy.line}`;
  });
  return [
    `## ${heading}`,
    '',
    site.description,
    '',
    ...site.practices.map((p) => `- ${p.name}: ${p.description}`),
    '',
    ...pages,
    '',
    ...work,
  ].join('\n');
}

export function GET() {
  const body = [
    '# Digital Knight',
    '',
    '> The independent digital studio of Spencer McKnight, in Melbourne, Australia. One partner for digital strategy, websites and AI integration, from strategy to code, kept evolving after launch. A free 30-minute call is the first step.',
    '',
    'Email: hello@digital-knight.au',
    '',
    market('en-AU', 'English (Australia)'),
    '',
    market('de-DE', 'Deutsch (Deutschland)'),
    '',
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
