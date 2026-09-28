# 03 · Sitemap, SEO, funnel

Phase 3. Two markets, one studio: en-AU (default, Australia) and de-DE (Germany). Everything here comes from the existing content and the services already claimed. No new clients, metrics or awards.

## Markets and routing

- **en-AU lives at `/`, de-DE at `/de`.** No automatic redirect by IP or browser language. Crawlers and people both get the URL they asked for.
- **Opening the other market is visible everywhere:**
  - the market pin in the masthead (DE on English pages, AU on German ones), linking to the paired page, not the home page
  - a line in the colophon: "Auf Deutsch lesen" / "Read in English"
  - on English pages, visitors whose browser prefers German see one dismissible line: "Diese Seite gibt es auch auf Deutsch." Client only. It never redirects.
- **hreflang.** Every indexable page lists `en-AU`, `de-DE` and `x-default` (the en-AU URL). Each locale's canonical points to itself.
- **One route map drives everything.** `src/content/routes.ts` maps page ids to `{ 'en-AU': path, 'de-DE': path }`. Canonicals, `alternates.languages`, sitemap entries, the Trail, the market pin and the colophon all read from it.
- **Two root layouts,** `app/(en-AU)/…` and `app/(de-DE)/de/…`, so `<html lang>` is right in the server HTML. Page files import blocks and content, nothing else.

## Route map

| Id | Stage | en-AU | de-DE | Robots |
| --- | --- | --- | --- | --- |
| `home` | Cover | `/` | `/de` | index |
| `services` | 1 Orientation | `/services` | `/de/leistungen` | index |
| `work` | 2 Proof | `/work` | `/de/referenzen` | index |
| `case` | 2 Proof | `/work/[slug]` | `/de/referenzen/[slug]` | index |
| `partnership` | 3 Offer | `/partnership` | `/de/zusammenarbeit` | index |
| `talk` | 4 Conversation | `/talk` | `/de/erstgespraech` | index |
| `contact` | Side door | `/contact` | `/de/kontakt` | index |
| `privacy` | Legal | `/privacy` | `/de/datenschutz` | noindex |
| `imprint` | Legal | (none) | `/de/impressum` | noindex, follow |

Case slugs are shared across locales: `sogif`, `dyflex`, `propertyinvesting`, `stevemcknight`, `inlight`.

## Funnel

Four stages, the way a studio actually sells. Every stage has its own page, and the funnel is a trail in the menu, not an anchor on the home page.

| Stage | The visitor is asking | en-AU | de-DE | Answered by | Next move |
| --- | --- | --- | --- | --- | --- |
| 1 Orientation | Is this for me? | What I do | Leistungen | Offer, Fit | ↳ Work |
| 2 Proof | Has this kind of work been done before? | Work, case studies | Referenzen | Proof, Index, Concordance; cases add Loupe, Narrative, Plates, Ledger | ↳ Partnership |
| 3 Offer | What do I get, how does it run, who does it? | Partnership | Zusammenarbeit | Method, Ledger, Credential, Dialogue | Ticket ↳ Book a call |
| 4 Conversation | When can we talk, and what happens? | Book a call | Erstgespräch | Agenda, Hours, Commit | Booked, with calendar export |

- **Home is the cover, not a stage.** It previews all four stages and offers two doors: "Start here" into Orientation, or the Ticket straight to Conversation for people who already know.
- **Side door.** `/contact` (Enquiry) is for people who would rather write. Its success state offers Commit, so a written enquiry can still become a booking.
- **Entry points.** Search tends to land on a case study or the services page. LinkedIn and referrals land on home or a case study. The Trail on every funnel page shows where the visitor stands and what comes next, whichever page they land on.

### The trail in the menu

The masthead carries "Start here" / "Hier starten" as its own entry. It opens the four stops, numbered, each with a one-line promise:

| # | en-AU | Promise | de-DE | Promise |
| --- | --- | --- | --- | --- |
| 1 | What I do | Four practices, one partner. | Leistungen | Vier Disziplinen, ein Ansprechpartner. |
| 2 | Work | What was built, and why. | Referenzen | Was gebaut wurde, und warum. |
| 3 | Partnership | How it runs, month to month. | Zusammenarbeit | So läuft es, Monat für Monat. |
| 4 | Book a call | 30 minutes, free. | Erstgespräch | 30 Minuten, kostenlos. |

The rest of the masthead: wordmark, Work / Referenzen, Contact / Kontakt, the "Book a call" / "Erstgespräch buchen" button, the market pin.

### Measurement

Two events through Vercel Analytics, which is cookieless: `funnel_step` (page id, locale) and `booking_created` (locale). Google Analytics stays on en-AU only for now; see consent and analytics in `04-legal.md`.

## Keyword map

One primary intent per indexable URL. Intents come from the services and proof already on the site. Search volumes are not validated; check them in Search Console eight weeks after launch. The title template is `%s | Digital Knight`; home sets its title in full.

**Copy rule:** titles, descriptions and headings describe the work, never outcome metrics. No percentages, multipliers, savings or traffic shares. "30 minutes" is the offer, not a claim, so it stays.

### en-AU

| URL | Primary intent | Title | Meta description | H1 |
| --- | --- | --- | --- | --- |
| `/` | independent digital studio Melbourne | Digital Knight \| Independent digital studio, Melbourne | One partner for digital strategy, websites and AI integration. Built in Melbourne and kept evolving, not handed off. Book a free 30-minute call. | Digital systems that solve, then evolve. |
| `/services` | digital strategy and web development services | Strategy, websites and AI integration \| Digital Knight | Advisory, website design and development, AI and automation, and market research. One accountable person in Melbourne, from strategy to code. | Strategy, websites and AI. One partner. |
| `/work` | web development case studies | Web development case studies \| Digital Knight | SOGIF, DyFlex, PropertyInvesting.com and SteveMcKnight.com. What each client needed, and what was built for them. | What was built, and why. |
| `/work/sogif` | investment fund website design | SOGIF: Investment fund website rebuild \| Digital Knight | A rebuild of the SOGIF fund's website: new design, new architecture, the same content structure for compliance, and a partnership that continues. | SOGIF.au: modernising a world-class fund |
| `/work/dyflex` | SAP portal development with Next.js | DyFlex: SAP vendor portal in Next.js \| Digital Knight | A Next.js front end for an SAP vendor portal across BTP, S/4HANA and OData V4, with an AI-assisted prototype workflow the team can reuse. | DyFlex: an SAP vendor portal in React |
| `/work/propertyinvesting` | website bot traffic audit | PropertyInvesting.com: Bot traffic and cost audit \| Digital Knight | Tracing heavy bot traffic to its source, charting a cheaper path forward, and three design directions for a long-running property community. | PropertyInvesting.com: resetting a community's trajectory |
| `/work/stevemcknight` | personal website design | SteveMcKnight.com: A personal website, idea to launch \| Digital Knight | A personal website taken from idea to launch at speed, on a static stack that is simple to keep running. | SteveMcKnight.com: from idea to launch |
| `/work/inlight` | full stack developer background (credential) | Inlight: Learning the craft in a product agency \| Digital Knight | Full stack work for Chadstone, Nando's, Urban Rest and AHM, and the Inlight Rising Star Award. Where the studio's craft was learned. | Inlight: where the craft was learned |
| `/partnership` | ongoing website development partner | Ongoing website development partner \| Digital Knight | Listen, ideate, create, evolve. Weekly demos, a live progress board and infrastructure you own. How a long-term partnership runs. | How the partnership runs. |
| `/talk` | free digital strategy consultation | Free 30-minute digital strategy call \| Digital Knight | Pick a slot, add your name and email, done. No obligation. Times show in your own time zone. | Free strategy call. 30 minutes. |
| `/contact` | contact Digital Knight (navigational) | Contact \| Digital Knight | Tell me what you are working on. I reply by email, and you can book a call straight after. | Introduce yourself. |

### de-DE

Written in German for a German buyer, not translated. Formal *Sie*. 24-hour times. The words German buyers search and trust: *Leistungen*, *Referenzen*, *Erstgespräch*, *unverbindlich*, *Ansprechpartner*. Same argument, Australian proof as it stands, with the emphasis moved to what a German buyer weighs: one accountable contact, infrastructure you own, documented results, and honesty about the time difference.

| URL | Primary intent | Title | Meta description | H1 |
| --- | --- | --- | --- | --- |
| `/de` | Digitalstudio für Strategie, Web und KI | Digital Knight \| Digitalstudio für Strategie, Web und KI | Ein Ansprechpartner für Digitalstrategie, Website und KI-Integration. Gebaut, um weiterzuwachsen, nicht um übergeben zu werden. Kostenloses Erstgespräch. | Digitale Systeme, die Probleme lösen und mit Ihnen wachsen. |
| `/de/leistungen` | Digitalstrategie und Webentwicklung | Digitalstrategie, Website und KI-Integration \| Digital Knight | Beratung, Webdesign und Entwicklung, KI und Automatisierung, Marktanalyse. Eine Person verantwortet alles, von der Strategie bis zum Code. | Strategie, Website, KI. Ein Ansprechpartner. |
| `/de/referenzen` | Referenzen Webentwicklung | Referenzen: Websites, Portale und Analysen \| Digital Knight | SOGIF, DyFlex, PropertyInvesting.com und SteveMcKnight.com. Was jeder Kunde brauchte und was dafür gebaut wurde. | Was gebaut wurde, und warum. |
| `/de/referenzen/sogif` | Website-Relaunch Investmentfonds | SOGIF: Website-Relaunch für einen Investmentfonds \| Digital Knight | Relaunch der Website des SOGIF-Fonds: neues Design, neue Architektur, gleiche Inhaltsstruktur für die Compliance und eine Partnerschaft, die weiterläuft. | SOGIF.au: ein Fonds, modern aufgestellt |
| `/de/referenzen/dyflex` | SAP-Portal mit Next.js | DyFlex: SAP-Lieferantenportal mit Next.js \| Digital Knight | Next.js-Frontend für ein SAP-Lieferantenportal über BTP, S/4HANA und OData V4, mit einem wiederverwendbaren, KI-gestützten Prototyping-Workflow. | DyFlex: ein SAP-Lieferantenportal in React |
| `/de/referenzen/propertyinvesting` | Bot-Traffic-Analyse für Websites | PropertyInvesting.com: Bot-Traffic- und Kostenanalyse \| Digital Knight | Die Quelle massiven Bot-Traffics gefunden, ein günstigerer Weg nach vorn und drei Designrichtungen für eine langjährige Immobilien-Community. | PropertyInvesting.com: eine Community, neu ausgerichtet |
| `/de/referenzen/stevemcknight` | persönliche Website erstellen lassen | SteveMcKnight.com: Persönliche Website, zügig umgesetzt \| Digital Knight | Eine persönliche Website, zügig von der Idee zum Launch, auf einem schlanken statischen Stack, der einfach zu betreiben ist. | SteveMcKnight.com: von der Idee zum Launch |
| `/de/referenzen/inlight` | Full-Stack-Entwicklung, Hintergrund | Inlight: Handwerk in einer Produktagentur \| Digital Knight | Full-Stack-Entwicklung für Chadstone, Nando's, Urban Rest und AHM, ausgezeichnet mit dem Inlight Rising Star Award. | Inlight: wo das Handwerk entstand |
| `/de/zusammenarbeit` | Website-Betreuung und Weiterentwicklung | Website-Betreuung und Weiterentwicklung \| Digital Knight | Zuhören, Ideen entwickeln, bauen, weiterentwickeln. Wöchentliche Demos, ein Live-Projektboard und Infrastruktur, die Ihnen gehört. | So läuft die Zusammenarbeit. |
| `/de/erstgespraech` | kostenloses Erstgespräch Digitalstrategie | Kostenloses Erstgespräch: 30 Minuten Digitalstrategie | Termin wählen, Name und E-Mail eintragen, fertig. Unverbindlich. Alle Zeiten erscheinen in Ihrer Zeitzone. | Kostenloses Erstgespräch. 30 Minuten. |
| `/de/kontakt` | Kontakt Digital Knight | Kontakt \| Digital Knight | Schreiben Sie, woran Sie arbeiten. Sie bekommen eine Antwort per E-Mail und können direkt danach einen Termin buchen. | Schreiben Sie mir. |

## Internal links

Rules, same in both locales:

- **Every funnel page** opens with the Trail (all four stops) and ends with a Call to the next stop.
- **Home.** Offer → services. Proof → SOGIF. Index rows → each case. Credential → partnership. Ticket → talk. Call → services.
- **Services.** Each practice links to its strongest proof. Advisory → PropertyInvesting. Websites → SOGIF and SteveMcKnight. AI and automation → DyFlex (the AI-driven prototype workflow). Research → PropertyInvesting. Fit's result → work.
- **Work.** Proof → SOGIF. Index → every case. Concordance → each technology to the cases that used it. Call → partnership.
- **Case.** Next case follows the existing `nextSlug` ring. Call → partnership.
- **Partnership.** Method's Create phase → DyFlex (prototype in four days). Evolve → SOGIF (ongoing retainer). Credential → Inlight. Dialogue answers → talk and the relevant case. Ticket → talk.
- **Talk.** "Rather write?" → contact. The confirmation links back to work.
- **Contact.** Success → Commit, in place.
- **Colophon.** Every indexable page in the locale, privacy (and Impressum on de-DE), the other market.
- **Across locales,** only the market pin, the colophon line, the hint and hreflang. German content pages never link into English ones, and the reverse.
- **Anchor text says where it goes:** "SOGIF fund rebuild", never "read more".

## Page compositions

Pages are ordered block instances plus content. Same order in both locales.

| Page | Blocks, in order |
| --- | --- |
| Home | Statement `cover` (Nightlight, Ticket) · Offer `compact` · Proof · Index `compact` · Credential `compact` · Call |
| What I do / Leistungen | Trail · Statement `page` · Offer `full` · **Fit** · Call |
| Work / Referenzen | Trail · Statement `page` · Proof · Index · **Concordance** · Call |
| Case | Trail · Statement `case` · Proof (what was built) · **Loupe** (if before and after) · Narrative `context` · Narrative `criteria` · Narrative `engagements` (Inlight) · Narrative `outcomes` · Plates · Ledger `stack` · Call |
| Partnership / Zusammenarbeit | Trail · Statement `page` · Method · Ledger `terms` · Credential · Dialogue · **Ticket** |
| Book a call / Erstgespräch | Trail · Statement `page` · **Agenda** · **Hours** · Commit · Call `quiet` (→ contact) |
| Contact / Kontakt | Statement `page` · Enquiry · **Hours** `compact` |
| Privacy, Datenschutz, Impressum | Document |
| 404 | Statement `page` · Call |

Blocks carried over from Phase 1: Statement, Offer, Proof, Index, Dialogue, Credential, Method, Commit, Enquiry, Narrative, Plates, Ledger, Call, Document. Masthead and Colophon are chrome.

## The seven new blocks

Each one is mounted on a real route in both locales.

| Block | Intention | Funnel | Desktop | Narrow | Routes |
| --- | --- | --- | --- | --- | --- |
| **Trail** | Show where you are on the way in, and the next stop. | Every stage; menu | Strip of four numbered stops under the masthead. Current stop in `--ink-text`, others muted, next stop marked ↳. | One line, "2/4 Work ↳ Partnership". Tap opens all four. | services, work, cases, partnership, talk; menu |
| **Ticket** | Make the free call an object you can take. | Offer → Conversation; cover | Cut-out ticket pressed onto a photographed surface at a fixed tilt. Lifts under the pointer, presses on click. Live text: "Admit one · 30 minutes · Free". | Full-width tap target at the foot of the block, no tilt, same text. | home, partnership |
| **Fit** | Let a visitor qualify themselves before reading on. | Orientation | Two columns: "This fits if" (four statements with tick boxes) and "It won't fit if" (two statements). A tally reads "3 of 4 ↳ See the work". | One column of full-width tick rows, tally pinned to the block's foot. | services |
| **Concordance** | Browse the proof by technology. | Proof | Grid of every technology across the case-study stacks. Hover or focus a term to light the cases that used it in the list beside. | Wrapping list of terms. Tap expands the matching cases under the term. | work |
| **Loupe** | Show what changed, under the light. | Proof | The before screenshot, full width. Nightlight in `reveal` mode: the pool of light follows the pointer and shows the after. | Scroll carries the light across once. A range input (keyboard too) sets it by hand. | cases: sogif, stevemcknight |
| **Agenda** | Say what the 30 minutes hold before anyone commits. | Conversation | A 30-minute bar in three segments: your business, recommendations and plans, what could come next. Minute stamps above. | Vertical list with minute stamps 00, 10, 20. | talk |
| **Hours** | Be honest about when calls happen, in the visitor's own time. | Conversation; side door | A 24-hour strip in the visitor's time zone with the call window shaded, a "now" tick, and the next free slot in both zones. | One line: "Next free: Tue 01:30 your time (10:30 Melbourne)". | talk, contact |

Fit's statements come from existing claims. It fits if: your website should do more than a brochure; you want one accountable person from strategy to code; you want AI and automation without starting over; you want a partner for years, not a handoff. It won't fit if: you need a one-off build and an invoice; you need a large in-house team on site.

## de-DE: decisions

1. **One booking window for both markets.** Decided 28 September 2026. The contract in `talk.md` is unchanged: Monday to Thursday, 10:00 to 15:00 Melbourne, one set of slots for everyone. Visitors see those slots in their own time zone. For Germany that is 02:00 to 07:00 from early April to early October, 00:00 to 05:00 from late October to late March, and 01:00 to 06:00 in the few weeks between, when only one country has changed its clocks. Hours and the Commit subtitle state both zones plainly, and Erstgespräch keeps the written request one tap away.
2. **Impressum.** Drafted in `04-legal.md`. The address stays blank until Spencer adds it.
3. **Privacy and consent.** No Google Analytics on de-DE pages; Vercel Analytics, which is cookieless, carries the funnel events. Full obligations in `04-legal.md`.
4. **German emails.** The booking confirmation and contact reply go out in German for de-DE visitors. That means adding a `locale` field to the booking and contact inputs. It is an addition to the contract, not a change.

## Content to confirm

- **Agenda split.** The three agenda parts come from `home.md`. The equal ten-minute split is presentation, not policy. Confirm or drop the minute stamps.

## Structured data and files

- Organization, Person and WebSite once per locale, with `inLanguage` and `areaServed: ["AU", "DE"]`.
- `CreativeWork` and `BreadcrumbList` per case, `ContactPage` on contact. No `FAQPage`.
- `sitemap.xml` lists both locales, with `alternates.languages` on every entry.
- `llms.txt` lists both locales' pages.
