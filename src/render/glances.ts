/**
 * R0580 (SOUL-63): Nubbins glance at what happens near them: another Nubbin tripping,
 * sneezing, twirling, splashing or crying close by, or a fruit dropping out of a tree.
 * Render-only (it reads the world and never writes it, so seeded days are untouched): each
 * renderer keeps one `Glances` and asks it for a look point per Nubbin per frame; a new
 * target is taken at most every `GLANCE.everyMs`, and a calm Nubbin is the only one that
 * looks up (one walking keeps its way, one asleep sleeps).
 */
import type { ReadonlyWorld } from './readonly-world';
import { GLANCE } from '../config/tuning-more/soul-quirks-gait';
import type { Nubbin, Vec2 } from '../sim/types';

/** Acts worth turning to look at. */
const SHOWY = new Set([
  'trip',
  'sneeze',
  'hiccup',
  'chaseTail',
  'twirl',
  'flex',
  'splash',
  'giggle',
  'burp',
  'stomp',
  'raindrop',
  'tag',
]);

const CALM = new Set(['sit', 'wander', 'eat', 'greet', 'swim', 'play']);

/** Whether this Nubbin is doing something to look at. */
export function showy(o: Nubbin): boolean {
  const b = o.behavior;
  if (b.state === 'cry') return true;
  const id = b.itemId ?? '';
  if (b.state === 'swim' && id.startsWith('splashFriend:')) return true;
  return b.state === 'perform' && SHOWY.has(id);
}

const dist = (a: Vec2, b: Vec2): number => Math.hypot(a.x - b.x, a.z - b.z);

/** What `n` would look at now, by the rules (no rate limit), or null. */
export function glanceTarget(n: Nubbin, world: ReadonlyWorld): { id: string; at: Vec2 } | null {
  if (n.stage === 'egg' || n.stage === 'cocoon' || !CALM.has(n.behavior.state)) return null;
  let best: { id: string; at: Vec2; d: number } | null = null;
  for (const o of world.nubbins) {
    if (o === n || o.stage === 'egg' || !showy(o)) continue;
    const d = dist(o.pos, n.pos);
    if (d < GLANCE.otherRadius && (!best || d < best.d)) best = { id: o.id, at: o.pos, d };
  }
  if (best) return best;
  for (const i of world.items) {
    if (i.kind !== 'fruit' || i.y <= 0.05) continue;
    const d = dist(i.pos, n.pos);
    if (d < GLANCE.fruitRadius && (!best || d < best.d)) best = { id: i.id, at: i.pos, d };
  }
  return best;
}

/** One renderer's glances, each held at least `everyMs` (render clock). */
export class Glances {
  private readonly held = new Map<string, { id: string | null; at: number }>();

  /** Where `n` is looking (a live position), or null. */
  at(n: Nubbin, world: ReadonlyWorld, nowMs: number): Vec2 | null {
    const h = this.held.get(n.id);
    const want = glanceTarget(n, world);
    let id = h?.id ?? null;
    if (!h || (want?.id ?? null) !== id) {
      if (!h || nowMs - h.at >= GLANCE.everyMs || id === null) {
        id = want?.id ?? null;
        this.held.set(n.id, { id, at: nowMs });
      }
    }
    if (!id) return null;
    const o = world.nubbins.find((x) => x.id === id) ?? world.items.find((x) => x.id === id);
    if (!o || !CALM.has(n.behavior.state)) return null;
    return o.pos;
  }

  /** The facing toward the glance, or null. */
  face(n: Nubbin, world: ReadonlyWorld, nowMs: number): number | null {
    const p = this.at(n, world, nowMs);
    return p ? Math.atan2(p.x - n.pos.x, p.z - n.pos.z) : null;
  }
}
