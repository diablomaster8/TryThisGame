import { CG4_A2 } from '../config/tuning-a2';
import { markAt } from '../config/stage-marks';
import type { Vec2 } from '../sim/types';
import type { StageFlags } from './scene-stage';

/**
 * Campaign graphics 4, package a2 (K5, K36): the pure half of the walk-ons. A cast entry
 * with `from` walks from that mark to its own; nothing here draws or writes the world.
 */

export type WalkKind = 'npc' | 'nubbin' | 'keeper' | 'actor';

export interface Walk {
  kind: WalkKind;
  /** The NPC or Nubbin id; 'you' for the Keeper; the cast `who` for a stage actor. */
  key: string;
  from: Vec2;
  to: Vec2;
  /** The travel direction, `atan2(dx, dz)`. */
  yaw: number;
  /** The facing on arrival (the mark's, or toward whom the entry names). */
  endFace: number;
  startMs: number;
  durMs: number;
  /** Set once the arrival has been written. */
  done: boolean;
}

export interface WalkPose {
  x: number;
  z: number;
  walking: boolean;
}

/** Where a `from` mark stands: the stage-marks table first, then the lane marks. */
export function fromSpot(location: string, name: string): Vec2 | null {
  const m = markAt(location, name);
  if (m) return { x: m.x, z: m.z };
  const extra = CG4_A2.fromMarks[name];
  return extra ? { x: extra.x, z: extra.z } : null;
}

/** How long a walk of this length takes, in ms. */
export function walkMs(dist: number): number {
  const w = CG4_A2.walk;
  return Math.max(w.minMs, Math.min(w.maxMs, (dist / w.speed) * 1000));
}

/** The walker's place at `nowMs`; under reduced motion it is on its mark from the start. */
export function walkPose(w: Walk, nowMs: number, reduce: boolean): WalkPose {
  const t = (nowMs - w.startMs) / w.durMs;
  if (reduce || t >= 1) return { x: w.to.x, z: w.to.z, walking: false };
  const k = Math.max(0, t);
  // A little ease at each end, so a figure does not leap into its stride.
  const e = k * k * (3 - 2 * k);
  return {
    x: w.from.x + (w.to.x - w.from.x) * e,
    z: w.from.z + (w.to.z - w.from.z) * e,
    walking: k > 0,
  };
}

export type GroundType = 'snow' | 'mud' | 'sand';

/**
 * The ground a walk-on leaves prints in (K36): snow through Hazel's cold chapters and in
 * Corvin's garden, mud in the rain of Hazel 6 and the Hundred Days' Mire, sand on the
 * Beetle Road; grass leaves none.
 */
export function groundType(f: StageFlags): GroundType | null {
  if (f.location === 'corvin') return 'snow';
  if (f.campaign === 'hazel') {
    if (f.chapter >= 9 && f.chapter <= 12) return 'snow';
    if (f.chapter === 6) return 'mud';
    return null;
  }
  if (f.campaign === 'beetle') return 'sand';
  if (f.campaign === 'hundred' && f.storyChapter === 6) return 'mud';
  return null;
}

/** K40: the emote ball a line's mood puts over the partner, or null for its own. */
export function partnerEmote(
  mood: string | undefined,
): 'heart' | 'spiral' | 'exclaim' | 'question' | null {
  return (mood && CG4_A2.partner.emote[mood]) || null;
}
