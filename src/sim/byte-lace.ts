/**
 * R0366 (FUN-77): Byte's shoelace, Moss's running joke with him (STORY-BIBLE). Before
 * Lantern Night (c4-close) it is tied. From then on it is undone, except on every few Grove
 * days, when Moss has stopped by and Byte has tied it; it is undone again the day after.
 * From chapter 12 on it stays tied, a quiet callback. Derived from the clock and the
 * campaign, so it needs no save field. Pure sim: no DOM, randomness only from the Rng given.
 */
import { BYTE_LACE_BARKS } from '../content/barks';
import { FUN_R10 } from '../config/tuning-fun-r10';
import { storyDay } from './side-rule-kit';
import type { Rng } from './rng';
import { STORY } from '../config/tuning';
import { mossOnHill, mossSeat } from './roster';
import type { Npc, SimEvent, Vec2, World } from './types';

export type LaceState = 'tied' | 'untied' | 'kept';

/** Byte's lace now: `kept` is tied for good (chapter 12 on). */
export function byteLace(world: World): LaceState {
  const c = world.campaign;
  if (!c || c.storyline || c.chapter < 4) return 'tied';
  if (c.chapter >= 12) return 'kept';
  if (c.chapter === 4 && !c.seen.includes('c4-close')) return 'tied';
  return storyDay(world.timeMs) % FUN_R10.laceTieEveryDays === 0 ? 'tied' : 'untied';
}

/** Whether the lace is undone (what a renderer draws). */
export function byteLaceUntied(world: World): boolean {
  return byteLace(world) === 'untied';
}

const laceNoted = new WeakMap<World, number>();

/**
 * A lace line for a tap on Byte, or null for an everyday bark. Before Lantern Night there
 * is no joke yet; after it, the first tap on a day the lace is undone mentions it, and
 * half the taps after that.
 */
export function laceBark(world: World, rng: Rng): string | null {
  const c = world.campaign;
  if (!c || c.storyline || c.chapter < 4 || (c.chapter >= 9 && c.chapter <= 11)) return null;
  if (c.chapter === 4 && !c.seen.includes('c4-close')) return null;
  const state = byteLace(world);
  // The first tap on a day his lace is undone always gets the lace: the tap that finds it.
  const day = storyDay(world.timeMs);
  const first = state === 'untied' && laceNoted.get(world) !== day;
  if (!first && !rng.chance(FUN_R10.laceBarkChance)) return null;
  if (state === 'untied') laceNoted.set(world, day);
  const pool = BYTE_LACE_BARKS[state];
  return pool[rng.int(0, pool.length - 1)] ?? null;
}

/**
 * The visit: on a tie day (chapters 4 to 11), Byte spends the first third of the morning
 * beside Moss (on his seat on the hill, or wherever Moss is once he has come down), and
 * says one line when he gets there. That is when the lace gets tied. Null on other days,
 * for other Keepers, or when Moss is not in the Grove.
 */
export function laceVisitSpot(world: World, npc: Npc): Vec2 | null {
  const c = world.campaign;
  if (npc.trainer !== 'byte' || !c || c.chapter > 11 || byteLace(world) !== 'tied') return null;
  if (c.chapter === 4 && !c.seen.includes('c4-close')) return null;
  if (c.chapter < 4 || world.location !== 'grove') return null;
  const t = world.timeMs % STORY.dayMs;
  if (t >= STORY.dayMs * FUN_R10.laceVisitShare) return null;
  const moss = c.mossId ? world.nubbins.find((n) => n.id === c.mossId) : undefined;
  if (!moss) return null;
  const at = mossOnHill(world, moss.id) ? mossSeat(world) : moss.pos;
  return { x: at.x + 1.1, z: at.z + 0.4 };
}

const visitSaid = new WeakMap<World, number>();

/** On arrival at Moss: one lace line in the routine bubble, once a day. True when handled. */
export function laceVisitArrived(world: World, npc: Npc, events: SimEvent[]): boolean {
  if (!laceVisitSpot(world, npc)) return false;
  const day = storyDay(world.timeMs);
  if (visitSaid.get(world) === day) return true;
  visitSaid.set(world, day);
  const lines = BYTE_LACE_BARKS.visit;
  const text = `👟 ${lines[day % lines.length]!}`;
  events.push({ kind: 'npcBark', npcId: npc.id, text, station: 'lace' });
  return true;
}
