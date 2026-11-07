/**
 * Round 17 lane D (helper d1): the small caves behind the world's `stairs` ways (R0115,
 * WORLD-38), the Hollow mouth's lantern, and the Hollow's own sound cues (R0450, TECH-08).
 */

/** One cave behind a `stairs` way: its place id (`caves:<id>`), floors and the way back out. */
export interface CaveWayDef {
  /** The place id after `caves:`. */
  id: string;
  /** The seed of its floors, fixed so the cave is the same every visit. */
  seed: number;
  /** How many floors it has; the last floor's stairs lead back out. */
  floors: number;
  /** The way in this cave's mouth is, in its region, and the cave region's way back out. */
  back: string;
}

/** Keyed by the exit id of the mouth. The Grove's own Hollow mouth is the Hollow, not here. */
export const CAVE_WAYS: Readonly<Record<string, CaveWayDef>> = {
  'ridge-ice': { id: 'ice', seed: 70113, floors: 2, back: 'caves-ice' },
  'ruins-door': { id: 'door', seed: 81207, floors: 1, back: 'caves-door' },
};

/** The warm lantern at the Hollow's mouth: where it stands relative to the mouth, and its size. */
export const MOUTH_LANTERN = {
  /** East of the hill face, south of the arch's lip (the lips run to z ± 1.9, and a Keeper must fit between). */
  dx: 1.5,
  dz: 3.6,
  /** Pixel billboard size (the cottage's own lantern is 0.8). */
  pixelSize: 0.8,
  /** 3D: the glass box's centre height above the ground. */
  glassY: 2.1,
  /** 3D: the pool of lamplight on the ground at night. */
  spill: 3.2,
} as const;

/** A note of a Hollow cue: frequency (Hz), start and length (ms), wave, gain, optional glide. */
export type CueNote = readonly [number, number, number, OscillatorType, number, number?];

/**
 * R0450: Hollow-specific cues not in the encounter set (R0199). Each is a short run of notes,
 * soft by design, played through `playHollowCue` and so muted until the first tap.
 */
export const HOLLOW_CUE_NOTES = {
  /** A hidden way opening: a low stone grind, then a bright ting. */
  secret: [
    [140, 0, 260, 'triangle', 0.045, 90],
    [1320, 220, 200, 'sine', 0.035],
  ],
  /** A puzzle solved: a rising three-note flourish. */
  puzzle: [
    [660, 0, 110, 'triangle', 0.045],
    [880, 100, 110, 'triangle', 0.045],
    [1320, 200, 280, 'triangle', 0.05],
  ],
  /** A plate pressed, a torch lit, a block pushed home: one soft tock. */
  plate: [[420, 0, 90, 'sine', 0.04, 300]],
  /** A fall into water: a plop. */
  'fall:water': [
    [500, 0, 140, 'sine', 0.05, 160],
    [900, 90, 60, 'triangle', 0.02],
  ],
  /** A fall down a chasm: a gentle slide down and a soft thud, never harsh. */
  'fall:chasm': [
    [700, 0, 300, 'sine', 0.04, 150],
    [110, 300, 120, 'triangle', 0.05],
  ],
  /** A trap seen in time: a two-note "ah!". */
  spot: [
    [988, 0, 70, 'triangle', 0.035],
    [1319, 70, 90, 'triangle', 0.03],
  ],
  /** A trap sprung: a cartoon boing. */
  trap: [[220, 0, 240, 'triangle', 0.05, 520]],
  /** A boss beaten: a short fanfare. */
  bossDown: [
    [392, 0, 140, 'square', 0.035],
    [523, 140, 140, 'square', 0.035],
    [659, 280, 140, 'square', 0.035],
    [784, 420, 420, 'triangle', 0.05],
  ],
  /** The boss door swinging open. */
  door: [
    [98, 0, 420, 'sawtooth', 0.035, 70],
    [196, 160, 300, 'triangle', 0.03],
  ],
  /** Down the stairs: two soft steps. */
  stairs: [
    [330, 0, 70, 'sine', 0.035],
    [262, 110, 90, 'sine', 0.035],
  ],
  /** Stepping into a cave: a hollow, echoing breath. */
  cavern: [
    [196, 0, 500, 'sine', 0.04],
    [147, 120, 700, 'sine', 0.025],
  ],
} as const satisfies Record<string, readonly CueNote[]>;

export type HollowNoteCue = keyof typeof HOLLOW_CUE_NOTES;
