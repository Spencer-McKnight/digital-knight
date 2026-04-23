import localFont from 'next/font/local';

/**
 * Aeonik — self-hosted from `/aeonik-font`.
 *
 * Shipping weights: Light 300 (display only), Regular 400, Medium 500, Bold 700.
 * No italics. Emphasis is carried by weight, size or ember (design.md §3).
 *
 * Exposes the CSS custom property `--t-family-source`. `layout.tsx` applies
 * the injected className to <html>, which in turn sets `--t-family` via the
 * SCSS token layer.
 */
export const aeonik = localFont({
  src: [
    {
      path: '../../aeonik-font/Aeonik-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../aeonik-font/Aeonik-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../aeonik-font/Aeonik-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../aeonik-font/Aeonik-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--t-family-source',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
});
