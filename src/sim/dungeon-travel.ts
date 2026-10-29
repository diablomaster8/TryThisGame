/**
 * Getting about the Hollow without starting over (lane B round 2): climbing back up a level,
 * waypoint stones (R0148, DUNG-08), the acts' "New paths" reroll (R0149, DUNG-09) and the
 * Homing Acorn portal home and back (R0150, DUNG-10). Every move between levels goes through
 * `goToLevel`, which remembers the level left and restores the one reached (R0151).
 *
 * Pure sim: no DOM.
 */
import { HOLLOW } from '../config/tuning';
import { actOpen, actProgress } from './dungeon-acts';
import { actStartDepth } from '../config/dungeon-acts';
import {
  cellCentre,
  cellOf,
  dailySeed,
  enterDungeon,
  floorOfRun,
  hashString,
  placeParty,
  populate,
  returnHome,
  runFloor,
  type Cell,
  type Floor,
} from './dungeon';
import {
  actSeed,
  levelIdOf,
  parseLevelId,
  rememberLevel,
  rerollActSeeds,
  restoreLevel,
  waypointCell,
  waypointHere,
} from './dungeon-levels';
import type { Rng } from './rng';
import { goToZone } from './dungeon-zones';
import type { DungeonRun, SimEvent, World } from './types';

/**
 * Moves the run to `depth` and puts the party at the stairs up or down, the waypoint stone, or
 * a given cell. The level left is remembered first unless `remember` is false.
 */
export function goToLevel(
  world: World,
  run: DungeonRun,
  depth: number,
  arrive: 'up' | 'down' | 'waypoint' | Cell,
  events: SimEvent[],
  remember = true,
): void {
  if (remember) rememberLevel(run);
  // A dungeon level is never a camp, field or side cave (R0147, R0152).
  delete run.zone;
  delete run.side;
  run.depth = depth;
  run.genVersion = run.story ? 2 : HOLLOW.genVersion;
  const f = floorOfRun(run);
  populate(run, f);
  restoreLevel(run);
  run.graceUntilMs = world.timeMs + HOLLOW.arrivalGraceMs;
  const cell =
    arrive === 'up'
      ? f.stairsUp
      : arrive === 'down'
        ? (f.stairsDown ?? f.stairsUp)
        : arrive === 'waypoint'
          ? waypointCell(f)
          : arrive;
  placeParty(world, run, f, cell);
  if (run.act !== undefined) {
    const p = actProgress(world, run.act);
    p.deepest = Math.max(p.deepest, run.depth - actStartDepth(run.act) + 1);
  }
  world.hollow.best = Math.max(world.hollow.best, run.depth);
  events.push({ kind: 'levelChanged', depth: run.depth });
}

// ---------------------------------------------------------------- waypoints (R0148)

/** The waypoint the Keeper stands on, if this level has one; null otherwise. */
export function standingOnWaypoint(world: World): string | null {
  const run = world.dungeon;
  const f = runFloor(world);
  if (!run || !f) return null;
  const id = waypointHere(run);
  if (!id) return null;
  const at = cellCentre(f, waypointCell(f));
  const k = world.keeper.pos;
  return Math.hypot(k.x - at.x, k.z - at.z) <= HOLLOW.waypoints.reach ? id : null;
}

/** Each step: walking onto a stone wakes it for good, with a chime. */
export function stepWaypoint(world: World, run: DungeonRun, f: Floor, events: SimEvent[]): void {
  if (run.encounter) return;
  const id = waypointHere(run);
  if (!id || world.hollow.waypoints.includes(id)) return;
  const at = cellCentre(f, waypointCell(f));
  const k = world.keeper.pos;
  if (Math.hypot(k.x - at.x, k.z - at.z) > HOLLOW.waypoints.reach) return;
  world.hollow.waypoints.push(id);
  events.push({ kind: 'waypointActivated', id });
}

/**
 * Travel to waypoint `id`: from the stone the Keeper stands on, or from the cave mouth in
 * the Grove. Free; only woken waypoints in open acts.
 */
export function waypointTravel(world: World, id: string, rng: Rng, events: SimEvent[]): boolean {
  const to = parseLevelId(id);
  if (!to || !world.hollow.waypoints.includes(id) || !actOpen(world, to.act)) return false;
  const run = world.dungeon;
  if (world.location === 'dungeon' && run) {
    if (run.story || run.encounter || run.loading || !standingOnWaypoint(world)) return false;
    if (levelIdOf(run) === id) return false;
    rememberLevel(run);
    if (run.act !== to.act) {
      run.act = to.act;
      run.seed = actSeed(world, to.act, rng);
    }
    if (to.zone) goToZone(world, run, to.zone, 'waypoint', events, undefined, false);
    else goToLevel(world, run, to.depth, 'waypoint', events, false);
  } else {
    if (world.location !== 'grove' || run) return false;
    if (!enterDungeon(world, false, rng, events, undefined, to.act)) return false;
    if (to.zone) goToZone(world, world.dungeon!, to.zone, 'waypoint', events, undefined, false);
    else goToLevel(world, world.dungeon!, to.depth, 'waypoint', events, false);
  }
  events.push({ kind: 'waypointArrived', id });
  return true;
}

// ---------------------------------------------------------------- new paths (R0149)

/** "New paths" from the cave mouth: the acts' layouts are redrawn, once per real day. */
export function rerollActs(world: World, events: SimEvent[]): void {
  const ok = !world.dungeon && rerollActSeeds(world, dailySeed(world.lastWallMs).day);
  events.push({ kind: 'actsRerolled', ok });
}

// ---------------------------------------------------------------- the Homing Acorn (R0150)

/** Whether a find holds a Homing Acorn: its own hash, so the floor's loot rolls stay put. */
export function acornInFind(run: DungeonRun, lootId: string): boolean {
  const roll = hashString(`acorn:${run.seed}:${run.depth}:${lootId}`) % 1000;
  return roll < HOLLOW.acorns.dropChance * 1000;
}

export function buyAcorns(world: World, events: SimEvent[]): void {
  const { bundle, price } = HOLLOW.acorns;
  const ok = world.inventory.shells >= price;
  if (ok) {
    world.inventory.shells -= price;
    world.hollow.acorns += bundle;
  }
  events.push({ kind: 'acornsBought', ok, count: ok ? bundle : 0 });
}

/** The free one each run first, then one from the pocket. */
export function canUseAcorn(world: World): boolean {
  const run = world.dungeon;
  if (!run || world.location !== 'dungeon' || run.story || run.encounter || run.loading)
    return false;
  return !run.acornUsed || world.hollow.acorns > 0;
}

/**
 * Plant an acorn: everyone falls up through a leaf-swirl to the Grove, and the run waits,
 * frozen, behind the portal until the Keeper steps back through. Planting one closes any
 * other portal.
 */
export function useAcorn(world: World, events: SimEvent[]): boolean {
  const run = world.dungeon;
  const f = runFloor(world);
  if (!run || !f || !canUseAcorn(world)) return false;
  const free = !run.acornUsed;
  if (free) run.acornUsed = true;
  else world.hollow.acorns -= 1;
  world.hollow.best = Math.max(world.hollow.best, run.depth);
  run.pending = null;
  run.pendingPos = null;
  world.hollow.portal = { levelId: levelIdOf(run), cell: cellOf(f, world.keeper.pos), run };
  returnHome(world, run);
  events.push({ kind: 'acornPortal', free });
  events.push({ kind: 'located', location: 'grove' });
  return true;
}

/** Step back through the acorn portal: the run carries on where it was left. */
export function portalReturn(world: World, events: SimEvent[]): boolean {
  const portal = world.hollow.portal;
  if (!portal || world.location !== 'grove' || world.dungeon) return false;
  const run = portal.run;
  // Whoever is still about to come back down; the Grove is where they go home to next.
  run.party = run.party.filter((id) => {
    const n = world.nubbins.find((x) => x.id === id);
    return n !== undefined && n.stage !== 'egg' && n.stage !== 'cocoon';
  });
  run.returnKeeper = { x: world.keeper.pos.x, z: world.keeper.pos.z };
  run.returnParty = Object.fromEntries(
    run.party.map((id) => {
      const n = world.nubbins.find((x) => x.id === id)!;
      return [id, { x: n.pos.x, z: n.pos.z }];
    }),
  );
  world.hollow.portal = null;
  world.dungeon = run;
  world.location = 'dungeon';
  const f = floorOfRun(run);
  placeParty(world, run, f, portal.cell);
  run.graceUntilMs = world.timeMs + HOLLOW.arrivalGraceMs;
  events.push({ kind: 'portalReturned' });
  events.push({ kind: 'levelChanged', depth: run.depth });
  events.push({ kind: 'located', location: 'dungeon' });
  return true;
}
