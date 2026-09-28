import type { DocumentProps } from '@/blocks/Document/Document';
import { cityLine, legal } from '../legal';
import { href } from '../routes';

export const meta = {
  title: 'Privacy policy',
  description: 'How Digital Knight handles personal data: what is collected, why, for how long, and your rights.',
};

const r = legal.retention;

export const privacy: DocumentProps = {
  folio: 'Legal',
  title: 'Privacy policy',
  updated: `Last updated ${legal.updated['en-AU']}`,
  sections: [
    {
      heading: 'Who is responsible',
      blocks: [
        { type: 'p', text: ['The controller of your personal data is:'] },
        {
          type: 'lines',
          lines: [
            `${legal.controller}, trading as ${legal.tradingName}`,
            legal.address.street,
            cityLine(),
            'Australia',
            legal.email,
          ],
        },
        {
          type: 'p',
          text: [
            'This policy is written to the standard of the EU General Data Protection Regulation (GDPR) and also covers the Australian Privacy Principles. The same policy in German is at ',
            { text: 'digital-knight.au/de/datenschutz', href: href('privacy', 'de-DE') },
            '.',
          ],
        },
      ],
    },
    {
      heading: 'What is processed, why, and for how long',
      blocks: [
        {
          type: 'table',
          head: ['Processing', 'Data', 'Purpose', 'Legal basis', 'Kept for'],
          rows: [
            ['Hosting and server logs (Vercel)', 'IP address, browser, time, page requested', 'Deliver the site and keep it secure', 'Art. 6(1)(f) GDPR, legitimate interest', r.serverLogs],
            ['Booking a call (Supabase, Resend)', 'Name, email, chosen time, time zone', 'Arrange and confirm the call', 'Art. 6(1)(b) GDPR, steps before a contract', r.bookings],
            ['Sending a message (Resend)', 'Name, email, message', 'Reply to your enquiry', 'Art. 6(1)(b) GDPR', r.enquiries],
            ['Form protection', 'Time spent on the form, a hidden field, email domain', 'Keep spam out', 'Art. 6(1)(f) GDPR', 'Not stored beyond the request'],
            ['Vercel Web Analytics', 'Pages viewed, referrer, device type, country. No cookies.', 'Improve the site', 'Art. 6(1)(f) GDPR', r.analytics],
            ['Google Analytics (English pages only)', 'Cookie identifiers and usage data', 'Measure how the site is used', 'Art. 6(1)(a) GDPR, consent; § 25 TDDDG', r.googleAnalytics],
          ],
        },
        {
          type: 'p',
          text: [
            'Bookings are stored in Supabase. Messages are delivered by email through Resend and are not stored in a database.',
          ],
        },
      ],
    },
    {
      heading: 'Recipients and transfers',
      blocks: [
        {
          type: 'p',
          text: [
            'Vercel (hosting and analytics), Supabase (booking database), Resend (email) and Google (analytics on the English pages) process data on my behalf under data processing agreements. Each transfers data outside the EU on the basis of the EU-US Data Privacy Framework or standard contractual clauses.',
          ],
        },
        {
          type: 'p',
          text: [
            'The controller is in Australia. Australia has no adequacy decision from the European Commission, so data you send reaches a country without one.',
          ],
        },
        ...(legal.supabaseRegion
          ? [{ type: 'p' as const, text: [`The booking database is hosted in ${legal.supabaseRegion}.`] }]
          : []),
      ],
    },
    {
      heading: 'Cookies',
      blocks: [
        {
          type: 'p',
          text: [
            'Only Google Analytics sets cookies, and it runs only on the English pages. The German pages set no cookies. You can block or delete cookies in your browser at any time.',
          ],
        },
      ],
    },
    {
      heading: 'Your rights',
      blocks: [
        {
          type: 'list',
          items: [
            ['Access to the data held about you (Art. 15 GDPR)'],
            ['Correction of inaccurate data (Art. 16)'],
            ['Erasure (Art. 17)'],
            ['Restriction of processing (Art. 18)'],
            ['Data portability (Art. 20)'],
            ['Objection to processing based on legitimate interest (Art. 21)'],
            ['Withdrawal of consent at any time, for the future (Art. 7(3))'],
            ['Complaint to a data protection supervisory authority (Art. 77)'],
          ],
        },
        {
          type: 'p',
          text: [
            'To use any of these rights, write to ',
            { text: legal.email, href: `mailto:${legal.email}` },
            '. In Australia you can also complain to the Office of the Australian Information Commissioner at ',
            { text: 'oaic.gov.au', href: 'https://www.oaic.gov.au' },
            '.',
          ],
        },
      ],
    },
    {
      heading: 'Other points',
      blocks: [
        {
          type: 'list',
          items: [
            ['Giving data is voluntary, but a call cannot be booked without a name and email.'],
            ['There is no automated decision-making or profiling.'],
            ['Fonts are served from this site and make no request to Google.'],
            ['There are no third-party embeds such as maps or video.'],
          ],
        },
      ],
    },
  ],
};
