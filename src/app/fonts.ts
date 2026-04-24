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
 *
 * CLS strategy (performance.md)
 * -----------------------------
 * Files are shipped as `.woff2` (≈36KB each vs ≈99KB for the source TTF) so
 * the critical payload fits inside the initial HTML/CSS window on most
 * connections. `adjustFontFallback: 'Arial'` tells Next to emit a
 * metric-matched `size-adjust` fallback `@font-face`, so the first paint in
 * the fallback renders at *exactly* Aeonik's line-box dimensions. When the
 * real font swaps in, glyph metrics change but the line boxes do not — the
 * classic FOUT reflow that moves Hero/Nav around is gone.
 *
 * `display: 'swap'` is retained (rather than `'optional'`) because the
 * size-adjusted fallback neutralises the layout-shift cost of the swap; we
 * still want Aeonik to appear as soon as it arrives, even on slow networks.
 */
export const aeonik = localFont({
  src: [
    {
      path: '../../aeonik-font/Aeonik-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../aeonik-font/Aeonik-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../aeonik-font/Aeonik-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../aeonik-font/Aeonik-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--t-family-source',
  display: 'swap',
  preload: true,
  adjustFontFallback: 'Arial',
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
});
