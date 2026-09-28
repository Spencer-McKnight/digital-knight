# Scenes: multi-stage and interactive imagery

A scene is imagery that changes or responds: it morphs as you scroll, splits into layers that pass each other, scrubs through frames, or carries live UI anchored to points in the art. Every such effect breaks down into the same few parts, so plan with these and combine them freely.

## The model

| Part | What it is |
| --- | --- |
| **Canvas** | A box at the art's aspect ratio. All positions are fractions of it (0 to 1), so art and DOM share one coordinate space. |
| **Stages** | Named beats in order (`['seed', 'sprout', 'bloom']`). Progress 0 to 1 is split evenly across them. |
| **Driver** | What moves progress: scroll through a sticky section (scrub), scroll past in normal flow (pass), pointer, time, app state, or nothing (static). |
| **Plate** | A full-canvas image layer with a z order, the stages it appears in, an enter style, and a parallax depth. |
| **Sequence** | A full-canvas run of frames, scrubbed by progress within its stages. |
| **Slot** | A real DOM element (heading, button, card, counter, a floating cut-out) pinned to a canvas point, visible in chosen stages, and able to share a plate's depth so it moves with that plate. |

One number drives everything, and every layer derives its own state from it. That is what makes scenes composable: nest them, stack them, or let any component subscribe to progress.

## Four patterns

These combine. A morph can contain stacks, and slots can live in any of them.

**Stack (depth and overlap).** Split one image into backdrop, subject and foreground plates at different depths, so they slide past each other with scroll or pointer. Put DOM between plates to get the sandwich: a headline behind the subject but in front of the sky.
*Art*: generate the full composite first. Then derive a clean backdrop by editing it ("remove the subject, reconstruct what was behind it, keep everything else"), and cut out the subject from the same render. Deriving from one render keeps the plates registered.

**Morph (stills that transform).** Each stage is a still. Transitions between them are crossfade, wipe or iris, driven by scroll.
*Art*: make stage 1, then create each next stage by **editing the previous one**, changing one idea and restating that everything else stays. Never generate stages independently, because the camera and light will jump. Check with `contact_sheet.py --drift`: only the intended change should light up.

**Scrub (continuous motion).** A frame sequence tied to scroll position, which reads as the object itself changing.
*Art*: take the start still and the end still (the end made by editing the start) and feed both to a video model that accepts start and end frames. Hold the camera still unless the camera move is the idea. Extract 48 to 96 frames (see `higgsfield.md`).

**Anchor (art and live UI).** DOM elements pinned to points in the art, such as a price tag on an object, a button on a surface, or a counter that ticks with progress. Real text stays accessible and sharp.
*Art*: give every slot something to sit on, described in the prompt as a surface ("an empty, evenly lit shelf in the lower right"). Record each slot's canvas point as you plan.

## Plan it as data

Write the scene as a manifest before generating anything. The manifest is both the shot list and the runtime config, so art and code can't disagree.

```ts
const manifest: SceneManifest = {
  id: 'growth',
  ratio: 16 / 9,
  mobileRatio: 4 / 5,
  stages: ['seed', 'sprout', 'bloom'],
  driver: { progress: 'scrub', pointer: true },
  plates: [
    { id: 'sky', art: { src: '/images/growth/sky.avif', width: 2560, height: 1440 }, z: 0, depth: 0.2 },
    { id: 'seed', art: { src: '/images/growth/seed.avif', width: 2560, height: 1440 }, z: 1, stages: ['seed'] },
    { id: 'sprout', art: { src: '/images/growth/sprout.avif', width: 2560, height: 1440 }, z: 2, stages: ['sprout'], enter: 'wipe' },
  ],
  sequences: [{ id: 'bloom', pattern: '/images/growth/bloom/f-{i}.webp', count: 72, z: 3, stages: ['bloom'] }],
  slots: {
    title: { id: 'title', at: [0.3, 0.4], z: 2, depth: 0.2 },
    cta: { id: 'cta', at: [0.72, 0.78], z: 4, stages: ['bloom'] },
  },
};
```

Every plate at canvas ratio shares the same framing. Mobile gets its own art (`mobile` on plates, `mobileAt` on slots) rather than a crop.

## The Scene kit (optional)

`assets/scene/` is a small reference implementation in this repo's stack: GSAP ScrollTrigger from `@/lib/gsap`, CSS Modules, `next/image`. Copy it to `src/components/Scene/` when a scene needs it. Adapt it or ignore it if a different approach suits the idea better.

```tsx
<Scene manifest={manifest} priority>
  <SceneSlot slot={manifest.slots!.title}><h1>Grow on purpose</h1></SceneSlot>
  <SceneSlot slot={manifest.slots!.cta}><Button href="/contact">Start</Button></SceneSlot>
</Scene>
```

How it works:

- The driver writes `--p`, `--px`/`--py` and `data-stage` onto the root. Layers read them in CSS, so scrolling never re-renders React.
- Each layer gets `--t` (the enter ramp, 0 to 1) and `--o` (the exit ramp). Section styles can target `[data-plate='sprout']`, `[data-slot='cta']` or `[data-stage='bloom']` and use those values for any custom treatment, such as filters, scale or masks.
- `useSceneProgress(fn)` gives any JS component the raw progress: counters, canvas drawing, a WebGL uniform, a video's `currentTime`.
- `scrub` scenes are `length` viewports tall with a sticky stage, so native scrolling is kept. `pass` scenes play as the section crosses the viewport. `--scene-height` sets a non-fullscreen stage.
- Parallax: `depth` times `--travel` for scroll and `--sway` for pointer. Plates overscan by `--overscan` so edges never show, and slots with the same depth stay registered to their plate.
- Reduced motion freezes at `rest` (default: the last stage), collapses scrub height, and skips pointer motion. Out-of-stage slots are `inert`.

Crossfades between two opaque full-frame plates dip slightly at the midpoint because both are partly transparent. Give the later plate a higher z and no `stages` end, or use `wipe`/`iris`, when that matters.

## Budget

- Keep 3 to 5 plates per scene. Every full-canvas layer costs decode time and memory.
- For sequences, use WebP at about 1600px wide and 48 to 96 frames. They load when near the viewport, coarse frames first.
- Plates are decorative (`alt=""`). Meaning belongs in slot text.
- Test at a mid-size phone and a wide desktop. The safe area for slots is the region that survives the cover crop at both.
