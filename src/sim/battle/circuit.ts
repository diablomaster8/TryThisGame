import { BATTLE } from '../../config/tuning-battle';
import { hashSeed, Rng } from '../rng';
import { HAT_IDS } from '../shop';
import { speciesByFamily, type Family } from '../species';
import { TRAINERS, trainerOf } from '../trainers';
import type { SimEvent, World } from '../types';
import type { Gimmick } from './types';

/**
 * The Grove Circuit (recs FIGHT-22): the ten Keepers as gym-like trainers. Each has a fixed
 * team per save (seeded from the save and the trainer), a field rule, and a ribbon won once.
 * Tier 1 is open from the start; each later tier opens when every ribbon of the one before is
 * won; a Champion rematch with each Keeper opens after all ten. The player's own Keeper role
 * is met as the "mirror match". Never needed for the main ending.
 */
export const CIRCUIT_TIERS: readonly (readonly string[])[] = [
  ['fern', 'clover', 'marina', 'sparks'],
  ['pixel', 'luna', 'dusty'],
  ['ember', 'byte', 'nova'],
];

export const CIRCUIT_GIMMICK: Readonly<Partial<Record<string, Gimmick>>> = {
  marina: 'puddle',
  luna: 'night',
  byte: 'shuffle',
  dusty: 'naps',
};

export interface CircuitState {
  /** Trainer ids whose ribbon is won, in the order won. */
  ribbons: string[];
  /** Trainer ids beaten at Champion difficulty. */
  champion: string[];
}

export function circuitOf(world: World): CircuitState {
  return world.circuit ?? { ribbons: [], champion: [] };
}

export function circuitTier(trainer: string): number {
  const i = CIRCUIT_TIERS.findIndex((t) => t.includes(trainer));
  return i < 0 ? 0 : i + 1;
}

/** Whether `trainer` can be challenged now (and at Champion difficulty). */
export function circuitOpen(world: World, trainer: string, champion = false): boolean {
  const tier = circuitTier(trainer);
  if (tier === 0) return false;
  const won = circuitOf(world).ribbons;
  if (champion) return CIRCUIT_TIERS.flat().every((t) => won.includes(t));
  return CIRCUIT_TIERS.slice(0, tier - 1).every((row) => row.every((t) => won.includes(t)));
}

/** A Keeper's team: 1, 2 or 3 species by tier (3 at Champion), fixed for the save. */
export function circuitTeam(world: World, trainer: string, champion = false): string[] {
  const t = trainerOf(trainer);
  const rng = Rng.fromSeed(hashSeed(`${world.seed}:circuit:${trainer}`) % 2147483647);
  const size = champion ? 3 : Math.max(1, circuitTier(trainer));
  const out: string[] = [];
  for (let i = 0; i < size; i++) {
    const family = rng.weighted(t.eggs) as Family;
    const pool = speciesByFamily(family).filter((s) => s.stage !== 'baby');
    const list = pool.length ? pool : speciesByFamily(family);
    const weights: Record<string, number> = {};
    for (const s of list) weights[s.id] = s.type === t.favourite ? 3 : 1;
    out.push(list.length ? rng.weighted(weights) : 'chao');
  }
  return out;
}

/** Pays a Circuit win: the ribbon, a hat and a skill point once; Shells every time. */
export function circuitWin(
  world: World,
  trainer: string,
  champion: boolean,
  events: SimEvent[],
): void {
  const c = (world.circuit ??= { ribbons: [], champion: [] });
  const list = champion ? c.champion : c.ribbons;
  if (list.includes(trainer)) return;
  list.push(trainer);
  if (!champion) {
    const ix = TRAINERS.findIndex((x) => x.id === trainer);
    const hat = HAT_IDS[Math.max(0, ix) % HAT_IDS.length]!;
    if (!world.inventory.hats.includes(hat)) world.inventory.hats.push(hat);
  }
  world.skillPoints += BATTLE.circuit.skillPoints;
  events.push({ kind: 'circuitRibbon', trainer, champion });
}

/** The Shells a Circuit win pays. */
export function circuitPrize(trainer: string, champion: boolean): number {
  const C = BATTLE.circuit;
  if (champion) return C.championPrize;
  return C.prize[Math.max(0, circuitTier(trainer) - 1)] ?? C.prize[0];
}
