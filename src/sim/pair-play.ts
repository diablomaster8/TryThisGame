/**
 * R0330 (FUN-41): Nubbins play together. A Nubbin near one that just reacted copies it
 * half a beat late; two walkers that meet bump and both react (a cheerful one laughs, a
 * shy one is startled); two after the same fruit tug, the hungrier wins and the other is
 * left in a spin. Rolls are hashes of the pair and the moment, so the world's dice are
 * untouched; friends (`friendsMade`) play twice as often. Nothing here changes stats.
 */
import { FRIENDS } from '../config/tuning';
import { PAIR_PLAY } from '../config/tuning-fun';
import { react } from './behavior';
import { hashSeed } from './rng';
import type { Nubbin, Reaction, SimEvent, World } from './types';

interface Memo {
  /** Per Nubbin: when it may play again. */
  rest: Map<string, number>;
  /** Copies waiting to happen: who, what, when. */
  copies: Array<{ id: string; reaction: Reaction; at: number }>;
}
const memos = new WeakMap<World, Memo>();

function memoOf(world: World): Memo {
  let m = memos.get(world);
  if (!m) {
    m = { rest: new Map(), copies: [] };
    memos.set(world, m);
  }
  return m;
}

const busy = (n: Nubbin): boolean =>
  n.stage === 'egg' ||
  n.stage === 'cocoon' ||
  ['held', 'thrown', 'nap', 'swim', 'eat'].includes(n.behavior.state);

function roll(a: Nubbin, b: Nubbin, at: number, perMille: number): boolean {
  const friends = (a.friends?.[b.id] ?? 0) >= FRIENDS.buddyAt ? 2 : 1;
  return (hashSeed(`${a.id}|${b.id}|${at}`) >>> 0) % 1000 < perMille * friends;
}

export function stepPairPlay(world: World, events: SimEvent[]): void {
  if (world.location !== 'grove' || world.nubbins.length < 2) return;
  const now = world.timeMs;
  const m = memoOf(world);
  const ready = (n: Nubbin): boolean => !busy(n) && (m.rest.get(n.id) ?? 0) <= now;
  // Copies that are due.
  if (m.copies.length > 0) {
    for (const c of m.copies.filter((x) => x.at <= now)) {
      const n = world.nubbins.find((x) => x.id === c.id);
      if (n && !busy(n)) react(n, c.reaction, now, events);
    }
    m.copies = m.copies.filter((x) => x.at > now);
  }
  const live = world.nubbins;
  for (let i = 0; i < live.length; i++) {
    const a = live[i]!;
    for (let j = 0; j < live.length; j++) {
      if (i === j) continue;
      const b = live[j]!;
      // Copycat: b just started a reaction; a, near and free, copies it half a beat late.
      const br = b.behavior;
      if (
        br.state === 'react' &&
        br.reaction &&
        br.sinceMs === now &&
        ready(a) &&
        a.behavior.state !== 'react' &&
        Math.hypot(a.pos.x - b.pos.x, a.pos.z - b.pos.z) < PAIR_PLAY.copyReach &&
        roll(a, b, now, PAIR_PLAY.copyPerMille)
      ) {
        m.copies.push({ id: a.id, reaction: br.reaction, at: now + PAIR_PLAY.copyDelayMs });
        m.rest.set(a.id, now + PAIR_PLAY.cooldownMs);
        m.rest.set(b.id, now + PAIR_PLAY.cooldownMs);
        events.push({ kind: 'pairPlay', play: 'copy', a: a.id, b: b.id });
        continue;
      }
      if (j < i) continue;
      const d = Math.hypot(a.pos.x - b.pos.x, a.pos.z - b.pos.z);
      // Tug: both after the same fruit, both nearly there.
      if (
        a.behavior.state === 'findFood' &&
        b.behavior.state === 'findFood' &&
        a.behavior.itemId !== null &&
        a.behavior.itemId === b.behavior.itemId
      ) {
        const item = world.items.find((x) => x.id === a.behavior.itemId);
        if (
          item &&
          Math.hypot(a.pos.x - item.pos.x, a.pos.z - item.pos.z) < PAIR_PLAY.tugReach &&
          Math.hypot(b.pos.x - item.pos.x, b.pos.z - item.pos.z) < PAIR_PLAY.tugReach
        ) {
          const loser = a.needs.hunger <= b.needs.hunger ? b : a;
          const winner = loser === a ? b : a;
          react(loser, 'dizzy', now, events);
          events.push({ kind: 'pairPlay', play: 'tug', a: winner.id, b: loser.id });
          continue;
        }
      }
      // Bump: two walkers meet.
      if (
        d < PAIR_PLAY.bumpReach &&
        a.behavior.state === 'wander' &&
        b.behavior.state === 'wander' &&
        ready(a) &&
        ready(b) &&
        roll(a, b, Math.floor(now / 1000), PAIR_PLAY.bumpPerMille)
      ) {
        for (const n of [a, b])
          react(
            n,
            n.personality === 'cheerful'
              ? 'happy'
              : n.personality === 'shy'
                ? 'surprised'
                : 'dizzy',
            now,
            events,
          );
        m.rest.set(a.id, now + PAIR_PLAY.cooldownMs);
        m.rest.set(b.id, now + PAIR_PLAY.cooldownMs);
        events.push({ kind: 'pairPlay', play: 'bump', a: a.id, b: b.id });
      }
    }
  }
}
