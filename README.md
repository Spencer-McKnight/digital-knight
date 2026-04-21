# Digital Knight

A studio showcase. Every page a short film. Read [`soul.md`](./soul.md) first.

---

## Docs

| File | Role |
| --- | --- |
| [`soul.md`](./soul.md) | Vision, voice, builder behaviour. |
| [`design.md`](./design.md) | Design system — tokens, grammar, accessibility. |
| [`stack.md`](./stack.md) | Technical stack, file structure, naming. |
| [`home.md`](./home.md) | `/` is the reference page for all tech selection. |
| [`page-ideas.md`](./page-ideas.md) | Route map and content direction. |

---

## Quickstart

```bash
pnpm install
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000). Dev uses Turbopack.

### Scripts

| Script | What it does |
| --- | --- |
| `pnpm dev` | Start Next.js with Turbopack. |
| `pnpm build` | Production build. |
| `pnpm start` | Serve the production build. |
| `pnpm lint` | ESLint via `next lint`. |
| `pnpm typecheck` | `tsc --noEmit` over the whole tree. |
| `pnpm format` | Prettier write. |
| `pnpm format:check` | Prettier check, no writes. |

---

## Architecture at a glance

```
src/
  app/                       App Router. One segment per page.
    layout.tsx               Font wiring + globals.
    globals.scss             Imports styles/ — the only global sheet.
    page.tsx                 /
    services/ method/ talk/  Interior pages
    error.tsx                Route-boundary error UI
    global-error.tsx         Tree-wide fallback (ships own <html>)
    not-found.tsx            404 boundary
    loading.tsx              Streaming fallback

  components/                CSS Modules colocated with each component
    Loader/  Nav/  Footer/  Cursor/

  styles/                    SCSS token system + mixins + reset + base
    tokens/_colors.scss      ← CSS custom properties for colour
    tokens/_type.scss        ← Fluid type scale
    tokens/_space.scss       ← 8-point rhythm
    tokens/_motion.scss      ← Durations + easings
    tokens/_grid.scss        ← 12-col fluid grid
    mixins/_respond.scss     ← respond-to($bp)
    mixins/_fluid.scss       ← fluid($min, $max)
    mixins/_type.scss        ← type($role)
    mixins/_ground.scss      ← ground-invert()

  lib/
    gsap.ts                  GSAP + plugin registration
    motion.ts                Reduced-motion detection

  store/
    ui.ts                    Zustand: loadingComplete, cursorVariant, reducedMotion

  hooks/
    useLoadGate.ts
    useCursorVariant.ts
```

All architectural rules live in `stack.md`. Read it before adding files.

---

## Design tokens — where to iterate

Tokens live in `src/styles/tokens/*.scss`. Each file carries an **⚑ ITERATE**
note explaining when (and when not) to extend it. Components never hardcode
colour, type, space, motion or grid values — always a token.

Ground inversion (Stone sections over Page default) is handled by the
`ground-invert()` mixin. Components stay ground-agnostic; the cascade does
the work.

---

## Font

Aeonik is self-hosted from [`/aeonik-font`](./aeonik-font) and loaded via
`next/font/local` in `src/app/fonts.ts`. Four weights ship: Light, Regular,
Medium, Bold. No italics.

---

## Deploy

Target is Vercel. No configuration required beyond connecting the repo.
