import { TOWN } from '../config/tuning';
import type { SimEvent, TownRole, World } from './types';

/**
 * The village square: every creature won over (a settled wild visitor, a returned stray,
 * a race rival or karate rival beaten) moves in as a recruit. Recruits raise prosperity,
 * and prosperity opens the square's services one by one: a stall with cheaper goods, the
 * gym bonus, a bathhouse attendant, free fortunes, a standing festival.
 */
const ROLES: TownRole[] = ['stall', 'gym', 'attendant', 'fortune', 'festival', 'guard'];

export interface TownUnlocks {
  stall: boolean;
  gym: boolean;
  attendant: boolean;
  fortune: boolean;
  festival: boolean;
}

export function townUnlocks(world: World): TownUnlocks {
  const p = world.town.prosperity;
  return {
    stall: p >= TOWN.unlocks.stall,
    gym: p >= TOWN.unlocks.gym,
    attendant: p >= TOWN.unlocks.attendant,
    fortune: p >= TOWN.unlocks.fortune,
    festival: p >= TOWN.unlocks.festival,
  };
}

/** A creature joins the square. Returns false if it already lives there. */
export function addRecruit(
  world: World,
  name: string,
  species: string,
  events: SimEvent[],
): boolean {
  const town = world.town;
  if (town.recruits.some((r) => r.name === name && r.species === species)) return false;
  const role = ROLES[town.recruits.length % ROLES.length]!;
  town.recruits.push({ name, species, role, atMs: world.timeMs });
  const before = townUnlocks(world);
  town.prosperity = Math.min(TOWN.max, town.prosperity + TOWN.perRecruit);
  const after = townUnlocks(world);
  events.push({ kind: 'recruited', name, role, prosperity: town.prosperity });
  for (const key of Object.keys(after) as Array<keyof TownUnlocks>) {
    if (after[key] && !before[key])
      events.push({ kind: 'townGrew', unlock: key, prosperity: town.prosperity });
  }
  return true;
}

/** Shop prices with the stall open. */
export function shopDiscount(world: World): number {
  return townUnlocks(world).stall ? TOWN.stallDiscount : 1;
}

/** The standing festival's race prize bonus. */
export function festivalPrizeMultiplier(world: World): number {
  return townUnlocks(world).festival ? TOWN.festivalPrize : 1;
}

/** Recruits are drawn from the step's events: settled wild visitors and returned strays. */
export function stepTown(world: World, events: SimEvent[]): void {
  for (const e of [...events]) {
    if (e.kind === 'wildSettled') {
      const n = world.nubbins.find((x) => x.id === e.nubbinId);
      if (n) addRecruit(world, n.name, n.species, events);
    } else if (e.kind === 'strayReturned') {
      const n = world.nubbins.find((x) => x.id === e.nubbinId);
      if (n) addRecruit(world, n.name, n.species, events);
    }
  }
}
