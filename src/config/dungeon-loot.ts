/**
 * Hollow loot (R0163, DUNG-23) and gear (R0164, DUNG-24): rarity tiers, item bases by slot,
 * the cosy affix list and the drop tables packs roll on. Every tier has a shape as well as a
 * colour, so colour is never the only signal. Names live in `strings-dungeon.ts`.
 */

export type RarityId = 'plain' | 'shiny' | 'fancy' | 'legendary' | 'set' | 'charm';

export interface RarityDef {
  id: RarityId;
  glyph: string;
  colour: string;
  /** Affix count range (fixed tiers carry their own). */
  affixes: readonly [number, number];
  /** Share of gear drops before magic find (charms come from their own table entry). */
  rate: number;
}

export const RARITIES: readonly RarityDef[] = [
  { id: 'plain', glyph: '●', colour: '#f2f2f2', affixes: [0, 0], rate: 0.7 },
  { id: 'shiny', glyph: '◆', colour: '#6fa8ff', affixes: [1, 2], rate: 0.22 },
  { id: 'fancy', glyph: '⬟', colour: '#ffd84a', affixes: [3, 4], rate: 0.065 },
  { id: 'legendary', glyph: '★', colour: '#e8a33c', affixes: [2, 2], rate: 0.01 },
  { id: 'set', glyph: '✿', colour: '#5fd27a', affixes: [2, 2], rate: 0.005 },
  { id: 'charm', glyph: '⬢', colour: '#b07cff', affixes: [1, 1], rate: 0 },
];

/** The Keeper's slots and the Nubbins' (the hat slot stays `inventory.hats`). */
export type GearSlot =
  'satchel' | 'boots' | 'lantern' | 'gloves' | 'scarf' | 'charm' | 'bracelet' | 'backpack';

export const KEEPER_SLOTS: readonly GearSlot[] = ['satchel', 'boots', 'lantern', 'gloves', 'scarf'];
export const NUBBIN_SLOTS: readonly GearSlot[] = ['charm', 'bracelet', 'backpack'];

/** What a stat does: Hollow pickups, light and finds (the sim reads these through `gearStat`). */
export type GearStat =
  | 'pickup'
  | 'speed'
  | 'explore'
  | 'shells'
  | 'mf'
  | 'snug'
  | 'brave'
  | 'fruit'
  | 'energy'
  | 'carry';

export interface BaseDef {
  id: string;
  slot: GearSlot;
  /** The stat every item of this base gives, and how much at item level 1 and per level. */
  stat: GearStat | null;
  value: number;
  perLevel: number;
}

export const BASES: readonly BaseDef[] = [
  { id: 'satchel', slot: 'satchel', stat: 'pickup', value: 0.2, perLevel: 0.02 },
  { id: 'boots', slot: 'boots', stat: 'speed', value: 0.05, perLevel: 0.005 },
  { id: 'lantern', slot: 'lantern', stat: 'explore', value: 1, perLevel: 0.1 },
  { id: 'gloves', slot: 'gloves', stat: 'shells', value: 1, perLevel: 0.1 },
  { id: 'scarf', slot: 'scarf', stat: null, value: 0, perLevel: 0 },
  { id: 'charm', slot: 'charm', stat: 'mf', value: 5, perLevel: 0.5 },
  { id: 'bracelet', slot: 'bracelet', stat: 'brave', value: 1, perLevel: 0.1 },
  { id: 'backpack', slot: 'backpack', stat: 'carry', value: 1, perLevel: 0.05 },
];

export interface AffixDef {
  id: string;
  kind: 'prefix' | 'suffix';
  stat: GearStat;
  /** Value at item level 1, and how much each level adds. */
  value: number;
  perLevel: number;
}

export const AFFIXES: readonly AffixDef[] = [
  { id: 'bouncy', kind: 'prefix', stat: 'speed', value: 0.04, perLevel: 0.004 },
  { id: 'sunny', kind: 'prefix', stat: 'shells', value: 1, perLevel: 0.1 },
  { id: 'lucky', kind: 'prefix', stat: 'mf', value: 10, perLevel: 1 },
  { id: 'snug', kind: 'prefix', stat: 'snug', value: 1, perLevel: 0.1 },
  { id: 'brave', kind: 'prefix', stat: 'brave', value: 1, perLevel: 0.1 },
  { id: 'crumbs', kind: 'suffix', stat: 'fruit', value: 0.05, perLevel: 0.005 },
  { id: 'owl', kind: 'suffix', stat: 'explore', value: 1, perLevel: 0.1 },
  { id: 'naps', kind: 'suffix', stat: 'energy', value: 1, perLevel: 0.1 },
];

export type DropEntry = 'gear' | 'shells' | 'essence' | 'critter' | 'egg' | 'charm';

export interface LootTable {
  id: string;
  picks: number;
  /** Weight of nothing at all, beside the entries. */
  noDrop: number;
  entries: ReadonlyArray<{ weight: number; item: DropEntry }>;
}

/** Drop tables by pack reward (`EncounterPack.reward`). */
export const LOOT_TABLES: Record<string, LootTable> = {
  'pack-normal': {
    id: 'pack-normal',
    picks: 1,
    noDrop: 60,
    entries: [
      { weight: 25, item: 'gear' },
      { weight: 10, item: 'shells' },
      { weight: 3, item: 'essence' },
      { weight: 2, item: 'charm' },
    ],
  },
  'pack-champion': {
    id: 'pack-champion',
    picks: 2,
    noDrop: 30,
    entries: [
      { weight: 45, item: 'gear' },
      { weight: 15, item: 'shells' },
      { weight: 6, item: 'essence' },
      { weight: 4, item: 'charm' },
    ],
  },
  'pack-boss': {
    id: 'pack-boss',
    picks: 3,
    noDrop: 0,
    entries: [
      { weight: 70, item: 'gear' },
      { weight: 20, item: 'essence' },
      { weight: 10, item: 'charm' },
    ],
  },
};

export const LOOT = {
  /** Magic find's knee for the rarest tiers: effective MF = MF × knee / (MF + knee). */
  mfKnee: 250,
  /** Gear kept in the satchel at most; the oldest plain piece makes room. */
  carry: 40,
};
