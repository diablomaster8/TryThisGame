import { FRIENDS } from '../config/tuning';
import { FRIENDS_AWAY } from '../config/tuning-fun-r7';
import { stepPairPlay } from './pair-play';
import { addHappiness } from './needs';
import { isFree } from './nubbin';
import { areRivals, compat, flushRivalEvents, stepRivals } from './rivals';
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
  stepReunions(world, events);
  flushRivalEvents(events);
  // R0330 (FUN-41): Nubbins near each other play together now and then.
  stepPairPlay(world, events);
  const minutes = dtMs / 60_000;
  const live = world.nubbins.filter((n) => n.stage !== 'egg' && n.stage !== 'cocoon');
  for (let i = 0; i < live.length; i++) {
    for (let j = i + 1; j < live.length; j++) {
      const a = live[i]!;
      const b = live[j]!;
      const near = Math.hypot(a.pos.x - b.pos.x, a.pos.z - b.pos.z) <= FRIENDS.reach;
      // R0538 (lane A r10): rivalry's friction, puffs and making up (live play only).
      stepRivals(world, a, b, near, minutes, events);
      if (!near) continue;
      a.friends ??= {};
      b.friends ??= {};
      const before = a.friends[b.id] ?? 0;
      // R0538: how fast they warm to each other depends on how their personalities fit.
      // Rivals near each other work toward making up instead (sim/rivals.ts).
      const gain = areRivals(a, b) ? 0 : FRIENDS.perMinute * compat(a, b) * minutes;
      const after = Math.min(100, before + gain);
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
      // Lane A r8 (R0539): a buddy away (not departed) is missed, for the hug when it is back.
      if (!flower && score >= FRIENDS.buddyAt && !n.missing?.includes(id))
        n.missing = [...(n.missing ?? []), id];
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
  // R0538 (lane A r10): a grudge against one no longer in the Grove is let go.
  for (const n of live) {
    if (!n.rivals) continue;
    const gone = Object.keys(n.rivals).filter((id) => !world.nubbins.some((x) => x.id === id));
    if (!gone.length) continue;
    const r = { ...n.rivals };
    for (const id of gone) delete r[id];
    if (Object.keys(r).length) n.rivals = r;
    else delete n.rivals;
  }
}

/**
 * R0539 (lane A r8): a missed buddy back in the Grove (a stray home, a friend back from a
 * trip) gets a reunion hug: both turn to each other with a heart and a little cheer.
 */
function stepReunions(world: World, events: SimEvent[]): void {
  for (const n of world.nubbins) {
    if (!n.missing?.length) continue;
    const back = n.missing.filter((id) => world.nubbins.some((x) => x.id === id));
    if (!back.length) continue;
    n.missing = n.missing.filter((id) => !back.includes(id));
    if (!n.missing.length) delete n.missing;
    for (const id of back) {
      const o = world.nubbins.find((x) => x.id === id)!;
      if (n.stage === 'egg' || o.stage === 'egg') continue;
      for (const [a, b] of [
        [n, o],
        [o, n],
      ] as const) {
        addHappiness(a, FRIENDS_AWAY.reunionHappiness);
        if (!isFree(a)) continue;
        a.behavior.state = 'react';
        a.behavior.sinceMs = world.timeMs;
        a.behavior.untilMs = world.timeMs + FRIENDS_AWAY.reunionMs;
        a.behavior.target = null;
        a.behavior.itemId = null;
        a.behavior.reaction = 'love';
        a.facing = Math.atan2(b.pos.x - a.pos.x, b.pos.z - a.pos.z);
      }
      events.push({ kind: 'reunion', a: n.id, b: o.id });
      events.push({ kind: 'reaction', nubbinId: n.id, reaction: 'love' });
      events.push({ kind: 'reaction', nubbinId: o.id, reaction: 'love' });
    }
  }
}
