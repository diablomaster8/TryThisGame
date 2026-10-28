/**
 * The tap-to-move preview both renderers draw (MOVE-44): a few fading footprint dots along
 * the Keeper's planned path, and a marker on the ground at the target, both at the height
 * of the surface there (a terrace top, a bench). It reads the sim (the tap target and the
 * nav route) and never changes it.
 */
import { TAP_PATH } from '../config/tuning-move';
import { keeperFooting } from '../sim/keeper';
import { keeperRoute } from '../sim/nav';
import type { Vec2, World } from '../sim/types';

export interface TapMark {
  x: number;
  y: number;
  z: number;
}

export class TapPath {
  private target: Vec2 | null = null;
  private at = -Infinity;
  dots: TapMark[] = [];
  mark: TapMark | null = null;

  /** Follow the sim's tap target; returns false when nothing is to be drawn. */
  update(world: World, nowMs: number): boolean {
    const t = world.location === 'grove' ? world.keeper.moveTarget : null;
    if (t !== this.target) {
      this.target = t;
      this.at = nowMs;
      this.dots = [];
      this.mark = null;
    }
    if (!t) return false;
    if (nowMs - this.at <= TAP_PATH.settleMs || !this.mark) this.place(world, t);
    return true;
  }

  /** How strongly to draw the dots (0 gone) and the marker, given the motion setting. */
  dotAlpha(nowMs: number, reduced: boolean): number {
    const age = nowMs - this.at;
    if (reduced) return age < TAP_PATH.reducedMs ? 1 : 0;
    return Math.max(0, 1 - age / TAP_PATH.dotsMs);
  }

  markAlpha(nowMs: number, reduced: boolean): number {
    const age = nowMs - this.at;
    if (reduced) return age < TAP_PATH.reducedMs ? 1 : 0;
    return age < TAP_PATH.markMs ? Math.min(1, (TAP_PATH.markMs - age) / 300) : 0;
  }

  private place(world: World, target: Vec2): void {
    const k = world.keeper.pos;
    const route = keeperRoute(world);
    const end = route.length ? route[route.length - 1]! : target;
    const line: Vec2[] = [{ x: k.x, z: k.z }, ...route.slice(0, -1), end];
    let total = 0;
    for (let i = 1; i < line.length; i++)
      total += Math.hypot(line[i]!.x - line[i - 1]!.x, line[i]!.z - line[i - 1]!.z);
    const at = (x: number, z: number): TapMark => ({
      x,
      y: keeperFooting(world, x, z).y,
      z,
    });
    this.mark = at(end.x, end.z);
    this.dots = [];
    if (total < 1) return;
    const n = TAP_PATH.dots;
    let seg = 1;
    let walked = 0;
    for (let d = 1; d <= n; d++) {
      const want = (total * d) / (n + 1);
      while (seg < line.length - 1) {
        const l = Math.hypot(line[seg]!.x - line[seg - 1]!.x, line[seg]!.z - line[seg - 1]!.z);
        if (walked + l >= want) break;
        walked += l;
        seg++;
      }
      const a = line[seg - 1]!;
      const b = line[seg]!;
      const l = Math.hypot(b.x - a.x, b.z - a.z) || 1;
      const f = Math.min(1, (want - walked) / l);
      this.dots.push(at(a.x + (b.x - a.x) * f, a.z + (b.z - a.z) * f));
    }
  }
}
