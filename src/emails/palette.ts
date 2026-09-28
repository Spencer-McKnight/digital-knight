import type { CSSProperties } from 'react';

// Email clients need inline colour values. These mirror the site's palette.
export const INK = {
  carbon: '#0B0B0A',
  paper: '#F2F1EC',
  signal: '#FFE500',
  graphite: '#5A5A55',
  rule: '#D6D5D0',
} as const;

export const SANS = "'Mona Sans', 'Helvetica Neue', Arial, sans-serif";
export const DISPLAY = "'Hubot Sans', 'Arial Black', Arial, sans-serif";

export const e = {
  body: { backgroundColor: INK.carbon, color: INK.paper, fontFamily: SANS, margin: 0, padding: '40px 16px' },
  container: { backgroundColor: INK.paper, color: INK.carbon, maxWidth: '560px', margin: '0 auto', padding: '44px 40px' },
  wordmark: {
    fontFamily: DISPLAY,
    fontSize: '12px',
    fontWeight: 800,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: INK.carbon,
    margin: 0,
  },
  title: {
    fontFamily: DISPLAY,
    fontSize: '32px',
    fontWeight: 800,
    lineHeight: 1,
    letterSpacing: '-0.02em',
    color: INK.carbon,
    margin: '28px 0 12px',
  },
  signal: { height: '8px', width: '56px', backgroundColor: INK.signal, margin: '0 0 24px' },
  lede: { fontSize: '17px', lineHeight: 1.5, margin: '0 0 28px' },
  label: {
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: INK.graphite,
    margin: '14px 0 4px',
  },
  value: { fontSize: '16px', fontWeight: 600, color: INK.carbon, margin: 0 },
  rule: { border: 0, borderTop: `1px solid ${INK.rule}`, margin: '28px 0' },
  text: { fontSize: '15px', lineHeight: 1.55, margin: '0 0 14px' },
  small: { fontSize: '13px', lineHeight: 1.5, color: INK.graphite, margin: 0 },
  link: { color: INK.carbon, textDecoration: 'underline', fontWeight: 600 },
} satisfies Record<string, CSSProperties>;
