/**
 * R0537 (SOUL-19): which toy a Nubbin goes to and how keen it is. Its favourite (from
 * `likesOf`) counts three times over, a toy it has played with a lot bores it (boredom
 * rises by a point a play second and fades by 9 a minute, the weight floored at 0.1),
 * and a toy new to the Grove draws everyone for ten minutes. The keenness scales the play
 * row of the idle table, so toys no longer swallow the whole day. Deterministic: no rng.
 */
import { TOY_SOUL } from '../config/tuning';
import { likesOf } from './likes';
import type { Item, Nubbin, World } from './types';

const dist = (a: { x: number; z: number }, b: { x: number; z: number }): number =>
  Math.hypot(a.x - b.x, a.z - b.z);

/** Boredom with a toy now, after its fade. */
export function boredomOf(n: Nubbin, toyId: string, now: number): number {
  const b = n.toyBoredom?.[toyId];
  if (!b) return 0;
  return Math.max(0, b.v - ((now - b.at) / 60_000) * TOY_SOUL.decayPerMinute);
}

/** How keen this Nubbin is on this toy now. */
export function toyWeight(n: Nubbin, toy: Item, now: number): number {
  const fav = (toy.toy ?? 'ball') === likesOf(n).toy ? TOY_SOUL.favourite : 1;
  const bored = Math.max(TOY_SOUL.floor, 1 - boredomOf(n, toy.id, now) / TOY_SOUL.boredAt);
  const novel = toy.bornMs !== undefined && now - toy.bornMs < TOY_SOUL.noveltyMs;
  return fav * bored * (novel ? TOY_SOUL.novelty : 1);
}

/**
 * The toy it would go to, and how keen it is (1 is an ordinary toy it has never tired of,
 * scaled by `TOY_SOUL.keen`, so a fresh favourite is three times the old flat odds). Nearer
 * toys win ties: keenness over a walk of six units counts once, farther ones less.
 */
export function favouredToy(
  world: World,
  n: Nubbin,
  now: number,
): { toy: Item; keen: number } | null {
  let best: Item | null = null;
  let bestScore = -Infinity;
  let keen = 0;
  for (const item of world.items) {
    if (item.kind !== 'toy') continue;
    const w = toyWeight(n, item, now);
    const score = w / Math.max(1, dist(n.pos, item.pos) / 6);
    if (score > bestScore) {
      bestScore = score;
      best = item;
      keen = w;
    }
  }
  return best ? { toy: best, keen: keen * TOY_SOUL.keen } : null;
}

/** A play step: boredom with this toy rises (stored with when, so it fades lazily). */
export function noteToyPlay(n: Nubbin, toyId: string, dtMs: number, now: number): void {
  const b = boredomOf(n, toyId, now) + (dtMs / 1000) * TOY_SOUL.perPlaySecond;
  (n.toyBoredom ??= {})[toyId] = { v: b, at: now };
}
