# Prompt craft

## How current models read

Nano Banana, GPT Image, Seedream and FLUX.2 learned from long, literal captions. A strong prompt reads like a precise caption of the finished picture.

- Write sentences, not comma-separated tags.
- Put the subject and action first, because early words carry more weight.
- State the purpose ("hero image, headline sits over the left third"). It sets polish and leaves room for the page.
- Prefer exact nouns to stacked adjectives: "brushed aluminium", not "sleek shiny modern metal".
- Write only what a camera could record. Turn feelings into visible evidence. "Calm" becomes one light, few objects and generous empty surface.
- Describe the empty state ("an empty plaza") rather than negating ("no people"). Only GPT Image reliably follows an exclusion line.
- Use one key light with direction and quality. Conflicting lights give conflicting shadows.
- Replace quality filler ("stunning, 8k, masterpiece") with a physical cause: a lens, a film stock, a surface or a light source.
- Aim for about 40 to 120 words. Detail should come from specificity, not length.

## Facets

Pick what matters for the piece and skip the rest.

| Facet | Question |
| --- | --- |
| Subject | What exactly? Material, finish, scale, wear |
| State | What is it doing, or what just happened? |
| Setting | Where and when? |
| Composition | Shot size, subject position, foreground, midground, background |
| Placement | What sits on top? Where is the calm area? Where do slots need a surface? |
| Camera | Angle, height, focal length, depth of field |
| Light | Source, direction, hardness, temperature, where shadows fall |
| Material | How light meets the surfaces |
| Colour | A few colours, each tied to an object ("the door is #2E4A3F") |
| Medium | Photograph and film stock, render, illustration or print technique |
| Atmosphere | Mood, shown through the choices above |

## Steering off the defaults

Models, and Claude writing for them, drift toward the same looks: teal and orange grading, neon and holograms, shallow-focus blur everywhere, dead-centre symmetry, glossy plastic and chrome, flawless surfaces, and the most literal metaphor for the idea. None is forbidden. Use one when you choose it on purpose, not by default.

When asked for options, write several one-line concepts that differ on at least two axes before expanding any. For a set, do the opposite: hold everything fixed but the subject.

## Examples

Keep the method, not the content or the rhythm.

<example name="hero, narrative (Nano Banana Pro / Soul Cinema)">
A lone lighthouse keeper's cottage on a basalt headland at first light, seen from low on the rocks with a 28mm lens; the cottage sits small in the lower right third. The upper two thirds is pale, even sky for headline text. Soft light from the left, long shadows across wet stone. Medium-format film, fine grain, muted palette.
</example>

<example name="element, labelled (GPT Image 2.5, transparent)">
Purpose: floating interface object for a website.
Subject: a small ceramic dial, 6cm across, matte glaze, one raised notch.
Camera: three-quarter view from slightly above, 100mm, centred, filling 70% of the frame.
Light: soft key from the upper left, faint rim on the right.
Constraints: isolated on a fully transparent background, clean edges, no backdrop, no cast shadow, no text.
</example>

<example name="stage edit (image 1 = previous stage)">
Using image 1, change only the tree: it is now in full autumn colour. Keep everything else exactly the same, including camera, framing, light, background and grain.
</example>

## Critique

Split the brief into small yes/no checks, with parents before children: "is there a dial? → is it matte? → is the notch visible?". Then check the fixed points: text area clear, light consistent across the set, clean edges on cut-outs, registration across stages, and no artefacts (garbled text, warped geometry, duplicated parts).

Edit a render that is about 80% right. Re-prompt when the concept is wrong. Change one variable per round and restate what must stay. After about three rounds on one concept, report where it stands.
