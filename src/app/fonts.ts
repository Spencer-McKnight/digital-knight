import localFont from 'next/font/local';

// Both families are self-hosted, upright only, subset to Latin plus German,
// variable in weight and width. Mona keeps its optical-size axis. No request
// leaves the site for fonts.

export const hubot = localFont({
  src: '../../public/fonts/hubot-sans/HubotSans-Upright.woff2',
  variable: '--font-hubot',
  weight: '600 900',
  style: 'normal',
  display: 'swap',
  preload: true,
  adjustFontFallback: 'Arial',
  fallback: ['Arial Black', 'Arial', 'sans-serif'],
  declarations: [{ prop: 'font-stretch', value: '75% 125%' }],
});

export const mona = localFont({
  src: '../../public/fonts/mona-sans/MonaSans-Upright.woff2',
  variable: '--font-mona',
  weight: '400 700',
  style: 'normal',
  display: 'swap',
  preload: true,
  adjustFontFallback: 'Arial',
  fallback: ['system-ui', 'Helvetica Neue', 'Arial', 'sans-serif'],
  declarations: [{ prop: 'font-stretch', value: '100% 110%' }],
});

export const fontVariables = `${hubot.variable} ${mona.variable}`;
