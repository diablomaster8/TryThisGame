import { CHATTER_TUNE } from '../config/tuning';
import { CHATTER, type ChatterExchange } from '../content/chatter';
import type { Npc, SimEvent, World } from './types';

/**
 * R0297 (FUN-08): when two Keepers pass close by, they swap a two-line exchange from
 * `content/chatter.ts`, gated by chapter, taken in turn so a pair never repeats itself
 * until it has said everything. Checked once a sim second, never during a scene, never
 * outside Hazel's Grove. Nothing is saved: cooldowns and turns live beside the world.
 */
interface ChatterMemo {
  lastSaid: Map<string, number>;
  pairAt: Map<string, number>;
  turns: Map<string, number>;
  reply: { npcId: string; text: string; atMs: number } | null;
}
const memos = new WeakMap<World, ChatterMemo>();

function memoOf(world: World): ChatterMemo {
  let m = memos.get(world);
  if (!m) {
    m = { lastSaid: new Map(), pairAt: new Map(), turns: new Map(), reply: null };
    memos.set(world, m);
  }
  return m;
}

/** A Keeper just said something in a bubble (a routine line counts too). */
export function noteNpcSaid(world: World, npcId: string): void {
  memoOf(world).lastSaid.set(npcId, world.timeMs);
}

/** The exchanges this pair may have in this chapter. */
export function chatterFor(a: string, b: string, chapter: number): readonly ChatterExchange[] {
  const key = [a, b].sort().join('|');
  return (CHATTER[key] ?? []).filter(
    (x) => chapter >= x.minChapter && chapter <= (x.maxChapter ?? Infinity),
  );
}

export function stepChatter(world: World, dtMs: number, scene: boolean, events: SimEvent[]): void {
  const memo = memos.get(world);
  if (memo?.reply && world.timeMs >= memo.reply.atMs) {
    const r = memo.reply;
    memo.reply = null;
    if (!scene) {
      events.push({ kind: 'npcBark', npcId: r.npcId, text: r.text });
      noteNpcSaid(world, r.npcId);
    }
  }
  if (Math.floor(world.timeMs / 1000) === Math.floor((world.timeMs - dtMs) / 1000)) return;
  const c = world.campaign;
  if (scene || !c || c.storyline || world.location !== 'grove' || world.npcs.length < 2) return;
  const m = memoOf(world);
  if (m.reply) return;
  const quiet = (n: Npc): boolean =>
    world.timeMs - (m.lastSaid.get(n.id) ?? -Infinity) >= CHATTER_TUNE.quietMs;
  const r2 = CHATTER_TUNE.radius * CHATTER_TUNE.radius;
  for (let i = 0; i < world.npcs.length; i++) {
    const a = world.npcs[i]!;
    for (let j = i + 1; j < world.npcs.length; j++) {
      const b = world.npcs[j]!;
      const dx = a.pos.x - b.pos.x;
      const dz = a.pos.z - b.pos.z;
      if (dx * dx + dz * dz > r2) continue;
      const key = [a.trainer, b.trainer].sort().join('|');
      if (world.timeMs - (m.pairAt.get(key) ?? -Infinity) < CHATTER_TUNE.cooldownMs) continue;
      if (!quiet(a) || !quiet(b)) continue;
      const pool = chatterFor(a.trainer, b.trainer, c.chapter);
      if (pool.length === 0) continue;
      const n = m.turns.get(key) ?? 0;
      m.turns.set(key, n + 1);
      m.pairAt.set(key, world.timeMs);
      const [first, second] = pool[n % pool.length]!.lines;
      const speaker = (who: string): Npc => (a.trainer === who ? a : b);
      const one = speaker(first.who);
      const two = speaker(second.who);
      events.push({ kind: 'npcBark', npcId: one.id, text: first.text });
      noteNpcSaid(world, one.id);
      m.reply = { npcId: two.id, text: second.text, atMs: world.timeMs + CHATTER_TUNE.replyMs };
      // Face each other for the exchange.
      one.facing = Math.atan2(two.pos.x - one.pos.x, two.pos.z - one.pos.z);
      two.facing = Math.atan2(one.pos.x - two.pos.x, one.pos.z - two.pos.z);
      return;
    }
  }
}
