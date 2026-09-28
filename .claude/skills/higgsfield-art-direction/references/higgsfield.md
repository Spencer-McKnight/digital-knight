# Higgsfield

Access, models, parameters and per-model prompt dialects. Researched September 2026. Higgsfield ships fast, so when a model id or parameter matters, check the live list first (MCP model listing, or `MODELS.md` in `github.com/higgsfield-ai/cli`). The CLI can lag behind the web app.

## Contents

1. Access
2. Image models
3. Compiling for each model
4. References and editing
5. Video models for frame sequences
6. Unverified or unstable

## 1. Access

| Route | How | Notes |
| --- | --- | --- |
| MCP | `https://mcp.higgsfield.ai/mcp` | 30+ models, no API key. Picks the model, submits, polls, returns URLs. Discover tools with ToolSearch `higgsfield`; authenticate if only `authenticate` is listed. |
| CLI | `higgsfield generate create <model> --prompt "..." --aspect_ratio 16:9 --resolution 2k --wait --json` | `--image` / `--image-references` take a job UUID or a local path. |
| REST | `Authorization: Key KEY_ID:KEY_SECRET` | Async: poll `status_url`, results in `images[]`. Per-model params live in the console docs. |

Outputs are kept for at least 7 days. Download everything you might keep into `art/<set>/renders/` straight away.

## 2. Image models

CLI ids from `MODELS.md`. Where the MCP names differ, match on the model name.

| Id | Model | Ratios | Size / quality | Refs | Use for |
| --- | --- | --- | --- | --- | --- |
| `gpt_image_2_5` | GPT Image 2.5 | auto, 1:1, 3:2, 2:3, 4:3, 3:4, 16:9, 9:16, 21:9, 4:5, 5:4 and more | 1k/2k/4k; quality low to max (default **low**, raise it) | 16 | True alpha via `background: transparent`, exact text, precise colour, UI objects |
| `gpt_image_2` | GPT Image 2 | 10 ratios incl. 21:9 | 1k/2k/4k; low/med/high | yes | Transparent bg, mask inpaint |
| `nano_banana_2` | **Nano Banana Pro** (the id is misleading) | 1:1 to 21:9, 10 ratios | 1k/2k/4k (default 2k) | 14 | Complex briefs, multi-reference, edits that preserve everything else |
| `nano_banana_flash` | Nano Banana 2 | same | 1k/2k/4k | yes | Cheaper, faster exploration |
| `soul_cinematic` | Soul Cinema | 1:1, 16:9, 9:16, 4:3, 3:4, 3:2, 2:3, 21:9 | 1.5k/2k | 1 | Film-still heroes, grain, era looks |
| `text2image_soul_v2` | Soul 2.0 | 7 ratios | 1.5k/2k | 1 | Preset-driven editorial looks, moodboards |
| `cinematic_studio_2_5` | Cinema Studio 2.5 | 10 ratios incl. 21:9 | 1k/2k/4k | 14 | Camera body and lens chosen as settings, batch grids |
| `seedream_v4_5`, Seedream 5.0 Pro / Flash | Seedream | up to 21:9 | basic/high | 14 | Dense compositions, box and arrow targeted edits |
| `flux_2` | FLUX.2 pro/flex/max | 1:1, 4:3, 3:4, 16:9, 9:16 | 1k/2k | yes | Photoreal with named cameras, hex colour binding |
| `flux_kontext` | Flux Kontext | 5 ratios | | 4 | Local edits, clean plates |
| `recraft_v4_1` | Recraft V4.1 | 9 ratios | 1k/2k | | `background_color` hex, `colors[]`, `model_type` vector/utility |
| `image_background_remover` | Cut-out tool | | | exactly 1 | Transparent PNG from any render |
| Layers | Decomposition tool | | | | Splits an image into elements; useful for plates |

No image model exposes a seed in the CLI. Soul 2's REST API does (`seed` 1 to 1,000,000, plus `style_id`, `batch_size`, `enhance_prompt`). Consistency otherwise comes from locked wording and reference images.

## 3. Compiling for each model

One facet sheet, several dialects.

**Nano Banana Pro.** Narrative sentences in the order subject, composition, action, location, style. Put the purpose in the first sentence. Give the ratio as a setting and the shot scale in words. Positive framing ("an empty wall" rather than "no people"). Hex codes work when bound to objects. Leave out polite phrasing. Longer prompts are fine when every sentence carries a fact.

**GPT Image 2.5 / 2.** Labelled lines work best for anything complex: `Purpose:`, `Scene:`, `Subject:`, `Camera:`, `Light:`, `Colour:`, `Constraints:`. It is the one model where an explicit exclusion line is reliable ("no text, no watermark, no cast shadow"). Camera specs are followed loosely; describe the look as well as the lens. Raise `quality` for finals because the default is low. Describe UI objects "as if they already exist", not as concept art.

**Soul Cinema / Soul 2.0.** Short: about 20 to 60 words of subject, setting, lens and light, then let presets and Soul HEX carry the style. Soul HEX (colour transfer) from an approved reference keeps a set on palette. Presets include Retro BW, Theatrical Light, Nature Light, Warm Ambient, Editorial Street Style and more. On Soul 2.0, attaching a reference image removes the prompt field, so decide up front: reference mode or prompt mode. Moodboards want 20 or more cohesive images without faces; build one from approved renders once a look settles.

**Cinema Studio.** Choose the camera body, lens, focal length and aperture in settings, and keep them **out** of the prompt, which describes only the scene. Tag references with roles ("Image 1 for the object, Image 2 for the location"). Its "hero frame" workflow works well for sets: approve one frame, grade it, then match everything else to it.

**Seedream.** Coherent sentences: subject, action, environment, then style, colour, light, composition. Name the image type and purpose. For edits, name exactly what changes and what stays; box-targeted edits ("inside the marked box, add...") give precise control.

**FLUX.2.** 30 to 80 words, most important first: subject, action, style, context, detail. No negative prompt support, so phrase everything positively ("sharp focus throughout"). Named camera and film stock beat "professional photo". Bind hex to objects. Turn off any prompt upsampling toggle when you've written a full prompt, or a second model rewrites your work.

**Recraft V4.1.** Name the medium first ("A flat vector illustration of..."). Set `background_color` and `colors[]` to your palette. `utility` gives front-facing, flatter lighting for icons and product pieces. Describe the whole set in one prompt when you want siblings ("a set of six line icons, uniform 2px stroke, square terminals").

**Any platform "enhance prompt" toggle.** Turn it off for full prompts, and leave it on only for deliberately loose exploration.

## 4. References and editing

- Give every reference a job: "object from image 1, lighting and grade from image 2". Two or three references are more stable than ten.
- Limits: Nano Banana Pro 14, GPT Image 2.5 16, FLUX.2 pro 8, Soul 1.
- Edit when a render is about 80% right. Use "change only X" and restate what stays: "Keep everything else exactly the same, preserving composition, camera, lighting, textures and grain."
- Change one thing per edit. Each edit round slightly softens detail, so return to a fresh generation, using the edit as a reference, if a chain gets long.
- The first approved asset in any set becomes reference image 1 for everything after it.

## 5. Video models for frame sequences

For scroll-scrubbed motion (see `scenes.md`), use a Higgsfield video model that accepts a **start frame and an end frame**. Check the live model list for which ones support an end image; the family changes often (Kling, Veo, Seedance, Wan and Higgsfield's own have all offered it).

- Both frames must share ratio, camera and lighting. Make the end frame by editing the start frame.
- Prompt motion only: "the camera holds still; the bar slowly cools from glowing orange to black". Hold the camera still unless the camera move *is* the idea, because a scrubbed camera move reads as the page sliding.
- Ask for no cuts, no speed ramps and constant lighting.
- Extract frames: `ffmpeg -i clip.mp4 -vf "fps=24,scale=1600:-2" -c:v libwebp -quality 78 frames/f-%03d.webp` (install with `brew install ffmpeg`). 48 to 96 frames is usually enough; scroll doesn't need 60fps.

## 6. Unverified or unstable

- Whether the MCP exposes GPT Image's `background` parameter (the CLI does). If not, use the CLI or the backdrop and remover route.
- Seedream 5.0 Pro and Flash are live in the app but were missing from `MODELS.md` at the time of writing.
- Cinema Studio's reported 512-character prompt cap and its lens vocabulary come from a community skill, not official docs.
- Soul prompt-length advice (under about 100 words) is community guidance.
- Reve and Wan image models no longer appear on Higgsfield. Wan is video only.
- GPT Image alpha quirks: opaque pixels sometimes at 252 to 254, thin grey edge halo, semi-transparent glass flattened to a hard cut. `matte.py clean` fixes the first two.
