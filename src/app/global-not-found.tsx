import '@/styles/index.scss';
import type { Metadata } from 'next';
import Link from 'next/link';
import { fontVariables } from './fonts';

export const metadata: Metadata = {
  title: 'Page not found | Digital Knight',
};

// Two root layouts leave no single layout to compose a 404 from, and this
// page cannot see the request path, so it speaks to both markets at once.
// Interim markup; composed from Statement and Call once those blocks exist.
export default function GlobalNotFound() {
  return (
    <html lang="en-AU" className={fontVariables}>
      <body>
        <main id="main">
          <h1>Page not found</h1>
          <Link href="/">Home</Link>
          <div lang="de">
            <p>Diese Seite gibt es nicht.</p>
            <Link href="/de" hrefLang="de-DE">
              Zur Startseite
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
