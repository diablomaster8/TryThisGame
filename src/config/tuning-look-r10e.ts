/**
 * Lane E round 10: tunables for the creature looks (crying, band-tinted emotes, the Run
 * crown). Imported directly by the render files that use them.
 */

/**
 * LOOK-21: the 3D tear streams. Every `everyMs` each eye throws one drop, sideways at
 * `side` m/s with a little `up` and `fwd`, from the eye spot: `eyeK` of the way from the
 * feet to the head bone (above 1 is past it), `eyeFwd` forward and `eyeSide` out, as
 * fractions of that feet-to-head height. With the tear's gravity and drag the drops land
 * about 0.2 m out. Reduced motion throws none (the pose stays).
 */
export const CRY_TEARS = {
  everyMs: 250,
  lifeMs: 650,
  eyeK: 1.15,
  eyeFwd: 0.32,
  eyeSide: 0.2,
  side: 0.5,
  up: 0.7,
  fwd: 0.15,
} as const;

/**
 * LOOK-11: a Run touch (a second evolution's half-strength Run) keeps its crown but grows it
 * ×1.4 from the root and tips it `sweep` radians further back. A full Run form trades the
 * crown for its quills (LOOK-19).
 */
export const CROWN_RUN = { length: 1.4, sweep: 0.22 } as const;

/**
 * LOOK-08: MetalGreymon's single metal arm (3D colours: the steel, the shoulder joint and the
 * claws), and the Greymon line's forward lean in 3D, in degrees: everything above the hips
 * leans this far forward over the legs, with the tail behind for balance.
 */
export const METAL_ARM = { steel: '#9aa4b8', joint: '#5c6478', claw: '#dcd6e6' } as const;
export const DINO_LEAN_DEG = 25;

/**
 * LOOK-51: the garden idle acts (render/idle-acts.ts). A content Nubbin standing idle plays
 * one every `gapMs` (seeded per Nubbin, skipped while a personality gag plays) for `playMs`;
 * a child at `childRate` of the rate. `weights` is each personality's table (a Nubbin with no
 * personality yet uses `none`); `wave` is open only with the Keeper within `waveRange` m. A
 * drawing's scribble stays on the ground `doodleMs`, fading over the last `doodleFadeMs`.
 */
export const IDLE_ACTS = {
  gapMs: [16_000, 28_000] as const,
  playMs: 4000,
  childRate: 0.6,
  waveRange: 4,
  doodleMs: 30_000,
  doodleFadeMs: 8000,
  doodleMax: 6,
  /** A hop's height (world units): the "!" of a thought, the dance's beats. */
  hop: 0.18,
  weights: {
    cheerful: { draw: 1, trumpet: 2, dance: 3, think: 1, trip: 1, stretch: 1, yawn: 0.5, wave: 2 },
    shy: { draw: 3, trumpet: 1, dance: 0.5, think: 2, trip: 1, stretch: 1, yawn: 1, wave: 0.5 },
    mischievous: {
      draw: 1.5,
      trumpet: 2.5,
      dance: 1.5,
      think: 1,
      trip: 1.5,
      stretch: 0.5,
      yawn: 0.5,
      wave: 1,
    },
    lazy: {
      draw: 1,
      trumpet: 0.5,
      dance: 0.5,
      think: 1,
      trip: 1,
      stretch: 2.5,
      yawn: 3,
      wave: 0.5,
    },
    none: { draw: 1, trumpet: 1, dance: 1, think: 1, trip: 1, stretch: 1, yawn: 1, wave: 1 },
  },
} as const;
