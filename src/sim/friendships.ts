import { FRIENDS } from '../config/tuning';
import { FRIENDS_AWAY } from '../config/tuning-fun-r7';
import { stepPairPlay } from './pair-play';
import type { Nubbin, SimEvent, World } from './types';

/**
 * Friendships between Nubbins: time spent near each other builds a score; at the
 * buddy mark they seek each other out to chat (the behaviour loop handles the visit).
 */
export function friendship(a: Nubbin, b: Nubbin): number {
  return a.friends?.[b.id] ?? 0;
}

export function bestFriend(world: World, n: Nubbin): Nubbin | null {
  let best: Nubbin | null = null;
  let score = 0;
  for (const [id, v] of Object.entries(n.friends ?? {})) {
    if (v > score) {
      const other = world.nubbins.find((x) => x.id === id);
      if (other) {
        best = other;
        score = v;
      }
    }
  }
  return score >= FRIENDS.buddyAt ? best : null;
}

export function stepFriendships(world: World, dtMs: number, events: SimEvent[]): void {
  // R0330 (FUN-41): Nubbins near each other play together now and then.
  stepPairPlay(world, events);
  const minutes = dtMs / 60_000;
  const live = world.nubbins.filter((n) => n.stage !== 'egg' && n.stage !== 'cocoon');
  for (let i = 0; i < live.length; i++) {
    for (let j = i + 1; j < live.length; j++) {
      const a = live[i]!;
      const b = live[j]!;
      if (Math.hypot(a.pos.x - b.pos.x, a.pos.z - b.pos.z) > FRIENDS.reach) continue;
      a.friends ??= {};
      b.friends ??= {};
      const before = a.friends[b.id] ?? 0;
      const after = Math.min(100, before + FRIENDS.perMinute * minutes);
      a.friends[b.id] = after;
      b.friends[a.id] = after;
      if (before < FRIENDS.buddyAt && after >= FRIENDS.buddyAt) {
        events.push({ kind: 'friendsMade', a: a.id, b: b.id });
      }
    }
  }
  // Friends who moved on are forgotten slowly (R0539): a friend away on a trip, a stray or
  // a minigame fades a little each minute; a buddy who departed is remembered by name.
  for (const n of live) {
    for (const id of Object.keys(n.friends ?? {})) {
      if (world.nubbins.some((x) => x.id === id)) continue;
      const score = n.friends[id]!;
      const flower = world.memorials.find((m) => m.id === `memorial-${id}`);
      if (flower && score >= FRIENDS.buddyAt && !n.remembered?.some((r) => r.id === id)) {
        n.remembered = [
          ...(n.remembered ?? []),
          { id, name: flower.name, atMs: world.timeMs },
        ].slice(-FRIENDS_AWAY.remember);
      }
      const left = score - FRIENDS_AWAY.decayPerMinute * minutes;
      if (left > 0 && !flower) n.friends[id] = left;
      else delete n.friends[id];
    }
  }
}
