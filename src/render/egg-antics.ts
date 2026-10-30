/**
 * R0351 (FUN-62): the hatch wait made funny, for both renderers. An egg on the ground has a
 * little wobble of its own every `EGG_ANTICS.wobbleEveryMs`; in its last 30 s it hops; and
 * every third shake a tiny foot pokes out of the bottom and goes back in. It reads the sim
 * (the shake count and time) and never changes it.
 */
import { EGG_ANTICS } from '../config/tuning-fun-r7';
import type { Nubbin } from '../sim/types';

export interface EggAntics {
  /** The foot is out this frame. */
  foot: boolean;
  /** An unprompted wobble this frame: -1 or 1 for the side, 0 for none. */
  wobble: -1 | 0 | 1;
  /** How high the egg hops this frame, in world units. */
  hop: number;
}

const NONE: EggAntics = { foot: false, wobble: 0, hop: 0 };

/** `phase` (ms) staggers eggs so two never wobble together. */
export function eggAntics(
  n: Pick<Nubbin, 'eggShakes' | 'lastShakeMs' | 'hatchRemainingMs' | 'stage'>,
  simMs: number,
  nowMs: number,
  phase: number,
  calm = false,
): EggAntics {
  if (n.stage !== 'egg') return NONE;
  const A = EGG_ANTICS;
  const foot =
    (n.eggShakes ?? 0) > 0 &&
    (n.eggShakes ?? 0) % A.footEvery === 0 &&
    simMs - n.lastShakeMs < A.footMs;
  if (calm) return { foot, wobble: 0, hop: 0 };
  const t = mod(nowMs + phase, A.wobbleEveryMs);
  const wobble: EggAntics['wobble'] =
    t < A.wobbleMs ? (Math.floor(t / (A.wobbleMs / 4)) % 2 === 0 ? -1 : 1) : 0;
  let hop = 0;
  if (n.hatchRemainingMs < A.hopUnderMs) {
    const h = mod(nowMs + phase, A.hopEveryMs);
    if (h < A.hopMs) hop = A.hopHeight * Math.sin((h / A.hopMs) * Math.PI);
  }
  return { foot, wobble, hop };
}

const mod = (v: number, m: number): number => ((v % m) + m) % m;
