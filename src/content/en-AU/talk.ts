import type { AgendaProps } from '@/blocks/Agenda/Agenda';
import type { CallProps } from '@/blocks/Call/Call';
import type { StatementProps } from '@/blocks/Statement/Statement';
import { scenes } from '../art';
import { href } from '../routes';
import { ticket } from './ticket';

const L = 'en-AU' as const;

export const meta = {
  title: 'Free 30-minute digital strategy call',
  description: 'Pick a slot, add your name and email, done. No obligation. Times show in your own time zone.',
};

export const statement: StatementProps = {
  variant: 'page',
  folio: 'Book a call',
  title: 'Free strategy call. 30 minutes.',
  lede: 'Pick a slot, add your name and email, done. No obligation. Times show in your own time zone.',
  art: (() => {
    const s = scenes.conversation('Two plain chairs facing each other across a narrow concrete table, a hard light between them.');
    return { picture: s.picture, object: { kind: 'ticket', content: ticket, href: '#book', tilt: -1, at: s.at } };
  })(),
};

export const agenda: AgendaProps = {
  folio: 'The call',
  title: 'What the half hour holds.',
  length: '30 minutes',
  parts: [
    { title: 'Your business', detail: 'Your goals, what is getting in the way, and your questions about digital.' },
    { title: 'Recommendations and plans', detail: 'Ideas to line your website and tools up with your strategy.' },
    { title: 'What could come next', detail: 'Where a partnership could start, if it makes sense. No obligation either way.' },
  ],
};

export const hoursHead = { folio: 'When', title: 'When calls happen, in your time.' };

export const commitHead = { folio: 'Book', title: 'Pick a time.' };

export const call: CallProps = {
  variant: 'quiet',
  lead: 'Rather write first?',
  link: { href: href('contact', L), label: 'Send a message instead' },
  ground: 'carbon',
};
