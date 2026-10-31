/**
 * Choosing who comes down the Hollow (R0168, DUNG-28): the cave-mouth menu's party picker.
 * The pick is remembered in `world.hollow.lastParty` and used by every later entry until it
 * changes (`choosePartyFor`, dungeon.ts, puts it after a carried Nubbin and before partners).
 * A Nubbin low on energy can still be picked; the picker greys it with a 💤.
 *
 * Pure sim: no DOM.
 */
import { HOLLOW_ZONES } from '../config/tuning';
import { autoRole, hollowPartySize, roleOf } from './dungeon-roles';
import { levelOf } from './stats';
import type { HollowRole, Nubbin, StatKey, World } from './types';

const STATS: readonly StatKey[] = ['swim', 'fly', 'run', 'power', 'stamina'];

export interface PartyChoice {
  id: string;
  name: string;
  energy: number;
  tired: boolean;
  /** Its best stat and that stat's level, for the card. */
  best: StatKey;
  level: number;
  /** R0167: its role underground, and whether the Keeper picked it by hand. */
  role: HollowRole;
  picked: boolean;
}

function canCome(n: Nubbin): boolean {
  return n.stage !== 'egg' && n.stage !== 'cocoon';
}

function bestStat(n: Nubbin): StatKey {
  return STATS.reduce((a, b) => (levelOf(n.stats[b].points) > levelOf(n.stats[a].points) ? b : a));
}

/** Everyone who could come along, in roster order. */
export function partyChoices(world: World): PartyChoice[] {
  return world.nubbins.filter(canCome).map((n) => {
    const best = bestStat(n);
    return {
      id: n.id,
      name: n.name,
      energy: Math.round(n.needs.energy * 100),
      tired: n.needs.energy < HOLLOW_ZONES.party.tired,
      best,
      level: levelOf(n.stats[best].points),
      role: roleOf(world, n),
      picked: roleOf(world, n) !== autoRole(n),
    };
  });
}

/** Sets the party for the next entries: known, hatched ids, at most the party size. */
export function setHollowParty(world: World, ids: readonly string[]): void {
  const ok = new Set(world.nubbins.filter(canCome).map((n) => n.id));
  const size = hollowPartySize(world);
  world.hollow.lastParty = [...new Set(ids)].filter((id) => ok.has(id)).slice(0, size);
}

/**
 * "Recommended": the rested Nubbins with the most stat points, one per role first (R0167's
 * role coverage), then the strongest of the rest.
 */
export function recommendedParty(world: World): string[] {
  const total = (n: Nubbin) => STATS.reduce((s, k) => s + n.stats[k].points, 0);
  const ranked = world.nubbins
    .filter(canCome)
    .sort(
      (a, b) =>
        Number(a.needs.energy < HOLLOW_ZONES.party.tired) -
          Number(b.needs.energy < HOLLOW_ZONES.party.tired) || total(b) - total(a),
    );
  const size = hollowPartySize(world);
  const out: Nubbin[] = [];
  const roles = new Set<HollowRole>();
  for (const n of ranked) {
    if (out.length >= size) break;
    const r = roleOf(world, n);
    if (roles.has(r)) continue;
    roles.add(r);
    out.push(n);
  }
  for (const n of ranked) if (out.length < size && !out.includes(n)) out.push(n);
  return out.map((n) => n.id);
}
