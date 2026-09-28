# Heroes and elements

## Heroes

Read the target section first, so you know where the headline and actions sit at desktop and at mobile.

- **Leave room for type as a thing, not a gap.** Describe the calm area as a physical surface with a tone, such as "the upper third is even, pale sky". Models can draw a surface but not "space for text". Keep that area low in detail and matched to the text colour it sits under. `contact_sheet.py --zone x0,y0,x1,y1` outlines it for checking.
- **Ratios.** Use 16:9 or 21:9 for desktop, and 4:5 or 9:16 for mobile. Make the mobile version by editing or outpainting the approved desktop render so the two register. Don't crop, because a subject placed on a third vanishes in a centre crop. Wire them with Next's `getImageProps` and `<picture>` art direction.
- **Frame loosely** if the image will move, so parallax or scale never shows an edge.
- **Loading.** For the LCP image, set `fetchPriority="high"` (or `preload` on a plain `next/image`). Export AVIF and let `next/image` generate the sizes.

## Floating elements

Cut-out objects that sit over the page, drift, overlap sections or tilt with the pointer.

- **Shape.** Use a three-quarter view from slightly above and a long lens (85 to 100mm), so perspective stays calm beside flat UI. Centre the object at about 70% fill, with padding. State the real size to set texture scale.
- **Shadows.** Usually leave them out and add them in CSS (`drop-shadow`), where they can move with parallax. Render a contact shadow as its own layer if you need one.
- **Sets.** Reuse one style clause and one light direction. Pass the first approved element as reference image 1: "match material, lighting, angle and scale of image 1; change only the object to ...". Alternatively, render the whole set as one grid image and slice it.

### Alpha routes

| Route | When | How |
| --- | --- | --- |
| Native | Solid objects | GPT Image 2.5 with `background: transparent`. Describe no backdrop. Then `matte.py clean --trim`. |
| Backdrop and remover | Any model | Use a flat mid-grey backdrop with even light. Run Higgsfield `image_background_remover`, then `matte.py clean`. |
| Difference matte | Soft or translucent edges (hair, paper, smoke, glass) | Render on pure white, then edit to pure black with the object unchanged. Run `matte.py pair --white w.png --black b.png -o out.webp --trim`. |
| Key colour | Quick, hard edges | Use a flat colour the object doesn't contain, then `matte.py key --color '#00FF00'`. |

Most models paint a fake checkerboard when asked for "transparent". Only GPT Image produces real alpha.

Export WebP or AVIF with alpha, at twice the display size, and trimmed. Decorative elements get `alt=""`.
