# 01 · Intention audit

Phase 1 of the redesign. A walk through the site as it stands on 28 September 2026. Each block is named by what it is for, not by what it used to be called. Old names appear once, in brackets, so the code can be found.

Live routes: `/`, `/work`, `/work/[slug]` (5), `/contact`, `/privacy`, plus 404, error, OG images, `sitemap.xml`, `robots.txt`, `llms.txt`.

## Findings that change the plan

1. **The conversion event has no route of its own.** The booking grid (`LetsTalk`) is not mounted on any page. A visitor only reaches it after submitting the contact form. The free 30-minute call, the one thing the site exists to produce, is hidden behind a different form.
2. **The method is built but unmounted.** `Services` (Listen, Ideate, Create, Evolve) holds the best explanation of how an engagement runs. Nobody sees it.
3. **Navigation points at the home page's insides.** `/#services` and `/#meet` are hash links into one long page, held together by scroll-spy code. There is no path a buyer can follow.
4. **Four labels for one action.** "Start a project", "Start with conversation", "Expert Advice" and "Contact" all lead to the same form.
5. **Claims the site cannot evidence.** "Guaranteed to deliver innovation." "Frontier AI was utilised without hallucinations." "Most agencies are still running the same playbook." The footer lists R3F, which is not in the codebase.
6. **Inlight is a tenure, not a client.** It sits in the case-study grid as if it were client work. It is credential, and should be labelled that way.
7. **FAQ structured data earns nothing.** Since August 2023 Google shows FAQ rich results only for authoritative government and health sites. The `FAQPage` graph in `StructuredData.tsx` adds weight without a result.
8. **Proof leans on outcome figures.** Percentages, multipliers and projected savings sit in titles, stats rails, the FAQ and `llms.txt`. Each one is a claim that has to hold up under Australian Consumer Law s 18 and, for the German market, UWG § 5. Decision: proof describes the work done, not numbers. See the copy rule in `04-legal.md`.

## Block by block

### Masthead (`Nav`)

- **Intention.** Identify the publication and move between its parts.
- **Keep.** Wordmark to home. One persistent action. Mobile drawer with Escape, focus handling, body scroll lock.
- **Cut.** Hash links into `/`. Scroll-spy, MutationObserver and settle timers. The glass blur bar.
- **Becomes.** Masthead with the funnel as its own menu entry ("Start here"), Work, Contact, and a market pin that opens the other locale.

### Statement (`Hero`)

- **Intention.** Make one claim and offer one action.
- **Keep.** "Solve and evolve", the one line of the old voice that is specific. Headline rendered in place on first paint.
- **Cut.** "Guaranteed to deliver innovation" (a guarantee is a promise the page cannot show). "Modernise your greatest successes" (says nothing a competitor could not). The eyebrow that repeats the wordmark.
- **Becomes.** Statement with three variants: `cover` (photograph, the 3D light, one action), `page` (title and lede), `case` (client, title, tagline, site link).

### Offer (`ServiceCards`)

- **Intention.** Name what is for sale in parts a buyer can scan.
- **Keep.** Four practices and their deliverables. Regrouped to match the business: Advisory, Websites, AI and automation, Research. Every item comes from the existing lists; the platform-evolution items join Websites, the research items from `Services › Listen` join Research.
- **Cut.** Generic icons (lightbulb, monitor, dataflow, infinity). The coarse-pointer scroll highlight, which fakes a state the card does not have.
- **Becomes.** Offer, set like a magazine contents page. Compact on home, full on the orientation page with one proof link per practice.

### Proof (`Work` featured card, case-study "At a glance")

- **Intention.** Show one piece of work and what it involved.
- **Keep.** SOGIF as lead. What was rebuilt and why: new design and architecture, the same content structure to keep compliance risk low, and the ongoing partnership that followed. Lead images.
- **Cut.** The "At a glance" stats. Outcome metrics anywhere in headline positions. The backdrop plus screen composite on every card.
- **Becomes.** Proof: one case, what was built, one link.

### Index (`Work` grid, the `sr-only` list on `/work`)

- **Intention.** List all the evidence so a visitor can choose.
- **Keep.** Order, labels, titles, lead images, links.
- **Cut.** The hidden duplicate nav on `/work`; the visible list becomes the accessible index. Inlight presented as client work.
- **Becomes.** Index: numbered rows with client, title and type (Rebuild, Portal, Audit, One-day build, Tenure). Inlight labelled "Before the studio".

### Dialogue (`FAQ`)

- **Intention.** Answer what a buyer asks before agreeing to a call.
- **Keep.** How AI is used and where decisions stay manual. AI versus automation. How to start, rewritten for the new funnel. Preferred technologies. The back-end examples (tax, payroll, orders, customer service, dashboards) move into Offer, where they explain what a website can carry.
- **Cut.** "What makes us a modern digital partner?" (generalises about competitors, proves nothing). The SOGIF figures repeated in three answers, and every other outcome metric. Answers longer than three short paragraphs. The `FAQPage` graph.
- **Becomes.** Dialogue on the offer page. Five questions.

### Credential (`MeetSpencer`)

- **Intention.** Show the person doing the work and why they can be trusted with it.
- **Keep.** Spencer McKnight. Bachelor of Business Information Technology (Professional). Two years full stack at Inlight. Rising Star Award. Hundreds of shipped digital experiences. The portrait.
- **Cut.** "Turn the tides for your online arena." "I'm not just a pretty website." The italic emphasis, which breaks the no-italics rail.
- **Becomes.** Credential: portrait, four checkable facts, one line in the first person.

### Method (`Services`, built, never mounted)

- **Intention.** Show how the work proceeds from the first conversation to ongoing change.
- **Keep.** Listen, Ideate, Create, Evolve, with their ledes, tags and questions. The progress board, weekly demonstrations, and "you own all infrastructure".
- **Cut.** The sticky scroll-stack (threshold maths, background extension). Fragile, and it hid the content behind a mechanism.
- **Becomes.** Method on the offer page.

### Commit (`LetsTalk`, only reachable after an enquiry)

- **Intention.** Turn intent into a booked conversation with one click.
- **Keep.** Everything functional, per `talk.md`: week grid, Monday to Thursday 10:00 to 15:00 Melbourne, 30-minute slots, signed slot tokens, honeypot and dwell checks, name and email, one-click book, Google, Outlook and Apple export, confirmation email and ICS.
- **Cut.** Copy ("30 mins, great ideas"). Styling.
- **Becomes.** Commit, the last stage of the funnel, on its own URL. Still offered after an Enquiry.

### Enquiry (`ContactSection`, `ContactForm`, `ContactSuccess`)

- **Intention.** Open a written channel for people not ready to pick a time.
- **Keep.** Name, email, message. Honeypot, dwell, disposable-domain checks. Success state with the booking offer.
- **Cut.** The "free digital consult" headline, which now belongs to the booking page. The rounded card.
- **Becomes.** Enquiry on `/contact`.

### Case study page (`CaseStudyPage`)

- **Intention.** Tell one engagement from brief to result.
- **Keep.** Context, success criteria, engagements, stack, images, site links. `CreativeWork` and breadcrumb JSON-LD. Static params.
- **Cut.** `'use client'` on the whole page; nothing in it needs the client. The sticky rail. The `stats` arrays. Outcomes rewritten as work done, without percentages, multipliers or savings: "identified the source of the bot traffic" rather than "97% of traffic was bots". Replace "without hallucinations" with what was done (the old site's content was ingested so the new copy kept Steve's voice). Repair the Inlight context sentence, which has no subject.
- **Becomes.** A composition of generic blocks: Statement `case`, Proof, Narrative (context, criteria, engagements, outcomes), Plates, Ledger, Call.

### Call (footer sign, case-study CTA, FAQ button)

- **Intention.** Hand the reader to the next stage.
- **Keep.** One action at the end of a page.
- **Cut.** Four labels for one destination.
- **Becomes.** Call: one next move, one verb per destination.

### Colophon (`Footer`)

- **Intention.** Sign off, list every page, carry legal and location.
- **Keep.** Sitemap columns, email, Melbourne, privacy, year, "Solve and evolve".
- **Cut.** "Site Stack … R3F …". The Services hash link.
- **Becomes.** Colophon with the market switch in words.

### Document (`/privacy`)

- **Intention.** Long legal text that has to be read, not skimmed.
- **Keep.** Content, `noindex`.
- **Fix.** The current text calls Google Analytics "anonymised" and says it "does not personally identify you". It sets cookies with client identifiers, which GDPR treats as personal data. It also lists phone numbers, which no form collects.
- **Becomes.** Document. The German market needs a GDPR privacy text and an Impressum; see `04-legal.md`.

### Behaviours and furniture

| Piece | Verdict |
| --- | --- |
| `Reveal` | Keep for block entrances. Headings get their own single type move instead. |
| `HashScroller`, `SmoothLink`, scroll-spy | Cut. No hash navigation remains; native scroll only. |
| `Cursor`, `useCursorVariant`, `CUSTOM_CURSOR_ENABLED` | Cut. Already disabled as a usability tax. The pointer becomes the light in one place instead. |
| `StructuredData` | Keep organisation, person, website. Drop `FAQPage`. Rebuild nav entries from the new route map. |
| `sitemap.ts`, `robots.ts`, `llms.txt` | Keep, extend to both locales. |
| OG and Twitter images | Rebuild in the new identity. |
| Emails | Keep templates, restyle, add German versions. |

## Removed, and why

| Removed | Reason |
| --- | --- |
| Hero guarantee line | Unevidenced promise |
| Outcome metrics (percentages, multipliers, savings) | Legal exposure; the work carries the proof |
| "Modern partner" answer | Competitor generalisation, no proof |
| FAQ structured data | No rich result available to this site |
| Custom cursor code | Already switched off, dead weight |
| Hash navigation and scroll-spy | Replaced by real routes |
| Hidden work list on `/work` | Duplicate of the visible index |
| "R3F" in the footer | Not true of the codebase |
| Icons on the offer cards | Generic, carry no meaning |
