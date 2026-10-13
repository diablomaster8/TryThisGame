import { GYM } from '../config/tuning';
import { addHappiness } from './needs';
import { addPoints } from './stats';
import { townUnlocks } from './town';
import type { SimEvent, StatKey, World } from './types';

/**
 * The training gym: four stations, one per stat, each a short timing game on screen.
 * The sim only sees the result: hits become points, the round costs energy, and a
 * rested, fed Nubbin gains more (the daily routine matters). The square's gym recruit
 * adds a bonus once prosperity opens it.
 */
export const STATIONS: ReadonlyArray<{ stat: StatKey; id: string }> = [
  { stat: 'swim', id: 'lane' },
  { stat: 'fly', id: 'rings' },
  { stat: 'run', id: 'track' },
  { stat: 'power', id: 'rocks' },
];

export function canTrain(world: World, nubbinId: string): string | null {
  const n = world.nubbins.find((x) => x.id === nubbinId);
  if (!n || n.stage === 'egg' || n.stage === 'cocoon') return 'nubbin';
  if (n.needs.energy < GYM.energyCost) return 'tired';
  return null;
}

export function trainResult(
  world: World,
  nubbinId: string,
  stat: StatKey,
  hits: number,
  events: SimEvent[],
): void {
  const n = world.nubbins.find((x) => x.id === nubbinId);
  if (!n || canTrain(world, nubbinId)) return;
  const rested = n.needs.hunger >= GYM.minHunger && n.needs.energy >= GYM.minEnergy;
  let points = Math.max(0, hits) * GYM.pointsPerHit;
  if (rested) points *= GYM.restedBonus;
  if (townUnlocks(world).gym) points *= 1.2;
  points = Math.round(points);
  addPoints(n.stats[stat], points);
  n.needs.energy = Math.max(0, n.needs.energy - GYM.energyCost);
  addHappiness(n, hits > 0 ? 2 : -1);
  events.push({ kind: 'trained', nubbinId, stat, points, rested });
}
