# SEO Strategy & Implementation Plan

Audit date: 2026-05-04
Domain: `digital-knight.au`
Stack: Next.js 16 (App Router), Vercel, SCSS, GA4

This document captures the current SEO posture and defines concrete implementation
tasks for agents working on discoverability, metadata, and search ranking.

---

## Current Strengths

These are already in place and should be preserved during any SEO work.

| Area | Detail | Files |
|---|---|---|
| Meta title + description | Unique per-page via Next.js `Metadata` export, template support (`%s · Digital Knight`) | `src/app/layout.tsx`, `src/app/page.tsx` |
| Open Graph / Twitter cards | `summary_large_image` card type, site name, titles | `src/app/layout.tsx` |
| `lang="en"` | Set on `<html>` | `src/app/layout.tsx` |
| Heading hierarchy | Single `<h1>` in Hero, `<h2>` per section, `<h3>` for sub-items | `Hero.tsx`, `Services.tsx`, `MeetSpencer.tsx`, `Footer.tsx` |
| Semantic HTML | `<main>`, `<section>`, `<nav>`, `<footer>` with `aria-labelledby` | All section components |
| ARIA accessibility | `aria-label`, `aria-modal`, `role="alert"`, `aria-live="polite"` | Booking flow components |
| Image alt text | Descriptive alt on primary image | `MeetSpencer.tsx` |
| Font loading | Local WOFF2, `adjustFontFallback: 'Arial'`, `display: 'swap'` — near-zero CLS | `src/app/fonts.ts` |
| Image formats | AVIF + WebP via `next.config.ts` | `next.config.ts` |
| Analytics | GA4 lazy-loaded off critical path, Vercel Analytics | `GtagLazyClient.tsx`, `layout.tsx` |
| Security headers | `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options` | `next.config.ts` |
| Robots directive | `index: true, follow: true` in metadata | `src/app/layout.tsx` |
| Web manifest | Present with 192px + 512px icons | `public/site.webmanifest` |

---

## Gaps & Tasks

### P0 — Critical (implement first)

#### 1. Add canonical URL

**Problem:** No `alternates.canonical` declared. Google decides the canonical, risking
duplicate indexing across `digital-knight.au`, `www.digital-knight.au`, and
trailing-slash variants.

**Where:** `src/app/layout.tsx` — add to the `metadata` export:

```ts
alternates: {
  canonical: 'https://digital-knight.au',
},
```

Page-level metadata should override with its own canonical when multi-page expansion
happens. For now the layout-level declaration covers the single-page site.

---

#### 2. Create `robots.txt`

**Problem:** No `robots.txt` exists. Sitemap discovery relies entirely on manual
Search Console submission.

**Where:** Create `src/app/robots.ts` (Next.js App Router convention):

```ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://digital-knight.au/sitemap.xml',
  };
}
```

---

#### 3. Create `sitemap.xml`

**Problem:** No sitemap exists. Even for a single-page site, a sitemap declares
canonical URLs and signals freshness via `lastModified`.

**Where:** Create `src/app/sitemap.ts`:

```ts
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://digital-knight.au',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
```

Extend this array as new pages are added.

---

#### 4. Add JSON-LD structured data

**Problem:** Zero structured data. The site is invisible to Google's rich result
features (business info box, service listings, knowledge panel).

**Where:** `src/app/layout.tsx` — add a `<script type="application/ld+json">` block
inside `<head>`, or create a dedicated `src/components/StructuredData.tsx` component.

**Schema types to implement:**

**a) `ProfessionalService` (primary)**
```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Digital Knight",
  "url": "https://digital-knight.au",
  "description": "An independent studio for long-term digital partnerships. Strategy, design, development and AI.",
  "founder": {
    "@type": "Person",
    "name": "Spencer McKnight"
  },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Melbourne",
    "addressRegion": "VIC",
    "addressCountry": "AU"
  },
  "email": "hello@digital-knight.au",
  "sameAs": [
    "https://www.linkedin.com/in/spencer-mcknight/",
    "https://github.com/Spencer-McKnight/"
  ],
  "serviceType": [
    "Web Design",
    "Web Development",
    "AI Automation",
    "Digital Strategy"
  ]
}
```

**b) `WebSite` (enables sitelinks search box)**
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Digital Knight",
  "url": "https://digital-knight.au"
}
```

Validate output with https://search.google.com/test/rich-results after deployment.

---

### P1 — High Priority

#### 5. Add OG image

**Problem:** `openGraph` metadata has no `images` property. Social shares and Google
Discover fall back to scraping or show nothing.

**Spec:** 1200x630px branded image. Place in `public/og-image.png` (or `.jpg`).

**Where:** `src/app/layout.tsx` — add to `openGraph`:

```ts
images: [
  {
    url: '/og-image.png',
    width: 1200,
    height: 630,
    alt: 'Digital Knight — Strategy, design, code that prevails.',
  },
],
```

Also add to `twitter`:
```ts
images: ['/og-image.png'],
```

The image itself requires design work — should match brand (Ember on Stone palette,
Aeonik typography). See `design.md` for colour/type tokens.

---

#### 6. Add `favicon.ico` + `apple-touch-icon.png`

**Problem:** No `favicon.ico` or `apple-touch-icon` in `/public`. Browsers request
`/favicon.ico` by default — its absence generates 404s.

**Where:** Generate from existing `icon-512.png`:
- `public/favicon.ico` — 32x32 (or multi-size .ico)
- `public/apple-touch-icon.png` — 180x180

Next.js App Router auto-discovers `favicon.ico` and `apple-touch-icon.png` from
`/public` or `src/app/` — no metadata changes needed.

---

#### 7. Build a real 404 page

**Problem:** `src/app/not-found.tsx` renders an empty `<main />`. Functional 404 pages
reduce bounce and retain crawl equity.

**Where:** `src/app/not-found.tsx`

Should include:
- A heading (e.g. "Lost ground")
- Brief message
- Link back to home (`/`)
- Link to services (`/#services`)
- Link to booking (`/#talk`)

Style with the existing design system — Stone ground, Aeonik typography.

---

#### 8. Enrich page-level OG metadata

**Problem:** Layout-level OG description is generic (`"Digital Knight — Website,
Design, Automation, AI."`). The page-level metadata in `page.tsx` has a richer
description but doesn't override OG fields, so the layout's weaker version wins.

**Where:** `src/app/page.tsx` — extend the `metadata` export:

```ts
export const metadata: Metadata = {
  title: 'Digital Knight — Strategy, design, code that prevails.',
  description: 'An independent studio for long-term digital partnerships...',
  openGraph: {
    title: 'Digital Knight — Strategy, design, code that prevails.',
    description:
      'An independent studio for long-term digital partnerships. Strategy, design, development and AI — forged for businesses that intend to be here in a decade.',
  },
};
```

---

### P2 — Medium Priority

#### 9. Add geo/local SEO signals

**Problem:** Footer mentions "Melbourne, Australia" in plain text. No `<address>` tag,
no geo meta, no LocalBusiness schema coordinates. Weak for local intent queries like
"web developer melbourne."

**Options (pick one or combine):**
- Wrap Footer location in `<address>` tag
- Add `geo.region` / `geo.placename` meta tags
- Extend the ProfessionalService JSON-LD with `geo` coordinates (see task 4)

---

#### 10. Plan multi-page expansion

**Problem:** Everything lives on `/`. Only one URL can rank for one primary keyword
cluster. The Services content (strategy, design, development, AI automation) could
target different search intents on dedicated pages.

**Candidate pages:**
- `/web-design` or `/web-design-melbourne`
- `/ai-automation`
- `/strategy`
- `/about` (expand MeetSpencer into a full page)

This is an architectural decision — not a quick fix. Discuss with Spencer before
implementing. When ready, update `sitemap.ts` and add per-page metadata + JSON-LD.

---

## Implementation Notes

- **Validation:** After deploying structured data changes, validate at
  https://search.google.com/test/rich-results and
  https://validator.schema.org
- **Search Console:** After deploying `robots.txt` + `sitemap.xml`, submit the sitemap
  URL in Google Search Console
- **OG testing:** Use https://cards-dev.twitter.com/validator and Facebook's Sharing
  Debugger to verify social cards after adding the OG image
- **Preserve what works:** Do not modify existing heading hierarchy, ARIA patterns, or
  font loading strategy — these are correct and performant
- **`metadataBase`** is already set to `https://digital-knight.au` in layout metadata —
  all relative URLs in OG/Twitter images will resolve correctly
