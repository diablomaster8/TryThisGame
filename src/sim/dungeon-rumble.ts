/**
 * Rumble rooms (R0257, R0282, recs FIGHT-65 and FIGHT-89): about one dungeon level in three
 * marks a room with a glowing door. Walking in starts lane C's grid-tactics slice on a 10×10
 * crop of that very room (`startRumble`, imported, never edited here) against a champion pack
 * with a Diablo-style prefix: Extra Fluffy (more HP), Speedy (more Zip, one more step) or
 * Sticky Paws (a sticky hug in every foe's kit). The leader already has two phases in the
 * slice. A win pays the slice's Shells and crystal plus a chest (a hat, a critter bubble or
 * Shells), books the room as done for the run, and adds to the haul; a loss leaves the room
 * armed for when the Keeper steps out and back in. The room is never on the way down: the
 * stairs must stay reachable with it walled off, or the level gets none.
 *
 * Pure sim: the floor's room is derived from the floor and the run's seed, so old saves get
 * rumble rooms with no migration, and nothing runs per step unless the level has one.
 */
import { HOLLOW } from '../config/tuning';
import { startRumble } from './battle/tactics/slice';
import type { TacticsState } from './battle/tactics/types';
import { CRITTER_SPECIES } from './critters';
import { cellOf, FLOOR, runFloor, type Cell, type Floor, type Room } from './dungeon';
import { HOLLOW_BATTLE_SOURCE } from './dungeon-encounters';
import { reachMask } from './dungeon-gaps';
import { levelIdOf, waypointCell } from './dungeon-levels';
import { Rng } from './rng';
import { HAT_IDS } from './shop';
import type { DungeonRun, SimEvent, World } from './types';

const R = HOLLOW.rumble;

export type RumblePrefix = keyof typeof R.prefix;
const PREFIXES = Object.keys(R.prefix) as RumblePrefix[];

export interface RumbleRoom {
  /** Index into `floor.rooms`. */
  room: number;
  /** Walkable cells just outside the room's box: where the door glows. */
  door: Cell[];
  /** Where the tactics map is cropped around. */
  centre: Cell;
  prefix: RumblePrefix;
}

const cache = new WeakMap<Floor, RumbleRoom | null>();

function inBox(r: Room, c: Cell): boolean {
  return c.x >= r.x && c.y >= r.y && c.x < r.x + r.w && c.y < r.y + r.h;
}

/** True when the stairs down can still be reached (jumps allowed) with `r` walled off. */
function bypassed(f: Floor, r: Room): boolean {
  const down = f.stairsDown!;
  const at = down.y * f.cols + down.x;
  if (!reachMask(f, f.stairsUp, true)[at]) return false;
  const cells = f.cells.slice();
  for (let y = r.y; y < r.y + r.h; y++)
    for (let x = r.x; x < r.x + r.w; x++) cells[y * f.cols + x] = 0;
  return !!reachMask({ ...f, cells }, f.stairsUp, true)[at];
}

function doorOf(f: Floor, r: Room): Cell[] {
  const out: Cell[] = [];
  const open = (x: number, y: number) =>
    x >= 0 && y >= 0 && x < f.cols && y < f.rows && f.cells[y * f.cols + x] === FLOOR;
  for (let x = r.x; x < r.x + r.w; x++) {
    if (open(x, r.y - 1) && open(x, r.y)) out.push({ x, y: r.y - 1 });
    if (open(x, r.y + r.h) && open(x, r.y + r.h - 1)) out.push({ x, y: r.y + r.h });
  }
  for (let y = r.y; y < r.y + r.h; y++) {
    if (open(r.x - 1, y) && open(r.x, y)) out.push({ x: r.x - 1, y });
    if (open(r.x + r.w, y) && open(r.x + r.w - 1, y)) out.push({ x: r.x + r.w, y });
  }
  return out;
}

function centreOf(f: Floor, r: Room): Cell {
  const c = { x: Math.floor(r.x + r.w / 2), y: Math.floor(r.y + r.h / 2) };
  if (f.cells[c.y * f.cols + c.x] === FLOOR) return c;
  for (let y = r.y; y < r.y + r.h; y++)
    for (let x = r.x; x < r.x + r.w; x++) if (f.cells[y * f.cols + x] === FLOOR) return { x, y };
  return c;
}

/**
 * The level's rumble room, or null. Only dungeon levels at `fromDepth` or deeper with stairs
 * down and no boss; a seeded `share` of them; the first medium room (then the great one) that
 * holds neither stairs, the chest nor the waypoint and that the way down can go around.
 */
export function rumbleRoomOf(f: Floor, seed: number, depth: number): RumbleRoom | null {
  const hit = cache.get(f);
  if (hit !== undefined) return hit;
  let out: RumbleRoom | null = null;
  const rng = new Rng(((seed >>> 0) ^ Math.imul(depth + 1, 0x52554d42)) >>> 0 || 1);
  const roll = rng.chance(R.share);
  if (
    roll &&
    !f.zone &&
    depth >= R.fromDepth &&
    f.stairsDown &&
    !f.packs?.some((p) => p.kind === 'boss')
  ) {
    const stone = waypointCell(f);
    const order = f.rooms
      .map((r, i) => ({ r, i }))
      .filter(({ r }) => r.kind !== 'small' && r.w >= R.minSide && r.h >= R.minSide)
      .sort((a, b) => (a.r.kind === 'great' ? 1 : 0) - (b.r.kind === 'great' ? 1 : 0));
    for (const { r, i } of order) {
      if ([f.stairsUp, f.stairsDown, f.chest, stone].some((c) => inBox(r, c))) continue;
      if (!bypassed(f, r)) continue;
      const door = doorOf(f, r);
      if (!door.length) continue;
      const weights = PREFIXES.map((p) => R.prefix[p]);
      let pick = rng.float(
        0,
        weights.reduce((a, b) => a + b, 0),
      );
      let prefix = PREFIXES[0]!;
      for (let k = 0; k < PREFIXES.length; k++) {
        pick -= weights[k]!;
        if (pick <= 0) {
          prefix = PREFIXES[k]!;
          break;
        }
      }
      out = { room: i, door, centre: centreOf(f, r), prefix };
      break;
    }
  }
  cache.set(f, out);
  return out;
}

/** The run's current level's rumble room, if it has one. */
export function runRumbleRoom(run: DungeonRun, f: Floor): RumbleRoom | null {
  return run.zone ? null : rumbleRoomOf(f, run.seed, run.depth);
}

/** The key a rumble on this level carries (`tacticsEnd.key`): its level id. */
export function rumbleKey(run: DungeonRun): string {
  return `rumble:${levelIdOf(run)}`;
}

/** Whether the room on this level is still to be won (for the door's glow). */
export function rumbleOpen(run: DungeonRun, f: Floor): RumbleRoom | null {
  const rr = runRumbleRoom(run, f);
  return rr && !run.rumble?.done.includes(rumbleKey(run)) ? rr : null;
}

/** The champion pack's prefix, laid on the slice's foes once they exist. */
function applyPrefix(s: TacticsState, prefix: RumblePrefix): void {
  for (const u of s.units) {
    if (u.c.side !== 1) continue;
    if (prefix === 'fluffy') {
      u.c.maxHp = Math.round(u.c.maxHp * R.fluffyHp);
      u.c.hp = u.c.maxHp;
    } else if (prefix === 'speedy') {
      u.c.zip = Math.round(u.c.zip * R.speedyZip);
      u.move += 1;
    } else {
      const hug = (moves: string[]) => {
        if (moves.includes('bear-hug')) return;
        if (moves.length >= 4) moves[moves.length - 1] = 'bear-hug';
        else moves.push('bear-hug');
      };
      hug(u.c.moves);
      for (const p of u.phases ?? []) hug(p.moveset);
    }
  }
}

/**
 * Live steps on a level with a rumble room: walking in starts the bout, stepping out re-arms a
 * room that was lost. Callers skip it while any fight is on.
 */
export function stepRumble(world: World, run: DungeonRun, f: Floor, events: SimEvent[]): void {
  const rr = rumbleOpen(run, f);
  if (!rr) return;
  const key = rumbleKey(run);
  const inside = inBox(f.rooms[rr.room]!, cellOf(f, world.keeper.pos));
  if (!inside) {
    if (run.rumble?.wait === key) delete run.rumble.wait;
    return;
  }
  if (run.rumble?.wait === key || world.tactics || (world.battle && !world.battle.result)) return;
  const state = (run.rumble ??= { done: [] });
  state.wait = key;
  const ok = startRumble(world, events, {
    depth: run.depth,
    ids: run.party,
    source: HOLLOW_BATTLE_SOURCE,
    key,
    floor: f,
    near: rr.centre,
  });
  if (!ok || !world.tactics) return;
  applyPrefix(world.tactics, rr.prefix);
  world.keeper.moveTarget = null;
  world.keeper.intent = null;
  events.push({ kind: 'rumbleRoom', phase: 'start', prefix: rr.prefix, loot: null });
}

/**
 * The tactics core's hook: a Hollow rumble that just ended (`tacticsEnd` among `fresh`) books
 * the room and opens its chest on a win.
 */
export function rumbleEnded(world: World, fresh: SimEvent[], events: SimEvent[]): void {
  const run = world.dungeon;
  if (!run) return;
  const key = rumbleKey(run);
  for (const e of fresh) {
    if (e.kind !== 'tacticsEnd' || e.source !== HOLLOW_BATTLE_SOURCE || e.key !== key) continue;
    const f = runFloor(world);
    const prefix = (f && runRumbleRoom(run, f)?.prefix) ?? 'fluffy';
    if (e.winner !== 0) {
      events.push({ kind: 'rumbleRoom', phase: 'lost', prefix, loot: null });
      return;
    }
    const state = (run.rumble ??= { done: [] });
    if (!state.done.includes(key)) state.done.push(key);
    run.haul.shells += e.shells;
    const loot = openChest(world, new Rng((world.tactics?.seed ?? run.seed) + 31));
    if (loot.kind === 'shells') run.haul.shells += loot.amount;
    else run.haul.items += 1;
    events.push({ kind: 'rumbleRoom', phase: 'won', prefix, loot });
    return;
  }
}

function openChest(
  world: World,
  rng: Rng,
): { kind: 'hat' | 'critter' | 'shells'; param: string; amount: number } {
  const hats = HAT_IDS.filter((h) => !world.inventory.hats.includes(h));
  if (hats.length && rng.chance(R.hatChance)) {
    const hat = rng.pick(hats);
    world.inventory.hats.push(hat);
    return { kind: 'hat', param: hat, amount: 1 };
  }
  if (rng.chance(R.critterChance)) {
    const id = rng.pick(CRITTER_SPECIES).id;
    world.inventory.critters[id] = (world.inventory.critters[id] ?? 0) + 1;
    return { kind: 'critter', param: id, amount: 1 };
  }
  world.inventory.shells += R.shells;
  return { kind: 'shells', param: '', amount: R.shells };
}
