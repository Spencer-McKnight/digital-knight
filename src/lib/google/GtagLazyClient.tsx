'use client';

import Script from 'next/script';

type GtagLazyClientProps = {
  /** GA4 measurement ID, e.g. G-XXXXXXXXXX */
  gaId: string;
};

const GTAG_BASE = 'https://www.googletagmanager.com/gtag/js';

/** gtag (GA4) with `next/script` `lazyOnload` (after `load`, off the critical path). */
export function GtagLazyClient({ gaId }: GtagLazyClientProps) {
  const dataLayer = 'dataLayer';
  return (
    <>
      <Script
        id="gtag-init"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `window['${dataLayer}']=window['${dataLayer}']||[];function gtag(){window['${dataLayer}'].push(arguments);}gtag('js', new Date());gtag('config',${JSON.stringify(gaId)});`,
        }}
      />
      <Script
        id="gtag-external"
        strategy="lazyOnload"
        src={`${GTAG_BASE}?id=${encodeURIComponent(gaId)}`}
      />
    </>
  );
}
