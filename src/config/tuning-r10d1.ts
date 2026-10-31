/** Lane D round 10, helper 1: perf tunables (R0473 frame dips, R0456 / R0081 memory). */

/**
 * R0473: `viewRect()` (the `#game` element's screen box) is read by every bubble, gag and
 * building rect each frame, and each read after a style write forced a layout (about 5% of
 * the main thread in a Pixel Grove at x10). A ResizeObserver and window resize keep it fresh;
 * it is re-measured at most this often as a safety net (one forced layout a second at worst).
 */
export const VIEW_RECT_CACHE = { ttlMs: 1000 };
