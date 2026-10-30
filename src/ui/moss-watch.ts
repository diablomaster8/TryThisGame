/**
 * R0353 (FUN-64): Moss, the old Eternal, has seen everything and is not impressed. When a
 * bonk, a fruit on the head or a throw happens within his sight (chapter 4 on), he gives
 * it a dry reaction in a bubble about one time in three (never three ignored in a row): a
 * slow blink, "Hm.", an eyebrow;
 * for a throw, only a stern look. The pick is seeded by the event and the sim clock, so the
 * same moment always gets the same answer. It reads the world and never changes it.
 */
import { MOSS_WATCH } from '../config/strings-fun-r7';
import { MOSS_WATCH_RULE } from '../config/tuning-fun-r7';
import type { SimEvent, World } from '../sim/types';

/** Eligible moments since Moss last reacted. */
let misses = 0;

/** A small stable hash of a string, 0..1. */
function unit(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return (h >>> 0) / 4294967296;
}

/** Moss's line for this event, with his id to hang the bubble on, or null. */
export function mossReaction(world: World, e: SimEvent): { mossId: string; line: string } | null {
  if (e.kind !== 'bonked' && e.kind !== 'thrown') return null;
  const c = world.campaign;
  if (!c?.mossId || c.chapter < MOSS_WATCH_RULE.fromChapter || world.location !== 'grove')
    return null;
  const moss = world.nubbins.find((n) => n.id === c.mossId);
  const who = world.nubbins.find((n) => n.id === e.nubbinId);
  if (!moss || !who || moss.id === who.id) return null;
  if (Math.hypot(moss.pos.x - who.pos.x, moss.pos.z - who.pos.z) > MOSS_WATCH_RULE.sight)
    return null;
  const r = unit(`${e.kind}:${e.nubbinId}:${Math.floor(world.timeMs / 100)}`);
  // Never three in a row ignored: he notices the third, whatever the dice say.
  if (r >= MOSS_WATCH_RULE.chance && misses < 2) {
    misses++;
    return null;
  }
  misses = 0;
  const lines = e.kind === 'thrown' ? MOSS_WATCH.throw : MOSS_WATCH.bonk;
  return { mossId: moss.id, line: lines[Math.floor(r * lines.length)]! };
}
