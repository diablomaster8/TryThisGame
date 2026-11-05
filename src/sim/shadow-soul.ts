/**
 * R0566 (SOUL-49): a wary Shadow Nubbin reads as a personality, not just distance. Besides
 * walking away from a Keeper who comes close, it sulks (sits facing a tree, its back to the
 * Grove), watches from afar (sits about five units off, facing the Keeper) and takes fruit
 * and runs (only a fruit the Keeper is well away from, carried off to its stash: the hoard
 * act of carry-fruit.ts). When it bonds again the moment gets a beat: it walks up to the
 * Keeper, hesitates, then hugs (`bondHug`, played by the renderers).
 *
 * Chances are hashed (`roll`); live play only for the quirks (`soulLive`), so catch-up runs
 * as before.
 */
import { SHADOW_SOUL } from '../config/tuning-soul-r11';
import { soulLive } from './antics';
import type { IdleAct } from './soul-idle';
import { roll } from './traits';
import { isWary } from './trust';
import type { Nubbin, SimEvent, Vec2, World } from './types';

const dist = (a: Vec2, b: Vec2): number => Math.hypot(a.x - b.x, a.z - b.z);
const S = SHADOW_SOUL;
const span = (n: Nubbin, now: number, what: string, [lo, hi]: readonly [number, number]) =>
  lo + (hi - lo) * roll(n, what, now);

/** A wary Shadow's idle act, or null for the usual (keeping its distance, wandering). */
export function shadowAct(n: Nubbin, world: World, now: number): IdleAct | null {
  if (!soulLive() || !isWary(n) || world.location !== 'grove') return null;
  const k = world.keeper.pos;
  const dk = dist(k, n.pos);
  // Takes a fruit the Keeper has left well alone, and runs off with it.
  const fruit = world.items.find(
    (i) =>
      i.kind === 'fruit' &&
      i.y <= 0.05 &&
      dist(i.pos, n.pos) < S.fruitRadius &&
      dist(i.pos, k) >= S.fruitKeeperGap,
  );
  if (fruit && roll(n, 'shadow-fruit', now) < S.fruitChance)
    return {
      state: 'perform',
      ms: 3_000,
      itemId: `hoard:${fruit.id}`,
      target: { x: fruit.pos.x, z: fruit.pos.z },
    };
  // Watches the Keeper from afar.
  if (dk < S.watchWithin && roll(n, 'shadow-watch', now) < S.watchChance) {
    const l = dk || 1;
    return {
      state: 'perform',
      ms: span(n, now, 'shadow-watch-ms', S.watchMs),
      itemId: 'watchFar',
      target: {
        x: k.x + ((n.pos.x - k.x) / l) * S.watchFar,
        z: k.z + ((n.pos.z - k.z) / l) * S.watchFar,
      },
    };
  }
  // Sulks, sat facing the nearest tree, away from everyone.
  if (dk >= S.watchFar && roll(n, 'shadow-sulk', now) < S.sulkChance) {
    let tree: Vec2 | null = null;
    for (const t of world.trees) if (!tree || dist(t.pos, n.pos) < dist(tree, n.pos)) tree = t.pos;
    return {
      state: 'sit',
      ms: span(n, now, 'shadow-sulk-ms', S.sulkMs),
      itemId: 'sulk',
      ...(tree ? { facing: Math.atan2(tree.x - n.pos.x, tree.z - n.pos.z) } : {}),
    };
  }
  return null;
}

/**
 * Once per live step: the bond's walk-up-and-hug for any Shadow that bonded this step, and
 * a watcher at its post keeps its eyes on the Keeper.
 */
export function stepShadowSoul(world: World, events: SimEvent[], offline: boolean): void {
  if (offline) return;
  const now = world.timeMs;
  const k = world.keeper.pos;
  for (const e of events) {
    if (e.kind !== 'shadowBonded') continue;
    const n = world.nubbins.find((x) => x.id === e.nubbinId);
    if (!n || n.stage === 'egg' || n.stage === 'cocoon') continue;
    const s = n.behavior.state;
    if (s === 'held' || s === 'carried' || s === 'thrown' || s === 'nap') continue;
    const d = dist(k, n.pos) || 1;
    const b = n.behavior;
    b.state = 'perform';
    b.sinceMs = now;
    b.untilMs = now + S.bondHugMs;
    b.itemId = 'bondHug';
    b.reaction = null;
    delete b.progress;
    b.target =
      d > 1.2
        ? { x: k.x + ((n.pos.x - k.x) / d) * 0.9, z: k.z + ((n.pos.z - k.z) / d) * 0.9 }
        : null;
  }
  for (const n of world.nubbins) {
    const b = n.behavior;
    if (b.state === 'perform' && !b.target && (b.itemId === 'watchFar' || b.itemId === 'bondHug'))
      n.facing = Math.atan2(k.x - n.pos.x, k.z - n.pos.z);
  }
}
