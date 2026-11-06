/**
 * Tuning: the economy domain (TECH-36). Moved out of config/tuning.ts, which still re-exports it.
 * Numbers are unchanged; the review-pass letters in the comments are their provenance.
 */
import type { ColliderFlag, ColliderShape } from '../grove-layout';

export const SHOP = {
  fruit: 5,
  egg: 60,
  /** Chance a bought egg is a rare colour. */
  rareEggChance: 0.15,
  /** Of the rare eggs: chance of a two-tone, and of a shiny. */
  twoToneChance: 0.3,
  shinyChance: 0.2,
  /** Chance a bought egg is a jewel (ruby, sapphire, ...); rolled before the rare colours. */
  jewelEggChance: 0.02,
  hat: 40,
  toy: 30,
  /** How many toys can lie in the Grove at once. */
  maxToys: 3,
} as const;

/** Weather rolls on the sim clock; rain and snow change behaviour a little. */
export const WEATHER = {
  /** Clear spells last this long (ms), then a roll. */
  clearMs: [8 * 60_000, 20 * 60_000] as const,
  rainMs: [3 * 60_000, 8 * 60_000] as const,
  snowMs: [4 * 60_000, 10 * 60_000] as const,
  rainChance: 0.35,
  /** Winter rolls snow instead of rain. */
  /** Swim lean per second while out in the rain. */
  rainSwimLeanPerSecond: 0.01,
  /** Happiness per minute for Nubbins sheltering under a tree in the rain (they like it). */
  shelterHappinessPerMinute: 0.5,
} as const;

export const SERVICES = {
  doctor: 15,
  fortune: 20,
} as const;

export const DECOR = {
  prices: {
    fence: 10,
    flowerbed: 15,
    bench: 25,
    statue: 60,
    pathTile: 5,
    lanternSmall: 20,
    nursery: 400,
    bathhouse: 450,
    workshop: 250,
    rockPile: 12,
    thicket: 18,
  } as const,
  maxPlaced: 60,
  /**
   * What each piece does to walkers (MOVE-04). Fences block Nubbins under Run or Fly 20,
   * which hop them; benches and rock piles can be stood on once the Keeper jumps; beds and
   * thickets are soft, so the Keeper pushes through slowly and Nubbins go round. Path tiles
   * have no entry: they are walked on.
   */
  colliders: {
    fence: { shape: { type: 'segment', len: 1.0, r: 0.08 }, top: 0.6, flags: ['hop'] },
    bench: { shape: { type: 'box', hw: 0.55, hd: 0.18 }, top: 0.44, flags: ['standable'] },
    statue: { shape: { type: 'circle', r: 0.35 }, top: 1.8, flags: ['solid'] },
    lanternSmall: { shape: { type: 'circle', r: 0.12 }, top: 1.0, flags: ['solid'] },
    flowerbed: { shape: { type: 'box', hw: 0.5, hd: 0.3 }, top: 0.3, flags: ['soft'] },
    rockPile: { shape: { type: 'circle', r: 0.45 }, top: 0.6, flags: ['hop', 'standable'] },
    thicket: { shape: { type: 'circle', r: 0.55 }, top: 0.9, flags: ['soft'] },
  } satisfies Record<string, { shape: ColliderShape; top: number; flags: readonly ColliderFlag[] }>,
} as const;

/** Orchards and crops. */
export const PLANTS = {
  /** Sim time per growth stage. */
  treeStageMs: 20 * 60_000,
  cropStageMs: 6 * 60_000,
  /** Grown trees drop a fruit this often. */
  treeFruitMs: 6 * 60_000,
  /** Water lost per minute without rain; growth stops when dry. */
  dryPerMinute: 0.02,
  rainRefill: true,
  /** Stat fruit adds this many points; Sun/Moon fruit nudge alignment this much. */
  fruitPoints: 40,
  fruitAlignment: 0.08,
  cropHarvest: 2,
  maxPlants: 24,
} as const;

export const TOYS = {
  prices: {
    ball: 30,
    radio: 60,
    blocks: 45,
    mirror: 40,
    tv: 90,
    seesaw: 120,
    sandbox: 80,
    drum: 55,
    bubbleWand: 35,
    skippingRope: 50,
    rubberDuck: 40,
    kite: 65,
    crayonBox: 45,
  } as const,
  maxPlaced: 6,
} as const;

/** Workshop recipes: what each costs in gathered materials and Shells. */
export const RECIPES = {
  fence: { wood: 2, stone: 0, reeds: 0, shells: 0 },
  bench: { wood: 4, stone: 0, reeds: 0, shells: 0 },
  pathTile: { wood: 0, stone: 1, reeds: 0, shells: 0 },
  statue: { wood: 0, stone: 6, reeds: 0, shells: 10 },
  lanternSmall: { wood: 2, stone: 1, reeds: 0, shells: 5 },
  flowerbed: { wood: 1, stone: 0, reeds: 2, shells: 0 },
  rockPile: { wood: 0, stone: 3, reeds: 0, shells: 0 },
  thicket: { wood: 3, stone: 0, reeds: 1, shells: 0 },
  nursery: { wood: 8, stone: 4, reeds: 2, shells: 80 },
  bathhouse: { wood: 6, stone: 8, reeds: 2, shells: 100 },
  workshop: { wood: 10, stone: 6, reeds: 0, shells: 60 },
  ball: { wood: 0, stone: 0, reeds: 2, shells: 0 },
  dye: { wood: 0, stone: 0, reeds: 1, shells: 5 },
} as const;

export const GATHER = {
  /** Chance a shaken tree also drops wood, and how much a stone or reed tap gives. */
  woodChance: 0.45,
  stonePerTap: 1,
  reedsPerTap: 1,
  tapCooldownMs: 8_000,
} as const;

/** Habitats: patches that draw wild creatures in. */
export const HABITAT = {
  /** Decor pieces that make each patch, and how many count as a full patch. */
  need: 3,
  /** Chance per sim minute of a visit when a patch is complete. */
  visitChancePerMinute: 0.15,
  visitMs: 4 * 60_000,
  /** Visits (or one feeding) before the creature settles. */
  settleVisits: 3,
  maxWild: 2,
} as const;

/** Festival multipliers by season. */
export const SEASONS = {
  spring: { eggPrice: 0.5, rareEgg: 2 },
  summer: { racePrize: 2 },
  autumn: { fruitInterval: 0.5 },
  winter: { lanternsAllDay: true },
} as const;

export const PERKS = {
  /** A bonded or well-loved adult of each type lends its Keeper a move. */
  minAffection: 70,
  runBonus: 2.4,
  wadeSpeed: 0.55,
  powerShakeFruit: 2,
  flyGlideSpeed: 1.3,
} as const;

export const PLOTS = {
  price: 300,
  rosterPerPlot: 4,
  max: 2,
} as const;

export const SLED = {
  /** Chance per idle choice to go sledding in the snow. */
  chance: 0.12,
  durationMs: 7000,
} as const;
