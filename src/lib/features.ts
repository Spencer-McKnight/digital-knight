/**
 * Feature flags — runtime toggles for experimental or optional behaviour.
 * Keep this file minimal; flags that graduate to permanent should be removed.
 */

/**
 * Custom cursor — the iron ring that replaces the system pointer on
 * pointer-fine devices. When false, the native cursor is used everywhere.
 *
 * Disabled by default: the custom cursor was found to be a usability tax.
 * To re-enable, set to `true` and uncomment the `cursor: none` rule in
 * `styles/_base.scss`.
 */
export const CUSTOM_CURSOR_ENABLED = false;
