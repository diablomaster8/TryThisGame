/**
 * Tunables for campaign-graphics-4 package d4 (re-exported from tuning.ts): the Hush's walk
 * (K17), depth of field (K21), god-rays and motes (K22), cloud shadows (K23), the moon (K24),
 * snow cover (K25), path wear (K26), puddles (K34) and the wind (K35). Every number is a
 * default.
 */
export const CG4_D4 = {
  /** K17: the Hush walks from its mark toward the Fold, one stretch per scene of its walk. */
  hush: {
    /** The path as marks (world x, z): the `hush` mark first, the Fold's side last. */
    path: [
      { x: 0, z: -22 },
      { x: 1.2, z: -20.2 },
      { x: -1, z: -18 },
      { x: 0.6, z: -15.6 },
      { x: 0, z: -13 },
    ],
    /** Seconds a scene's stretch takes, from its first line. */
    stretchS: 14,
    /** The fog band: puffs along the walked path, then tendrils to each lantern put out. */
    pathPuffs: 9,
    tendrilPuffs: 4,
    /** Puff size (world units) and the opacity of the band. */
    puffW: 5.2,
    puffH: 2.4,
    opacity: 0.5,
    /** Lift of a puff's centre over the ground. */
    lift: 0.7,
  },
  /** K21: depth of field. Off on phones unless the setting asks, and under `minFps`. */
  dof: {
    /** A close shot's blur radius in texels (at 720 px tall) at the far end of the blur. */
    radius: 4.5,
    /** Distance past the focus over which the blur ramps in, in world units. */
    ramp: 6,
    /** The focus sits this far past the camera's target (the speaker), world units. */
    focusPad: 0.5,
    /** Below this frame rate (from the governor's average) the pass is off. */
    minFps: 45,
    /** Seconds the blur eases in or out. */
    easeS: 0.6,
    /** A phone's width in CSS pixels at or under which the pass is off by default. */
    phoneWidth: 700,
  },
  /** K22: light shafts and dust motes on crisp mornings. */
  rays: {
    shafts: 3,
    /** Shaft card size (world units), opacity and how far from the focus they stand. */
    w: 6.5,
    h: 15,
    opacity: 0.4,
    spread: 7,
    motes: 56,
    moteSize: 0.15,
    /** Mote cloud half-size round the focus (x, z) and height. */
    moteBox: 9,
    moteHeight: 4,
    /** Seconds a mote takes to drift its loop. */
    moteDriftS: 18,
    /** Pixel: card count, opacity, size on the ground plane. */
    pixelBands: 3,
    pixelOpacity: 0.34,
    pixelW: 7,
    pixelH: 13,
  },
  /** K23: cloud shadows in the terrain shader. */
  clouds: {
    /** Darkening at the shadow's core (0..1), the noise scale (1/units) and drift (units/s). */
    strength: 0.2,
    scale: 0.045,
    speed: 0.7,
    /** Daylight darkness at which they fade out entirely. */
    fadeAtDark: 0.35,
  },
  /** K24: the moon's phase by chapter, and what each phase does to the stars. */
  moon: {
    /** Hazel's chapters 1..12. The Long Night (10) is new-moon dark. */
    hazel: [
      'half',
      'crescent',
      'crescent',
      'half',
      'full',
      'half',
      'crescent',
      'half',
      'full',
      'new',
      'crescent',
      'full',
    ],
    /** A separate campaign's chapters by `storyChapter` (0-based), cycled. */
    cycle: ['half', 'full', 'half', 'crescent', 'full', 'half', 'crescent', 'new'],
    /** The Hundred Days' ninth chapter, the Hush, is as dark as the Long Night. */
    hundred9: 'new',
    /** Star brightness by phase (1 is the sky's own). */
    starGain: { new: 1.9, crescent: 1.25, half: 1, full: 0.55 },
    /** Lit share of the disc by phase. */
    lit: { new: 0, crescent: 0.28, half: 0.5, full: 1 },
    /** The moon's angular radius (radians) in the 3D dome. */
    radius: 0.052,
    /** Pixel: the moon overlay canvas, in its own pixels. */
    pixelSize: 32,
  },
  /** K25: snow cover 0..1 by the vigil's wave (index 0 is the vigil's start), then after. */
  snow: {
    byWave: [0.25, 0.6, 1],
    /** Chapter 11, the morning after. */
    afterChapter: 0.5,
    /** Seconds the 3D amount follows a change. */
    easeS: 2.5,
    /** Pixel repaint levels: the cover at which each level starts (level 1..3). */
    levels: [0.2, 0.55, 0.95],
    /** Pixel: the share of the ground each level covers (patchy, most, all). */
    cover: [0.35, 0.7, 1.3],
    /** The snow's colour in 3D. */
    color: '#eef4fb',
  },
  /** K26: path wear by Hazel's chapter (1..12) and by a separate campaign's chapter. */
  wear: {
    /** Wear 0..1 at chapter 12 and the share a separate campaign's last chapter reaches. */
    max: 1,
    campaignMax: 0.8,
    /** Pixel levels: wear at which each level starts. */
    levels: [0.3, 0.6, 0.9],
    /** Pixel: how much wider the paths paint at full wear (a share of their width). */
    widen: 0.7,
  },
  /** K34: puddles. Seconds of rain to a full set, and seconds to dry. */
  wet: {
    riseS: 45,
    dryS: 40,
    /** Pixel puddle steps: the wetness at which each of three sets shows. */
    steps: [0.15, 0.5, 0.85],
    /** 3D: instanced puddle count, size range (world units) and how far from the focus. */
    puddles: 26,
    minR: 0.8,
    maxR: 1.8,
    range: 17,
    /** 3D ground darkening at full wetness. */
    darken: 0.28,
    /** Pixel puddle sprite size. */
    pixelW: 2.4,
    /** Pixel: where the puddles lie, four to a step (open grass west of the pond). */
    pixelSpots: [
      { x: -2, z: 3, s: 1 },
      { x: -6, z: 6, s: 0.8 },
      { x: 0, z: -3, s: 0.9 },
      { x: -9, z: 2, s: 1.1 },
      { x: -5, z: -6, s: 0.9 },
      { x: -1, z: -9, s: 1 },
      { x: 2, z: -6, s: 0.8 },
      { x: -12, z: 9, s: 1 },
      { x: -3, z: 11, s: 0.9 },
      { x: -11, z: -1, s: 1.1 },
      { x: 1, z: 1, s: 0.8 },
      { x: -7, z: -10, s: 1 },
    ],
  },
  /** K35: one wind for the grass, bunting, banners and coat tails. */
  wind: {
    /** Direction (radians, world; 0 blows toward +x). */
    dir: 0.45,
    /** Lean always on, and the extra a windy scene adds (blade height units). */
    lean: 0.06,
    leanWindy: 0.2,
    gust: 0.1,
    gustWindy: 0.28,
    /** A gust's speed (rad/s) and ripple scale across the ground. */
    gustHz: 1.8,
    ripple: 0.3,
    /** Seconds the strength eases between scenes. */
    easeS: 1.5,
  },
  /** K35, pixel: the two-frame sway of bushes and banners (world units). */
  windPx: { frameMs: 700, swing: 0.03, leanShare: 0.5 },
} as const;
