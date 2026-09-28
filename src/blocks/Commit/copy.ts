import type { LinkTo } from '@/content/types';

/** Every word the booking block says, per market. Placeholders in braces. */
export type CommitCopy = {
  /** "Times in your zone ({zone}). Calls run {days}, {start} to {end} in Melbourne." */
  subtitle: string;
  dayRange: string;
  gridLabel: string;
  prevWeek: string;
  nextWeek: string;
  free: string;
  form: {
    dialog: string;
    close: string;
    name: string;
    namePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    honeypot: string;
    submit: string;
    submitting: string;
    bookingFor: string;
  };
  errors: {
    name: string;
    email: string;
    expired: string;
    taken: string;
    details: string;
    server: string;
    network: string;
    calendar: string;
  };
  confirmed: {
    title: string;
    lede: string;
    emailFailed: string;
    add: string;
    google: string;
    outlook: string;
    apple: string;
    when: string;
    who: string;
    next: LinkTo;
  };
  live: { submitting: string; confirmed: string };
  noscript: string;
};

export const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (_, k: string) => values[k] ?? '');
