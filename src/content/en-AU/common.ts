import type { CommitCopy } from '@/blocks/Commit/copy';
import type { CredentialProps } from '@/blocks/Credential/Credential';
import type { EnquiryCopy } from '@/blocks/Enquiry/copy';
import type { HoursCopy } from '@/blocks/Hours/Hours';
import type { Practice } from '@/blocks/Offer/Offer';
import { href } from '../routes';

const L = 'en-AU' as const;

export const commit: CommitCopy = {
  subtitle: 'Times show in your zone ({zone}). Calls run {days}, {start} to {end} in Melbourne.',
  dayRange: '{first} to {last}',
  gridLabel: 'Free times, week of {range}',
  prevWeek: 'Previous week',
  nextWeek: 'Next week',
  free: 'Free',
  form: {
    dialog: 'Confirm your call',
    close: 'Close',
    name: 'Name and business',
    namePlaceholder: 'Your name and business',
    email: 'Email',
    emailPlaceholder: 'you@business.com',
    honeypot: 'Company (leave blank)',
    submit: 'Book the call',
    submitting: 'Booking',
    bookingFor: 'Booking for',
  },
  errors: {
    name: 'Add your name to book.',
    email: 'Check the email address.',
    expired: 'That time has expired. Pick another.',
    taken: 'Someone just took that time. Pick another.',
    details: 'Check the details and try again.',
    server: 'The booking did not go through. Try again in a moment.',
    network: 'The connection dropped. Try again.',
    calendar: 'The calendar did not load. Try again.',
  },
  confirmed: {
    title: 'Booked.',
    lede: 'A confirmation is on its way to your inbox, with the call link and a calendar file.',
    emailFailed: 'The confirmation email did not send. Add the call to your calendar below, and the link is in the event.',
    add: 'Add to your calendar',
    google: 'Google Calendar',
    outlook: 'Outlook',
    apple: 'Apple Calendar (.ics)',
    when: 'When',
    who: 'Who',
    next: { href: href('work', L), label: 'While you wait, read the work' },
  },
  live: { submitting: 'Booking your call.', confirmed: 'Booked for {when}. A confirmation email is on its way.' },
  noscript: 'The calendar needs JavaScript. Email {email} to book instead.',
};

export const enquiry: EnquiryCopy = {
  name: 'Name',
  email: 'Email',
  message: 'What are you working on?',
  honeypot: 'Website (leave blank)',
  submit: 'Send message',
  submitting: 'Sending',
  errors: {
    details: 'Check your name, email and message, then send again.',
    server: 'The message did not send. Try again shortly, or email hello@digital-knight.au.',
    retry: 'The message did not send. Try again.',
  },
  success: {
    title: 'Message sent.',
    body: 'I reply by email.',
    offer: 'Rather talk sooner? Your name and email carry over.',
    book: 'Book a call now',
    loading: 'Loading the calendar',
    back: 'Back',
    bookingAs: 'Booking as',
    calendarError: 'The calendar did not load. Try again.',
  },
};

export const hours: HoursCopy = {
  window: 'Calls run {days}, {start} to {end} in {city}.',
  yours: 'That is {start} to {end} your time ({zone}).',
  nextFree: 'Next free: {visitor} your time ({business} {city})',
  none: 'No free times in the next eight weeks. Write instead and I will find one.',
  dayRange: '{first} to {last}',
  city: 'Melbourne',
  now: 'Now',
  strip: '{day}, your time',
};

export const caseLabels = {
  folio: 'Case study',
  proof: 'What was built',
  loupe: 'Before and after',
  loupeFolio: 'What changed',
  loupeLede: 'Hold the light over the old site to see the new one.',
  before: 'Before',
  after: 'After',
  range: 'Move the light',
  context: 'Context',
  criteria: 'What success meant',
  engagements: 'Client work',
  outcomes: 'What was done',
  plates: 'The work',
  stack: 'Stack',
  next: 'Next case',
  call: 'See how the partnership runs',
  callLead: 'Every engagement starts the same way and keeps going after launch.',
};

export const credential: Omit<CredentialProps, 'variant' | 'link'> = {
  folio: 'Who does the work',
  title: 'Spencer McKnight',
  line: 'I set the strategy and write the code, so nothing is lost between the two.',
  facts: [
    'Bachelor of Business Information Technology (Professional)',
    'Two years as a full stack developer at Inlight',
    'Inlight Rising Star Award',
    'Hundreds of shipped digital experiences, across web and mobile',
  ],
  portrait: {
    src: '/images/credential/spencer.avif',
    width: 800,
    height: 1067,
    alt: 'A drawn portrait of Spencer McKnight, founder of Digital Knight',
  },
};

export const practices: ReadonlyArray<Practice> = [
  {
    name: 'Advisory',
    summary: 'Where digital can take the business, and what to build first.',
    items: ['AI and innovation strategy', 'Modern architecture', 'Digital product analysis', 'Success definitions'],
    proof: [{ href: href('case', L, 'propertyinvesting'), label: 'PropertyInvesting.com audit' }],
  },
  {
    name: 'Websites',
    summary: 'Design and build, then the evolution and upkeep that keep a site earning its place.',
    items: [
      'Development',
      'Design and branding',
      'Search',
      'Conversion and marketing',
      'Quality assurance',
      'Platform evolution',
      'Technical support',
    ],
    proof: [
      { href: href('case', L, 'sogif'), label: 'SOGIF fund rebuild' },
      { href: href('case', L, 'stevemcknight'), label: 'SteveMcKnight.com build' },
    ],
  },
  {
    name: 'AI and automation',
    summary:
      'A website can carry the back office too: tax and compliance data, payroll, orders and fulfilment, customer service and reporting, fed by the systems you already run.',
    items: ['AI workflows', 'Business process maps', 'Third-party integrations', 'Admin dashboards', 'Less manual work'],
    proof: [{ href: href('case', L, 'dyflex'), label: 'DyFlex SAP portal and prototype workflow' }],
  },
  {
    name: 'Research',
    summary: 'Know the market before deciding: who the customers are, what competitors do, what to try.',
    items: ['Market research', 'Competitor analysis', 'User stories', 'Customer journeys', 'Data analytics', 'Scope and project outline'],
    proof: [{ href: href('case', L, 'propertyinvesting'), label: 'PropertyInvesting.com audit' }],
  },
];
