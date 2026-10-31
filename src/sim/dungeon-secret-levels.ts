/**
 * Getting into the Hollow's secret levels and what winning there gives (lane B round 9,
 * helper b). Floors are in `dungeon-secret-floors.ts`.
 *
 * - The Moo Meadow (R0189): the Act V boss leaves Gran's Teaspoon and a milk bell (keepsake
 *   keys, one of each held at most). Both in the wheelbarrow open a sunny portal at the camp,
 *   once a trip; stepping through spends it. The Moo Crew moo-ve along when beaten and leave
 *   charms; the Cow Queen leaves a Picnic set piece not yet owned and, once, her sun bonnet.
 * - The Pillow Fort (R0183): the three keys open it (`dungeon-wheelbarrow.ts`). It stays open
 *   until the Pillow Trio is beaten, which gives the Pillow Crown and the "Pillow Champion"
 *   title (once), and a first-win bonus.
 *
 * Every way out goes through the camp: the stairs up land at its waypoint stone. Pure sim.
 */
import { charmKey, addCharm } from './dungeon-charms';
import { CHARM_TYPES, SET_PIECES } from '../config/dungeon-items-r8';
import { SECRETS } from '../config/dungeon-r9-b';
import { MOO_BONNET, PILLOW_CROWN } from '../config/cosmetics-r9b';
import { SECRETS_R9B_TEXT } from '../config/strings-hollow-r9-b';
import { levelIdOf } from './dungeon-levels';
import type { EncounterPack } from './dungeon-encounters';
import { makeSpecial, noteFound, ownedSpecials } from './dungeon-sets';
import { goToZone } from './dungeon-zones';
import { ensureGear, keepGear, rollGear } from './gear';
import type { Rng } from './rng';
import type { DungeonRun, HollowSecret, SimEvent, World } from './types';

/** Whether the Keeper may step through `where`'s portal now: in a camp, the way open. */
export function canEnterSecret(world: World, where: HollowSecret): boolean {
  const run = world.dungeon;
  if (!run || world.location !== 'dungeon' || run.act === undefined || run.story) return false;
  if (run.zone !== 'town' || run.encounter || run.loading) return false;
  const g = world.gear;
  return where === 'moo' ? g?.mooMeadow === 'open' : g?.pillowFort === 'open';
}

/** Through the portal: the meadow's is spent on the way in, the fort's stays till it's won. */
export function enterSecret(world: World, where: HollowSecret, events: SimEvent[]): boolean {
  if (!canEnterSecret(world, where)) return false;
  const run = world.dungeon!;
  const g = ensureGear(world);
  if (where === 'moo') delete g.mooMeadow;
  const seen = (run.secretsVisited ??= []);
  if (!seen.includes(where)) seen.push(where);
  // A fresh visit: nothing remembered from an earlier one this trip.
  const id = levelIdOf({ ...run, zone: where });
  if (run.levels) delete run.levels[id];
  goToZone(world, run, where, 'up', events);
  return true;
}

/** Whether the barrow may open the meadow: the Act V boss beaten, not already open or used. */
export function mooRecipeReady(world: World): boolean {
  const g = world.gear;
  return (
    world.hollow.acts[SECRETS.keepsakeAct]?.bossDefeated === true &&
    g?.mooMeadow !== 'open' &&
    !world.dungeon?.secretsVisited?.includes('moo')
  );
}

/** The secret levels' stairs: up is back to the camp's waypoint stone; there is no down. */
export function secretStairs(
  world: World,
  run: DungeonRun,
  dir: 'up' | 'down',
  events: SimEvent[],
): void {
  if (dir === 'up') goToZone(world, run, 'town', 'waypoint', events);
}

/** A wearable, given once (as the act bosses' hats are). */
function giveWearable(world: World, id: string, events: SimEvent[]): void {
  if (world.inventory.hats.includes(id)) return;
  world.inventory.hats.push(id);
  events.push({ kind: 'hollowWearable', id });
}

/** A Picnic (Moo) set piece the household does not own yet; a charm when all are home. */
function picnicPiece(world: World, level: number, rng: Rng): void {
  const g = ensureGear(world);
  const owned = ownedSpecials(g);
  const pool = SET_PIECES.filter((p) => p.set === 'moo' && !owned.includes(p.id));
  if (!pool.length) {
    addCharm(g, charmKey(rng.pick(CHARM_TYPES), 2));
    return;
  }
  const exclude = SET_PIECES.filter((p) => p.set !== 'moo' || owned.includes(p.id)).map(
    (p) => p.id,
  );
  const made = makeSpecial(rollGear(world, rng, level, 0, 'set'), `${world.seed}:moo`, exclude);
  noteFound(world, made);
  keepGear(world, made);
}

/**
 * A pack beaten on a secret level, or the Act V boss (the meadow's keepsakes). Called before
 * the unique's own bookkeeping, so a first win is still a first win here.
 */
export function secretPackWon(
  world: World,
  run: DungeonRun,
  spec: EncounterPack,
  rng: Rng,
  events: SimEvent[],
): void {
  const g = ensureGear(world);
  if (spec.kind === 'boss' && run.act === SECRETS.keepsakeAct) {
    const keys = (g.keys ??= {});
    if (!keys.teaspoon || !keys.bell) {
      keys.teaspoon = Math.max(1, keys.teaspoon ?? 0);
      keys.bell = Math.max(1, keys.bell ?? 0);
      events.push({ kind: 'hollowItems', what: 'secret', id: 'keepsakes' });
    }
    return;
  }
  const first = spec.unique !== undefined && !world.hollow.uniquesBeaten.includes(spec.unique);
  const level = spec.members[0]?.level ?? run.depth;
  if (spec.family === 'moo-crew' && spec.kind === 'normal') {
    if (rng.chance(SECRETS.moo.herdCharm)) addCharm(g, charmKey(rng.pick(CHARM_TYPES), 1));
    events.push({ kind: 'hollowItems', what: 'herd', id: spec.id });
    return;
  }
  if (spec.unique === 'cow-queen') {
    picnicPiece(world, level, rng);
    giveWearable(world, MOO_BONNET, events);
    events.push({ kind: 'hollowItems', what: 'secret', id: 'queen' });
  } else if (spec.unique === 'pillow-trio') {
    delete g.pillowFort;
    giveWearable(world, PILLOW_CROWN, events);
    events.push({ kind: 'hollowItems', what: 'secret', id: 'trio' });
  } else return;
  const bonus = first ? (SECRETS.bonus[spec.unique] ?? 0) : 0;
  world.inventory.shells += bonus;
  run.haul.shells += bonus;
}

/** Titles the secret levels gave, beside the achievement titles. */
export function secretTitles(world: World): string[] {
  return world.hollow.uniquesBeaten.includes('pillow-trio') ? [SECRETS_R9B_TEXT.title] : [];
}
