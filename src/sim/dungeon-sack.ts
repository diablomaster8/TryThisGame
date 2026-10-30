/**
 * The haul sack and the stash (R0175, R0174, R0362; lane B round 6). Gear found underground
 * rides in `run.sack` until it is banked at a waypoint stone, a camp, an acorn portal or home,
 * with a "Bank it!" count each time. Nothing can take a banked piece away: a lost fight keeps
 * the sack, and a satchel past `LOOT.carry` sends its overflow to `gear.stash` instead of
 * dropping it. Shells and materials still land at once, as before.
 *
 * The tumble home (R0362): when every party Nubbin is out of puff, everyone rolls up the stairs
 * in a heap and lands home damp. Half the sack comes along to the satchel and the rest washes
 * up in the stash, so the joke costs nothing.
 */
import { LOOT } from '../config/dungeon-loot';
import { HOLLOW_R6 } from '../config/tuning-dungeon';
import { leaveDungeon } from './dungeon';
import { standingOnWaypoint } from './dungeon-travel';
import { ensureGear, keepGear } from './gear';
import type { DungeonRun, GearItem, SimEvent, World } from './types';

export function ensureStash(world: World): GearItem[] {
  return (ensureGear(world).stash ??= []);
}

export function sackCount(run: DungeonRun | null): number {
  return run?.sack?.length ?? 0;
}

/**
 * Banks the sack into the satchel. `home` always reports, so the haul card shows on every
 * return; the other places only when there was something to bank.
 */
export function bankSack(
  world: World,
  run: DungeonRun,
  where: 'home' | 'waypoint' | 'camp' | 'portal',
  events: SimEvent[],
): number {
  const sack = run.sack ?? [];
  delete run.sack;
  for (const item of sack) keepGear(world, item);
  if (sack.length > 0 || where === 'home')
    events.push({ kind: 'haulBanked', items: sack.length, where });
  return sack.length;
}

/** Each step: a woken waypoint stone or a camp banks what is in the sack. */
export function stepSack(world: World, run: DungeonRun, events: SimEvent[]): void {
  if (!run.sack?.length || run.encounter) return;
  if (run.zone === 'town') bankSack(world, run, 'camp', events);
  else if (standingOnWaypoint(world)) bankSack(world, run, 'waypoint', events);
}

/** Every party Nubbin that came along is out of puff (and there is at least one). */
export function partySpent(world: World, run: DungeonRun): boolean {
  const party = run.party
    .map((id) => world.nubbins.find((n) => n.id === id))
    .filter((n) => n && n.stage !== 'egg' && n.stage !== 'cocoon');
  return party.length > 0 && party.every((n) => n!.needs.energy <= 0);
}

/**
 * R0362: the tumble home. Half the sack (rounded up) goes to the satchel, the rest to the
 * stash; then the trip ends as usual (which reports an empty bank, so the card still shows).
 */
export function tumbleHome(world: World, events: SimEvent[]): boolean {
  const run = world.dungeon;
  if (!run || world.location !== 'dungeon' || run.encounter) return false;
  const sack = run.sack ?? [];
  delete run.sack;
  const kept = Math.ceil(sack.length * HOLLOW_R6.tumbleKeep);
  sack.slice(0, kept).forEach((item) => keepGear(world, item));
  ensureStash(world).push(...sack.slice(kept));
  events.push({ kind: 'tumbleHome', kept, camp: sack.length - kept });
  return leaveDungeon(world, events);
}

/** R0174: takes a piece out of the stash into the satchel, if the satchel has room. */
export function takeFromStash(world: World, itemId: string): boolean {
  const g = ensureGear(world);
  const stash = ensureStash(world);
  const i = stash.findIndex((x) => x.id === itemId);
  if (i < 0 || g.items.length >= LOOT.carry) return false;
  g.items.push(stash.splice(i, 1)[0]!);
  return true;
}
