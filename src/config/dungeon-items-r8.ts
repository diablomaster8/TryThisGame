/**
 * Lane B round 8, the "items" group: gear effects the sim reads (R0164), stash tabs (R0174),
 * charms in sockets (R0173), the Gardener's Wheelbarrow (R0177), the key set (R0183) and the
 * named sets and uniques (R0172). Every tunable number for those lives here; names and lines
 * live in `strings-hollow-r8-items.ts`.
 */
import type { GearSlot, GearStat } from './dungeon-loot';

/** R0164: how the worn stats that are not Hollow-only touch the Grove and the fights. */
export const GEAR_EFFECTS = {
  /** Snug: happiness a minute per point (the Nubbin's own gear plus the Keeper's). */
  snugPerMinute: 0.3,
  /** Snug never lifts happiness past this; it soothes, it does not stack forever. */
  snugCap: 60,
  /** Naps: share of the energy drain saved per point, up to `napsMax`. */
  napsPerPoint: 0.04,
  napsMax: 0.5,
  /** Brave: party fight weight per point (Keeper's and each party member's). */
  bravePower: 1,
  /** Crumbs: the fruit stat is the chance a tree shake drops one extra fruit, up to this. */
  fruitMax: 0.6,
  /** Boots and Bouncy: the walk-speed bonus never passes this. */
  speedMax: 0.6,
};

/** R0174: the stash's tabs. */
export const STASH = {
  tabs: 4,
  /** One more tab for each act boss's first win, up to `maxTabs`. */
  maxTabs: 9,
  perTab: 40,
  /** How near the cottage door the Grove's chest opens (world units from its centre). */
  cottageReach: 5,
};

// ------------------------------------------------------------------ R0173: charms in sockets

export type CharmType =
  'acorn' | 'pebble' | 'shell' | 'feather' | 'berry' | 'snowflake' | 'sunbeam' | 'moonbeam';

export const CHARM_TYPES: readonly CharmType[] = [
  'acorn',
  'pebble',
  'shell',
  'feather',
  'berry',
  'snowflake',
  'sunbeam',
  'moonbeam',
];

/** Grades: 1 chipped, 2 bright, 3 perfect; a charm's effect is its value × grade. */
export const CHARM_GRADES = 3;

/** What a charm gives in a Keeper piece, and in a Nubbin piece. */
export const CHARMS: Record<
  CharmType,
  { keeper: { stat: GearStat; value: number }; nubbin: { stat: GearStat; value: number } }
> = {
  acorn: { keeper: { stat: 'pickup', value: 0.1 }, nubbin: { stat: 'snug', value: 1 } },
  pebble: { keeper: { stat: 'explore', value: 0.5 }, nubbin: { stat: 'brave', value: 1 } },
  shell: { keeper: { stat: 'shells', value: 1 }, nubbin: { stat: 'snug', value: 1 } },
  feather: { keeper: { stat: 'speed', value: 0.05 }, nubbin: { stat: 'energy', value: 1 } },
  berry: { keeper: { stat: 'fruit', value: 0.05 }, nubbin: { stat: 'snug', value: 1 } },
  snowflake: { keeper: { stat: 'explore', value: 0.5 }, nubbin: { stat: 'energy', value: 1 } },
  sunbeam: { keeper: { stat: 'mf', value: 8 }, nubbin: { stat: 'brave', value: 1 } },
  moonbeam: { keeper: { stat: 'snug', value: 1 }, nubbin: { stat: 'brave', value: 1 } },
};

export const SOCKETS = {
  /** Socket count weights for 0, 1, 2 and 3 sockets (Plain and Shiny pieces only). */
  weights: [50, 30, 15, 5] as readonly number[],
  max: 3,
  /** Chance a pick of each drop table also drops a charm, and the grade weights. */
  dropChance: { 'pack-normal': 0.06, 'pack-champion': 0.15, 'pack-boss': 1 } as Record<
    string,
    number
  >,
  gradeWeights: [80, 18, 2] as readonly number[],
};

/** Charm Chains (runewords): this exact order in a piece of this slot with exactly as many sockets. */
export interface ChainDef {
  id: string;
  slot: GearSlot;
  order: readonly CharmType[];
  bonus: ReadonlyArray<{ stat: GearStat; value: number }>;
}

export const CHAINS: readonly ChainDef[] = [
  {
    id: 'picnic-pack',
    slot: 'backpack',
    order: ['acorn', 'berry', 'sunbeam'],
    bonus: [
      { stat: 'snug', value: 3 },
      { stat: 'energy', value: 3 },
    ],
  },
  {
    id: 'zephyr-boots',
    slot: 'boots',
    order: ['feather', 'feather', 'sunbeam'],
    bonus: [{ stat: 'speed', value: 0.12 }],
  },
  {
    id: 'starlight-lantern',
    slot: 'lantern',
    order: ['moonbeam', 'sunbeam'],
    bonus: [{ stat: 'explore', value: 3 }],
  },
  {
    id: 'beachcomber-gloves',
    slot: 'gloves',
    order: ['shell', 'shell', 'pebble'],
    bonus: [{ stat: 'shells', value: 3 }],
  },
  {
    id: 'owl-satchel',
    slot: 'satchel',
    order: ['acorn', 'moonbeam'],
    bonus: [{ stat: 'pickup', value: 0.4 }],
  },
  {
    id: 'hero-band',
    slot: 'bracelet',
    order: ['pebble', 'sunbeam'],
    bonus: [{ stat: 'brave', value: 4 }],
  },
];

// ------------------------------------------------------------ R0177: the Gardener's Wheelbarrow

export const WHEELBARROW = {
  slots: 6,
  /** The Act II quest (act index 1) opens it, or that act's boss beaten. */
  unlockAct: 1,
};

export type RecipeId =
  | 'charm-up'
  | 'shiny-to-fancy'
  | 'reroll'
  | 'add-socket'
  | 'essence-critter'
  | 'set-swap'
  | 'pillow-fort';

/** The recipe book's order. */
export const RECIPES: readonly RecipeId[] = [
  'charm-up',
  'shiny-to-fancy',
  'reroll',
  'add-socket',
  'essence-critter',
  'set-swap',
  'pillow-fort',
];

// ------------------------------------------------------------------- R0183: the key set

export type KeyId = 'giggles' | 'yawns' | 'brrr';

/** Each key's source: a named unique's id or an act boss's id. Brisk or Wild only. */
export const KEYS: Record<KeyId, { source: string }> = {
  giggles: { source: 'captain-crumbs' },
  yawns: { source: 'fluffhotep' },
  brrr: { source: 'yeti-spaghetti' },
};

export const KEY_DROPS = {
  chance: 1 / 8,
  /** The pity counter: the key is certain by this kill. */
  pity: 10,
};

// ------------------------------------------------------------ R0172: sets and uniques

export interface SetPieceDef {
  id: string;
  set: string;
  slot: GearSlot;
}

export interface SetDef {
  id: string;
  pieces: readonly string[];
  /** Bonuses at piece counts (the last one is the full set). */
  bonuses: ReadonlyArray<{ at: number; stat: GearStat; value: number }>;
}

export const SET_PIECES: readonly SetPieceDef[] = [
  { id: 'gran-trowel', set: 'gran', slot: 'charm' },
  { id: 'gran-sunhat', set: 'gran', slot: 'scarf' },
  { id: 'gran-gloves', set: 'gran', slot: 'gloves' },
  { id: 'gran-wellies', set: 'gran', slot: 'boots' },
  { id: 'night-lantern', set: 'night', slot: 'lantern' },
  { id: 'night-scarf', set: 'night', slot: 'scarf' },
  { id: 'night-satchel', set: 'night', slot: 'satchel' },
  { id: 'yeti-scarf', set: 'yeti', slot: 'scarf' },
  { id: 'yeti-meatball', set: 'yeti', slot: 'bracelet' },
  { id: 'pharaoh-scarf', set: 'pharaoh', slot: 'scarf' },
  { id: 'pharaoh-pillow', set: 'pharaoh', slot: 'backpack' },
  { id: 'pharaoh-mask', set: 'pharaoh', slot: 'charm' },
  { id: 'moo-blanket', set: 'moo', slot: 'backpack' },
  { id: 'moo-cowprint', set: 'moo', slot: 'bracelet' },
  { id: 'moo-bell', set: 'moo', slot: 'charm' },
  { id: 'topiary-helm', set: 'topiary', slot: 'scarf' },
  { id: 'topiary-shield', set: 'topiary', slot: 'charm' },
];

export const SETS: readonly SetDef[] = [
  {
    id: 'gran',
    pieces: ['gran-trowel', 'gran-sunhat', 'gran-gloves', 'gran-wellies'],
    bonuses: [
      { at: 2, stat: 'snug', value: 2 },
      { at: 3, stat: 'shells', value: 2 },
      // Full set: +1 fruit a tree shake (a certain extra fruit).
      { at: 4, stat: 'fruit', value: 1 },
    ],
  },
  {
    id: 'night',
    pieces: ['night-lantern', 'night-scarf', 'night-satchel'],
    bonuses: [
      { at: 2, stat: 'pickup', value: 0.3 },
      { at: 3, stat: 'explore', value: 3 },
    ],
  },
  {
    id: 'yeti',
    pieces: ['yeti-scarf', 'yeti-meatball'],
    bonuses: [{ at: 2, stat: 'brave', value: 3 }],
  },
  {
    id: 'pharaoh',
    pieces: ['pharaoh-scarf', 'pharaoh-pillow', 'pharaoh-mask'],
    bonuses: [
      { at: 2, stat: 'snug', value: 2 },
      // Full set: the naps stat (energy lasts half as long again).
      { at: 3, stat: 'energy', value: 8 },
    ],
  },
  {
    id: 'moo',
    pieces: ['moo-blanket', 'moo-cowprint', 'moo-bell'],
    bonuses: [
      { at: 2, stat: 'fruit', value: 0.1 },
      { at: 3, stat: 'mf', value: 40 },
    ],
  },
  {
    id: 'topiary',
    pieces: ['topiary-helm', 'topiary-shield'],
    bonuses: [{ at: 2, stat: 'brave', value: 3 }],
  },
];

export interface UniqueItemDef {
  id: string;
  slot: GearSlot;
  stats: ReadonlyArray<{ stat: GearStat; value: number }>;
}

export const UNIQUE_ITEMS: readonly UniqueItemDef[] = [
  { id: 'tea-cosy', slot: 'scarf', stats: [{ stat: 'brave', value: 2 }] },
  { id: 'puddle-jumpers', slot: 'boots', stats: [{ stat: 'speed', value: 0.12 }] },
  { id: 'grans-nightlight', slot: 'lantern', stats: [{ stat: 'explore', value: 3 }] },
  {
    id: 'sticky-mittens',
    slot: 'gloves',
    stats: [
      { stat: 'shells', value: 3 },
      { stat: 'pickup', value: 0.3 },
    ],
  },
  { id: 'bottomless-bag', slot: 'satchel', stats: [{ stat: 'pickup', value: 0.6 }] },
  { id: 'very-long-scarf', slot: 'scarf', stats: [{ stat: 'snug', value: 3 }] },
  { id: 'four-leaf-locket', slot: 'charm', stats: [{ stat: 'mf', value: 30 }] },
  {
    id: 'friendship-band',
    slot: 'bracelet',
    stats: [
      { stat: 'brave', value: 3 },
      { stat: 'snug', value: 2 },
    ],
  },
  { id: 'snack-sack', slot: 'backpack', stats: [{ stat: 'carry', value: 3 }] },
  {
    id: 'slippers-of-haste',
    slot: 'boots',
    stats: [
      { stat: 'speed', value: 0.1 },
      { stat: 'energy', value: 2 },
    ],
  },
  {
    id: 'firefly-jar',
    slot: 'lantern',
    stats: [
      { stat: 'explore', value: 2 },
      { stat: 'mf', value: 10 },
    ],
  },
  {
    id: 'gardeners-gauntlets',
    slot: 'gloves',
    stats: [
      { stat: 'fruit', value: 0.15 },
      { stat: 'shells', value: 1 },
    ],
  },
  {
    id: 'conker-pouch',
    slot: 'satchel',
    stats: [
      { stat: 'pickup', value: 0.3 },
      { stat: 'shells', value: 2 },
    ],
  },
  {
    id: 'stripy-comforter',
    slot: 'scarf',
    stats: [
      { stat: 'snug', value: 2 },
      { stat: 'energy', value: 2 },
    ],
  },
  {
    id: 'pebble-of-plenty',
    slot: 'charm',
    stats: [
      { stat: 'mf', value: 20 },
      { stat: 'brave', value: 1 },
    ],
  },
  { id: 'daisy-chain', slot: 'bracelet', stats: [{ stat: 'snug', value: 3 }] },
  { id: 'nap-sack', slot: 'backpack', stats: [{ stat: 'energy', value: 4 }] },
  {
    id: 'wellies-of-wading',
    slot: 'boots',
    stats: [
      { stat: 'speed', value: 0.08 },
      { stat: 'explore', value: 1 },
    ],
  },
  {
    id: 'acorn-of-ages',
    slot: 'charm',
    stats: [
      { stat: 'brave', value: 2 },
      { stat: 'energy', value: 2 },
    ],
  },
  { id: 'conker-cuff', slot: 'bracelet', stats: [{ stat: 'brave', value: 4 }] },
];

/** A Legendary roll becomes one of the uniques this often (else the usual two-affix piece). */
export const UNIQUE_SHARE = 0.5;
