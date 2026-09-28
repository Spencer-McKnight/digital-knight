You are the lead engineer and art director continuing the redesign of Digital Knight (https://digital-knight.au), the solo studio of Spencer McKnight. Phases 1 to 3 of the redesign are written and decided. Your job is Phases 4 to 6: the block system, the imagery and the build, in both markets.

Decide and build. The taste questions are settled in the docs. Where something small is still open, choose, write the reason in one line in your final report, and keep going. Stop and ask only for the items under "Stop and ask".

## Read first

1. `claude.md`, the project rules: no long dashes in content, short comments, read UI and SCSS together, do not check git history.
2. `redesign/01-intention-audit.md`, `02-identity.md`, `03-sitemap-funnel.md`, `04-legal.md`. These are the source of truth. Where they conflict with `design.md` or `home.md`, the redesign docs win. `talk.md` still governs the booking contract.
3. `.claude/skills/higgsfield-art-direction/SKILL.md` and its references, before any image work.
4. The code you are replacing: `src/app`, `src/components`, `src/styles`.

## Settled decisions (do not reopen)

- **Name and identity.** The name stays Digital Knight. Build the identity in `02-identity.md` as written:
  - carbon, paper and signal palette through semantic tokens
  - Hubot Sans and Mona Sans
  - four motion speeds
  - one 3D scene, Nightlight: the home cover, plus Loupe on the SOGIF and SteveMcKnight case studies. Nowhere else.
- **Markets.** en-AU at `/`, de-DE at `/de`, with the localised slugs in `03`. No automatic redirects.
- **One booking window for both markets.** The `talk.md` contract is unchanged: Monday to Thursday, 10:00 to 15:00 Australia/Melbourne, 30-minute slots, one-click booking, calendar export. German visitors see those slots in their local time (00:00 to 07:00 depending on season). The Hours block and the Commit subtitle state both zones plainly.
- **Copy rule.** Describe the work, never outcome metrics (`04-legal.md`). Rewrite the case studies, FAQ answers, `llms.txt` and structured data to match, and remove the `stats` arrays.
- **Impressum.** Follow the draft in `04-legal.md`. Address fields stay empty in `src/content/legal.ts`, render nothing, and log a build warning.
- **Analytics.** No Google Analytics on de-DE routes. Keep it on en-AU for now.
- **Agenda.** Three numbered parts and no minute stamps, until Spencer confirms the split.

## Ground rules

- **Branch and commits.** Work on a new branch, `redesign`, off `main`.
  - First commit: the five files in `redesign/`, plus the `three` and `@types/three` dependency change already in the working tree.
  - After that, commit at the end of each milestone.
- **Stay green.** Every milestone leaves `pnpm typecheck`, `pnpm lint`, `pnpm test` and `pnpm build` passing.
- **Hands off shared systems.** Do not push, deploy, edit `.env*`, or run Supabase commands.
- **Never submit a real booking or enquiry.** The local environment may point at production Supabase and Resend. Check flows up to the submit step. Leave the server actions to their tests, and add tests where logic changes.

## Order of work

### M1 · Foundations

- **Fonts.**
  - Download the Mona Sans and Hubot Sans variable WOFF2 files, with their OFL licences, from the official `github/mona-sans` and `github/hubot-sans` releases into `public/fonts/`. Upright only.
  - If fonttools is available, subset to Latin plus German glyphs, keeping the weight and width axes (and Mona's optical size).
  - Wire them through `next/font/local`, preloaded, with fallback metrics adjusted.
  - Remove Reforma and Plus Jakarta once nothing uses them.
- **Tokens.** Rewrite `src/styles/tokens/*` and `src/styles/mixins/*` to `02-identity.md`. Keep the grid and space tokens.
  - primitives and semantic `--ink-*` tokens
  - ground overrides for `data-ground` (paper, carbon, photo) through one mixin
  - the six type roles
  - the four speeds and the house curve
  - the focus ring
- **Routing.**
  - `src/content/routes.ts` maps page ids to per-locale paths. Its helpers produce the canonical, `alternates.languages` with `x-default`, and the paired URL for the market pin.
  - Two root layouts via route groups, `app/(en-AU)` and `app/(de-DE)/de`, each setting `<html lang>`.
  - Before building, confirm how the installed Next.js version handles multiple root layouts and a global not-found page.
- **Dead code from `01`.** Delete Cursor, `useCursorVariant` and its flag, HashScroller, SmoothLink, the scroll-spy and the `FAQPage` graph.

### M2 · Vertical slice: the cover

Prove the identity on one screen before building breadth.

- **Cover imagery only.**
  - Follow the skill. Write full prompts for set-list items 1 and 2 with the style clause pasted verbatim, and log them in `art/studio-night/`.
  - Explore at low resolution and commit to one. Render the final 21:9, then edit it (never crop) into the 4:5 mobile version.
  - Check the text-safe zone with `contact_sheet.py --zone`. The knight must be in the shadow, present but only faint.
- **Blocks for the slice.** Masthead (with the "Start here" trail entry and the market pin), Statement `cover`, Ticket and Colophon, and the en-AU home route built from them.
- **Nightlight, exactly as `02` specifies:**
  - one plane, a custom `ShaderMaterial`, normals from luminance
  - a damped pointer light, grain, and a single epic pass on coarse pointers
  - dynamic import after first paint, with the still image underneath
  - fails quietly; reduced motion never mounts it; stops rendering offscreen
- **Check in Chrome at 390×844 and 1440×900:**
  - the first screen reads as a magazine cover: one statement, one image world, one action
  - no layout shift when the canvas arrives
  - reduced motion and disabled WebGL both show the still
  - keyboard focus is visible throughout

### M3 · Block system

Build every block named in the "Page compositions" table of `03`:

- **The survivors:** Statement, Offer, Proof, Index, Dialogue, Credential, Method, Commit, Enquiry, Narrative, Plates, Ledger, Call, Document.
- **The seven new blocks:** Trail, Ticket, Fit, Concordance, Loupe, Agenda, Hours, with the desktop and narrow behaviours from the table.

Rules:

- Each block lives at `src/blocks/<Name>/<Name>.tsx` with `<Name>.module.scss`. Content arrives as props. Variants are props mapped to `data-*` attributes. The block root sets the ground.
- Tokens and variants are the only styling API. `rg '#[0-9a-fA-F]{3,8}\b' src/blocks src/app --glob '*.scss'` must return nothing. No page-level SCSS modules.
- Commit keeps every server action, slot token, spam check and the calendar export from `talk.md`. Move it out of `components/home/LetsTalk` into the block, and keep the booking offer after an enquiry working.
- Every heading gets the one type move: the width opens on an `aria-hidden` overlay, so layout never shifts.

### M4 · en-AU pages

- **Content.** One module per page in `src/content/en-AU/`, including the five case studies rewritten under the copy rule. Page files contain ordered block instances and content, nothing else.
- **Metadata.** Titles, descriptions and H1s exactly as in the `03` keyword map, plus canonicals and hreflang.
- **SEO files.**
  - `sitemap.ts` with both locales and alternates, and `robots.ts`
  - `StructuredData` per locale, with no `FAQPage`
  - `llms.txt`
  - OG and Twitter images in the new identity, composed in code from the cover
- **Analytics.** Vercel Analytics custom events `funnel_step` and `booking_created`.

### M5 · de-DE

- **Content.** German content in `src/content/de-DE/`, written as German with formal *Sie*, making the same argument with the same Australian proof. Titles, descriptions and H1s exactly as in `03`. The German pages should feel like the same studio in a second language.
- **Legal pages.**
  - `/de/impressum` and `/de/datenschutz` built from `04-legal.md`.
  - `/privacy` updated with the fixes listed there.
  - Unfilled fields render nothing.
- **Emails.** Add `locale` to the booking and contact inputs, and write German versions of both emails. Emails may keep inline colour values, which email clients need, but in the new palette.
- **Analytics.** Google Analytics is not loaded under the de-DE root layout.

### M6 · Remaining imagery and Loupe

- **Imagery.** Set-list items 3 to 9 from `02`.
  - The approved cover is reference image 1 for the scenes.
  - Objects: GPT Image 2.5 with a transparent background, then `matte.py clean --trim`. The approved ticket is the reference for the sticker and pin.
  - Cap: 12 finals for the whole session, including M2. Replace a render only if it is unusable.
  - Finals go to `public/images/<set>/` (AVIF or WebP at twice display size). Prompt logs go to `art/<set>/`.
- **Loupe.** On `/work/sogif` and `/work/stevemcknight` and their German pairs, using the existing before and after screenshots and Nightlight in reveal mode.

### M7 · Finish

- **Walk the funnel in both locales in Chrome.**
  - Land on a case study and follow the Trail to the booking page.
  - Reach the submit step of a booking and of an enquiry.
  - Open the other market from every page type.
  - Check 390 and 1440 widths, keyboard only, and reduced motion.
- **Update the docs.**
  - Rewrite `design.md` from `02-identity.md`, keeping the engineering rails.
  - Update `claude.md`: add the redesign docs to the docs table, note that `home.md` is no longer the tech reference, and that booking lives on `/talk`.
  - Add a short note to `talk.md` about the new route and the `locale` field.

## Stop and ask

- Any change to the booking contract or the Supabase schema.
- Anything that needs Spencer's legal details, or a decision listed under "Spencer to supply" in `04-legal.md`.
- The cover image cannot meet the brief within the credit cap.

## Done when

- A visitor can move through the funnel in en-AU and de-DE, reach booking or contact, read proof, and open the other market from any page.
- Every page is composed from the blocks, and tokens plus variants are the only styling API.
- Every image on the site shares one style clause. The 3D moment is one considered scene.
- You can point at the seven new blocks on real URLs in both locales.
- Typecheck, lint, tests and build pass.

## Report at the end

- What shipped per milestone, with commit hashes.
- Where each of the seven new blocks is mounted: URLs in both locales.
- Imagery: finals shipped, credits used, contact-sheet paths.
- Anything skipped, failing, or decided along the way, with the one-line reason.
- Open items for Spencer.
