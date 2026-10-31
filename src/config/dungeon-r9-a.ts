/**
 * Lane B round 9, helper a: the Hollow's looks in both renderers. Every number for the
 * uniques' own looks (R0156), the acorn portal (R0150), the guide's footprints on the cave
 * floor (R0208), the Keeper's light ring and each act's colours (R0190) lives here. Colours
 * for creatures are palette names (`render/sprites/palette.ts`, `C`); cave colours are hex,
 * as in the depth bands (`GROVE3D.cave.bands`).
 */

/**
 * A named unique's own look (R0156): its foe species recoloured, grown and given a hat or
 * prop, so it never reads as one more of its pack. `hat` is a creature extra kind
 * (`render/sprites/creature-extras.ts`); every unique wears one, the crown for the grand.
 */
export interface UniqueLook {
  body: string;
  shade: string;
  belly?: string;
  accent: string;
  accent2: string;
  /** Size over the species' own (the leader of a pack stands taller than its minions). */
  size: number;
  hat: string;
  hatC: string;
  hatC2?: string;
}

export const UNIQUE_LOOKS: Readonly<Record<string, UniqueLook>> = {
  'sir-snorts': {
    body: 'bark',
    shade: 'darkBark',
    accent: 'sunYellow',
    accent2: 'ember',
    size: 1.3,
    hat: 'crown',
    hatC: 'sunYellow',
    hatC2: 'ember',
  },
  mumblemoss: {
    body: 'forest',
    shade: 'deepGreen',
    belly: 'leafLight',
    accent: 'leaf',
    accent2: 'sprout',
    size: 1.35,
    hat: 'leafTuft',
    hatC: 'leaf',
    hatC2: 'sprout',
  },
  'captain-crumbs': {
    body: 'greyLight',
    shade: 'greyDeep',
    accent: 'wood',
    accent2: 'sand',
    size: 1.25,
    hat: 'cap',
    hatC: 'nightBlue',
    hatC2: 'sunYellow',
  },
  willowby: {
    body: 'leafLight',
    shade: 'leafDeep',
    accent: 'skyLight',
    accent2: 'water',
    size: 1.4,
    hat: 'leafTuft',
    hatC: 'leafDeep',
    hatC2: 'skyLight',
  },
  snapdragon: {
    body: 'roseLight',
    shade: 'roseDeep',
    accent: 'sunYellow',
    accent2: 'orange',
    size: 1.3,
    hat: 'bigFlower',
    hatC: 'rose',
    hatC2: 'sunYellow',
  },
  'count-compost': {
    body: 'darkBark',
    shade: 'darkPlum',
    accent: 'violet',
    accent2: 'sunYellow',
    size: 1.3,
    hat: 'crown',
    hatC: 'violet',
    hatC2: 'sunYellow',
  },
  'dune-buggy': {
    body: 'sandLight',
    shade: 'sandDeep',
    accent: 'teal',
    accent2: 'orange',
    size: 1.3,
    hat: 'antennae',
    hatC: 'tealDeep',
    hatC2: 'orange',
  },
  'sandy-claws': {
    body: 'ember',
    shade: 'berry',
    accent: 'white',
    accent2: 'sunYellow',
    size: 1.35,
    hat: 'bucketHat',
    hatC: 'ember',
    hatC2: 'white',
  },
  'sphinx-kitten': {
    body: 'sunLight',
    shade: 'sunDeep',
    accent: 'tealLight',
    accent2: 'nightBlue',
    size: 1.3,
    hat: 'crown',
    hatC: 'teal',
    hatC2: 'sunYellow',
  },
  'brr-nadette': {
    body: 'skyLight',
    shade: 'skyDeep',
    belly: 'white',
    accent: 'roseLight',
    accent2: 'white',
    size: 1.3,
    hat: 'bucketHat',
    hatC: 'roseLight',
    hatC2: 'white',
  },
  'sir-shivers': {
    body: 'white',
    shade: 'skyDeep',
    accent: 'skyLight',
    accent2: 'roseDeep',
    size: 1.35,
    hat: 'plume',
    hatC: 'roseLight',
    hatC2: 'skyLight',
  },
  'icicle-choir': {
    body: 'tealLight',
    shade: 'tealDeep',
    belly: 'white',
    accent: 'white',
    accent2: 'skyLight',
    size: 1.3,
    hat: 'crown',
    hatC: 'white',
    hatC2: 'skyLight',
  },
  // Act V's Hush Siblings: greyed Nubbin-shaped echoes, each keeping one warm colour.
  'hush-one': {
    body: 'greyLight',
    shade: 'greyDeep',
    accent: 'roseLight',
    accent2: 'lilacGrey',
    size: 1.25,
    hat: 'flowers',
    hatC: 'roseLight',
    hatC2: 'sunLight',
  },
  'hush-two': {
    body: 'lilacGrey',
    shade: 'greyDeep',
    accent: 'sunLight',
    accent2: 'greyLight',
    size: 1.3,
    hat: 'flowers',
    hatC: 'sunLight',
    hatC2: 'roseLight',
  },
  'hush-three': {
    body: 'greyLight',
    shade: 'dusk',
    accent: 'tealLight',
    accent2: 'lilacGrey',
    size: 1.35,
    hat: 'crown',
    hatC: 'greyLight',
    hatC2: 'tealLight',
  },
};

/**
 * The Homing Acorn portal (R0150): a sprouting acorn ringed by a turning leaf-swirl, at the
 * return spot while the portal is open (beside where the Keeper came up in the Grove, or by
 * the camp's waypoint stone), and briefly on the floor where it closes behind the party.
 */
export const PORTAL_R9 = {
  /** World offset from the return spot, so the portal never stands on the Keeper. */
  offset: { x: 1.4, z: 0.6 },
  /** How long the closing portal lingers on the floor after stepping back, ms. */
  closeMs: 1600,
  /** Billboard size in world units, and the leaf ring's radius. */
  size: 1.6,
  ring: 1.15,
  /** Leaf-swirl turn speed, radians a second (still under reduced motion). */
  spin: 1.6,
} as const;

/** The guide's footprints on the cave floor (R0208), drawn on the path's footprint cells. */
export const FOOTPRINT_R9 = {
  /** World size of one print. */
  size: 0.85,
  /** Sideways offset of a left or right print from the path line. */
  side: 0.22,
  /** Opacity, and the soft travelling pulse's depth and speed (static under reduced motion). */
  opacity: 0.85,
  pulse: 0.3,
  pulseCellsPerSec: 4,
} as const;

/** The Keeper's light ring (R0190): a faint circle on the cave floor at the sight radius. */
export const LIGHT_RING_R9 = {
  opacity: 0.22,
  /** Ring width as a share of the radius. */
  width: 0.08,
} as const;

/**
 * Each act's colours (R0190, DUNG-47), laid over the depth band for that act's dungeon
 * floors and side caves (camps and fields keep the open sky). `lamp` tints the Keeper's
 * light. The Gloom starts at `saturation` and re-saturates as its packs are warmed.
 */
export interface ActLook {
  background: string;
  hemiSky: string;
  hemiGround: string;
  key: string;
  torch: string;
  grade: string;
  rock: string;
  moss: string;
  crystal: string;
  floor: string;
  rim: string;
  glow: string;
  lamp: string;
  /** Starting colour saturation of the floor (1 = full colour). */
  saturation: number;
}

export const ACT_LOOKS: Readonly<Record<string, ActLook>> = {
  // Rootways: warm stone.
  rootways: {
    background: '#2a2018',
    hemiSky: '#e0c8a8',
    hemiGround: '#6a4a30',
    key: '#ffd8b0',
    torch: '#ffa050',
    grade: '#fff0e0',
    rock: '#9a7a5e',
    moss: '#7a8a4a',
    crystal: '#ffc890',
    floor: '#94806c',
    rim: '#c8a484',
    glow: '#ffc070',
    lamp: '#ffe8c8',
    saturation: 1,
  },
  // Cloister: moss green and lantern gold.
  cloister: {
    background: '#1a2a1e',
    hemiSky: '#b8e0a8',
    hemiGround: '#3e5a30',
    key: '#e8f0b0',
    torch: '#ffc840',
    grade: '#f8ffe8',
    rock: '#6e7e5a',
    moss: '#4e9a40',
    crystal: '#ffd860',
    floor: '#7c8a6c',
    rim: '#c8d890',
    glow: '#ffd050',
    lamp: '#fff0b0',
    saturation: 1,
  },
  // Sandglass: ochre and turquoise.
  sandglass: {
    background: '#2e2616',
    hemiSky: '#a8e8e0',
    hemiGround: '#7a5a28',
    key: '#ffe0a0',
    torch: '#ffb050',
    grade: '#fff6e0',
    rock: '#b08a4e',
    moss: '#3aa89a',
    crystal: '#50e0d0',
    floor: '#b49a6a',
    rim: '#60d8c8',
    glow: '#70e8d8',
    lamp: '#fff0c8',
    saturation: 1,
  },
  // Frostbell: blue-white with pink light.
  frostbell: {
    background: '#1e2a3a',
    hemiSky: '#e0f0ff',
    hemiGround: '#5a6a8a',
    key: '#ffd8e8',
    torch: '#ff9ac0',
    grade: '#f4f8ff',
    rock: '#a0b4cc',
    moss: '#d8e8f8',
    crystal: '#ffb8d8',
    floor: '#b4c4d8',
    rim: '#ffd0e8',
    glow: '#ffb0d0',
    lamp: '#ffe0ee',
    saturation: 1,
  },
  // Gloom: desaturated grey with warm hearth spots; colour comes back as packs are warmed.
  gloom: {
    background: '#22201e',
    hemiSky: '#c8c0b8',
    hemiGround: '#5a4a3a',
    key: '#ffd0a0',
    torch: '#ff9840',
    grade: '#fff0e0',
    rock: '#7a7068',
    moss: '#6a8a5a',
    crystal: '#ffb070',
    floor: '#80786e',
    rim: '#b0a090',
    glow: '#ffa050',
    lamp: '#ffd8a8',
    saturation: 0.2,
  },
};
