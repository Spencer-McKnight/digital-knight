# 02 · Identity

Phase 2. This note replaces `design.md` §§1 to 4 (identity, colour, type, wordmark) and §10 (imagery). What it keeps from `design.md` is listed at the end.

## Name

**Keep Digital Knight.** It is the registered business name, the domain, the email address, the LinkedIn handle, and the name every client in `/work` knows. A new name would cost all of that and buy a mood. The name also holds a better idea than the forge ever used.

## The idea: the next move

The knight is the only chess piece that moves in an L, and the only one that jumps whatever blocks a straight line. A solo studio is one piece. It makes the move a business cannot see from where it stands, then the next one, for years.

What follows from it:

- **The house arrow is ↳**, the knight's L. Every "next move" on the site uses it. Nothing else does.
- **Composition has a rule for asymmetry.** The loud element of a view sits a knight's move off the text axis: two columns across, one band down.
- **One knight, hidden.** A black chess knight stands in the shadow of the cover photograph. It shows only when the visitor's light passes over it. No other chess imagery anywhere.

## Colour

### The argument

Colour psychology is weak on mood and strong on attention. Elliot's 2015 review calls the field nascent, finds its effects depend on context, and keeps only findings replicated in five or more labs. The best-known mood effect, red impairing performance, does not survive a correction for publication bias (Gnambs 2020). What does hold is salience. A single colour among uniform neighbours is found preattentively, in parallel, however many neighbours there are (Treisman and Gelade 1980). An isolated item is remembered better than the items around it (von Restorff 1933).

So the palette is built for salience, not mood:

1. **The field is achromatic.** Reading contrast comes from luminance alone: carbon on paper, 17.4:1.
2. **One chromatic accent, used once per view,** so it is always the singleton. It marks the next move and nothing else.
3. **The accent is yellow.** Of the saturated hues, yellow sits closest to the peak of the eye's luminance sensitivity (the CIE photopic curve peaks at 555 nm). That makes it the only chromatic colour that carries black type at road-sign contrast: carbon on signal, 15.4:1. Red has good attention evidence too, but interfaces already use red for errors, so a red "book now" reads as a warning.
4. **Scarcity is built into the maths.** Signal on paper is 1.13:1, so it can never be text on a light ground. On paper it is only ever a surface under carbon type, or an object with a carbon edge.

Tech-punk comes from the pairing, not from effects: a black and white page, hard photographs, and one printed yellow object pressed onto them. It is not a neon light.

### Tokens

Primitives, compile-time only:

| Primitive | Value | Role |
| --- | --- | --- |
| `carbon` | `#0B0B0A` | Cover and booking ground. Text on paper. |
| `paper` | `#F2F1EC` | Reading ground. Text on carbon. Neutral, not antique. |
| `signal` | `#FFE500` | The next move. Once per view. |
| `graphite` | `#5A5A55` | Secondary text on paper, 6.1:1. |
| `fog` | `#A09F98` | Secondary text on carbon, 7.4:1. |

Semantic tokens are the only layer components read. Each ground redeclares them:

| Token | `paper` ground | `carbon` ground |
| --- | --- | --- |
| `--ink-ground` | paper | carbon |
| `--ink-text` | carbon | paper |
| `--ink-muted` | graphite | fog |
| `--ink-rule` | carbon at 14% | paper at 18% |
| `--ink-signal` | signal | signal |
| `--ink-on-signal` | carbon | carbon |
| `--ink-focus` | carbon | signal |

Grounds are set by the block, never the component: `data-ground="paper" | "carbon" | "photo"`. `photo` reads as carbon. Text over a photograph sits in a zone the image leaves dark by composition. Never a gradient scrim.

### Colour rules

- One signal per view. The Ticket counts. A selected booking slot counts.
- Signal never carries meaning alone. It always comes with a shape, a weight or a word.
- Errors are neither signal nor red: an inverted carbon bar, a "!" glyph, one plain sentence.
- No gradients, glows, blurs or translucent panels. Dividers are one 1px `--ink-rule` hairline.
- Shadows belong to physical objects only (ticket, sticker, pin), as CSS `drop-shadow`. Never on boxes.

## Grid and composition

- 12 columns, fluid gutters and margins (current grid tokens hold). Vertical rhythm on the 8-point space scale.
- **One loud moment per view:** the monument line, the photograph, or the object. Everything else is set small and quiet.
- **Magazine furniture.** Every block carries a folio at meta size: number and intention, "02 Proof". On funnel pages the masthead's running head shows the step, "Step 2 of 4".
- Square corners everywhere. Only objects may be irregular, because they are objects.
- Photographs run full-bleed or lock to column edges. Never in rounded cards.

## Type

**Hubot Sans for display, Mona Sans for text and UI.** Both from GitHub, drawn with Degarism, SIL Open Font License 1.1, variable in weight and width, designed as a pair so metrics match.

- **Hubot Sans** is the geometric, "robotic" sibling. Set wide and heavy it looks engineered with a straight face, and its width axis gives headings their one move.
- **Mona Sans** has an optical-size axis and was built for product UI and reading. It runs long passages at body size and labels at meta size.
- Not Inter (the SaaS default), not the old serif (the forge), not a third mono family for labels.

Self-hosted from `public/fonts`: variable WOFF2, upright only (no italic axis ships), subset to Latin plus German (ä ö ü ß ẞ „ “ ‚ ‘ €), preloaded, fallback metrics adjusted so nothing shifts on swap.

### Scale by role

Fluid from 360px to 1440px.

| Role | Family | Size | Weight · width | Leading | Tracking |
| --- | --- | --- | --- | --- | --- |
| monument | Hubot | `clamp(3.25rem, 1.17rem + 9.26vw, 9.5rem)` | 800 · 112% | 0.92 | -0.035em |
| title | Hubot | `clamp(2.25rem, 1.33rem + 4.07vw, 5rem)` | 700 · 108% | 0.98 | -0.025em |
| section | Hubot | `clamp(1.625rem, 1.25rem + 1.67vw, 2.75rem)` | 700 · 100% | 1.05 | -0.015em |
| lede | Mona | `clamp(1.25rem, 1.08rem + 0.74vw, 1.75rem)` | 450 | 1.35 | -0.005em |
| body | Mona | `clamp(1.0625rem, 1rem + 0.28vw, 1.25rem)` | 400 | 1.55 | 0 |
| meta | Mona | `clamp(0.8125rem, 0.79rem + 0.09vw, 0.875rem)` | 600 · 110% | 1.3 | 0.08em |

- **Uppercase lives only at meta size.** Nav, buttons, folios and labels are meta.
- **No italics.** Emphasis is weight, size, or the single signal.
- **Wordmark:** DIGITAL KNIGHT in Hubot Sans 800 at 125% width, meta size, followed by ↳. Small and exact. The cover's monument line does the shouting.
- **Favicon:** ↳ in carbon on a signal square. The only place signal fills a whole field.

## Motion

**Motion reports a move.** Things arrive like a sticker being pressed or a page being turned: fast in, settled, done. Nothing idles, floats or loops, except the cover light, and that moves only when the visitor does.

| Token | Value | Used for |
| --- | --- | --- |
| `--dur-state` | 90ms | Hover, press, focus. Colour and underline swaps. |
| `--dur-element` | 220ms | Object responses: ticket lift, sticker press, slot fill, pin flip. |
| `--dur-scene` | 560ms | Block entrance, heading width move, trail advance, week change. |
| `--dur-epic` | 1400ms | Once per page at most: the cover light settling, the loupe's first pass. |

- One house curve, `cubic-bezier(0.16, 1, 0.3, 1)`. No springs, no overshoot.
- **One kinetic treatment per heading:** the width opens from 75% to its set width on first entry. It runs on an `aria-hidden` overlay above the real heading, so layout never moves.
- Objects lift under the pointer (translate plus shadow). Their resting tilt is fixed per object in data, between -3° and 3°. Never random, never spinning.
- Native scroll only. Scroll-linked effects read real scroll.
- **Reduced motion:** scene and epic collapse to opacity fades at element speed, the width move is off, the 3D scene shows its still. State feedback stays.

## 3D: one scene, Nightlight

**The visitor holds the light.** A night photograph of the studio's world is relit in real time by a hard light that follows the pointer. Light is what photography is made of, and showing a business where it can move next is the studio's job. The hidden knight appears only when the light reaches it.

**Build.** One isolated client component, loaded with a dynamic import after first paint, only on routes that use it. three.js with a custom `ShaderMaterial` on a single plane. No post-processing library, no model loader, one draw call.

**Shader.**

- Inputs: the photograph, a pointer position damped at element speed, time.
- Normals come from the photograph itself: a Sobel pass on blurred luminance in the fragment shader.
- Exposure is pulled down about 1.3 stops. A hard point light with a Lambert term on those normals and inverse-square falloff lifts it back locally. Shadow detail that exists in the file develops under the light.
- Grain is laid back over the result so the lit area matches the rest of the frame. No bloom, no halation (it would add colour).

**Behaviour.**

- Fine pointer: the light follows. When the pointer leaves, it returns to rest (the designed key, high left) at scene speed.
- Coarse pointer: one slow pass on load at epic speed, from the knight to rest, then still.
- Stops rendering offscreen and in hidden tabs. Device pixel ratio capped at 1.5.

**No layout shift, fails quietly.** The canvas sits over a `next/image` of the same photograph in the same box. It fades in only after its first frame. If WebGL is missing, the context is lost or the texture fails, the canvas never appears and the photograph stays. Reduced motion never mounts the canvas.

**The later beat.** The same component in `reveal` mode inside Loupe, on the two case studies that have a before and after pair (SOGIF, SteveMcKnight). The pool of light shows the after state over the before. Same shader, a second texture, one uniform. Nowhere else.

## Imagery

**World: the studio at night.** Still lifes and architecture in empty rooms after hours. Concrete, brushed aluminium, black glass, uncoated paper. One hard light. No people; the only person on the site is Spencer, in his real portrait, set to greyscale.

**The one graphic interruption.** Each photograph carries exactly one interface object pressed onto it (ticket, sticker or pin), on a surface the prompt left calm for it. The object is a transparent cut-out with live DOM text on top, so it stays readable, accessible and clickable.

### Style clause

Pasted unchanged into every image prompt:

> Style: a medium-format film photograph taken with an 80 to 100mm lens at deep focus. One hard, cool-white light comes from high on the left with no fill, so shadows fall clean to the lower right and the darkest tones sit near carbon #0B0B0A with faint detail. Surfaces are raw concrete, brushed aluminium, black glass and uncoated paper #F2F1EC. Everything is black, white and grey, except signal yellow #FFE500 where named. Grain is fine and even.

### Set list

Subjects only. Full prompts go to `art/<set>/` in Phase 5.

| # | Set | Asset | Subject | Text-safe zone |
| --- | --- | --- | --- | --- |
| 1 | `studio-night` | Cover, 21:9 | A long poured-concrete table in an empty room. One sheet of paper lit on its right third. A black chess knight stands in shadow at the far end. | Upper-left, unlit wall |
| 2 | `studio-night` | Cover, 4:5 | Edited from 1, never cropped | Upper third |
| 3 | `studio-night` | Orientation | Four identical sheets squared on black glass, one lit | Left half |
| 4 | `studio-night` | Proof | A stack of printed proofs on concrete, top sheet lit | Upper band |
| 5 | `studio-night` | Offer | One aluminium key on black glass ("you own all infrastructure") | Right half |
| 6 | `studio-night` | Conversation | Two plain chairs facing across a narrow concrete table, the light between | Upper-left |
| 7 | `objects` | Ticket | Blank admission stub, uncoated card, signal band, perforated edge | Face for DOM text |
| 8 | `objects` | Sticker | Round signal-yellow vinyl dot, one edge lifting. Carries the kind of work (Rebuild, Portal, Audit), never a metric. | Face for DOM text |
| 9 | `objects` | Pin | Small square enamel pin, black enamel, polished steel rim | Face for DOM text |

Nine finals, three held back for replacements, cap of twelve. The OG image is composed in code from the cover. Scenes 3 to 6 take the approved cover as reference image 1. Objects 8 and 9 take the approved ticket.

## Interaction vocabulary

One idea per block, from this list only:

| Idea | Where |
| --- | --- |
| **Light.** The pointer is a light. | Cover, Loupe |
| **Press.** The object lifts, then presses. | Ticket, stickers, pin |
| **Type move.** The width opens on entry. | Headings |
| **Tick.** A mark lands in a box, the tally updates. | Fit |
| **Fill.** Signal fills the chosen slot, left to right. | Commit |

Native cursor everywhere.

## Never

- Gradients, glass, glow, bloom, neon, blurred panels.
- Purple or blue.
- Stock handshakes, laptops on desks, hands on keyboards, people pointing at screens.
- Rounded cards, pill buttons, shadows on boxes.
- Signal as text on paper. More than one signal in a view.
- 3D outside Nightlight.
- Chess beyond the one hidden knight: no boards, checks or crowns.
- Italics.

## What `design.md` keeps

- §0: fewer words, larger type, quieter motion.
- §5: headline and action render in place on first paint.
- §6: four speeds, one curve, reduced-motion path, no scroll-jacking (values updated above).
- §7: one hero per fold.
- §13: the accessibility floor. AA on every text pair, visible focus (2px `--ink-focus`, 3px offset), 44px targets, keyboard equivalents.
- §15: three token layers (primitives, custom properties, ground overrides) and ground-agnostic components.
- Voice: short, specific, no long dashes.
- The booking contract in `talk.md`.

`design.md` is rewritten from this note when the build starts.

## Sources

- Elliot, A. J. (2015). [Color and psychological functioning: a review of theoretical and empirical work](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4383146/). *Frontiers in Psychology*, 6, 368.
- Gnambs, T. (2020). [Limited evidence for the effect of red color on cognitive performance: a meta-analysis](https://pubmed.ncbi.nlm.nih.gov/32696125/). *Psychonomic Bulletin & Review*, 27, 1374 to 1382.
- Treisman, A., and Gelade, G. (1980). [A feature-integration theory of attention](https://www.semanticscholar.org/paper/A-feature-integration-theory-of-attention-Treisman-Gelade/76361a44e145732a39dbc68d9418871038c83be2). *Cognitive Psychology*, 12, 97 to 136.
- von Restorff, H. (1933). Über die Wirkung von Bereichsbildungen im Spurenfeld. *Psychologische Forschung*, 18, 299 to 342.
- CIE 1924 photopic luminous efficiency function V(λ), peak at 555 nm.
- GitHub. [Introducing Mona Sans and Hubot Sans](https://github.blog/news-insights/company-news/introducing-mona-sans-and-hubot-sans/).
