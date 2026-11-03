/**
 * Lane C round 11, helper "profiles" (R0638, CAMP-46): the fun-quest packs as questlines.
 * A pack is a numbered family of capers (Q1–Q20 the Python pack, and so on, in
 * `PACKS.ranges`). Finishing every caper of a pack keeps a one-time pack keepsake,
 * `pack-<id>`, in `inventory.keepsakes`; walking a caper again gives nothing more. Pure.
 */
import { PACKS } from '../config/tuning-camp11-profiles';
import type { CampaignState, SimEvent, World } from './types';

export type PackId = (typeof PACKS.ranges)[number]['id'];

/** A caper's id from its number: 1 → `q01`, 66 → `q66`. */
export function caperId(n: number): string {
  return `q${String(n).padStart(2, '0')}`;
}

/** The pack a caper id belongs to, or null (side stories, Neopia, anything unnumbered). */
export function packOf(questId: string): PackId | null {
  const m = /^q(\d+)$/.exec(questId);
  if (!m) return null;
  const n = Number(m[1]);
  return PACKS.ranges.find((r) => n >= r.from && n <= r.to)?.id ?? null;
}

/** A pack's capers in order. */
export function packQuests(id: PackId): string[] {
  const r = PACKS.ranges.find((x) => x.id === id);
  if (!r) return [];
  return Array.from({ length: r.to - r.from + 1 }, (_, i) => caperId(r.from + i));
}

/** How far a pack is: capers done of all, and the first not done (null once all are). */
export function packProgress(
  c: CampaignState,
  id: PackId,
): { done: number; of: number; next: string | null } {
  const ids = packQuests(id);
  const isDone = (q: string): boolean => c.fun[q]?.status === 'done';
  return {
    done: ids.filter(isDone).length,
    of: ids.length,
    next: ids.find((q) => !isDone(q)) ?? null,
  };
}

export function packKeepsake(id: PackId): string {
  return `pack-${id}`;
}

/** After a caper is done: the pack's keepsake, once, when its last caper closed. */
export function grantPackReward(
  world: World,
  c: CampaignState,
  questId: string,
  events: SimEvent[],
): boolean {
  const id = packOf(questId);
  if (!id) return false;
  const p = packProgress(c, id);
  const keepsake = packKeepsake(id);
  if (p.done < p.of || world.inventory.keepsakes.includes(keepsake)) return false;
  world.inventory.keepsakes.push(keepsake);
  events.push({ kind: 'keepsake', id: keepsake, quest: `pack:${id}` });
  return true;
}
