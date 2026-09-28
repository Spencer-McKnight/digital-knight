import '@/styles/index.scss';
import type { Metadata } from 'next';
import { Call } from '@/blocks/Call/Call';
import { Statement } from '@/blocks/Statement/Statement';
import { fontVariables } from './fonts';

export const metadata: Metadata = {
  title: 'Page not found | Digital Knight',
  robots: { index: false, follow: true },
};

// Two root layouts leave no single layout to compose a 404 from, and this page
// cannot see the request path, so it offers both markets.
export default function GlobalNotFound() {
  return (
    <html lang="en-AU" className={fontVariables}>
      <body>
        <main id="main">
          <Statement
            variant="page"
            folio="404"
            title="This page is not here."
            lede="The address may have changed in the redesign. Start from the cover, or read the work."
          />
          <Call link={{ href: '/', label: 'Back to the cover' }} />
          <div lang="de">
            <Call variant="quiet" lead="Diese Seite gibt es nicht." link={{ href: '/de', label: 'Zur deutschen Startseite' }} />
          </div>
        </main>
      </body>
    </html>
  );
}
