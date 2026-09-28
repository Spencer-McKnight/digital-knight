# studio-night

Set list items 1 to 6 from `redesign/02-identity.md`. Every prompt carries the
style clause verbatim. Renders land in `renders/`, finals in
`public/images/studio-night/`.

## Style clause

> Style: a medium-format film photograph taken with an 80 to 100mm lens at deep focus. One hard, cool-white light comes from high on the left with no fill, so shadows fall clean to the lower right and the darkest tones sit near carbon #0B0B0A with faint detail. Surfaces are raw concrete, brushed aluminium, black glass and uncoated paper #F2F1EC. Everything is black, white and grey, except signal yellow #FFE500 where named. Grain is fine and even.

## 1 · Cover, 21:9

Brief. The home cover. The monument line sits over the upper band, widest at
the left, three lines at 1440px. The Ticket is pressed onto the bare near end
of the table. Nightlight relights the file: the knight must survive in the
shadow detail, present but faint, so the light can develop it.

Concepts explored at 1k:

- **A. Receding.** Low three-quarter view from the near end; the table runs
  from the lower-left foreground to the back right. Depth gives the shader
  relief to work with.
- **B. Elevation.** Square-on side view; the table crosses the lower third,
  wall above. Flatter, more graphic, more room for type.

### Renders

| File | Model | Notes |
| --- | --- | --- |
| `cover-A-nb2-1k.png` | `nano_banana_2`, 21:9, 1k | Concept A. Right structure; knight rim-lit and readable, pool spread over the whole table. |
| `cover-B-nb2-1k.png` | `nano_banana_2`, 21:9, 1k | Concept B. Wall mid-grey and blotchy, too busy for type. Rejected. |
| `cover-A-soul.png` | `soul_cinematic`, 21:9, 1.5k | Crushed, green cast, subject too far. Rejected. |
| `cover-A2-edit-1k.png` | edit of A | Knight sank, but the light became a round stage spot and the table lost tone. |
| `cover-A3-fresh-1k.png` | fresh, tighter pool | Right light. Knight still rim-lit. About 80%. |
| `cover-A4-edit-2k.png` | edit of A3, 2k | **Approved 21:9.** Far end into shadow, nothing else changed. |
| `cover-4x5-edit-2k.png` | edit of A4, 4:5, 2k | **Approved 4:5.** Same room as if the camera stepped back; dark wall over the upper two fifths. |

Note: the live catalogue names `nano_banana_2` "Nano Banana 2" and jobs report
`nano_banana_flash`. The skill's note that this id is Nano Banana Pro is out of
date; no Pro id is listed.

### Prompts

A3, fresh (the approved line starts here):

> Cover photograph for a studio website; a large headline will sit across the upper half, so the upper half of the frame is a plain, unlit poured-concrete wall that falls to near-black at the upper left. A long poured-concrete table in an empty room at night, seen from a low three-quarter angle at its near end: the table starts in the lower-left foreground and runs away to the right, towards the back wall. The near end of the tabletop, lower left, is bare, even concrete in soft shadow. One sheet of uncoated paper lies flat on the table's right third. A narrow, hard light from high on the left falls on that sheet only: a sharp-edged pool the size of a doormat, the brightest thing in the frame, with the concrete around it dropping quickly into shadow. At the far end of the table, outside the pool, stands a single black chess knight, a black shape on dark concrete against an equally dark wall, only the faint top edge of its mane readable. The rest of the room falls away into near-black.
>
> + style clause

A4, edit of A3 at 2k:

> Using image 1, change only the far end of the room: the far end of the table, the chess knight standing on it and the wall behind it all fall into deep shadow outside the light. The knight becomes a black shape on dark concrete against an equally dark wall, its outline only just separating from the dark, with faint detail still present in the shadow. Keep everything else exactly the same, preserving composition, camera, the raking pool of light on the sheet of paper, the near end of the table, textures and grain.
>
> + style clause

4:5, edit of A4 at 2k:

> Using image 1, make the same photograph as a vertical 4:5 frame, as if the camera had stepped back and risen slightly in the same room. The upper two fifths of the frame is the same plain, unlit concrete wall, falling to near-black at the upper left, where a headline will sit. Below it the same long poured-concrete table runs from the lower-left foreground away to the back right, the same sheet of uncoated paper lies in the same hard, raking pool of light, and the same black chess knight stands in deep shadow at the far end, a faint silhouette against the dark wall. The near end of the table in the lower left stays bare, even concrete. Keep the light, exposure, materials, lens character and grain exactly as in image 1.
>
> + style clause

### Finishing

Both finals are forced to true greyscale, then the far wall and the knight
are burned about 0.6 stops in linear light (soft ellipse, stopping above the
table) so the knight reads faint until the light finds it. Exported to AVIF
at twice display size: `cover-21x9.avif` 2880 × 1222, `cover-4x5.avif`
1600 × 1986.

| Zone check | 21:9 | 4:5 |
| --- | --- | --- |
| Text zone mean | 0.054 | 0.094 |
| Text zone 95th percentile | 0.13 | 0.18 |
| Knight / wall beside it | 0.043 / 0.066 | 0.063 / 0.101 |
| Lit sheet | 0.95 | 0.97 |

Contact sheets with the zone outlined: `sheet-cover-21x9-zone.png`,
`sheet-cover-4x5-zone.png`.

Nightlight positions (image coordinates, origin top left) live in
`src/content/art.ts`: rest on the lit sheet, knight at 0.775, 0.44 (21:9) and
0.755, 0.485 (4:5).
