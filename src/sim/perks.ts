import { PERKS } from '../config/tuning';
import type { NubbinType, World } from './types';
import { rideSpeed } from './ride';
import { swimTower } from './swim-tow';

/**
 * Borrowed moves: a bonded or well-loved adult lends its Keeper something of its type.
 * Swim lets the Keeper wade the pond, Fly glides faster, Power shakes whole trees,
 * Run sprints harder.
 */
export interface Perks {
  wade: boolean;
  glide: boolean;
  power: boolean;
  sprint: boolean;
  /** Which Nubbin grants each, for the profile card. */
  from: Partial<Record<NubbinType, string>>;
}

export function keeperPerks(world: World): Perks {
  const perks: Perks = { wade: false, glide: false, power: false, sprint: false, from: {} };
  for (const n of world.nubbins) {
    if (n.stage !== 'adult' || !n.form) continue;
    const loved = n.bond || n.needs.affection >= PERKS.minAffection;
    if (!loved) continue;
    const t = n.form.type;
    if (t === 'swim') perks.wade = true;
    else if (t === 'fly') perks.glide = true;
    else if (t === 'power') perks.power = true;
    else if (t === 'run') perks.sprint = true;
    if (t !== 'normal' && !perks.from[t]) perks.from[t] = n.name;
  }
  // R0088: a Swim-trained partner (or the ridden Nubbin) tows the Keeper into deep water.
  if (!perks.wade) {
    const tow = swimTower(world);
    if (tow) {
      perks.wade = true;
      perks.from.swim ??= tow.name;
    }
  }
  return perks;
}

/** Speed multiplier for the Keeper from perks and running. */
export function keeperSpeedMultiplier(
  world: World,
  running: boolean,
  runMultiplier: number,
): number {
  // R0085: on a Nubbin's back its pace is the Keeper's pace.
  const ride = rideSpeed(world, running);
  if (ride !== null) return ride;
  const p = keeperPerks(world);
  let m = running ? (p.sprint ? PERKS.runBonus : runMultiplier) : 1;
  if (p.glide && running) m *= PERKS.flyGlideSpeed / 1.3 + 0.3;
  return m;
}
