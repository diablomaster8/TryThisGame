/** Tuning: the orbit camera (split from render-3d-grove.ts, TECH-36). */

export const CAMERA = {
  /** Fixed downward tilt of the orbit camera, in degrees. */
  pitchDeg: 35,
  pitchRad: (35 * Math.PI) / 180,
  /** How long the camera turns to a Nubbin whose end-of-life moment is playing, in ms. */
  focusMs: 6000,
  /** The camera orbits in steps of this many degrees. */
  yawStepDeg: 45,
  /** Number of yaw steps in a full circle (360 / yawStepDeg). */
  yawSteps: 8,
  initialYawIndex: 1,
  /**
   * Zoom levels, expressed as low-res pixels per world unit. Integer ratios keep
   * pixel art crisp. Index 0 is the farthest view.
   */
  pixelsPerUnit: [16, 32] as const,
  /**
   * A closer step only story shots reach (campaign graphics 3): the push-in after a wide
   * shot, and close shots, which the near step could not show on a desktop already there.
   * Twice the near step, so the art stays on whole pixels. It sits at index
   * `pixelsPerUnit.length`; the player's own zoom never lands on it.
   */
  storyPixelsPerUnit: 64,
  initialZoomIndex: 1,
  /**
   * The zoom a phone starts at: the far one, so both eggs and the nearest trees are on screen
   * at the first look (review 2026-10-21, bug 25). Desktops keep `initialZoomIndex`.
   */
  phoneZoomIndex: 0,
  /** Distance from the orbit target. Only affects clipping for an orthographic camera. */
  distance: 60,
  near: 0.1,
  far: 200,
  /** Duration of the eased snap between yaw steps and zoom levels, in ms. */
  snapMs: 180,
  /** How quickly the orbit target follows the Keeper (fraction per second). */
  followRate: 6,
} as const;
