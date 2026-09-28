import type { StatementProps } from '@/blocks/Statement/Statement';
import { coverArt } from '../art';
import { href } from '../routes';
import { ticket } from './ticket';

export const meta = {
  title: 'Digital Knight | Independent digital studio, Melbourne',
  description:
    'One partner for digital strategy, websites and AI integration. Built in Melbourne and kept evolving, not handed off. Book a free 30-minute call.',
};

export const cover: StatementProps = {
  variant: 'cover',
  folio: 'Independent studio, Melbourne',
  title: 'Digital systems that solve, then evolve.',
  art: coverArt('A sheet of paper under a hard light on a long concrete table, in a dark room.'),
  ticket: { content: ticket, href: href('talk', 'en-AU'), tilt: -2 },
};
