/**
 * The tap-to-move preview both renderers draw (MOVE-44, WORLD-41): soft footprints every
 * 0.8 u along the Keeper's planned path, fading over 1.2 s, a marker on the ground at the
 * target, and a small "?" puff at the nearest point when the tap itself can't be reached,
 * all at the height of the surface there (a terrace top, a bench). It reads the sim (the
 * tap target and the nav route) and never changes it.
 */
import { TAP_PATH } from '../config/tuning-move';
import { TAP_FLAG } from '../config/tuning-move-r10';
import { TAP_PRINTS } from '../config/tuning-r9d2';
import { keeperFooting, standInTap, tapVerdict, type TapVerdict } from '../sim/keeper';
import { keeperRoute } from '../sim/nav';
import type { Vec2, World } from '../sim/types';

export interface TapMark {
  x: number;
  y: number;
  z: number;
}

/** A footprint: where it lies and which way the walk heads there (radians about y). */
export interface TapPrint extends TapMark {
  yaw: number;
}

export class TapPath {
  private target: Vec2 | null = null;
  private at = -Infinity;
  dots: TapPrint[] = [];
  mark: TapMark | null = null;
  /** R0035: a ✕ (refused) or ⤒ (needs a jump) where the player tapped, for a little while. */
  flag: (TapMark & { kind: TapVerdict['kind'] }) | null = null;
  private verdict: TapVerdict | undefined;
  private flagAt = -Infinity;
  /** The nearest reachable point, when the walk stops short of the tap (else null). */
  unreached: TapMark | null = null;
  private puffAt = -Infinity;

  /** Follow the sim's tap target; returns false when nothing is to be drawn. */
  update(world: World, nowMs: number): boolean {
    const v = world.location === 'grove' ? tapVerdict(world) : undefined;
    if (v !== this.verdict) {
      this.verdict = v;
      this.flagAt = nowMs;
      this.flag = v ? { ...v.at, y: keeperFooting(world, v.at.x, v.at.z).y, kind: v.kind } : null;
    }
    const t = world.location === 'grove' ? world.keeper.moveTarget : null;
    if (t !== this.target) {
      // A fresh tap somewhere else clears an old flag (the walk to a shut-in tap's nearest
      // point starts in the same step as its flag, so that one stays).
      if (t && nowMs !== this.flagAt) this.flag = null;
      this.target = t;
      this.at = nowMs;
      this.dots = [];
      this.mark = null;
      // The "?" puff outlives a short walk to the nearest point; a new tap clears it.
      if (t) this.unreached = null;
    }
    if (!t) return this.flagAlpha(nowMs, false) > 0 || this.puffLife(nowMs, false) !== null;
    if (nowMs - this.at <= TAP_PATH.settleMs || !this.mark) this.place(world, t);
    // A walk that stops short already says so with the "?" puff; the ✕ is for taps that get
    // no walk at all (the ⤒ jump hint stays either way).
    if (this.unreached && this.flag?.kind === 'cant') this.flag = null;
    return true;
  }

  /** How strongly to draw the prints (0 gone): a fade, or whole then gone in reduced motion. */
  dotAlpha(nowMs: number, reduced: boolean): number {
    const age = nowMs - this.at;
    if (reduced) return age < TAP_PRINTS.fadeMs ? 1 : 0;
    return Math.max(0, 1 - age / TAP_PRINTS.fadeMs);
  }

  markAlpha(nowMs: number, reduced: boolean): number {
    const age = nowMs - this.at;
    if (reduced) return age < TAP_PATH.reducedMs ? 1 : 0;
    return age < TAP_PATH.markMs ? Math.min(1, (TAP_PATH.markMs - age) / 300) : 0;
  }

  /** R0035: how strongly to draw the ✕ / ⤒ flag (0 gone). */
  flagAlpha(nowMs: number, reduced: boolean): number {
    if (!this.flag) return 0;
    const left = (reduced ? TAP_FLAG.reducedMs : TAP_FLAG.showMs) - (nowMs - this.flagAt);
    return Math.max(0, Math.min(1, left / TAP_FLAG.fadeMs));
  }

  /**
   * The "?" puff's life, 0..1 (null when there is none or it is over); reduced motion holds
   * it still at 0.5 for the same time.
   */
  puffLife(nowMs: number, reduced: boolean): number | null {
    if (!this.unreached) return null;
    const f = (nowMs - this.puffAt) / TAP_PRINTS.puffMs;
    if (f < 0 || f >= 1) return null;
    return reduced ? 0.5 : f;
  }

  private place(world: World, target: Vec2): void {
    const k = world.keeper.pos;
    const route = keeperRoute(world);
    const end = route.length ? route[route.length - 1]! : target;
    const line: Vec2[] = [{ x: k.x, z: k.z }, ...route.slice(0, -1), end];
    const at = (x: number, z: number): TapMark => ({
      x,
      y: keeperFooting(world, x, z).y,
      z,
    });
    this.mark = at(end.x, end.z);
    // A shut-in tap is swapped in the sim for a stand-in at the nearest reachable point.
    const tapped = standInTap(target) ?? target;
    const short = Math.hypot(end.x - tapped.x, end.z - tapped.z) > TAP_PRINTS.unreachedGap;
    if (short && !this.unreached) this.puffAt = this.at;
    this.unreached = short ? at(end.x, end.z) : null;
    this.dots = [];
    const P = TAP_PRINTS;
    let want = P.spacing;
    let walked = 0;
    let side = 1;
    for (let i = 1; i < line.length && this.dots.length < P.max; i++) {
      const a = line[i - 1]!;
      const b = line[i]!;
      const l = Math.hypot(b.x - a.x, b.z - a.z);
      if (l < 1e-6) continue;
      const dx = (b.x - a.x) / l;
      const dz = (b.z - a.z) / l;
      const last = i === line.length - 1;
      // Prints stop a half step short of the marker so the two don't overlap.
      while (want <= walked + l - (last ? P.spacing / 2 : 0) && this.dots.length < P.max) {
        const f = want - walked;
        const x = a.x + dx * f - dz * P.spread * side;
        const z = a.z + dz * f + dx * P.spread * side;
        this.dots.push({ ...at(x, z), yaw: Math.atan2(dx, dz) });
        side = -side;
        want += P.spacing;
      }
      walked += l;
    }
  }
}
