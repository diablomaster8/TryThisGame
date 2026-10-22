/**
 * Tunables for campaign-graphics-2 package y, "light and grade" (re-exported from tuning.ts):
 * the night's dark windows (C5), a calmer dawn grade (H11), lantern posts that go dark in
 * 3D (H13), Dawn & Dusk's two halves (M6), the crisp morning (M10), the shared lantern
 * string (M11) and Logged In's first light and final board (M15).
 */
export const CG2_Y = {
  /** C5: the glass of a house whose windows are out, and of a dawn house with no lamp lit. */
  windows: {
    /** The Grove's window glass emissive when it is lit (the host uses 2.5). */
    lit: 2.5,
    /** The dawn half's crest-house glass: a faint warmth, not a lamp. */
    dawnGlass: 0.22,
    /** The dusk half's crest-house glass, past the bloom threshold. */
    duskGlass: 2.1,
    /** The kit glass' ordinary emissive (kitMaterials). */
    kitGlass: 0.4,
  },

  /** H13: a lamp post's pool of light as a share of full, by state. */
  lamp: {
    lit: 1,
    /** The flicker's two levels, and how fast it steps between them (Hz); still dim when reduced. */
    flickerLow: 0.45,
    flickerHz: 4.5,
    /** A post whose spill lies within this (xz, world units) of a post is that post's. */
    postRadius: 1.2,
  },

  /** M6: Dawn & Dusk's half cues. */
  halves: {
    /** Shutter boards over a crest house's windows: size and the seconds they take to move. */
    shutter: { w: 0.8, h: 0.78, color: '#5a8a6a', slit: '#ffd08a', seconds: 1.3 },
    /** Window centres on a crest house, as shares of its width and wall height. */
    window: { dx: 0.3, dy: 0.55 },
    /** Dew on the green at dawn: how many glints, and the disc they scatter over. */
    dew: { count: 46, radiusShare: 1.5, size: 0.26, opacity: 1, hz: 0.7 },
    /** Chimney smoke: puffs in a column, from the roof, drifting with the air. */
    smoke: { house: 1, puffs: 4, rise: 2.4, size: 1.2, opacity: 0.55, seconds: 5 },
  },

  /** M10: the crisp morning's grade (read by config/campaign-look.ts). */
  crisp: {
    key: '#fff8e8',
    keyAlpha: 0.4,
    shade: '#7d9fd6',
    shadeAlpha: 0.34,
    sat: 0.9,
    bloomBoost: 0.12,
  },

  /** H11: Dawn's grade, held so the ground keeps its hue (about 12 degrees at most). */
  dawn: {
    key: '#ffd2a0',
    keyAlpha: 0.3,
    shade: '#6f8cc8',
    shadeAlpha: 0.3,
    /** The light itself: how far the dawn sun and hemisphere move toward calm, 0..1. */
    sunCalm: 0.55,
    sunColor: '#ffe0b8',
    hemiColor: '#b4c6ee',
    hemiMix: 0.5,
    /** Pixel post pass: scale on the dawn daylight's tint amount. */
    pixelTintScale: 0.45,
  },

  /** M11: the lantern string. */
  string: {
    /** Lanterns per swag, the swag's sag (units) and the pole height. */
    perSwag: 8,
    sag: 0.55,
    poleHeight: 2.9,
    /** Lantern size (3D radius) and glow card size. */
    size: 0.2,
    glow: 0.65,
    glowOpacity: 0.4,
    /** Emissive multiplier on the lantern colours (3D, past the bloom threshold). */
    emissive: 1.15,
    colors: ['#ff5a30', '#ff9a2a', '#ffcf3a', '#ff7048', '#ffb830'],
    /** Each anchor list, by the set it dresses (mark names; the string loops through them). */
    festival: ['festival-1', 'festival-4', 'festival-7', 'festival-10'],
    fold: ['fold-door-1', 'fold-well', 'fold-door-3', 'fold-door-2', 'fold-door-4'],
  },

  /** M15: Logged In's first light and its final board. */
  firstLight: {
    /** The sky's first-light band strength (0..1) and the hours it can show between. */
    strength: 0.85,
    from: 5,
    to: 7.2,
    /** The board's final message: panel size (world units), the lift above its mark, the text. */
    board: {
      w: 3.7,
      h: 2.3,
      lift: 2.45,
      forward: 0.55,
      title: 'LOGGED OUT',
      rows: ['JUNO + YOU', 'SEE YOU OUTSIDE'],
    },
  },
} as const;
