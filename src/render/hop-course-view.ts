import { HOP_COURSE } from '../config/tuning-move';
import { hopCourseOpen, hopCourseRun } from '../sim/hop-course';
import type { World } from '../sim/types';

/**
 * MOVE-63: what both renderers show of the hop course: which flags stand (the start flag
 * whenever the course is open; during a run the next flag and, fainter, the one after) and
 * where the best run's ghost is. The ghost comes from the UI's side save
 * (`ui/hop-course.ts`), never from the sim, as x, y, z triples one sim step (100 ms) apart.
 */

let ghost: readonly number[] | null = null;

export function setHopGhost(points: readonly number[] | null): void {
  ghost = points && points.length >= 3 ? points : null;
}

export interface ShownFlag {
  x: number;
  z: number;
  kind: 'start' | 'next' | 'after';
  /** The flag's number on the course, 1-based (0 for the start flag). */
  n: number;
}

export function hopFlagsShown(world: World): ShownFlag[] {
  if (world.location !== 'grove' || !hopCourseOpen(world)) return [];
  const run = hopCourseRun(world);
  const s = HOP_COURSE.start;
  if (!run) return [{ x: s.x, z: s.z, kind: 'start', n: 0 }];
  const out: ShownFlag[] = [];
  const f = HOP_COURSE.flags;
  const next = f[run.next];
  if (next) out.push({ x: next.x, z: next.z, kind: 'next', n: run.next + 1 });
  const after = f[run.next + 1];
  if (after) out.push({ x: after.x, z: after.z, kind: 'after', n: run.next + 2 });
  return out;
}

/** Where the ghost is at sim time `t` during a run, or null (no run, no ghost, or done). */
export function hopGhostAt(world: World, t: number): { x: number; y: number; z: number } | null {
  const run = hopCourseRun(world);
  if (!run || !ghost) return null;
  const i = (t - run.startMs) / 100;
  const n = ghost.length / 3;
  if (i < 0 || i >= n - 1) return null;
  const a = Math.floor(i);
  const u = i - a;
  const g = ghost;
  const at = (k: number) => g[a * 3 + k]! + (g[(a + 1) * 3 + k]! - g[a * 3 + k]!) * u;
  return { x: at(0), y: at(1), z: at(2) };
}
