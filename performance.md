## Current Load Flow

- Root layout renders `Nav`, page content, `Cursor`, and `Footer` immediately.
- Nav defaults to Page/light assumptions before runtime ground detection refines ink/surface split.
- Hero content is rendered in-place without a post-hydration gate.
- Scrollbar gutter is stable to prevent width hops as content crosses overflow thresholds.

## Flashing Prevention

- Any first-paint animation must have matching initial CSS state, not a delayed JS `set(...)` that hides already-painted content.
- If JS needs to measure before paint, do it in a paint-safe lifecycle and keep a deterministic visual fallback in CSS.
- Entrance animation is allowed only where late reveal does not cause a visible jump.
