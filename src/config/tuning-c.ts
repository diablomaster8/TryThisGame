/**
 * Tunables for campaign-graphics package c, story places (re-exported from tuning.ts):
 * Corvin's garden (C8, H15), the Hollow camp and the ledge (H5), the Long Night's held
 * effects (H6), the memorial hill (H7), breath puffs and footprints (N2, N3). Both
 * renderers read the same coordinates, so a place is the same place in either.
 */
export const CG_C = {
  corvin: {
    /** Corvin's grey house, north of the pens, door toward +z (the `corvin-door` mark). */
    house: { x: 0, z: -12.6, w: 6.4, d: 4.2, h: 2.4 },
    /** The garden's gate, south of the pens (the `corvin-gate` mark): posts either side. */
    gate: { x: 0, z: 5, half: 1.5 },
    /** Each pen's gate leaf hangs on the east wall, hinged at its middle. */
    leaf: { x: 10, len: 2.76, openRad: 1.45, swing: 4 },
    /** Painted numbers: how many the atlas holds, and the first. */
    numbers: { count: 40, first: 1 },
    /** The ring of frosted trees round the plane and the low hills past them. */
    backdrop: { trees: 56, rMin: 17, rMax: 30, hillR: 44, hillH: 6.5 },
    /** Frost on the earth: tint of the frost, and its noise scale per metre. */
    frost: { color: '#eef4fb', scale: 0.55, cover: 0.62 },
  },
  hollow: {
    /** The cold fire ring and the loose arc of a dozen bowls round it. */
    fire: { x: -3.4, z: -6.4, r: 0.9 },
    bowls: { count: 12, r: 2.3, from: 175, to: 355 },
    stone: { x: -9, z: -9 },
  },
  ledge: {
    /** Along the falls' sheet from the lip (0) to the foot (1), and behind it. */
    along: 0.88,
    behind: 1.0,
    width: 2.8,
  },
  hill: {
    /** The worn path up hill[0] follows its ramp (`rampPath`, MOVE-09); this is its width. */
    pathWidth: 0.9,
    /** The flat stone halfway up (the `flat-stone` mark) and the crest tree at the top. */
    crest: { dx: 1.2, dz: 1.0 },
    /** Briar's flower: scale over the plain memorial flower, and the stone ring. */
    briar: { scale: 1.7, ring: 9, ringR: 0.62 },
  },
  fx: {
    /** Seconds a held effect takes to settle (snapped under reduced motion). */
    settle: 1.4,
    stone: '#59b8ff',
    frostFall: { shallow: '#dff1ff', deep: '#a9c9e6', foam: '#ffffff' },
    gold: { shallow: '#ffe38a', deep: '#d9902a', foam: '#fff4c2' },
  },
  breath: {
    /** Seconds between puffs at each head, how long one lives, and how many heads. */
    every: 3,
    life: 1.5,
    heads: 12,
    size: 0.65,
    alpha: 0.85,
  },
  prints: {
    /** The most prints on the ground, and how far the Keeper walks between two. */
    cap: 30,
    stride: 0.7,
    size: 0.65,
  },
} as const;
