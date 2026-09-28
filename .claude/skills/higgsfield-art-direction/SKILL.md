---
name: higgsfield-art-direction
description: Art-direct and generate imagery with Higgsfield (Nano Banana Pro, GPT Image 2.5, Soul Cinema, Seedream, FLUX.2, Recraft, and video models for frame sequences). Turns an idea into distinct concepts, a multi-angle description and model-tuned prompts, then critiques renders and ships web-ready files. Covers hero images, cut-out objects for floating UI elements, and multi-stage interactive scenes (morphing on scroll, layered overlaps, frame-scrubbed sequences, images composed with live JS/React components). Use whenever a task involves AI-generated imagery, image prompts, Higgsfield, hero art, backgrounds, illustrations, 3D-looking objects, OG images, or scroll-driven image effects, even if Higgsfield isn't named.
---

# Higgsfield art direction

The craft is deciding what an image is for and describing it so precisely that the model can't fall back on the generic. Style, palette and mood are yours to choose per project and per piece. This skill supplies method, not taste.

If the project has a settled visual direction (check `design.md` and the target section's `.tsx` and `.module.scss`), work within it. If it doesn't, you have full creative latitude.

## Flow

1. **Brief.** Decide what the image is for, where it sits, and what the page puts on top of it (text, buttons, cards). Also decide ratio, whether it needs alpha, and whether it needs stages. Draft this yourself when the user is vague.
2. **Concepts.** Sketch a few one-line directions that genuinely differ (distance, light, medium, metaphor, scale). Recommend one. Your first idea is usually the most common one, so push past it.
3. **Describe from every angle.** Subject, state, setting, composition, placement, camera, light, material, colour, medium, atmosphere. One precise fact each, skipping what doesn't matter. See `references/prompt-craft.md`.
4. **Compile for the model.** Each model reads prompts differently. See `references/higgsfield.md`.
5. **Generate.** Use the Higgsfield MCP (ToolSearch `higgsfield`, authenticate if needed), the `higgsfield` CLI, or hand the prompts to the user. Explore cheaply at low resolution, then finalise at high resolution. Confirm before large or 4k batches, because they spend the user's credits.
6. **Look and refine.** View the renders (`scripts/contact_sheet.py` helps). Edit what's close, re-prompt what's wrong, and change one thing at a time.
7. **Ship.** Put finals in `public/images/<set>/`. Put raw renders and a short log of the prompts, models and settings in `art/<set>/`, so the work can be reproduced and shown.

## Consistency

For anything that comes in sets (several heroes, a family of elements, the stages of a scene), write a **style clause** once the look is chosen, covering light direction, palette, materials, lens and grain. Reuse it verbatim in every prompt, and pass the first approved image as a reference for the rest.

## Model picker

| Job | Try first |
| --- | --- |
| Cinematic, textured, mood-led | Soul Cinema |
| Complex brief, several references, precise edits | Nano Banana Pro |
| Dense multi-object composition | Seedream 5.0 |
| True transparent background | GPT Image 2.5 (`background: transparent`) |
| Flat, vector, icon sets | Recraft V4.1 |
| Scroll-scrubbed motion | Video model with start and end frames |

## References

- `references/prompt-craft.md`: how models read, the facet list, common defaults to steer away from, critique
- `references/higgsfield.md`: access, model ids and parameters, per-model dialects, references and editing
- `references/assets.md`: heroes (text space, crops) and cut-out elements (alpha routes, sets)
- `references/scenes.md`: interactive multi-stage compositions and the optional Scene kit in `assets/scene/`

## Scripts

- `scripts/contact_sheet.py`: tiles renders for review. `--zone` outlines a text area and `--drift` shows movement between stages.
- `scripts/matte.py`: makes cut-outs. `pair` builds a difference matte from renders on white and black, `key` removes a flat backdrop, and `clean` fixes alpha halos. All modes accept `--trim`.
