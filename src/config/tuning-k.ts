/**
 * Tunables for campaign-graphics-2 package k (re-exported from tuning.ts): the separate
 * campaigns' landmark kits (H3), the Fold's mending states (M2), the Beetle Road's banners
 * and cart (M4), Dawn & Dusk's carved plaques (M5), the Fold's tally post and wreaths (N5)
 * and the campaign memorial marks (N7). Pure data, shared by the pixel and Full 3D views.
 */

/** A closed outline in a unit box: x right, y up, both 0..1. */
export type Outline = ReadonlyArray<readonly [number, number]>;

/**
 * The four carved creatures over the crest-house doors (M5): "a flier, a runner, a swimmer,
 * a thicket thing". Each is a plain silhouette, drawn facing right, so it reads at the
 * establishing distance by shape alone.
 */
export const PLAQUE_OUTLINES = {
  flier: [
    [0.0, 0.62],
    [0.14, 0.86],
    [0.3, 0.88],
    [0.42, 0.72],
    [0.5, 0.78],
    [0.56, 0.7],
    [0.7, 0.88],
    [0.86, 0.86],
    [1.0, 0.6],
    [0.82, 0.68],
    [0.68, 0.6],
    [0.6, 0.38],
    [0.62, 0.1],
    [0.5, 0.26],
    [0.4, 0.1],
    [0.4, 0.38],
    [0.32, 0.6],
    [0.18, 0.68],
  ],
  runner: [
    [0.02, 0.62],
    [0.14, 0.64],
    [0.22, 0.58],
    [0.5, 0.58],
    [0.66, 0.6],
    [0.74, 0.78],
    [0.82, 0.94],
    [0.88, 0.84],
    [0.98, 0.7],
    [0.9, 0.58],
    [0.78, 0.5],
    [0.76, 0.38],
    [0.84, 0.04],
    [0.72, 0.04],
    [0.62, 0.34],
    [0.5, 0.36],
    [0.42, 0.04],
    [0.3, 0.04],
    [0.3, 0.34],
    [0.22, 0.34],
    [0.16, 0.04],
    [0.04, 0.04],
    [0.1, 0.4],
  ],
  swimmer: [
    [1.0, 0.5],
    [0.88, 0.68],
    [0.7, 0.78],
    [0.6, 0.94],
    [0.46, 0.8],
    [0.3, 0.7],
    [0.2, 0.58],
    [0.04, 0.84],
    [0.1, 0.5],
    [0.04, 0.16],
    [0.2, 0.42],
    [0.34, 0.3],
    [0.5, 0.2],
    [0.66, 0.24],
    [0.62, 0.06],
    [0.78, 0.26],
    [0.9, 0.34],
  ],
  thicket: [
    [0.06, 0.04],
    [0.0, 0.38],
    [0.16, 0.46],
    [0.08, 0.76],
    [0.28, 0.62],
    [0.34, 0.96],
    [0.5, 0.7],
    [0.66, 0.98],
    [0.72, 0.62],
    [0.9, 0.78],
    [0.86, 0.46],
    [1.0, 0.38],
    [0.94, 0.04],
  ],
} as const satisfies Record<string, Outline>;

export type PlaqueCreature = keyof typeof PLAQUE_OUTLINES;

export const CG2_K = {
  /** Dawn & Dusk's plaques, clockwise from the north house (sun, moon, leaf, wave). */
  plaque: {
    creatures: ['flier', 'runner', 'thicket', 'swimmer'] as readonly PlaqueCreature[],
    /** Full 3D: board and relief size (world units) and height of its centre over the door. */
    w: 0.8,
    h: 0.52,
    centreY: 2.26,
    relief: 0.06,
  },
  fold: {
    /** Wreaths hang from the storyline chapter with this 0-based index (chapter 7). */
    wreathFromIndex: 6,
    /** The lit window appears in this 0-based chapter (chapter 10). */
    litWindowIndex: 9,
    /** Tally strokes drawn on the well post, at most (a stroke per day, a hundred days). */
    tallyMax: 100,
    perGroup: 5,
    /** The tally post stands this far round the well's rim (radians from +x) and out. */
    postAngle: 0.9,
    postOut: 1.5,
    postHeight: 1.7,
  },
  beetle: {
    /** Banner poles: position (grove), crest and cloth colour. Each is a shape as well as a colour. */
    poles: [
      { x: -10.4, z: 30.6, crest: 'sun', colour: '#e8a53a' },
      { x: -2.6, z: 29.2, crest: 'moon', colour: '#6f7ac0' },
      { x: -0.4, z: 33.2, crest: 'drop', colour: '#4aa0c4' },
    ] as const,
    poleHeight: 2.9,
    cloth: { w: 0.8, h: 1.15 },
    /** The lane in from the gate and past the guard house, as grove x, z points. */
    road: [
      [0, 24.2],
      [0.6, 27],
      [0.6, 30],
      [-1.2, 32.4],
      [-5, 33.6],
      [-9.5, 33.6],
      [-14, 32.2],
    ] as ReadonlyArray<readonly [number, number]>,
    roadWidth: 2.6,
    rutOffset: 0.5,
    rutWidth: 0.3,
    milestones: [
      { x: 2.3, z: 26.4, n: 1 },
      { x: -3.4, z: 35.2, n: 2 },
      { x: -12, z: 34.2, n: 3 },
    ] as const,
    /** Where the cart is read from (the cart mark of LOOK_F.beetle). */
    cartYaw: -0.5,
  },
  /** Campaign memorial marks (N7): where flowers of departed Nubbins stand. */
  memorial: {
    /** The Hundred Days: a ring round the Fold's well, starting on the side away from the houses. */
    wellRing: { r: 1.9, from: 2.2, step: 0.55 },
    /** Dawn & Dusk: along the green's edge, between the houses, in four arcs. */
    greenEdge: { out: 0.75, arcOffset: 0.2, per: 4 },
  },
} as const;
