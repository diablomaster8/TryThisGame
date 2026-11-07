/**
 * R0555 (SOUL-38), lane A round 11: one Nubbin sings, plays or dances and the others gather.
 * When a Nubbin starts a music lesson performance (singing or an instrument) or a dance, the
 * free Nubbins within 6 units who know that kind of music (a lesson, or the musical trait)
 * each join with chance 0.5 x their play multiplier: they walk to a spot on a ring around the
 * leader, face the centre and perform their own lesson. Three or more is a concert (a dance
 * circle, for dance): every emote becomes a note, everyone within 8 units gains +1 happiness
 * per 10 s, and a Keeper standing near gets a burst of hearts. A friend with no leader yet
 * may also strike up a tune when two others who know music stand near (`sparkPerSecond`).
 *
 * The jams live in a transient WeakMap store (renderers read `jamsOf`); the members are plain
 * `perform` states, so a pickup or a call ends a Nubbin's part cleanly. Chances are hashed,
 * never the world's rng. Live play only; nothing forms while catching up on time away.
 * Behaviour and looks only, never stats.
 */
import type { ReadonlyWorld } from './readonly';
import { JAM } from '../config/tuning-more/soul-ambient-games';
import { liveliness, soulLive } from './antics';
import { react } from './behavior';
import { lessonLevel } from './kindergarten';
import { isFree } from './nubbin';
import { idleMultipliers } from './personality';
import { hashSeed } from './rng';
import { hasTrait, withTraitMult } from './traits';
import type { LessonId, Nubbin, SimEvent, Vec2, World } from './types';

export type JamKind = 'music' | 'dance';

export interface Jam {
  id: string;
  kind: JamKind;
  /** The leader's spot: the circle's centre. */
  cx: number;
  cz: number;
  leader: string;
  members: string[];
  startMs: number;
  endMs: number;
  /** Three or more: everyone's emote is a note, and the happiness ticks. */
  concert: boolean;
  /** When the Keeper's hearts last rose (0: not yet). */
  heartAtMs: number;
  lastTickMs: number;
}

interface Store {
  jams: Jam[];
  seq: number;
  cooldownUntil: number;
  /** Jams and concerts formed so far (tests and the debug panel). */
  formed: number;
  concerts: number;
}

const stores = new WeakMap<ReadonlyWorld, Store>();

/** Members of a running concert, and until when: what the emote ball asks. */
const concertMark = new WeakMap<Nubbin, number>();

export function inConcert(n: Nubbin, simMs: number): boolean {
  return (concertMark.get(n) ?? 0) > simMs && n.behavior.state === 'perform';
}

export function jamStore(world: World): Store {
  let s = stores.get(world);
  if (!s) {
    s = { jams: [], seq: 0, cooldownUntil: 0, formed: 0, concerts: 0 };
    stores.set(world, s);
  }
  return s;
}

export const jamsOf = (world: ReadonlyWorld): readonly Jam[] => stores.get(world)?.jams ?? [];

/** The jam this Nubbin is part of, if any (what the renderers ask). */
export function jamOf(world: World, id: string): Jam | undefined {
  return stores.get(world)?.jams.find((j) => j.members.includes(id));
}

const h01 = (key: string): number => hashSeed(key) / 4294967296;
const dist = (a: Vec2, b: Vec2): number => Math.hypot(a.x - b.x, a.z - b.z);
const awake = (n: Nubbin): boolean => n.stage !== 'egg' && n.stage !== 'cocoon';

const MUSIC: readonly LessonId[] = ['singing', 'instrument'];

/** The lesson a Nubbin would perform for this kind of jam, or null when it knows none. */
export function jamLesson(n: Nubbin, kind: JamKind): LessonId | null {
  if (kind === 'dance') return lessonLevel(n, 'dance') > 0 ? 'dance' : null;
  const sing = lessonLevel(n, 'singing');
  const play = lessonLevel(n, 'instrument');
  if (sing > 0 || play > 0) return play > sing ? 'instrument' : 'singing';
  return hasTrait(n, 'musical') ? 'singing' : null;
}

const kindOf = (lesson: string | null): JamKind | null =>
  lesson === 'dance' ? 'dance' : lesson && MUSIC.includes(lesson as LessonId) ? 'music' : null;

/** A Nubbin's chance multiplier for joining in. */
function playMult(n: Nubbin): number {
  return withTraitMult(n, idleMultipliers(n.personality ?? null)).play;
}

const joinable = (n: Nubbin): boolean => {
  if (!awake(n) || !isFree(n)) return false;
  const s = n.behavior.state;
  return s === 'wander' || s === 'sit' || s === 'greet';
};

function ringSpot(jam: Jam, index: number): Vec2 {
  // Spread by the golden angle so a late joiner never lands on a friend.
  const a = index * 2.399963 + h01(jam.id) * 6.28;
  return { x: jam.cx + Math.cos(a) * JAM.ringRadius, z: jam.cz + Math.sin(a) * JAM.ringRadius };
}

function enrol(jam: Jam, n: Nubbin, lesson: LessonId, now: number): void {
  const b = n.behavior;
  b.state = 'perform';
  b.sinceMs = now;
  b.untilMs = jam.endMs;
  b.itemId = lesson;
  b.target = ringSpot(jam, jam.members.length);
  b.reaction = null;
  jam.members.push(n.id);
}

/** Starts a jam around a Nubbin that has just begun performing. */
function form(world: World, store: Store, leader: Nubbin, kind: JamKind, now: number): void {
  const key = `jam:${world.seed}:${store.seq}:${now}`;
  const jam: Jam = {
    id: `jam${store.seq++}`,
    kind,
    cx: leader.pos.x,
    cz: leader.pos.z,
    leader: leader.id,
    members: [leader.id],
    startMs: now,
    endMs: now + JAM.ms[0] + (JAM.ms[1] - JAM.ms[0]) * h01(key),
    concert: false,
    heartAtMs: 0,
    lastTickMs: now,
  };
  leader.behavior.untilMs = jam.endMs;
  leader.behavior.target = null;
  let joined = 0;
  for (const o of world.nubbins) {
    if (o === leader || !joinable(o) || dist(o.pos, leader.pos) > JAM.joinRadius) continue;
    const lesson = jamLesson(o, kind);
    if (!lesson) continue;
    if (h01(`join:${o.id}:${jam.id}:${leader.id}:${now}`) >= JAM.joinChance * playMult(o)) continue;
    enrol(jam, o, lesson, now);
    joined++;
  }
  if (joined === 0) return;
  store.jams.push(jam);
  store.formed++;
}

/** Everyone nearby who could still join a jam in progress (late arrivals). */
function recruit(world: World, jam: Jam, now: number): void {
  for (const o of world.nubbins) {
    if (
      jam.members.includes(o.id) ||
      !joinable(o) ||
      dist(o.pos, { x: jam.cx, z: jam.cz }) > JAM.joinRadius
    )
      continue;
    const lesson = jamLesson(o, jam.kind);
    if (!lesson) continue;
    if (h01(`join:${o.id}:${jam.id}`) >= JAM.joinChance * playMult(o)) continue;
    enrol(jam, o, lesson, now);
  }
}

/**
 * Music-lovers drift together: an idle one that knows music and has another such Nubbin
 * beyond the join radius but within hearing wanders over to stand beside it.
 */
function gather(world: World, now: number): void {
  for (const n of world.nubbins) {
    if (!joinable(n) || n.behavior.state === 'greet') continue;
    const kinds = (['music', 'dance'] as const).filter((k) => jamLesson(n, k));
    if (kinds.length === 0) continue;
    if (h01(`gather:${n.id}:${now}`) >= JAM.gatherPerSecond) continue;
    let best: Nubbin | null = null;
    for (const o of world.nubbins) {
      if (o === n || !awake(o) || !kinds.some((k) => jamLesson(o, k))) continue;
      const d = dist(o.pos, n.pos);
      if (d <= JAM.joinRadius * 0.7 || d > JAM.gatherRadius) continue;
      if (!best || d < dist(best.pos, n.pos)) best = o;
    }
    if (!best) continue;
    const b = n.behavior;
    b.state = 'wander';
    b.sinceMs = now;
    b.untilMs = now + JAM.gatherMs;
    b.itemId = 'gatherJam';
    b.target = { x: best.pos.x + 1.8, z: best.pos.z + 0.6 };
  }
}

/** A friendly Nubbin among music-knowers strikes up a tune on its own. */
function spark(world: World, now: number): void {
  const lively = liveliness(world);
  for (const n of world.nubbins) {
    if (!joinable(n) || n.behavior.state === 'greet') continue;
    for (const kind of ['music', 'dance'] as const) {
      const lesson = jamLesson(n, kind);
      if (!lesson) continue;
      let near = 0;
      for (const o of world.nubbins)
        if (o !== n && awake(o) && dist(o.pos, n.pos) < JAM.joinRadius && jamLesson(o, kind))
          near++;
      if (near < 2) continue;
      if (h01(`spark:${n.id}:${kind}:${now}`) >= JAM.sparkPerSecond * playMult(n) * lively)
        continue;
      const b = n.behavior;
      b.state = 'perform';
      b.sinceMs = now;
      b.untilMs = now + 4000;
      b.itemId = lesson;
      b.target = null;
      return;
    }
  }
}

function end(world: World, store: Store, jam: Jam, now: number, events: SimEvent[]): void {
  for (const id of jam.members) {
    const n = world.nubbins.find((x) => x.id === id);
    if (n && n.behavior.state === 'perform' && kindOf(n.behavior.itemId) === jam.kind) {
      react(n, 'happy', now, events);
    }
  }
  store.cooldownUntil = now + JAM.cooldownMs;
}

/** Once a step. */
export function stepJams(world: World, dtMs: number, events: SimEvent[], offline: boolean): void {
  const store = jamStore(world);
  if (offline || !soulLive() || world.location !== 'grove') {
    if (store.jams.length) store.jams = [];
    return;
  }
  const now = world.timeMs;
  const second = Math.floor(now / 1000) !== Math.floor((now - dtMs) / 1000);

  for (const jam of store.jams) {
    // Members that were picked up or called away drop out; the rest keep singing.
    jam.members = jam.members.filter((id) => {
      const n = world.nubbins.find((x) => x.id === id);
      return (
        !!n && isFree(n) && n.behavior.state === 'perform' && kindOf(n.behavior.itemId) === jam.kind
      );
    });
    const c = { x: jam.cx, z: jam.cz };
    for (const id of jam.members) {
      const n = world.nubbins.find((x) => x.id === id)!;
      const b = n.behavior;
      if (b.untilMs > jam.endMs) b.untilMs = jam.endMs;
      if (!b.target && id !== jam.leader) n.facing = Math.atan2(c.x - n.pos.x, c.z - n.pos.z);
    }
    if (jam.concert)
      for (const id of jam.members) {
        const m = world.nubbins.find((x) => x.id === id);
        if (m) concertMark.set(m, jam.endMs);
      }
    if (jam.members.length >= JAM.concertAt && !jam.concert) {
      jam.concert = true;
      store.concerts++;
    }
    if (jam.concert && second) {
      if (now - jam.lastTickMs >= JAM.concertTickMs) {
        jam.lastTickMs = now;
        for (const n of world.nubbins)
          if (awake(n) && dist(n.pos, c) < JAM.concertRadius)
            n.needs.happiness = Math.min(100, n.needs.happiness + JAM.concertHappiness);
      }
      if (jam.heartAtMs === 0 && dist(world.keeper.pos, c) < JAM.concertRadius) jam.heartAtMs = now;
    }
    if (second && now < jam.endMs - 1500) recruit(world, jam, now);
  }

  // Jams over (or down to the leader alone).
  for (const jam of store.jams)
    if (now >= jam.endMs || jam.members.length < 2) end(world, store, jam, now, events);
  store.jams = store.jams.filter((j) => now < j.endMs && j.members.length >= 2);

  if (!second || now < store.cooldownUntil) return;
  // A fresh performance starts a jam around it.
  for (const n of world.nubbins) {
    const b = n.behavior;
    if (b.state !== 'perform' || now - b.sinceMs > 1500 || !isFree(n)) continue;
    const kind = kindOf(b.itemId);
    if (!kind || store.jams.some((j) => j.members.includes(n.id))) continue;
    form(world, store, n, kind, now);
    if (store.jams.some((j) => j.leader === n.id)) return;
  }
  gather(world, now);
  if (store.jams.length === 0) spark(world, now);
}
