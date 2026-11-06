/**
 * R0412 (LOOK-56): the Full 3D photo mode's numbers: the free camera's limits, how the
 * gestures turn into camera moves, the group formations and the saved picture's scale.
 * R0411's book turntable sits here too, since it shares the offscreen-render budget.
 */
export const PHOTO3D = {
  camera: {
    /** Tilt above the ground, degrees. */
    tiltMin: 5,
    tiltMax: 80,
    tiltStart: 22,
    /** Distance to the subject in world units (1 unit is about a third of a metre: 0.5–3 m). */
    distMin: 1.5,
    distMax: 9,
    /** Roll either way, degrees. */
    rollMax: 15,
    /** The look point's height over the subjects' feet. */
    lookUp: 0.55,
    /** Kept this far above the ground under the camera. */
    floor: 0.25,
  },
  gesture: {
    /** Radians of orbit per pixel of one-finger drag. */
    yawPerPx: 0.008,
    /** Degrees of tilt per pixel of drag (one finger up and down, or two fingers). */
    tiltPerPx: 0.25,
    /** Zoom factor per wheel notch (100 px of deltaY). */
    wheelStep: 1.12,
    /** A press that moves less than this, in px, is a tap (a sticker pick). */
    tapPx: 8,
  },
  group: {
    max: 8,
    /** Gap between neighbours in the row, world units. */
    spacing: 0.95,
    /** Smallest circle radius. */
    circleMin: 0.9,
  },
  /** The saved picture is drawn at this many device pixels per CSS pixel, the longer side capped. */
  shot: { scale: 2, maxSide: 4096 },
  /** Sticker size as a share of the shorter side of the picture. */
  stickerSize: 0.09,
  stickerMax: 12,
} as const;

/** R0411: the collection book's 3D turntable: one offscreen strip per look, cached. */
export const TURNTABLE3D = {
  px: 256,
  frames: 8,
  /** Strips kept (each is px × px × frames × 4 bytes: 2 MB at 256 px and 8 frames). */
  cache: 8,
  /** How long the page waits for a look's sculpt before it keeps the pixel figure. */
  waitMs: 20000,
  pollMs: 120,
  /** One frame shown this long while the page is open. */
  frameMs: 160,
} as const;
