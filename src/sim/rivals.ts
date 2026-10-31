/**
 * R0538 (SOUL-20): friendships that depend on personality fit, and rivalries. A cheerful
 * Nubbin and a shy one warm to each other fast; a mischievous one and a lazy one rub each
 * other up the wrong way. Rivalry also comes from contests: losing a race to a fruit, a
 * fruit snatched (R0545), two show-offs performing at once. Rivals puff at each other, race
 * each other to fruit, and after enough time together make up with a hug.
 *
 * `n.rivals[id]` is how much n holds against id (one-sided, as a grudge is); the friendship
 * stays the shared `n.friends`. Every rivalry change and act is for watching, so none of it
 * runs while catching up on time away (`soulLive`); the fit only sets how fast friendship
 * grows, there as here. Chances are hashed (`roll`), so no world rng is drawn.
 */
import { FRIENDS } from '../config/tuning';
import { FRIEND_COMPAT, RIVALS } from '../config/tuning-soul-r10';
import { soulLive } from './antics';
import { addHappiness } from './needs';
import { isFree } from './nubbin';
import { leaningPersonality } from './personality';
import { roll } from './traits';
import type { IdleAct } from './soul-idle';
import type { Nubbin, SimEvent, World } from './types';

const dist = (a: { x: number; z: number }, b: { x: number; z: number }): number =>
  Math.hypot(a.x - b.x, a.z - b.z);

/** How well two Nubbins' personalities fit (a child by its leaning; none yet is 1). */
export function compat(a: Nubbin, b: Nubbin): number {
  const pa = a.personality ?? leaningPersonality(a);
  const pb = b.personality ?? leaningPersonality(b);
  return pa && pb ? FRIEND_COMPAT[pa][pb] : 1;
}

export function rivalry(a: Nubbin, b: Nubbin): number {
  return a.rivals?.[b.id] ?? 0;
}

/** Whether the two are rivals, either way round. */
export function areRivals(a: Nubbin, b: Nubbin): boolean {
  return Math.max(rivalry(a, b), rivalry(b, a)) >= RIVALS.at;
}

/** The one it holds most against, once that is past the rival mark, else null. */
export function topRival(world: World, n: Nubbin): Nubbin | null {
  let best: Nubbin | null = null;
  let score = 0;
  for (const [id, v] of Object.entries(n.rivals ?? {})) {
    if (v <= score) continue;
    const o = world.nubbins.find((x) => x.id === id);
    if (o) {
      best = o;
      score = v;
    }
  }
  return score >= RIVALS.at ? best : null;
}

/** Add to what `from` holds against `to` (clamped 0..100); a new rival is announced. */
export function addRivalry(from: Nubbin, to: Nubbin, amount: number, events: SimEvent[]): void {
  if (from.id === to.id) return;
  const before = from.rivals?.[to.id] ?? 0;
  const after = Math.max(0, Math.min(100, before + amount));
  const r = { ...(from.rivals ?? {}) };
  if (after > 0) r[to.id] = after;
  else delete r[to.id];
  from.rivals = r;
  if (before < RIVALS.at && after >= RIVALS.at && rivalry(to, from) < RIVALS.at)
    events.push({ kind: 'rivalsMade', a: from.id, b: to.id });
}

/** R0538: the one that reached a fruit first ate it; the others walking to it lost the race. */
export function noteFruitWon(world: World, winner: Nubbin, fruitId: string, events: SimEvent[]) {
  if (!soulLive()) return;
  for (const o of world.nubbins)
    if (o.id !== winner.id && o.behavior.state === 'findFood' && o.behavior.itemId === fruitId)
      addRivalry(o, winner, RIVALS.fruitContest, events);
}

/** When each Nubbin last started showing off a lesson (transient: a 10 s window). */
const showedAt = new WeakMap<Nubbin, number>();

/** Events from the idle choice (which has no event list), passed on by `flushRivalEvents`. */
const pending: SimEvent[] = [];

export function flushRivalEvents(events: SimEvent[]): void {
  if (pending.length) events.push(...pending.splice(0));
}

/** R0538: a show-off performing as another near it did, inside the window: both +3. */
export function noteShowOff(world: World, n: Nubbin, now: number, events = pending): void {
  if (!soulLive()) return;
  showedAt.set(n, now);
  for (const o of world.nubbins) {
    const at = showedAt.get(o);
    if (o === n || at === undefined || now - at > RIVALS.showOffMs) continue;
    if (dist(o.pos, n.pos) > RIVALS.showOffRadius) continue;
    addRivalry(n, o, RIVALS.showOff, events);
    addRivalry(o, n, RIVALS.showOff, events);
  }
}

/**
 * The walk speed multiplier on the way to a fruit: a rival also after fruit near it makes
 * it a race; a Nubbin whose fruit was just snatched hurries a little (R0545), till it eats.
 */
export function fruitPace(world: World, n: Nubbin): number {
  let pace = n.searchBoost ? RIVALS.victimSearch : 1;
  if (!soulLive()) return pace;
  for (const o of world.nubbins)
    if (
      o !== n &&
      o.behavior.state === 'findFood' &&
      dist(o.pos, n.pos) < RIVALS.raceRadius &&
      areRivals(n, o)
    ) {
      pace *= RIVALS.raceSpeed;
      break;
    }
  return pace;
}

const idling = (n: Nubbin): boolean =>
  isFree(n) && (n.behavior.state === 'wander' || n.behavior.state === 'sit');

/** When each Nubbin may puff again (transient). */
const puffAfter = new WeakMap<Nubbin, number>();

function face(a: Nubbin, b: Nubbin): void {
  a.facing = Math.atan2(b.pos.x - a.pos.x, b.pos.z - a.pos.z);
}

function startTogether(a: Nubbin, b: Nubbin, now: number, itemId: string, ms: number): void {
  for (const [x, y] of [
    [a, b],
    [b, a],
  ] as const) {
    const bh = x.behavior;
    bh.state = 'perform';
    bh.itemId = itemId;
    bh.target = null;
    bh.sinceMs = now;
    bh.untilMs = now + ms;
    face(x, y);
  }
}

/**
 * Once per step, per pair, after the friendship step: the fit's friction, the puffs, and
 * the time together that ends in making up. Live play only.
 */
export function stepRivals(
  world: World,
  a: Nubbin,
  b: Nubbin,
  near: boolean,
  minutes: number,
  events: SimEvent[],
): void {
  if (!soulLive()) return;
  const now = world.timeMs;
  const fit = compat(a, b);
  // The rub of a poor fit simmers up to a rivalry and no further; making up can cool it.
  if (near && fit < RIVALS.frictionBelow && !areRivals(a, b)) {
    const rub = FRIENDS.perMinute * (1 - fit) * RIVALS.friction * minutes;
    addRivalry(a, b, rub, events);
    addRivalry(b, a, rub, events);
  }
  if (!areRivals(a, b)) {
    if (a.makeUp?.[b.id] !== undefined) clearMakeUp(a, b);
    return;
  }
  if (near) {
    const m = (a.makeUp?.[b.id] ?? 0) + minutes;
    if (m >= RIVALS.makeUpMinutes && idling(a) && idling(b)) {
      clearMakeUp(a, b);
      for (const [x, y] of [
        [a, b],
        [b, a],
      ] as const) {
        addRivalry(x, y, -RIVALS.makeUpRival, events);
        addHappiness(x, 3);
      }
      const f = Math.min(100, (a.friends[b.id] ?? 0) + RIVALS.makeUpFriend);
      a.friends[b.id] = f;
      b.friends[a.id] = f;
      startTogether(a, b, now, 'makeUpHug', RIVALS.hugMs);
      events.push({ kind: 'madeUp', a: a.id, b: b.id });
      events.push({ kind: 'reaction', nubbinId: a.id, reaction: 'love' });
      events.push({ kind: 'reaction', nubbinId: b.id, reaction: 'love' });
      return;
    }
    a.makeUp = { ...(a.makeUp ?? {}), [b.id]: m };
    b.makeUp = { ...(b.makeUp ?? {}), [a.id]: m };
  }
  // A puff at each other as they meet: both turn and huff a moment.
  if (
    dist(a.pos, b.pos) < RIVALS.puffRadius &&
    idling(a) &&
    idling(b) &&
    now >= (puffAfter.get(a) ?? 0) &&
    now >= (puffAfter.get(b) ?? 0) &&
    Math.floor(now / 1000) !== Math.floor((now - minutes * 60_000) / 1000) &&
    roll(a, `puff:${b.id}`, now) < RIVALS.puffChancePerSecond
  ) {
    puffAfter.set(a, now + RIVALS.puffRestMs);
    puffAfter.set(b, now + RIVALS.puffRestMs);
    startTogether(a, b, now, 'rivalPuff', RIVALS.puffMs);
    events.push({ kind: 'rivalPuff', a: a.id, b: b.id });
  }
}

function clearMakeUp(a: Nubbin, b: Nubbin): void {
  for (const [x, y] of [
    [a, b],
    [b, a],
  ] as const) {
    if (!x.makeUp) continue;
    const m = { ...x.makeUp };
    delete m[y.id];
    if (Object.keys(m).length) x.makeUp = m;
    else delete x.makeUp;
  }
}

/**
 * The idle choice's pull toward a kindred spirit: now and then a Nubbin wanders over to sit
 * by the best fit near it that is not a rival, so good fits spend their time together and
 * become friends first. Live play only.
 */
export function kindredAct(n: Nubbin, world: World, now: number): IdleAct | null {
  if (!soulLive() || n.stage === 'egg' || n.stage === 'cocoon') return null;
  if (roll(n, 'kindred', now) >= RIVALS.kindredChance) return null;
  let best: Nubbin | null = null;
  let fit: number = RIVALS.kindredFit;
  for (const o of world.nubbins) {
    if (o === n || o.stage === 'egg' || o.stage === 'cocoon' || areRivals(n, o)) continue;
    const d = dist(o.pos, n.pos);
    if (d > RIVALS.kindredRadius || d < 1.5) continue;
    const f = compat(n, o);
    if (f >= fit) {
      best = o;
      fit = f;
    }
  }
  if (!best) return null;
  const a = roll(n, 'kindredSide', now) * Math.PI * 2;
  return {
    state: 'wander',
    ms: 12_000,
    target: { x: best.pos.x + Math.sin(a) * 1.2, z: best.pos.z + Math.cos(a) * 1.2 },
  };
}
