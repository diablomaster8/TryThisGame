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

/**
 * R0025: a splash-down in the pond without the Swim perk puffs the Keeper back to its last
 * safe spot once the feet are within `surface` of the water. The cloud lasts `cloudMs`.
 */
export const KEEPER_POOF = {
  surface: 0.05,
  cloudMs: 400,
  puffs: 10,
  /** The nearest hatched friend within this many units shows a heart when it is back. */
  friendRange: 12,
} as const;

/**
 * R0026 item 4: the hidden keepsake on the rock shelf behind the waterfall (on hill 1's second
 * tier). The shelf sits inside the falls' solid face, so it is found from the tier beside
 * it: feet within `reach` of the shelf and `rise` over the tier there find it, once. A plain
 * jump tops out at 0.95, so it takes the double jump.
 */
export const FALLS_SHELF = {
  keepsake: 'falls-pebble',
  reach: 1.4,
  rise: 1.2,
} as const;
