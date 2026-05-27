import localFont from 'next/font/local';

export const serif = localFont({
  src: [
    {
      path: '../../public/fonts/reforma/reforma.1969-blanca.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/reforma/reforma.1969-gris.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/reforma/reforma.1969-gris.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/reforma/reforma.1969-negra.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--t-family-serif-source',
  display: 'swap',
  preload: true,
  adjustFontFallback: 'Times New Roman',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
});

export const sans = localFont({
  src: [
    {
      path: '../../public/fonts/plus-jakarta/PlusJakartaSans-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/plus-jakarta/PlusJakartaSans-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/plus-jakarta/PlusJakartaSans-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/plus-jakarta/PlusJakartaSans-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--t-family-sans-source',
  display: 'swap',
  preload: true,
  adjustFontFallback: 'Arial',
  fallback: ['system-ui', 'Helvetica Neue', 'sans-serif'],
  declarations: [
    { prop: 'ascent-override', value: '110%' },
  ],
});
