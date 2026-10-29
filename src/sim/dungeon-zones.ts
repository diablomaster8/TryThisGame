/**
 * Getting about an act above ground (R0147, R0152): the camp, the fields and their side
 * caves, as zones of an act run (`DungeonRun.zone`). The way runs
 *
 *   Grove ⇄ camp (road home ⇄ gate) ⇄ fields (camp gate ⇄ act gate) ⇄ the act's level 1,
 *   and fields (cave mouth) ⇄ side cave (stairs up).
 *
 * A zone stands at the act's top depth, so foes and finds scale as on level 1. Zones are
 * remembered like levels (`rememberLevel`, ids `rootways.town`, `rootways.field`,
 * `rootways.side2`), so beaten packs and taken finds stay so.
 *
 * Pure sim: no DOM.
 */
import { ACTS, actStartDepth } from '../config/dungeon-acts';
import { DUNGEON, HOLLOW, HOLLOW_ZONES } from '../config/tuning';
import {
  cellCentre,
  enterDungeon,
  floorOfRun,
  placeParty,
  populate,
  runFloor,
  type Cell,
  type Floor,
} from './dungeon';
import { rememberLevel, restoreLevel, waypointCell } from './dungeon-levels';
import { fieldFloor, sideFloor } from './dungeon-outdoor';
import { townFloor } from './dungeon-towns';
import type { Rng } from './rng';
import type { DungeonRun, DungeonZone, SimEvent, World } from './types';

/** The floor of the zone a run stands in; null on a dungeon level. */
export function zoneFloor(run: DungeonRun): Floor | null {
  if (!run.zone || run.act === undefined) return null;
  if (run.zone === 'town') return townFloor(run.act);
  if (run.zone === 'field') return fieldFloor(run.seed, run.act);
  return sideFloor(run.seed, run.act, run.side ?? 0);
}

/** The level id of a zone (`rootways.town`), or null on a dungeon level. */
export function zoneLevelId(run: Pick<DungeonRun, 'act' | 'zone' | 'side'>): string | null {
  if (!run.zone || run.act === undefined) return null;
  const name = ACTS[run.act]!.id;
  return run.zone === 'side' ? `${name}.side${run.side ?? 0}` : `${name}.${run.zone}`;
}

/**
 * Moves the run into zone `zone` of its act (null: back onto the act's level 1) and puts the
 * party at the stairs up or down, the waypoint stone, or a given cell.
 */
export function goToZone(
  world: World,
  run: DungeonRun,
  zone: DungeonZone | null,
  arrive: 'up' | 'down' | 'waypoint' | Cell,
  events: SimEvent[],
  side?: number,
  remember = true,
): void {
  if (run.act === undefined) return;
  if (remember) rememberLevel(run);
  if (zone) run.zone = zone;
  else delete run.zone;
  if (zone === 'side' && side !== undefined) run.side = side;
  else delete run.side;
  run.depth = actStartDepth(run.act);
  run.genVersion = HOLLOW.genVersion;
  const f = floorOfRun(run);
  populate(run, f);
  restoreLevel(run);
  // The stash chest is a service, never a find.
  if (f.zone === 'town') run.chestOpen = true;
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
  events.push({ kind: 'levelChanged', depth: run.depth });
}

/** From the cave mouth: into act `act`'s camp, at the road home. */
export function enterTown(world: World, act: number, rng: Rng, events: SimEvent[]): boolean {
  if (!enterDungeon(world, false, rng, events, undefined, act)) return false;
  goToZone(world, world.dungeon!, 'town', 'up', events, undefined, false);
  return true;
}

/**
 * The stairs up or down in a zone, or up from an act's level 1 onto its fields. True when
 * handled; false leaves the stairs to the dungeon's own rules.
 */
export function zoneStairs(
  world: World,
  run: DungeonRun,
  dir: 'up' | 'down',
  events: SimEvent[],
): boolean {
  if (run.act === undefined || run.story) return false;
  const top = actStartDepth(run.act);
  if (!run.zone) {
    if (dir !== 'up' || run.depth !== top) return false;
    goToZone(world, run, 'field', 'down', events);
    return true;
  }
  if (run.zone === 'town') {
    if (dir === 'up') return false;
    goToZone(world, run, 'field', 'up', events);
    return true;
  }
  if (run.zone === 'field') {
    if (dir === 'up') goToZone(world, run, 'town', 'down', events);
    else goToZone(world, run, null, 'up', events);
    return true;
  }
  // A side cave's stairs up come out at its mouth.
  if (dir === 'up') {
    const mouths = fieldFloor(run.seed, run.act).mouths ?? [];
    const m = mouths[run.side ?? 0];
    goToZone(world, run, 'field', m ? { x: m.x, y: m.y + 1 } : 'up', events);
  }
  return true;
}

/** The cave mouth the Keeper stands at, by index; null when none. */
export function mouthHere(world: World): number | null {
  const run = world.dungeon;
  const f = runFloor(world);
  if (!run || !f?.mouths || run.encounter) return null;
  const k = world.keeper.pos;
  const reach = HOLLOW_ZONES.reach + DUNGEON.cell * 0.5;
  const i = f.mouths.findIndex((m) => {
    const p = cellCentre(f, m);
    return Math.hypot(k.x - p.x, k.z - p.z) <= reach;
  });
  return i < 0 ? null : i;
}

/** Into the side cave whose mouth the Keeper stands at. */
export function enterMouth(world: World, events: SimEvent[]): boolean {
  const run = world.dungeon;
  const i = mouthHere(world);
  if (!run || i === null || run.loading) return false;
  goToZone(world, run, 'side', 'up', events, i);
  events.push({ kind: 'sideCaveEntered', index: i });
  return true;
}
