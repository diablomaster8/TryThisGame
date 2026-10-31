/**
 * R0533 (SOUL-15): Nubbins notice the Keeper going by, even while busy. Render-only: it
 * reads the Nubbin and the Keeper and never writes the sim, so seeded days are untouched.
 *
 * - The head turn: a sitting, greeting or swimming Nubbin with the Keeper within
 *   `NOTICE.radius` is drawn facing the Keeper (Pixel picks the angle; the 3D rig already
 *   turns its head through its glance), without changing the sim's `facing`.
 * - The acknowledgement, on the first approach after `NOTICE.apartMs` apart, by personality:
 *   cheerful waves, shy looks and then looks away, mischievous grins and skips a step, lazy
 *   lifts one hand. A child with no personality yet waves.
 */
import { NOTICE } from '../config/tuning';
import type { Nubbin, Personality, Vec2 } from '../sim/types';

export type NoticeBeat = 'wave' | 'shyGlance' | 'grin' | 'handLift';

/** States calm enough to look up from (walking ones keep facing their way). */
const LOOKING = new Set(['sit', 'greet', 'swim', 'wander', 'play', 'eat']);
const TURNING = new Set(['sit', 'greet', 'swim', 'eat']);

const near = (n: Nubbin, k: Vec2): boolean =>
  Math.hypot(k.x - n.pos.x, k.z - n.pos.z) < NOTICE.radius;

/** The facing to draw instead of the sim's, or null. */
export function noticeFace(n: Nubbin, keeper: Vec2): number | null {
  if (n.stage === 'egg' || n.stage === 'cocoon' || !TURNING.has(n.behavior.state)) return null;
  if (!near(n, keeper)) return null;
  return Math.atan2(keeper.x - n.pos.x, keeper.z - n.pos.z);
}

export function noticeBeatFor(p: Personality | null): NoticeBeat {
  switch (p) {
    case 'shy':
      return 'shyGlance';
    case 'mischievous':
      return 'grin';
    case 'lazy':
      return 'handLift';
    default:
      return 'wave';
  }
}

/**
 * Per renderer: when each Nubbin last had the Keeper near (render clock). Returns the beat
 * to start on this frame, or null.
 */
export class NoticeTracker {
  private readonly lastNear = new Map<string, number>();

  check(n: Nubbin, keeper: Vec2 | null, nowMs: number): NoticeBeat | null {
    if (!keeper || n.stage === 'egg' || n.stage === 'cocoon') return null;
    if (!near(n, keeper)) return null;
    const last = this.lastNear.get(n.id);
    this.lastNear.set(n.id, nowMs);
    if (last !== undefined && nowMs - last < NOTICE.apartMs) return null;
    if (!LOOKING.has(n.behavior.state)) return null;
    return noticeBeatFor(n.personality);
  }
}
