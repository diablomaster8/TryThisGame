/**
 * Hollow foe data (lane B, DUNG): champion and elite modifiers (R0155) and the density rules
 * packs are placed by (R0158). The dungeon side spawns, names and shows these; the battle core
 * (lane C) reads `effect` to turn each modifier into play. Names stay cosy: nothing cursed,
 * nothing bloody. Every modifier has an icon as well as a word, so colour is never the only
 * signal.
 */
import type { NubbinType } from '../sim/types';

export type ChampionModId =
  | 'zoomy'
  | 'bigBiceps'
  | 'grumpyCloud'
  | 'bouncy'
  | 'sticky'
  | 'sparkly'
  | 'copycat'
  | 'snackThief'
  | 'hiding'
  | 'bossy';

export interface ChampionModDef {
  id: ChampionModId;
  name: string;
  /** Shown on the name plate beside the word. */
  icon: string;
  /** The look in the world (for the renderers' tells). */
  tell: string;
  /**
   * What the battle core should do with it (lane C maps these; all shares are fractions):
   * speed, power and damage-taken multipliers, a curse on the target, slow-on-hit, a chain
   * hit when struck, an extra weak attack, fruit stolen on a loss, a hop to another spot, and
   * an aura for packmates.
   */
  effect: {
    speed?: number;
    power?: number;
    damageTaken?: number;
    curse?: { targetPower: number; turns: number };
    slowOnHit?: boolean;
    chainOnStruck?: number;
    extraWeakAttack?: number;
    stealFruitOnLoss?: number;
    hops?: boolean;
    aura?: { power: number };
  };
}

export const CHAMPION_MODS: readonly ChampionModDef[] = [
  {
    id: 'zoomy',
    name: 'Zoomy',
    icon: '»',
    tell: 'speed lines, a tiny trail',
    effect: { speed: 0.3 },
  },
  {
    id: 'bigBiceps',
    name: 'Big Biceps',
    icon: '✊',
    tell: 'flexing, sweatband',
    effect: { power: 0.4 },
  },
  {
    id: 'grumpyCloud',
    name: 'Grumpy Cloud',
    icon: '☁',
    tell: 'a little raincloud overhead',
    effect: { curse: { targetPower: -0.15, turns: 3 } },
  },
  {
    id: 'bouncy',
    name: 'Bouncy',
    icon: '◍',
    tell: 'wobbly jelly shine',
    effect: { damageTaken: -0.3 },
  },
  { id: 'sticky', name: 'Sticky', icon: '♒', tell: 'honey drips', effect: { slowOnHit: true } },
  {
    id: 'sparkly',
    name: 'Sparkly',
    icon: '✧',
    tell: 'static sparkles',
    effect: { chainOnStruck: 0.1 },
  },
  {
    id: 'copycat',
    name: 'Copycat',
    icon: '⧉',
    tell: 'two shadow copies',
    effect: { extraWeakAttack: 0.35 },
  },
  {
    id: 'snackThief',
    name: 'Snack Thief',
    icon: '⁂',
    tell: 'crumbs',
    effect: { stealFruitOnLoss: 1 },
  },
  {
    id: 'hiding',
    name: 'Hiding',
    icon: '◌',
    tell: 'puffs to another spot on its turn',
    effect: { hops: true },
  },
  {
    id: 'bossy',
    name: 'Bossy',
    icon: '♛',
    tell: 'a crown of leaves',
    effect: { aura: { power: 0.2 } },
  },
];

export function championMod(id: ChampionModId): ChampionModDef {
  return CHAMPION_MODS.find((m) => m.id === id)!;
}

/** The name plate's shape by pack kind: a champion ◆, an elite ◈, a unique or boss ★. */
export const PLATE_GLYPH = {
  normal: '',
  champion: '◆',
  elite: '◈',
  unique: '★',
  boss: '★',
} as const;

/**
 * Pack density and placement (R0158). Packs per 1,000 dry cells by floor kind; pack sizes by
 * difficulty (the tier picked at the cave mouth, R0179); spacing in cells; the mix of kinds; the
 * foe level's base per act (level = act base + level in act + difficulty offset); and how
 * many modifiers each kind rolls.
 */
export const DENSITY = {
  perThousand: { outdoor: 3, dungeon: 1.6, boss: 1.2 },
  size: { cosy: [2, 3], brisk: [3, 4], wild: [3, 5] } as const,
  difficultyOffset: { cosy: 0, brisk: 35, wild: 70 } as const,
  spacing: 10,
  fromEntry: 8,
  fromWaypoint: 8,
  mix: { champion: 0.15, elite: 0.05 },
  actBase: [1, 8, 16, 24, 32] as const,
  /** Endless-Hollow floors count as acts of this many levels for the level base. */
  endlessActLevels: 5,
  mods: { champion: 1, elite: [2, 3] as const, wildBonus: 1 },
  tries: 600,
} as const;

export type Difficulty = keyof typeof DENSITY.size;

/**
 * The named uniques (R0156, DUNG-16): three per act, each with a fixed place (an act level,
 * 1-based, never the boss's), fixed modifiers, a few minions and a one-time first-win bonus
 * in Shells. Names and captions are in `UNIQUE_TEXT` (strings-dungeon.ts); the look is a
 * foe species picked from the id, so it is the same in every seed.
 */
export interface UniqueDef {
  id: string;
  act: number;
  level: number;
  mods: readonly ChampionModId[];
  minions: number;
  bonus: number;
}

export const UNIQUES: readonly UniqueDef[] = [
  { id: 'sir-snorts', act: 0, level: 1, mods: ['zoomy', 'bigBiceps'], minions: 1, bonus: 40 },
  { id: 'mumblemoss', act: 0, level: 2, mods: ['grumpyCloud'], minions: 2, bonus: 40 },
  { id: 'captain-crumbs', act: 0, level: 2, mods: ['snackThief'], minions: 2, bonus: 40 },
  { id: 'willowby', act: 1, level: 1, mods: ['sticky'], minions: 1, bonus: 60 },
  { id: 'snapdragon', act: 1, level: 2, mods: ['zoomy', 'sparkly'], minions: 2, bonus: 60 },
  { id: 'count-compost', act: 1, level: 2, mods: ['grumpyCloud', 'bossy'], minions: 2, bonus: 60 },
  { id: 'dune-buggy', act: 2, level: 1, mods: ['zoomy'], minions: 2, bonus: 80 },
  { id: 'sandy-claws', act: 2, level: 2, mods: ['bouncy', 'bigBiceps'], minions: 1, bonus: 80 },
  { id: 'sphinx-kitten', act: 2, level: 3, mods: ['hiding', 'copycat'], minions: 1, bonus: 80 },
  { id: 'brr-nadette', act: 3, level: 1, mods: ['sticky', 'sparkly'], minions: 2, bonus: 100 },
  { id: 'sir-shivers', act: 3, level: 2, mods: ['bouncy'], minions: 2, bonus: 100 },
  { id: 'icicle-choir', act: 3, level: 3, mods: ['copycat', 'bossy'], minions: 3, bonus: 100 },
  { id: 'hush-one', act: 4, level: 1, mods: ['hiding'], minions: 1, bonus: 130 },
  { id: 'hush-two', act: 4, level: 2, mods: ['hiding', 'copycat'], minions: 1, bonus: 130 },
  { id: 'hush-three', act: 4, level: 2, mods: ['hiding', 'grumpyCloud'], minions: 2, bonus: 130 },
];

/**
 * Foe families per act (R0157, DUNG-17): four rascally families each, never the player's own
 * Nubbins. `look` is the stand-in species a family borrows (its stats and its sprite) until
 * lane E draws the families themselves; `type` is the family's lean. Act V's Greylings are the
 * earlier families colour-drained (`actFamilies` builds them), old friends stilled by the cold.
 */
export interface FoeFamilyDef {
  id: string;
  act: number;
  look: string;
  type: NubbinType;
  /** An Act V Greyling: drawn colour-drained. */
  grey?: true;
}

export const FOE_FAMILIES: readonly FoeFamilyDef[] = [
  { id: 'grubble', act: 0, look: 'leafgrub', type: 'run' },
  { id: 'sporepuff', act: 0, look: 'sporemite', type: 'normal' },
  { id: 'batling', act: 0, look: 'duskflit', type: 'fly' },
  { id: 'rockhermit', act: 0, look: 'pebblefist', type: 'power' },
  { id: 'helmhog', act: 1, look: 'thornbeau', type: 'run' },
  { id: 'gnomelet', act: 1, look: 'budling', type: 'normal' },
  { id: 'lanternmoth', act: 1, look: 'smogpuff', type: 'fly' },
  { id: 'ivyimp', act: 1, look: 'tanglet', type: 'normal' },
  { id: 'dunemouse', act: 2, look: 'nibbler', type: 'run' },
  { id: 'scarablet', act: 2, look: 'pinchbeetle', type: 'power' },
  { id: 'tumbleweed', act: 2, look: 'dustball', type: 'run' },
  { id: 'sandsprite', act: 2, look: 'sparkorb', type: 'run' },
  { id: 'penguinling', act: 3, look: 'floepup', type: 'swim' },
  { id: 'snowgolem', act: 3, look: 'rockhorn', type: 'power' },
  { id: 'frostferret', act: 3, look: 'snoutling', type: 'swim' },
  { id: 'icejelly', act: 3, look: 'jellet', type: 'swim' },
];

/** An act's four families; from Act V on, one Greyling of each earlier act's family. */
export function actFamilies(act: number): FoeFamilyDef[] {
  const own = FOE_FAMILIES.filter((f) => f.act === act);
  if (own.length) return own;
  return FOE_FAMILIES.map((f) => ({ ...f, id: `grey-${f.id}`, act, grey: true as const }));
}
