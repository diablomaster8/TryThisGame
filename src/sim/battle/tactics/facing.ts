/**
 * Facing and height (recs FIGHT-54): where an attacker stands relative to the way its target
 * faces, and how far above or below it. Side hits are ×1.15 with +10% accuracy, back hits
 * ×1.35 (a Dasher's ×1.5) and ignore Flutter; every height level above the target adds 8%, up
 * to 24%, and every level below takes 8% off. Pure numbers; the engine and the preview both
 * read them, so the preview always matches the hit.
 */
import { TACTICS } from '../../../config/tuning-tactics';
import type { Cell, Dir } from './types';

const F = TACTICS.facing;

export const DIRS: readonly Dir[] = ['n', 'e', 's', 'w'];
export const DIR_VEC: Readonly<Record<Dir, Cell>> = {
  n: { x: 0, y: -1 },
  e: { x: 1, y: 0 },
  s: { x: 0, y: 1 },
  w: { x: -1, y: 0 },
};

/** The way to face to look from `a` towards `b` (the longer axis wins; ties go north-south). */
export function dirTo(a: Cell, b: Cell): Dir {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? 'e' : 'w';
  if (dy === 0) return 's';
  return dy > 0 ? 's' : 'n';
}

export type Side = 'front' | 'side' | 'back';

/**
 * Which side of the target the attacker hits: the front when it stands in the half the target
 * faces (on or inside the diagonals), the back in the opposite half, a side otherwise.
 */
export function sideOf(attacker: Cell, target: Cell, face: Dir): Side {
  const f = DIR_VEC[face];
  const vx = attacker.x - target.x;
  const vy = attacker.y - target.y;
  const dot = vx * f.x + vy * f.y;
  const cross = Math.abs(vx * f.y - vy * f.x);
  if (dot > 0 && dot >= cross) return 'front';
  if (dot < 0 && -dot >= cross) return 'back';
  return 'side';
}

/** The facing factor; a Dasher's back hits are stronger (FIGHT-55). */
export function facingMult(side: Side, dasher = false): number {
  if (side === 'back') return dasher ? TACTICS.jobs.dasherBack : F.back;
  return side === 'side' ? F.side : 1;
}

/** The height factor for an attacker `dh` levels above (or, negative, below) its target. */
export function heightMult(dh: number): number {
  return 1 + Math.max(-F.heightMax, Math.min(F.heightMax, dh * F.heightPer));
}

/** Extra ranged reach from standing higher: +1 per two levels (never less than 0 for a Glider). */
export function reachBonus(dh: number, glider = false): number {
  const r = Math.trunc(dh / F.reachPer);
  return glider ? Math.max(0, r) : r;
}

/** Accuracy: a side hit +10%; a back hit ignores Flutter (the caller drops it). */
export function accBonus(side: Side): number {
  return side === 'side' ? F.sideAcc : 0;
}
