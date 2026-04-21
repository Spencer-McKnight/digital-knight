# Digital Knight — Stack

A reference of the technical decisions underpinning the build. Every choice is argued, not listed.

---

## Framework — Next.js 15 (App Router)

**Version:** `next@15` · `react@19` · `typescript@5`

App Router is the right model for this site. Each page is a distinct film — Server Components deliver the shell instantly, Client Components take over for animation and interactivity. Turbopack handles dev HMR. Route segments map cleanly to the four pages (`/`, `/services`, `/method`, `/talk`).

No pages router. No `getServerSideProps`. The mental model is: static shell → hydrated experience.

---

## Styling — SCSS + CSS Modules

**Package:** `sass` (Dart Sass, the canonical compiler)

The design system is built on CSS custom properties (`--ink-*`, `--t-*`, `--space-*`, `--dur-*`). SCSS wraps this perfectly:

- **Mixins** for fluid breakpoints, the clamp type scale, and ground inversion — write once, call everywhere
- **Nesting** for component states without class proliferation
- **CSS Modules** keep every component's selectors truly scoped, with no runtime overhead
- **No Tailwind.** The design demands bespoke, per-component authorship. Utility classes fight that at every step.
- **No CSS-in-JS.** No styled-components, no Emotion — zero runtime cost, zero hydration overhead.

Token architecture and file structure are defined below.

---

## Animation — GSAP 3 + ScrollTrigger

**Package:** `gsap@3`

The loading sequence, text reveals, scroll-linked parallax, stat counters, custom cursor — all of this demands a professional animation timeline engine. GSAP is the industry standard for cinematic web animation and the unambiguous choice here.

- **ScrollTrigger** plugin drives all scroll-linked effects (parallax on imagery, section entrances, footer lock)
- **SplitText** (GSAP Club, included with paid license) enables the per-character/per-word heading reveals specified in the design
- Timeline composition makes the loading sequence (`DK` → `DIGITAL KNIGHT` → settle to nav) straightforward to build and tune
- `prefers-reduced-motion` collapses by toggling timeline `timeScale(0)` or swapping to opacity-only fallbacks — one place, clean implementation

Framer Motion is not used. It overlaps with GSAP, adds bundle weight, and its declarative model resists the imperative sequence control the loading beat and cursor need.

---

## 3D — React Three Fiber + Drei

**Packages:** `@react-three/fiber` · `@react-three/drei` · `three`

Used selectively — only where a page's **Turn** or **Proof** beat calls for it. R3F integrates cleanly into the React tree and works well alongside GSAP (animate R3F uniforms via GSAP's ticker). Drei supplies ready abstractions (environment maps, soft shadows, suspense loaders) that keep 3D scenes tight.

The design constraint — matte metal, no glassy chrome — means scenes are small and deliberate, not full-canvas spectacles. R3F + Drei makes that achievable without building a raw Three.js scaffold every time.

---

## State — Zustand 5

**Package:** `zustand@5`

The site has a small set of genuinely global states:

- `loadingComplete` — gates the loading sequence; components subscribe to know when to animate in
- `cursorVariant` — the custom cursor ring changes on hover over interactables
- `reducedMotion` — read from `prefers-reduced-motion` once, consumed everywhere

Zustand 5 handles this with no boilerplate and no context providers wrapping the tree. Nothing heavier is needed.

---

## Typography — next/font (localFont)

**Package:** built into Next.js

Aeonik is self-hosted from `/aeonik-font`. `next/font/local` handles subsetting, preloading, `font-display: swap`, and injects the `@font-face` with zero layout shift. Four weights ship (Light, Regular, Medium, Bold). Font family CSS custom property is set once from the injected class, consumed via the token system.

---

## Booking — Cal.com Embed

**Package:** `@calcom/embed-react`

`/talk` needs direct-to-calendar booking with timezone detection. Cal.com's embed component is the cleanest integration: self-hostable if needed, handles timezone automatically, and renders inline without a redirect. Styled to match the design system via Cal's `theme` and `styles` props.

---

## Package Manager — pnpm

Fast installs, strict dependency isolation, deterministic lockfile. The standard modern choice; no specific rationale required beyond it being faster and more correct than npm or yarn.

---

## Deployment — Vercel

Natural target for Next.js. Edge Network, automatic preview deployments per branch, built-in analytics. No configuration required to ship.

---

## Token Architecture

Three layers. Components only ever touch layer 2.

| Layer | Where | Role |
|---|---|---|
| **1. SCSS primitives** | `styles/tokens/_*.scss` | Raw values (`$ink-ember: #DD6637`). Used in mixins for computed values (rgba, darken). Never imported into component files. |
| **2. CSS custom properties** | `:root` in `globals.scss` | Semantic runtime tokens (`--ink-ember`). The only thing components reference. |
| **3. Ground overrides** | Section root via `@include ground-invert()` | Redeclares `--ink-*` locally for Stone-ground sections. All child components adapt through the cascade with no modification. |

**Why this layering:**
SCSS primitives exist for compile-time computation inside mixins. CSS custom properties exist because components must never hardcode color values, JS (GSAP) can read and animate them, and ground inversion is just CSS cascade — no prop threading, no conditional rendering.

---

## File Structure

```
src/
  app/
    layout.tsx                  ← root layout: font injection, globals.scss import
    globals.scss                ← @use styles/index — one import, zero output of its own
    page.tsx                    ← /
    services/
      page.tsx
    method/
      page.tsx
    talk/
      page.tsx

  components/
    Loader/
      Loader.tsx
      Loader.module.scss
    Nav/
      Nav.tsx
      Nav.module.scss
    Footer/
      Footer.tsx
      Footer.module.scss
    Cursor/
      Cursor.tsx
      Cursor.module.scss

  styles/
    tokens/
      _colors.scss              ← $ink-* primitives + :root --ink-* custom props
      _type.scss                ← $t-* + :root --t-*, --t-leading-*, --t-tracking-*
      _space.scss               ← $space-* + :root --space-*
      _motion.scss              ← $dur-*, $ease-* + :root --dur-*, --ease-*
      _grid.scss                ← $grid-* + :root --grid-*
    mixins/
      _respond.scss             ← respond-to($bp) — named breakpoint wrapper
      _fluid.scss               ← fluid($min, $max, $from, $to) — generates clamp()
      _type.scss                ← type($role) — applies size + leading + tracking in one call
      _ground.scss              ← ground-invert() — Stone-ground CSS var overrides
    _reset.scss                 ← modern reset: box-sizing, margin, list, img
    _base.scss                  ← html/body defaults, custom scrollbar, ::selection
    index.scss                  ← @use of all tokens + reset + base; no output of its own

  lib/
    gsap.ts                     ← register plugins (ScrollTrigger, SplitText), set defaults
    motion.ts                   ← prefers-reduced-motion detection; exports gate for GSAP timelines

  store/
    ui.ts                       ← Zustand: loadingComplete, cursorVariant, reducedMotion

  hooks/
    useLoadGate.ts              ← subscribes to loadingComplete; returns boolean for animation entry
    useCursorVariant.ts         ← sets cursorVariant from pointer events; consumed by Cursor
```

---

## Naming

**CSS Modules class names**

- `.root` — always the outermost element of a component. No exceptions.
- Child names are semantic to the component: `.title`, `.body`, `.lead`, `.figure`, `.actions`
- State via data attributes, not modifier classes: `[data-active]`, `[data-variant="ghost"]`
- Forbidden: `.wrapper`, `.container`, `.inner`, `.outer` — name what the element *is*, not where it sits

**SCSS**

- Partials: underscore prefix (`_colors.scss`). Entry points: no prefix (`index.scss`, `globals.scss`)
- SCSS variable names mirror their CSS custom property: `$ink-ember` → `--ink-ember`
- Mixins: verb-phrase kebab-case: `respond-to`, `fluid`, `type`, `ground-invert`
- No `@extend`. Only `@mixin` / `@include` and `@function`.

**TypeScript / Components**

- Component: PascalCase directory + matching filename (`Nav/Nav.tsx`, `Nav/Nav.module.scss`)
- Hooks: `use` prefix, camelCase, named for what they return (`useLoadGate`, `useCursorVariant`)
- Store file: feature-named (`ui.ts`), not `store.ts`
- GSAP timelines: named string IDs at creation — `gsap.timeline({ id: 'loader-sequence' })`. One timeline per named sequence, not per component.

**File-level rules**

- One component per file. No barrel `index.ts` re-exports unless the component has sub-parts (`Nav/index.ts` that re-exports `Nav.tsx` is acceptable; a shared `components/index.ts` is not).
- Co-locate the module with its component. No global `styles/components/` directory.

---

## Summary

| Layer | Choice | Version |
|---|---|---|
| Framework | Next.js App Router | 15 |
| Language | TypeScript | 5 |
| React | React | 19 |
| Styling | SCSS + CSS Modules | Dart Sass latest |
| Animation | GSAP + ScrollTrigger | 3 |
| 3D | React Three Fiber + Drei | latest |
| State | Zustand | 5 |
| Font loading | next/font (localFont) | built-in |
| Booking | Cal.com Embed | latest |
| Package manager | pnpm | latest |
| Deployment | Vercel | — |
