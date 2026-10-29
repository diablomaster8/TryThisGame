/**
 * MOVE-58: teaching the jump, once. The first time the Keeper comes near a log, a fence or
 * the stream, the HUD shows a chip that suggests a hop; the first jump that carries the
 * Keeper over one completes it for good, and the nearest Nubbin cheers with a heart. It is
 * one-time per save: `world.hopLesson` goes 'shown' then 'done' and is never asked again.
 * Live play only, and it costs nothing once done or while the Keeper stands still.
 */
import { GROVE } from '../config/tuning';
import { HOP_LESSON } from '../config/tuning-move';
import { react } from './behavior';
import { contact, obstacles } from './obstacles';
import { isFree } from './nubbin';
import { riverDistance } from './terrain';
import type { SimEvent, Vec2, World } from './types';
import type { Collider } from '../config/grove-layout';

/** Per collider table, the hop pieces (logs, fences): a short list to scan. */
const hopLists = new WeakMap<readonly Collider[], Collider[]>();
/** Where the current jump left the ground (transient). */
const takeOff = new WeakMap<World, Vec2>();
/** Where the Keeper was at the last check, so a still Keeper costs nothing. */
const lastAt = new WeakMap<World, Vec2>();

function hopPieces(world: World): Collider[] {
  const all = obstacles(world);
  let list = hopLists.get(all);
  if (!list) {
    list = all.filter((c) => c.flags.includes('hop') && !c.flags.includes('nubbinOnly'));
    hopLists.set(all, list);
  }
  return list;
}

const streamEdge = (): number => GROVE.river.width / 2;

/** What the Keeper is near: a log or fence, the stream, or nothing. */
export function hopLessonNear(world: World, p: Vec2): 'log' | 'stream' | null {
  const r = HOP_LESSON.near;
  for (const c of hopPieces(world))
    if (Math.abs(c.x - p.x) < r + 2 && Math.abs(c.z - p.z) < r + 2 && contact(c, p.x, p.z, r))
      return 'log';
  return riverDistance(p.x, p.z) < streamEdge() + r ? 'stream' : null;
}

/** Whether the line from a to b passes over a hop piece or the stream. */
function crossed(world: World, a: Vec2, b: Vec2): boolean {
  const n = HOP_LESSON.samples;
  for (let i = 1; i < n; i++) {
    const x = a.x + ((b.x - a.x) * i) / n;
    const z = a.z + ((b.z - a.z) * i) / n;
    if (riverDistance(x, z) < streamEdge()) return true;
    for (const c of hopPieces(world)) if (contact(c, x, z, 0)) return true;
  }
  return false;
}

/** Once per sim step in live play. */
export function stepHopLesson(world: World, events: SimEvent[]): void {
  if (world.hopLesson === 'done' || world.location !== 'grove') return;
  const k = world.keeper;
  if (world.hopLesson === undefined) {
    const was = lastAt.get(world);
    if (was && was.x === k.pos.x && was.z === k.pos.z) return;
    lastAt.set(world, { x: k.pos.x, z: k.pos.z });
    const near = hopLessonNear(world, k.pos);
    if (!near) return;
    world.hopLesson = 'shown';
    events.push({ kind: 'hopLesson', stage: 'shown', near });
    return;
  }
  // Shown: watch for the first jump that clears something.
  const from = takeOff.get(world);
  if (!k.grounded) {
    if (!from) takeOff.set(world, { x: k.pos.x, z: k.pos.z });
    return;
  }
  if (!from) return;
  takeOff.delete(world);
  if (!crossed(world, from, k.pos)) return;
  world.hopLesson = 'done';
  events.push({ kind: 'hopLesson', stage: 'done', near: null });
  let best: World['nubbins'][number] | null = null;
  let bestD = 8;
  for (const n of world.nubbins) {
    if (n.stage === 'egg' || n.stage === 'cocoon' || !isFree(n)) continue;
    const d = Math.hypot(n.pos.x - k.pos.x, n.pos.z - k.pos.z);
    if (d < bestD) [best, bestD] = [n, d];
  }
  if (best) react(best, 'love', world.timeMs, events);
}
