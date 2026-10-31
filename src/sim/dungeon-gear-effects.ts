/**
 * The worn stats the Hollow does not read itself (R0164, DUNG-24; lane B round 8). Boots and
 * Bouncy speed up the Keeper's walk everywhere; Snug soothes a Nubbin's mood a little each
 * minute (its own gear plus the Keeper's), Naps makes its energy last longer, Brave adds weight
 * to the party in a Hollow fight, and Crumbs gives a tree shake a chance of an extra fruit.
 * Each effect is small and capped; nothing here runs when nothing is worn. Pure sim.
 */
import { GEAR_EFFECTS } from '../config/dungeon-items-r8';
import { NEEDS } from '../config/tuning';
import { gearStat } from './gear';
import type { Nubbin, World } from './types';

/** The Keeper's walk-speed multiplier from boots, Bouncy and Feathers. */
export function gearSpeedMul(world: World): number {
  if (!world.gear) return 1;
  return 1 + Math.min(GEAR_EFFECTS.speedMax, Math.max(0, gearStat(world, 'speed')));
}

/** A Nubbin's Snug or Naps: its own pieces plus the Keeper's. */
function nubbinStat(world: World, n: Nubbin, stat: 'snug' | 'energy'): number {
  return gearStat(world, stat, n.id) + gearStat(world, stat);
}

/**
 * After the needs' own decay: Snug nudges happiness up (never past `snugCap`), Naps gives back
 * part of the energy the step drained (not while napping, which already restores it).
 */
export function stepGearNeeds(world: World, n: Nubbin, dtMs: number): void {
  if (!world.gear) return;
  const snug = nubbinStat(world, n, 'snug');
  if (snug > 0 && n.needs.happiness < GEAR_EFFECTS.snugCap) {
    const add = snug * GEAR_EFFECTS.snugPerMinute * (dtMs / 60_000);
    n.needs.happiness = Math.min(GEAR_EFFECTS.snugCap, n.needs.happiness + add);
  }
  const naps = nubbinStat(world, n, 'energy');
  if (naps > 0 && n.behavior.state !== 'nap' && n.needs.energy > 0 && n.needs.energy < 1) {
    const saved = Math.min(GEAR_EFFECTS.napsMax, naps * GEAR_EFFECTS.napsPerPoint);
    n.needs.energy = Math.min(1, n.needs.energy + (dtMs / NEEDS.energyFullToEmptyMs) * saved);
  }
}

/** Brave: the fight weight the Keeper's and the party's gear add to a Hollow fight. */
export function bravePower(world: World, party: readonly string[]): number {
  if (!world.gear) return 0;
  let sum = gearStat(world, 'brave');
  for (const id of party) sum += gearStat(world, 'brave', id);
  return sum * GEAR_EFFECTS.bravePower;
}

/** Crumbs: extra fruit a tree shake drops; the whole part is certain, the rest a chance. */
export function shakeFruitBonus(world: World, roll: () => number): number {
  if (!world.gear) return 0;
  const f = gearStat(world, 'fruit');
  if (f <= 0) return 0;
  const whole = Math.floor(f);
  const part = Math.min(GEAR_EFFECTS.fruitMax, f - whole);
  return whole + (part > 0 && roll() < part ? 1 : 0);
}
