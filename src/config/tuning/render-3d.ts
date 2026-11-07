/**
 * Tuning: the render-3d domain (TECH-36). Moved out of config/tuning.ts, which still re-exports it.
 * Numbers are unchanged; the review-pass letters in the comments are their provenance.
 */

/**
 * The 3D mode's sculpt grid per device. A first-run benchmark marches a small test surface
 * and picks the finest torso resolution whose opening build fits the budget; the save
 * keeps the answer in `settings.sculptRes`. Parts scale by the same share of their own grid.
 */
export const SCULPT_RES = {
  /** The resolution species are authored at (the torso default in `species.ts`). */
  authored: 104,
  /** The choices, finest first: desktop, mid, phone, slow phone. */
  steps: [104, 80, 64, 48] as const,
  /** Grid of the benchmark surface (the Nubbin's torso). */
  benchRes: 24,
  /**
   * How marching time grows with the grid: the narrow band and the per-vertex bake make
   * it nearer the square than the cube (2.84x from 64 to 104, measured 2026-10-16).
   */
  exponent: 2.2,
  /**
   * Marching work of an opening Grove (the Keeper and 8 Nubbins in 7 looks, 54 surfaces)
   * in benchmark surfaces at the benchmark's grid. The benchmark runs at boot, when it
   * reads about 3.5x slower than on an idle page (20 ms against 6 on Maor's PC); the
   * opening marched in 540 ms on 4 workers at grid 63 there, 2026-10-16.
   */
  openingWork: 15,
  /**
   * Marching time the opening may take, in ms. It runs in workers while the page builds
   * the scene and compiles its shaders (2.4 s on Maor's PC, several times that on a
   * phone), so time inside this is hidden; the cache makes it a one-off.
   */
  budgetMs: 3000,
} as const;

/** Which adults get the extra motion clips, by stat level (both renderers). */
export const MOTION_CLIPS = {
  /** An adult at or above this Fly level flaps its wings when it moves. */
  flapLevel: 30,
  /** An adult at or above this Swim level swims a stroke in the pond; others wade. */
  swimLevel: 30,
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

/**
 * Full 3D readability (review 2026-10-21, bugs 10–17): the key-moment camera, the occluder
 * fade, the story staging, the Hollow's light and the memorial flower.
 */
export const READ3D = {
  /** A hatch, evolution, cocoon or rebirth: how long the camera frames the Nubbin. */
  focus: {
    ms: 5000,
    /** The orbit distance while framing, and where between Keeper (0) and Nubbin (1) it looks. */
    distance: 7,
    towardSubject: 0.55,
    /** The camera turns at most this far off the player's yaw to bring the Nubbin forward. */
    maxTurnRad: 1.4,
    /** Turned this far off the Keeper-to-Nubbin line: from the side, so both read, the Nubbin nearer. */
    sideRad: 1.15,
    pitchDeg: 20,
    lookUp: 1.3,
  },
  /** A story scene: the speakers framed together, the distance growing with their spread. */
  stage: {
    radius: 14,
    minDistance: 8.5,
    spreadK: 1.5,
    /** The hour a scene's dusk or night narration is lit at. */
    duskHour: 19.2,
    nightHour: 22.5,
    goldenHour: 17.8,
    morningHour: 7.5,
    /** C5: a speaker further than `radius` is drawn this far from the Keeper, facing them. */
    bringIn: 2.5,
    /** H8: fraction of the frame height the subjects are lifted by, clear of the dialogue box. */
    boxLift: 0.2,
    /** On a phone held upright the story camera stands no further back than this. */
    portraitMaxDistance: 12,
    /** …and frames at most this spread (units from the centre), narrowing the cast to fit. */
    portraitSpread: 3.5,
    /** H8 shot shapes: `wide` and `establish` stand back by this much over a two-shot. */
    wideK: 1.45,
    /** `establish` dollies in from this many times its distance, over `establishMs`. */
    establishFrom: 1.7,
    establishMs: 2000,
    /** `over`: the camera sits behind the Keeper, this far round off the line to the speaker. */
    overSideRad: 0.35,
    overDistance: 5.5,
    overPitchDeg: 16,
    /** `close` frames the speaker this far along from the Keeper (0) to the speaker (1). */
    closeToward: 0.7,
  },
  /** Lantern posts: how wide a post blocks, and the NPC's keep-off radius round each. */
  post: { r: 0.3, keepOff: 0.75 },
  /** The Hollow Below's wider camera (its light rig is `GROVE3D.cave.light`). */
  hollow: {
    distanceK: 1.2,
    pitchDeg: 42,
  },
  memorial: { height: 1.15, glow: 0.55 },
  /** Racers and the Expedition runner turn this far from side-on toward the camera. */
  faceTurn: 0.55,
} as const;

/**
 * Lane F r13 (R0375): the seal-stance quads (Seel, Dewgong, Lapras) galumph with a long,
 * quick flipper sweep, so the gait clock keeps their feet planted up to a Nubbin's run
 * (`KEEPER_ACTS.runSpeed`) without passing `GROVE3D.maxCadence`.
 */
export const QUAD_SEAL = {
  strideLength: 1.8,
  stridePeriod: 0.6,
  /** The smallest quads (babies at this size or under) scurry on a quicker cycle for the same reason. */
  babyMaxSize: 0.85,
  babyStridePeriod: 0.66,
} as const;

/** Lane F r16 (R0405): Exeggutor's one big crown over its three heads in Full 3D. */
export const PALM3D = {
  clusterScale: 1.9,
  clusterLeaves: 8,
  /** The coconuts' stems and fan in 3D: short and close, clustered under the crown. */
  neck: 0.15,
  spread: 100,
} as const;

/** Lane F r16 (R0405): Horsea and Seadra in Full 3D read from the front. */
export const SEAHORSE3D = {
  /** The tail curl's plane, turned this far (radians) off the side plane toward the camera. */
  tailTurn: Math.PI / 4,
  /** And set this far to one side, so the curl shows beside the body, not behind it. */
  tailSide: 0.18,
  /** How far the tube snout dips at its tip. */
  snoutDrop: 0.32,
  /** How far each spiky cheek frill sticks out. */
  frill: 0.28,
} as const;
