# Digital Knight — Design System

Rails, not recipes. This document defines the frame. What goes inside the frame is designed per-section, per-moment, by the hand holding the pen.

---

## 0. Directive (read first)

> Digital Knight is not a product page — it is a studio's own showcase. The site must _feel_ before it _reads_. A short film with a promise, a proof, and a landing. The site's argument is the site itself: if we can't make this feel considered, we can't be trusted to make anyone else's work feel considered.
>
> Design with restraint on the page and generosity in the moments. One hero per fold. One ember per view.
>
> When in doubt: fewer words, larger type, darker ground, quieter motion, sharper edge.

---

## 1. Identity in one frame

A modern forge. Antique paper, charcoal stone, blackened steel, one ember of orange. Handmade and precision-engineered at once.

**Three inherited instincts, used as seasoning, not recipe:**

- _Lusion_ — cinema. Restraint, atmosphere, the reel is the argument.
- _Oryzo_ — wit. Each section is its own small demonstration of craft.
- _Supernova_ — clarity. Numbered, structured, trustable.

Lean cinema + wit. Nothing should feel generic-enterprise, and nothing should feel try-hard-3D.

---

## 2. Color

Four anchors. Everything else is a mix of these four.

| Token         | Hex       | Role                                       |
| ------------- | --------- | ------------------------------------------ |
| `--ink-page`  | `#FFEDD7` | Antique page. Primary canvas.              |
| `--ink-stone` | `#403D39` | Charcoal. Inversion zones, footer ground.  |
| `--ink-iron`  | `#1B1B1A` | Near-black. All text and UI definition.    |
| `--ink-ember` | `#DD6637` | Accent only. Interaction, single emphasis. |

**Rails**

- One ember moment per viewport. Ember is scarcity.
- Text pairings: Iron on Page, Page on Stone, Page on Iron. Nothing else.
- Ember is never a large fill — it is a stroke, an underline, a single letter, a lit edge.
- Shadows use Stone on Page (low opacity) or Iron on Stone. No pure-black shadows.
- Hairlines and dividers are Iron at ~12% on Page, Page at ~20% on Stone. One rule, everywhere.

---

## 3. Typography

**Family.** Aeonik, self-hosted from `/aeonik-font`.

**Variants that ship.** Light (display only), Regular, Medium, Bold. No italics anywhere — emphasis is carried by weight, size, or ember.

**Scale.** Fluid, clamp-based. Five roles, named by intent:

- `--t-monument` — sparingly, if at all. Cinematic.
- `--t-hero` — primary page title.
- `--t-section` — act headers.
- `--t-lede` — opening sentence, pull copy.
- `--t-body` — reading.
- `--t-meta` — eyebrows, captions, labels. Uppercase lives here and nowhere else.

**Setting rails**

- Heading line-heights are tight (≈0.95). Body line-height is generous (≈1.55).
- Negative letter-spacing on large heads; default on body.
- Paragraphs cap at ~62ch.
- Tabular numerals everywhere numbers appear in rows.

**Headers move.** Every hero and section head has _one_ kinetic treatment — a reveal, a weight-shift, or a track-widen — never mixed inside a block. Body type is still. Motion is a privilege.

---

## 4. Logo & Wordmark

- Wordmark: `DIGITAL KNIGHT`, Aeonik Medium, wide tracking, Iron on Page.
- `DK` short form is reserved for compact UI marks (small-screen nav) and favicon only.
- The wordmark stands alone — no box, no lockup, generous air.

---

## 5. Initial Load

- Nav assumes Page (light) until section-ground detection refines it.
- Hero copy and CTA render in-place on first paint (no post-hydration hide/reveal).
- Motion is reserved for scroll-enter moments and interaction feedback, not startup gating.

---

## 6. Motion

**Philosophy.** Motion acknowledges change. If nothing changed, nothing moves.

**Rails**

- One house easing curve, used everywhere except infinite marquees.
- Four speeds by role: _state_ (instant feedback), _element_ (object-level), _scene_ (section-level), _epic_ (sparingly).
- Parallax is permitted on imagery only, and never loud.
- `prefers-reduced-motion` collapses scene/epic to short opacity fades; element feedback is kept.

**Interactables**

- Every hover pairs an instant state on the element with an optional small response nearby.
- Every focusable element has a visible focus ring in ember, offset from the element.
- Custom cursor on pointer-fine devices: a small iron ring that fills ember over interactables. Native cursor on touch.
- No scroll-jacking. The page scrolls natively. Scroll-linked effects ride the real scroll.

---

## 7. Layout

- Vertical rhythm built from an 8-point scale. Sections breathe generously between them.
- The page alternates Page → Stone → Page grounds to mark acts. The change of ground _is_ the transition.
- **One hero per fold.** Each viewport-height has one dominant element. No fold competes with itself.

---

## 8. Components

The library is intentionally small. Locked shapes; open contents.

- **Button.** Square corners, 1px stroke, no rounding, no shadow. Primary (solid), Secondary (outline), Ghost (label + arrow). Inverts cleanly on Stone. Hover and press states are felt, not loud.
- **Navigation.** Top-left wordmark, top-right links in meta type. Transparent over Page; hairline over Stone. Shrinks on scroll-down, restores on scroll-up. Ember hairline marks the active section.
- **Scrollbar.** Custom, thin, right-edge inset. Invisible unless scrolling or approached. Reserves a stable gutter to avoid CLS.
- **Footer.** Stone ground. Locks to the bottom once fully in view — a landing, not a sticky bar. Mirrors the nav's ember hairline at its top edge.
- **Card / Tile.** Defined by hairlines, not fills. Hover: slight lift, hairline becomes ember. Interior layout is free — cards are a bespoke canvas.
- **Input.** Hairline-only, no box. Label above in meta. Focus thickens the hairline and turns it ember.
- **Divider.** One hairline, never a shaded bar, never a dotted rule.
- **Figure.** Edge-to-edge inside its container. Optional meta caption sits below-left under a short hairline. Imagery enters in a stone duotone and resolves to full color once in view — the site's visual signature.
- **Stat.** Tabular Bold numerals, meta label above. Counts up once on enter.

Anything not listed is built per-section and returns to these primitives for its edges.

---

## 9. Page Grammar

The page is a short film in six beats:

1. **Entry** — a monumental promise. Almost no other content.
2. **Proof** — one figure or interaction that demonstrates the promise.
3. **Acts** — 3–6 sections alternating grounds, each with one idea and one hero element.
4. **Turn** — one section that breaks the pattern. A toy, a diagram, a pull-quote, a live demo. The place invention is expected.
5. **Call** — one section header and a primary button.
6. **Landing** — the footer.

Lean cinema: large Entry, restrained Acts, a strong Turn, quiet Call.

---

## 10. Imagery & 3D

- Default treatment is a Stone + Page duotone, with ember reserved for a single element in the composition.
- 3D should feel forged — matte metal, soft lights, paper and cork textures. No glassy chrome, no gradient plastic, no confetti particle fields.
- Motion in imagery is slow and long-looped. Nothing should feel restless.
- Color photography is absent by choice so that ember remains the site's only chromatic voice.

---

## 11. Iconography

Custom line icons, consistent stroke, square terminals, no flourish. A small size grid only. Icons are monochrome by default; ember only when they _are_ the interaction.

---

## 12. Content ↔ Design Contract

- Headings over ~7 words aren't headings — they become lede type.
- One ember word per section, chosen by meaning.
- Paragraphs beyond three sentences trigger a layout pattern (list, split, callout) rather than a wall.
- Every section earns its air. If a section can't justify its own fold, cut it.

---

## 13. Accessibility Floor

- AA contrast across all text pairings.
- Ember never carries meaning alone; it's always paired with a weight or shape change.
- Visible focus ring on every interactive element.
- Reduced-motion path defined for every motion rail above.
- Minimum 44px touch targets.
- Every custom cursor, scrollbar, and nav behavior has a keyboard-only equivalent.

---

## 14. What's Deliberately Open

These are the canvas areas — design them fresh per section:

- The content and layout of each **Act**.
- The **Proof** figure.
- The **Turn** — the surprise is the point.
- The count and rhythm of sections, so long as ground-inversion alternates and the grammar of §9 holds.
- Interior composition of **cards** and **figures**.
- Copy voice within the constraints of `soul.md`.

Sections §§1–8, §10–§13 are the frame. Sections §9 and §14 are the painting.

---

## 15. Token System

**Three layers, always in this order:**

1. **SCSS primitives** — compile-time raw values (`$ink-ember: #DD6637`). Used inside mixins for computed values (rgba, darken). Never referenced in component files directly.
2. **CSS custom properties** — runtime semantic tokens set in `:root`. The only layer components touch.
3. **Ground overrides** — a Stone-ground section redeclares `--ink-*` locally via a mixin. Child components adapt through the cascade without modification.

---

### Colors — `--ink-*`

| Token            | Value                     | Role                   |
| ---------------- | ------------------------- | ---------------------- |
| `--ink-page`     | `#FFEDD7`                 | Primary canvas         |
| `--ink-stone`    | `#403D39`                 | Inversion ground       |
| `--ink-iron`     | `#1B1B1A`                 | Text and UI definition |
| `--ink-ember`    | `#DD6637`                 | Single accent          |
| `--ink-rule`     | `rgba(27,27,26, 0.12)`    | Hairlines on Page      |
| `--ink-rule-inv` | `rgba(255,237,215, 0.20)` | Hairlines on Stone     |
| `--ink-shadow`   | `rgba(64,61,57, 0.18)`    | Shadows on Page        |

`--ink-rule` and `--ink-rule-inv` are derived; they are set in `:root` using SCSS primitives and also redeclared inside `ground-invert()`.

---

### Typography — `--t-*`

**Scale** (fluid, clamp-based, 375px → 1440px):

| Token          | Value                                         |
| -------------- | --------------------------------------------- |
| `--t-monument` | `clamp(4.5rem, 7vw + 2.9rem, 9rem)`           |
| `--t-hero`     | `clamp(2.75rem, 4vw + 1.78rem, 5.5rem)`       |
| `--t-section`  | `clamp(1.875rem, 1.7vw + 1.475rem, 3rem)`     |
| `--t-lede`     | `clamp(1.25rem, 0.75vw + 1.075rem, 1.75rem)`  |
| `--t-body`     | `clamp(1rem, 0.2vw + 0.953rem, 1.125rem)`     |
| `--t-meta`     | `clamp(0.6875rem, 0.1vw + 0.625rem, 0.75rem)` |

**Settings:**

| Token                | Value                             | Used for                |
| -------------------- | --------------------------------- | ----------------------- |
| `--t-family`         | `'Aeonik', system-ui, sans-serif` | All type                |
| `--t-leading-tight`  | `0.95`                            | Monument, hero, section |
| `--t-leading-body`   | `1.55`                            | Body, lede              |
| `--t-tracking-tight` | `-0.03em`                         | Monument, hero          |
| `--t-tracking-meta`  | `0.12em`                          | Meta — uppercase only   |

---

### Spacing — `--space-*`

8-point base. Steps 1–2 are the 4pt half-step for tight UI gaps.

| Token        | Value           | Typical use                   |
| ------------ | --------------- | ----------------------------- |
| `--space-1`  | `0.25rem` / 4px | Icon padding, hairline offset |
| `--space-2`  | `0.5rem` / 8px  | Inline gap, tight pad         |
| `--space-3`  | `1rem` / 16px   | Base gap                      |
| `--space-4`  | `1.5rem` / 24px |                               |
| `--space-5`  | `2rem` / 32px   |                               |
| `--space-6`  | `3rem` / 48px   |                               |
| `--space-7`  | `4rem` / 64px   |                               |
| `--space-8`  | `6rem` / 96px   |                               |
| `--space-9`  | `8rem` / 128px  | Section breathing room        |
| `--space-10` | `12rem` / 192px | Hero vertical padding         |

---

### Motion — `--dur-*`, `--ease-*`

| Token           | Value                           | Role                                          |
| --------------- | ------------------------------- | --------------------------------------------- |
| `--dur-state`   | `80ms`                          | Hover, focus — immediate                      |
| `--dur-element` | `220ms`                         | Card lift, cursor fill, button                |
| `--dur-scene`   | `500ms`                         | Section entrance, nav shrink                  |
| `--dur-epic`    | `1200ms`                        | Sparingly used long-form sequences            |
| `--ease-house`  | `cubic-bezier(0.16, 1, 0.3, 1)` | Fast-out-slow-in. Everywhere except marquees. |
| `--ease-linear` | `linear`                        | Infinite marquees only                        |

---

### Ground Inversion

Stone-ground sections redeclare `--ink-*` at the section root. Components never branch on ground color — they only read tokens.

```scss
// Applied at the section root via @include ground-invert()
--ink-page: #{$ink-stone};
--ink-iron: #{$ink-page-value};
--ink-rule: #{$ink-rule-inv-value};
--ink-shadow: rgba(27, 27, 26, 0.3);
background: var(--ink-stone);
color: var(--ink-iron);
```

**Rule:** every component is ground-agnostic by default. Ground is always set by the section, never the component.
