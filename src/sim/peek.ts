/**
 * R0543 (SOUL-25): a tiny hide and seek with a shy Nubbin. When the Keeper comes close, a
 * shy adult (a shy-leaning child less often) slips behind the nearest tree, on the side away
 * from the Keeper, hides a moment and then peeks round the trunk. Tapping that tree finds it
 * instead of shaking it: a giggle, a little affection and trust, and the game rests a minute
 * before it can start again. It is the gentle way to build a shy one's trust.
 *
 * The chance is hashed from the Nubbin and the second, as the traits' are, so no world rng
 * is drawn; the Keeper never moves during a catch-up, so it never starts there.
 */
import { PEEK } from '../config/tuning';
import { addAffection } from './needs';
import { leaningPersonality } from './personality';
import { roll } from './traits';
import { soulLive } from './antics';
import { addTrust } from './trust';
import type { IdleAct } from './soul-idle';
import type { Nubbin, SimEvent, World } from './types';

/** Who was inside the trigger ring last step (the Keeper, visitors), per Nubbin (transient). */
const wasNear = new WeakMap<Nubbin, ReadonlySet<string>>();
const NONE: ReadonlySet<string> = new Set();

const dist = (a: { x: number; z: number }, b: { x: number; z: number }): number =>
  Math.hypot(a.x - b.x, a.z - b.z);

function shyness(n: Nubbin): number {
  if (n.personality) return n.personality === 'shy' ? 1 : 0;
  return n.stage === 'child' && leaningPersonality(n) === 'shy' ? 0.5 : 0;
}

/**
 * On the step the Keeper comes inside `PEEK.keeperRadius`: maybe the hide act (to the far
 * side of the nearest tree within reach). Called for a wandering or sitting Nubbin.
 */
export function peekAct(n: Nubbin, world: World, now: number): IdleAct | null {
  // Lane A r10: a stranger, a visiting Keeper walking up, sets it off as the Keeper does
  // (in live play only: visitors still potter about while catching up on time away).
  const watchers = [{ id: 'keeper', pos: world.keeper.pos }];
  if (soulLive()) for (const v of world.npcs) watchers.push({ id: v.id, pos: v.pos });
  const near = new Set(
    watchers.filter((w) => dist(n.pos, w.pos) < PEEK.keeperRadius).map((w) => w.id),
  );
  const before = wasNear.get(n) ?? NONE;
  wasNear.set(n, near.size ? near : NONE);
  const fresh = watchers.find((w) => near.has(w.id) && !before.has(w.id));
  if (!fresh || n.stage === 'egg' || n.stage === 'cocoon') return null;
  const k = fresh.pos;
  const s = shyness(n);
  if (s <= 0 || now < (n.peekAfterMs ?? 0)) return null;
  if (roll(n, 'peek', now) >= PEEK.chance * s) return null;
  let tree: { x: number; z: number } | null = null;
  for (const t of world.trees)
    if (dist(t.pos, n.pos) < PEEK.treeRadius && (!tree || dist(t.pos, n.pos) < dist(tree, n.pos)))
      tree = t.pos;
  if (!tree) return null;
  n.peekAfterMs = Math.max(n.peekAfterMs ?? 0, now + PEEK.restMs);
  const away = dist(tree, k) || 1;
  const target = {
    x: tree.x + ((tree.x - k.x) / away) * PEEK.behind,
    z: tree.z + ((tree.z - k.z) / away) * PEEK.behind,
  };
  return {
    state: 'perform',
    ms: PEEK.stayMs,
    itemId: 'peekTree',
    target,
    facing: Math.atan2(k.x - target.x, k.z - target.z),
  };
}

/**
 * The Keeper tapped a tree: a Nubbin hiding behind it is found (true), and the tree is not
 * shaken. It giggles and turns to the Keeper.
 */
export function findHiding(world: World, treeId: string, events: SimEvent[]): boolean {
  const tree = world.trees.find((t) => t.id === treeId);
  if (!tree) return false;
  const now = world.timeMs;
  const n = world.nubbins.find(
    (o) =>
      o.behavior.state === 'perform' &&
      o.behavior.itemId === 'peekTree' &&
      dist(o.pos, tree.pos) < PEEK.tapRadius,
  );
  if (!n) return false;
  addAffection(n, PEEK.foundAffection);
  addTrust(n, PEEK.foundTrust, events);
  n.peekAfterMs = now + PEEK.cooldownMs;
  const b = n.behavior;
  b.state = 'perform';
  b.itemId = 'giggle';
  b.target = null;
  b.sinceMs = now;
  b.untilMs = now + 2000;
  n.facing = Math.atan2(world.keeper.pos.x - n.pos.x, world.keeper.pos.z - n.pos.z);
  events.push({ kind: 'peekFound', nubbinId: n.id });
  return true;
}
