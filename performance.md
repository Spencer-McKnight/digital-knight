# Performance Guardrails

Load experience is "stable-first": render the final layout immediately, then layer in non-blocking motion.

## CLS Policy

- No startup overlay or splash screen that blocks scroll, swaps layers, or hand-offs UI ownership.
- Reserve layout up front for every persistent region (nav, hero, section structure, scrollbar gutter).
- Never hide visible content after hydration just to replay an entrance animation.
- Use transforms/opacity for motion; avoid animating layout-affecting properties where possible.
- Keep async and dynamic mounts inside containers that already own space.

## Current Load Flow

- Root layout renders `Nav`, page content, `Cursor`, and `Footer` immediately.
- Nav defaults to Page/light assumptions before runtime ground detection refines ink/surface split.
- Hero content is rendered in-place without a post-hydration gate.
- Scrollbar gutter is stable to prevent width hops as content crosses overflow thresholds.

## Flashing Prevention

- Any first-paint animation must have matching initial CSS state, not a delayed JS `set(...)` that hides already-painted content.
- If JS needs to measure before paint, do it in a paint-safe lifecycle and keep a deterministic visual fallback in CSS.
- Entrance animation is allowed only where late reveal does not cause a visible jump.

## Verification

- Run Lighthouse and monitor CLS in local and production builds.
- Test first-load on throttled CPU/network and on a hard refresh.
- Validate no horizontal reflow when the page toggles between short and long content.
