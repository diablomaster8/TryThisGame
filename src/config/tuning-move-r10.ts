/** Lane A round 10 (MOVE) tuning: Keeper motion and its UI. */

/**
 * R0035: the tap marker's variants. A refused tap shows a grey ✕ where it landed; a tap on a
 * ledge only a jump reaches shows a ⤒. Each stays `showMs` (`reducedMs` under reduced motion),
 * fading over the last `fadeMs`. `size` is the glyph's world width.
 */
export const TAP_FLAG = {
  showMs: 2200,
  reducedMs: 1200,
  fadeMs: 400,
  size: 0.6,
  /** The ⤒ stands this high over the ledge it points at, bobbing by `bob` (3D and Pixel). */
  lift: 0.35,
  bob: 0.08,
  bobMs: 700,
} as const;

/**
 * R0041: the Pixel Keeper swaps to its lean frame walking up a slope at least this steep
 * (rise over run along its facing, probed `KEEPER_SLOPE.probe` ahead, as the 3D lean is).
 */
export const PIXEL_LEAN = {
  minSlope: 0.12,
} as const;

/** R0042: a running Keeper's 3D arms swing this many times wider than a walk's (0.4 rad). */
export const RUN_ARMS = {
  swing: 1.8,
} as const;
