/**
 * R0574 (SOUL-57): toys for two. A seesaw or sandbox with two Nubbins playing on it counts
 * its players, settles them into the two ends, builds their friendship and tells the
 * renderers to rock (`rockTilt`). One Nubbin alone just plays; the others see a waiting
 * one as a reason to come (see `toyWeight`). Deterministic: no rng.
 */
import { TOY_PAIR } from '../config/tuning-soul-r11a';
import type { Item, Nubbin, World } from './types';

export function isPairToy(kind: string | undefined): boolean {
  return !!kind && TOY_PAIR.pairKinds.includes(kind);
}

/** Nubbins playing on this toy right now (arrived, or with `walking`, still on the way). */
export function playersOn(world: World, toy: Item, walking = false): Nubbin[] {
  return world.nubbins.filter(
    (m) =>
      m.behavior.state === 'play' &&
      m.behavior.itemId === toy.id &&
      (walking || !m.behavior.target),
  );
}

/** The seesaw's tilt, -1 to 1: it rocks only while two are on it. */
export function rockTilt(toy: { players?: number }, timeMs: number): number {
  return (toy.players ?? 0) >= 2 ? Math.sin((timeMs / TOY_PAIR.rockMs) * Math.PI * 2) : 0;
}

export function stepToyPairs(world: World, dtMs: number): void {
  for (const toy of world.items) {
    if (toy.kind !== 'toy' || !isPairToy(toy.toy)) continue;
    const on = playersOn(world, toy).sort((a, b) => (a.id < b.id ? -1 : 1));
    if (on.length === 0) {
      if (toy.players !== undefined) delete toy.players;
      continue;
    }
    toy.players = Math.min(2, on.length);
    if (on.length < 2) continue;
    const pair = on.slice(0, 2) as [Nubbin, Nubbin];
    pair.forEach((n, i) => {
      const tx = toy.pos.x + (i === 0 ? -1 : 1) * TOY_PAIR.slot;
      n.pos.x += (tx - n.pos.x) * TOY_PAIR.settle;
      n.pos.z += (toy.pos.z - n.pos.z) * TOY_PAIR.settle;
    });
    const [a, b] = pair;
    const add = (dtMs / 60_000) * TOY_PAIR.friendPerMinute;
    a.friends = { ...(a.friends ?? {}), [b.id]: (a.friends?.[b.id] ?? 0) + add };
    b.friends = { ...(b.friends ?? {}), [a.id]: (b.friends?.[a.id] ?? 0) + add };
  }
}
