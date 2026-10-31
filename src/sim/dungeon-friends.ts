/**
 * Friends for hire (R0181, DUNG-38, lane B round 9): a camp's hire board offers a few of the
 * Grove's Keeper-friends. One may come along for the trip for a few Shells. The friend walks
 * behind the party (a fifth follower), adds a little to every fight (Brave for each party
 * Nubbin, one more member in the stub's weight) and brings one aura:
 * - sight: the floor opens wider round the Keeper;
 * - fetch: the party reaches further for loot;
 * - brave: a bigger Brave boost in fights;
 * - heal: once a level, a tired party gets a rest.
 * The friend lives on the run, so they leave when the trip ends.
 *
 * Pure sim: no DOM.
 */
import { ACTS } from '../config/dungeon-acts';
import { FRIEND_AURA, HOLLOW_R9C, type FriendAura } from '../config/dungeon-r9-c';
import { TOWN_CAST } from '../config/dungeon-zones';
import { resolveDungeon, type Floor } from './dungeon';
import { newRoute, nextWaypoint, type NavRoute } from './dungeon-nav';
import { DUNGEON_NAV } from '../config/tuning-sim';
import { serviceHere } from './dungeon-towns';
import { levelMoods } from './dungeon-moods';
import { TRAINERS } from './trainers';
import type { DungeonRun, HollowFriend, Nubbin, SimEvent, Vec2, World } from './types';

const F = HOLLOW_R9C.friends;

/** Who is on act `act`'s hire board: its hire keeper first, then friends picked by the act. */
export function hireBoard(act: number): string[] {
  const own = TOWN_CAST[ACTS[act]!.id]?.hire;
  const out: string[] = own && own !== 'local' ? [own] : [];
  const ids = TRAINERS.map((t) => t.id);
  for (let i = 0; out.length < F.perBoard && i < ids.length; i++) {
    const id = ids[(act * 3 + i * 2) % ids.length]!;
    if (!out.includes(id)) out.push(id);
  }
  return out;
}

/** The friend along on this run, if any. */
export function friendOf(world: World): HollowFriend | null {
  return world.dungeon?.friend ?? null;
}

export function friendAura(world: World): FriendAura | null {
  const f = friendOf(world);
  return f ? (FRIEND_AURA[f.trainer] ?? 'brave') : null;
}

/** Hire `trainer` at the camp's hire board. */
export function hireFriend(world: World, trainer: string, events: SimEvent[]): boolean {
  const run = world.dungeon;
  if (!run || run.zone !== 'town' || run.act === undefined || run.friend) return false;
  if (serviceHere(world)?.kind !== 'hire') return false;
  if (!hireBoard(run.act).includes(trainer)) return false;
  if (world.inventory.shells < F.cost) return false;
  world.inventory.shells -= F.cost;
  const k = world.keeper.pos;
  run.friend = { trainer, pos: { x: k.x + 0.8, z: k.z + 0.8 }, facing: 0 };
  events.push({ kind: 'hollowR9', what: 'hired', id: trainer, n: F.cost });
  return true;
}

/** Send the friend home early (no refund: they had a nice walk). */
export function dismissFriend(world: World, events: SimEvent[]): boolean {
  const run = world.dungeon;
  if (!run?.friend) return false;
  const id = run.friend.trainer;
  delete run.friend;
  events.push({ kind: 'hollowR9', what: 'friendLeft', id });
  return true;
}

// ---------------------------------------------------------------- auras

export function friendSight(world: World): number {
  return friendAura(world) === 'sight' ? F.sight : 0;
}

export function friendFetch(world: World): number {
  return friendAura(world) === 'fetch' ? F.fetch : 0;
}

/** Brave points the friend adds to each party Nubbin's hits. */
export function friendBrave(world: World): number {
  const a = friendAura(world);
  if (!a) return 0;
  return F.brave + (a === 'brave' ? F.braveAura : 0);
}

/** The friend's weight in the stub fight, in party members. */
export function friendPower(world: World): number {
  return friendOf(world) ? F.power : 0;
}

// ---------------------------------------------------------------- walking

/** For the renderers: is the friend walking (still catching up with the Keeper)? */
export function friendWalking(world: World, fr: HollowFriend): boolean {
  return dist(fr.pos, world.keeper.pos) > F.follow + 0.15;
}

const routes = new WeakMap<HollowFriend, NavRoute>();

function dist(a: Vec2, b: Vec2): number {
  return Math.hypot(a.x - b.x, a.z - b.z);
}

/** Once a step: follow the Keeper round the rock, and the heal aura. */
export function stepFriend(
  world: World,
  run: DungeonRun,
  f: Floor,
  party: readonly Nubbin[],
  dtMs: number,
  events: SimEvent[],
): void {
  const fr = run.friend;
  if (!fr) return;
  const k = world.keeper.pos;
  const d = dist(fr.pos, k);
  if (d > DUNGEON_FAR) {
    // A new level or a waypoint hop: they catch up at once.
    fr.pos = { x: k.x + 0.6, z: k.z + 0.6 };
    resolveDungeon(fr.pos, f, 0.3, 'chasm');
    routes.delete(fr);
  } else if (d > F.follow) {
    let route = routes.get(fr);
    if (!route) routes.set(fr, (route = newRoute()));
    const wp = nextWaypoint(route, f, fr.pos, k, true, DUNGEON_NAV.nubbinClearance) ?? k;
    const step = Math.min(dist(fr.pos, wp), (F.speed * dtMs) / 1000);
    const w = Math.max(1e-6, dist(fr.pos, wp));
    if (w > 1e-3) fr.facing = Math.atan2(wp.x - fr.pos.x, wp.z - fr.pos.z);
    fr.pos.x += ((wp.x - fr.pos.x) / w) * step;
    fr.pos.z += ((wp.z - fr.pos.z) / w) * step;
    resolveDungeon(fr.pos, f, 0.3, 'chasm');
  } else fr.facing = Math.atan2(k.x - fr.pos.x, k.z - fr.pos.z);
  if (friendAura(world) !== 'heal' || run.zone === 'town') return;
  const moods = levelMoods(run);
  if (moods.healed || !party.some((n) => n.needs.energy < F.healBelow)) return;
  moods.healed = true;
  for (const n of party) n.needs.energy = Math.min(1, n.needs.energy + F.heal);
  events.push({ kind: 'hollowR9', what: 'friendHeal', id: fr.trainer });
}

/** Past this far (u) the friend simply catches up. */
const DUNGEON_FAR = 14;
