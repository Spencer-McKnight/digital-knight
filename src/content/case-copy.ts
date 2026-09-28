import type { CaseSlug } from './routes';
import type { Paragraph } from './types';

/**
 * What a case says, per market. Names, links, images and stacks live in
 * `cases.ts`; this is the words. Copy rule (`redesign/04-legal.md`): describe
 * the work, never outcome figures.
 */
export type CaseCopy = {
  meta: { title: string; description: string };
  /** The H1. */
  h1: string;
  /** A short headline for the Proof block. */
  headline: string;
  /** One line for the Index. */
  line: string;
  tagline: string;
  siteLabel: string;
  built: ReadonlyArray<Paragraph>;
  context: ReadonlyArray<Paragraph>;
  criteria: ReadonlyArray<string>;
  outcomes: ReadonlyArray<Paragraph>;
  engagements?: ReadonlyArray<{ name: string; description: string }>;
  /** Alt text for the lead and each plate, keyed as in `cases.ts`. */
  alt: { lead: string; before?: string; after?: string } & Record<string, string>;
  captions?: Record<string, string>;
  /** Use cases for each stack entry, in the order of `cases.ts`. */
  stackUse: ReadonlyArray<string>;
  /** Index label when the kind alone would mislead (Inlight). */
  indexKind?: string;
};

export type CaseCopyMap = Record<CaseSlug, CaseCopy>;
