import { NPC_ROUTINE } from '../config/tuning';
import { STORY } from '../config/tuning';
import { ROUTINES, type RoutineStation } from '../content/routines';
import { blocked } from './obstacles';
import { noteNpcSaid } from './npc-chatter';
import { laceVisitArrived, laceVisitSpot } from './byte-lace'; /* Lane E r10, R0366 */
import { hashSeed, Rng } from './rng';
import type { Npc, SimEvent, Vec2, World } from './types';

/**
 * R0296 (FUN-07): the Keepers' daily antics. Each story day picks three of a Keeper's
 * stations (seeded by the day and the Keeper, never the world's generator, so the rest of
 * the sim's dice are untouched), one for each third of the day; the Keeper walks there,
 * says one of its lines in a bubble on arrival, and potters round it until the next third.
 * Nothing here is saved: the station is read from the clock, and the last line said is
 * kept beside the world. Routines hold while a scene is up (stepNpcs already stops them).
 */

interface RoutineMemo {
  /** Per Keeper: the station visit (`day:slot`) already announced. */
  said: Map<string, string>;
  /** Per Keeper: lines said so far (to take them in turn). */
  turns: Map<string, number>;
  /** Open ground found near each station, by `trainer:station`. */
  spots: Map<string, Vec2>;
}
const memos = new WeakMap<World, RoutineMemo>();

function memoOf(world: World): RoutineMemo {
  let m = memos.get(world);
  if (!m) {
    m = { said: new Map(), turns: new Map(), spots: new Map() };
    memos.set(world, m);
  }
  return m;
}

const isNight = (ms: number): boolean => ms % STORY.dayMs >= STORY.duskAt * STORY.dayMs;

/** The station a Keeper is at now (null for a Keeper with no routine), and its visit key. */
export function currentStation(
  trainer: string,
  timeMs: number,
): { station: RoutineStation; visit: string } | null {
  const day = Math.floor(timeMs / STORY.dayMs);
  const slot = Math.floor(((timeMs % STORY.dayMs) / STORY.dayMs) * NPC_ROUTINE.perDay);
  const night = isNight(timeMs);
  // Asked every step by each walking Keeper: the answer only changes a few times a day.
  const key = `${day}:${slot}:${night ? 1 : 0}`;
  const hit = lastStation.get(trainer);
  if (hit && hit.key === key) return hit.value;
  const value = pickStation(trainer, day, slot, night);
  lastStation.set(trainer, { key, value });
  return value;
}

const lastStation = new Map<
  string,
  { key: string; value: { station: RoutineStation; visit: string } | null }
>();

function pickStation(
  trainer: string,
  day: number,
  slot: number,
  night: boolean,
): { station: RoutineStation; visit: string } | null {
  const all = ROUTINES[trainer];
  if (!all?.length) return null;
  const pool = all.filter((s) => !s.when || s.when === (night ? 'night' : 'day'));
  if (pool.length === 0) return null;
  const rng = new Rng(hashSeed(`${trainer}:${day}:${night ? 'n' : 'd'}`));
  const order = [...pool];
  for (let i = order.length - 1; i > 0; i--) {
    const j = rng.int(0, i);
    [order[i], order[j]] = [order[j]!, order[i]!];
  }
  const station = order[slot % order.length]!;
  return { station, visit: `${day}:${slot}:${station.id}` };
}

/** The open spot to stand at for a station: the station, or the nearest open point round it. */
export function stationSpot(world: World, trainer: string, s: RoutineStation): Vec2 {
  const memo = memoOf(world);
  const key = `${trainer}:${s.id}`;
  const cached = memo.spots.get(key);
  if (cached && !blocked(cached, world, NPC_ROUTINE.radius, 'keeper')) return cached;
  let spot: Vec2 = { x: s.x, z: s.z };
  search: for (let r = 0; r <= 4; r += 0.75)
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2;
      const p = { x: s.x + Math.cos(a) * r, z: s.z + Math.sin(a) * r };
      if (!blocked(p, world, NPC_ROUTINE.radius, 'keeper')) {
        spot = p;
        break search;
      }
      if (r === 0) break;
    }
  memo.spots.set(key, spot);
  return spot;
}

/** Where a Keeper wants to be now: the current station's spot, or null for no routine. */
export function routineTarget(world: World, npc: Npc): Vec2 | null {
  // R0366 (lane E r10): on a tie day Byte's morning is spent beside Moss.
  const lace = laceVisitSpot(world, npc);
  if (lace) return lace;
  const cur = currentStation(npc.trainer, world.timeMs);
  return cur ? stationSpot(world, npc.trainer, cur.station) : null;
}

/** On arrival at a station: one line from it in a bubble, once per visit. */
export function routineArrived(world: World, npc: Npc, events: SimEvent[]): void {
  if (laceVisitArrived(world, npc, events)) return; /* R0366 (lane E r10) */
  const cur = currentStation(npc.trainer, world.timeMs);
  if (!cur) return;
  const memo = memoOf(world);
  if (memo.said.get(npc.trainer) === cur.visit) return;
  memo.said.set(npc.trainer, cur.visit);
  const n = memo.turns.get(npc.trainer) ?? 0;
  memo.turns.set(npc.trainer, n + 1);
  const lines = cur.station.lines;
  const text = `${cur.station.icon} ${lines[n % lines.length]!}`;
  events.push({ kind: 'npcBark', npcId: npc.id, text, station: cur.station.id });
  noteNpcSaid(world, npc.id);
}
