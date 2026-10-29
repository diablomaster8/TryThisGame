/**
 * Hollow foe data (lane B, DUNG): champion and elite modifiers (R0155) and the density rules
 * packs are placed by (R0158). The dungeon side spawns, names and shows these; the battle core
 * (lane C) reads `effect` to turn each modifier into play. Names stay cosy: nothing cursed,
 * nothing bloody. Every modifier has an icon as well as a word, so colour is never the only
 * signal.
 */

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
 * difficulty (Cosy until DUNG-36 adds the setting); spacing in cells; the mix of kinds; the
 * foe level's base per act (level = act base + level in act + difficulty offset); and how
 * many modifiers each kind rolls.
 */
export const DENSITY = {
  perThousand: { outdoor: 3, dungeon: 1.6, boss: 1.2 },
  size: { cosy: [2, 3], brisk: [3, 4], wild: [3, 5] } as const,
  difficultyOffset: { cosy: 0, brisk: 2, wild: 4 } as const,
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
