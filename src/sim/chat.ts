/**
 * R0540 (SOUL-22), lane A round 10: two friends "talking" in the Chao manner. The one who
 * starts walks over and both stand 0.9 apart, facing; then they trade picture bubbles turn
 * about every 0.8 s (a topic from their shared news: fruit, a toy, the Keeper's pat, the
 * weather, a song, a heart, a ? or a !), and the talk ends in a laugh, a hug for close friends
 * or a huff when one is grumpy, hungry or holds a grudge.
 *
 * Everything is kept in the behaviour's `itemId` as
 * `chat:<otherId>:<topic>:<ending>:<role>:<phase>` (role `a` started it, `b` was asked; phase
 * `w` walking over, `t` talking), so it needs no save field and a reload resumes it. Chats
 * start only in live play (`soulLive`); the topic is hashed from the pair and the time, so no
 * world rng is drawn. Nubbins never speak words here: the bubbles are pictures.
 */
import { CHAT, SIM } from '../config/tuning';
import { soulLive } from './antics';
import { lessonLevel } from './kindergarten';
import { hashSeed } from './rng';
import { hasTrait } from './traits';
import type { Nubbin, SimEvent, Vec2, World } from './types';

export type ChatTopic =
  'fruit' | 'toyball' | 'heart' | 'keeper' | 'cloud' | 'note' | 'question' | 'exclaim';
export type ChatEnd = 'laugh' | 'hug' | 'huff';

export interface ChatInfo {
  other: string;
  topic: ChatTopic;
  end: ChatEnd;
  role: 'a' | 'b';
  phase: 'w' | 't';
}

export function isChat(id: string | null | undefined): boolean {
  return !!id && id.startsWith('chat:');
}

export function parseChat(id: string | null | undefined): ChatInfo | null {
  if (!isChat(id)) return null;
  const [, other, topic, end, role, phase] = id!.split(':');
  if (
    !other ||
    !topic ||
    !end ||
    (role !== 'a' && role !== 'b') ||
    (phase !== 'w' && phase !== 't')
  )
    return null;
  return { other, topic: topic as ChatTopic, end: end as ChatEnd, role, phase };
}

const encode = (c: ChatInfo): string => `chat:${c.other}:${c.topic}:${c.end}:${c.role}:${c.phase}`;

const dist = (a: Vec2, b: Vec2): number => Math.hypot(a.x - b.x, a.z - b.z);

const recent = (n: Nubbin, now: number, kinds: readonly string[]): boolean =>
  (n.diary ?? []).some((d) => kinds.includes(d.kind) && now - d.atMs < CHAT.newsMs);

/** What two friends have to talk about: their shared recent news, hashed among the options. */
export function chatTopic(world: World, a: Nubbin, b: Nubbin, now: number): ChatTopic {
  const both = [a, b];
  const out: ChatTopic[] = [];
  const kind = world.weather?.kind ?? 'clear';
  if (kind === 'rain' || kind === 'snow') out.push('cloud');
  if (both.some((n) => recent(n, now, ['yum', 'bleh'])) || both.every((n) => n.needs.hunger < 0.5))
    out.push('fruit');
  if (both.some((n) => now - n.lastPetMs < CHAT.newsMs && n.lastPetMs > 0)) out.push('keeper');
  if (both.some((n) => Object.values(n.toyBoredom ?? {}).some((t) => now - t.at < CHAT.newsMs)))
    out.push('toyball');
  if (
    both.some(
      (n) =>
        lessonLevel(n, 'singing') > 0 || lessonLevel(n, 'instrument') > 0 || hasTrait(n, 'musical'),
    )
  )
    out.push('note');
  if (both.some((n) => recent(n, now, ['trip', 'bonked', 'wasPranked', 'sneeze'])))
    out.push('exclaim');
  if ((a.friends?.[b.id] ?? 0) >= CHAT.hugAt) out.push('heart');
  if (out.length === 0) out.push('question');
  const [x, y] = a.id < b.id ? [a.id, b.id] : [b.id, a.id];
  return out[hashSeed(`chat:${x}:${y}:${Math.floor(now / 1000)}`) % out.length]!;
}

const grudge = (x: Nubbin, id: string): boolean =>
  ((x as { rivals?: Record<string, number> }).rivals?.[id] ?? 0) > 0;

/** How it ends: a huff when one is cross or hungry, a hug for close friends, else a laugh. */
export function chatEnd(a: Nubbin, b: Nubbin): ChatEnd {
  const cross = (n: Nubbin): boolean => n.moody === 'grumpy' || n.needs.hunger < 0.2;
  if (cross(a) || cross(b) || grudge(a, b.id) || grudge(b, a.id)) return 'huff';
  return (a.friends?.[b.id] ?? 0) >= CHAT.hugAt ? 'hug' : 'laugh';
}

/** A free Nubbin in a calm state can be asked to chat. */
function canJoin(n: Nubbin): boolean {
  if (n.stage === 'egg' || n.stage === 'cocoon') return false;
  const s = n.behavior.state;
  return s === 'wander' || s === 'sit' || s === 'greet' || s === 'play';
}

function enter(n: Nubbin, c: ChatInfo, now: number, ms: number): void {
  const b = n.behavior;
  b.state = 'greet';
  b.sinceMs = now;
  b.untilMs = now + ms;
  b.target = null;
  b.reaction = null;
  delete b.progress;
  b.itemId = encode(c);
}

/** Where the starter stands: 0.9 from its friend, on its own side. */
function spotBeside(n: Nubbin, other: Nubbin): Vec2 {
  const dx = n.pos.x - other.pos.x;
  const dz = n.pos.z - other.pos.z;
  const l = Math.hypot(dx, dz) || 1;
  return { x: other.pos.x + (dx / l) * CHAT.gap, z: other.pos.z + (dz / l) * CHAT.gap };
}

/**
 * Start a chat between `n` and its buddy (live play only); false leaves the old greet to the
 * caller. Both enter `greet`: the starter walks over, the friend waits and turns to it.
 */
export function startChat(world: World, n: Nubbin, buddy: Nubbin, now: number): boolean {
  if (!soulLive() || !canJoin(buddy) || isChat(buddy.behavior.itemId)) return false;
  if (dist(n.pos, buddy.pos) > 12) return false;
  const topic = chatTopic(world, n, buddy, now);
  const end = chatEnd(n, buddy);
  enter(n, { other: buddy.id, topic, end, role: 'a', phase: 'w' }, now, CHAT.approachMs);
  n.behavior.target = spotBeside(n, buddy);
  enter(buddy, { other: n.id, topic, end, role: 'b', phase: 'w' }, now, CHAT.approachMs);
  buddy.facing = Math.atan2(n.pos.x - buddy.pos.x, n.pos.z - buddy.pos.z);
  return true;
}

export const talkMs = (): number => CHAT.turns * CHAT.turnMs + CHAT.endMs;

/**
 * One step of a chat. `walk` steps toward a point and says whether it arrived. Returns true
 * when this Nubbin's part is over (the caller picks its next idle).
 */
export function stepChat(
  n: Nubbin,
  world: World,
  now: number,
  walk: (to: Vec2) => boolean,
  events: SimEvent[],
): boolean {
  const c = parseChat(n.behavior.itemId);
  if (!c) return true;
  const other = world.nubbins.find((x) => x.id === c.other);
  const oc = other ? parseChat(other.behavior.itemId) : null;
  // The friend was picked up, called away or is gone: the talk is off.
  if (!other || !oc || oc.other !== n.id || other.behavior.state !== 'greet') return true;
  n.facing = Math.atan2(other.pos.x - n.pos.x, other.pos.z - n.pos.z);
  if (c.phase === 'w') {
    if (now >= n.behavior.untilMs) return true;
    if (c.role === 'b') return false;
    const to = n.behavior.target ?? spotBeside(n, other);
    const arrived = walk(to);
    const d = dist(n.pos, other.pos);
    if (!arrived && d > CHAT.gap + 0.25) return false;
    // Stuck on the way (a bush between them): no shouting across the Grove.
    if (d > CHAT.gap + 0.8) return true;
    // Arrived: both start talking together.
    const t = talkMs();
    enter(n, { ...c, phase: 't' }, now, t);
    enter(other, { ...oc, phase: 't' }, now, t);
    other.facing = Math.atan2(n.pos.x - other.pos.x, n.pos.z - other.pos.z);
    if (soulLive()) events.push({ kind: 'chatTurn', nubbinId: n.id, turn: 0, topic: c.topic });
    return false;
  }
  if (now >= n.behavior.untilMs) return true;
  // The starter announces each bubble once, for the chirp (live play only).
  if (c.role === 'a' && soulLive()) {
    const t = now - n.behavior.sinceMs;
    const k = Math.floor(t / CHAT.turnMs);
    if (k > 0 && k < CHAT.turns && t % CHAT.turnMs < SIM.stepMs) {
      const speaker = k % 2 === 0 ? n : other;
      const bubble = chatBubbles(c.topic, c.end)[k]!;
      events.push({ kind: 'chatTurn', nubbinId: speaker.id, turn: k, topic: bubble });
    }
  }
  return false;
}

/** The four bubbles of a talk: the topic, an answer, the topic again, and a reply. */
export function chatBubbles(topic: ChatTopic, end: ChatEnd): string[] {
  const answer = topic === 'exclaim' ? 'question' : 'exclaim';
  const last = end === 'hug' ? 'heart' : end === 'huff' ? 'puff' : 'note';
  return [topic, answer, topic, last];
}

/**
 * What a chatter shows at `simMs`: its bubble while it speaks (null while it listens), the
 * ending (both together), or `wait` while the starter walks over.
 */
export function chatBeat(
  n: Nubbin,
  simMs: number,
): { kind: 'speak'; shape: string } | { kind: 'listen' } | { kind: 'end'; end: ChatEnd } | null {
  if (n.behavior.state !== 'greet') return null;
  const c = parseChat(n.behavior.itemId);
  if (!c) return null;
  if (c.phase === 'w') return { kind: 'listen' };
  const t = simMs - n.behavior.sinceMs;
  const k = Math.floor(t / CHAT.turnMs);
  if (k >= CHAT.turns) return { kind: 'end', end: c.end };
  const mine = (k % 2 === 0) === (c.role === 'a');
  return mine ? { kind: 'speak', shape: chatBubbles(c.topic, c.end)[k]! } : { kind: 'listen' };
}
