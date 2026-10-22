/**
 * Tunables for campaign-graphics-4 package a2 (re-exported from tuning.ts): walk-ons (K5),
 * footsteps (K36) and the partner's reactions (K40). Every number is a default.
 */
export const CG4_A2 = {
  walk: {
    /** Walking pace on the ground, in world units a second. */
    speed: 2.2,
    /** The shortest and longest a walk-on takes, in ms (a far mark is hurried). */
    minMs: 800,
    maxMs: 4800,
    /** Wait after the scene begins before the walk starts, in ms. */
    leadMs: 350,
  },
  /**
   * Marks a walk-on may come `from` that the stage-marks table does not have (the lane
   * outside the gate, which the Grove's own marks stop short of). Looked up after `markAt`.
   */
  fromMarks: {
    'lane-west': { x: -9, z: 31 },
    'lane-east': { x: 9, z: 31 },
    'lane-south': { x: 0, z: 33 },
  } as Readonly<Record<string, { x: number; z: number }>>,
  prints: {
    /** The most footprints lying at once (one pool each renderer), and the gap between two. */
    cap: 64,
    stride: 0.6,
    /** Print length in world units; the width is 0.55 of it. */
    size: 0.5,
    /** How far a foot lands off the line of travel. */
    spread: 0.1,
    /** How opaque a print lies (3D; the pixel prints are solid painted pixels). */
    opacity: 0.65,
    /** Tint by ground type (grass leaves none), and the pixel palette index of the same. */
    snow: { color: '#4a5878', pixel: 3 },
    mud: { color: '#3a2a1c', pixel: 12 },
    sand: { color: '#a8844e', pixel: 43 },
  },
  partner: {
    /** The emote ball the line's mood shows over the partner (none for the rest). */
    emote: {
      happy: 'heart',
      soft: 'heart',
      sad: 'spiral',
      shock: 'exclaim',
      think: 'question',
    } as Readonly<Record<string, 'heart' | 'spiral' | 'exclaim' | 'question'>>,
  },
} as const;
