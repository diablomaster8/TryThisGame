// Every tunable number lives here. Nothing in this file is player-facing text
// (that is config/strings.ts).

export const RENDER = {
  /** Height of the low-res frame in pixels. Width follows the screen aspect ratio. */
  targetHeight: 270,
  /** The low-res target does the heavy lifting, so device pixel ratio is capped at 1. */
  maxPixelRatio: 1,
} as const;

export const CAMERA = {
  /** Fixed downward tilt of the orbit camera, in degrees. */
  pitchDeg: 35,
  /** The camera orbits in steps of this many degrees. */
  yawStepDeg: 45,
  /** Number of yaw steps in a full circle (360 / yawStepDeg). */
  yawSteps: 8,
  initialYawIndex: 1,
  /**
   * Zoom levels, expressed as low-res pixels per world unit. Integer ratios keep
   * pixel art crisp. Index 0 is the farthest view.
   */
  pixelsPerUnit: [8, 16] as const,
  initialZoomIndex: 0,
  /** Distance from the orbit target. Only affects clipping for an orthographic camera. */
  distance: 60,
  near: 0.1,
  far: 200,
  /** Duration of the eased snap between yaw steps and zoom levels, in ms. */
  snapMs: 180,
} as const;

export const TEST_SCENE = {
  groundSize: 32,
  /** Ground texture tiles per world unit. */
  groundTilesPerUnit: 1,
  /** Pixels per ground tile. */
  groundTilePx: 8,
  spriteSizePx: 32,
  /** World height of a 32px sprite. 2 units at 16 px/unit means 1:1 pixels at the near zoom. */
  spriteWorldHeight: 2,
} as const;

export const INPUT = {
  /** Horizontal two-finger travel (CSS px) that counts as a rotate swipe. */
  swipeThresholdPx: 40,
  /** Pinch distance ratios that count as zoom out / zoom in. */
  pinchOutRatio: 0.8,
  pinchInRatio: 1.25,
  /** Wheel delta (px) that counts as one zoom step. */
  wheelThreshold: 20,
} as const;

export const UI = {
  fpsUpdateMs: 1000,
} as const;
