import { R10B3 } from '../config/tuning-more/dungeon-poof-kid-mode';
import { cellCentre, cellOf, WALL, type Floor } from '../sim/dungeon';
import type { Vec2 } from '../sim/types';

/**
 * The foe families' defeat beat (R0157, DUNG-17, lane B r10), shared by both renderers: the
 * beaten pack's leader squashes flat (0.15 s), bursts into twelve sparkles in the act's
 * colour, and a tiny figure of it runs to the nearest wall and fades out with a "Bye!" ♪.
 * Never a death: it has simply gone home. Under reduced motion the leader fades where it
 * stood under one sparkle icon, with no burst and no run.
 *
 * It is started by the sim's `packBeaten` event and timed in render time; nothing here
 * changes the sim. Pure (no DOM, no Three.js): `render/hollow-poof-pixel.ts` and
 * `render3d/crowd.ts` draw what `poofFrame` says.
 */
const P = R10B3.poof;

export interface Poof {
  packId: string;
  x: number;
  z: number;
  startMs: number;
  act: number;
  /** Where the runner heads: the nearest wall cell's centre, found once. */
  home: Vec2;
}

export interface PoofFrame {
  /** The leader, squashing (scaleY under 1) or, under reduced motion, fading; null once gone. */
  leader: { scaleX: number; scaleY: number; opacity: number } | null;
  /** 0..1 through the sparkle burst, or null (before it, after it, or under reduced motion). */
  burst: number | null;
  /** The tiny runner, or null. */
  runner: { x: number; z: number; opacity: number; facing: number } | null;
  /** Show the "Bye!" ♪ over the runner. */
  bye: boolean;
  /** Reduced motion's sparkle icon over the fading leader. */
  icon: boolean;
}

/** The centre of the wall cell nearest a point (within `wallSearch` cells), or the point. */
export function nearestWall(f: Floor, at: Vec2): Vec2 {
  const c = cellOf(f, at);
  const r = P.wallSearch;
  let best: Vec2 | null = null;
  let bestD = Infinity;
  for (let y = c.y - r; y <= c.y + r; y++)
    for (let x = c.x - r; x <= c.x + r; x++) {
      if (x < 0 || y < 0 || x >= f.cols || y >= f.rows) continue;
      if (f.cells[y * f.cols + x] !== WALL) continue;
      const d = (x - c.x) ** 2 + (y - c.y) ** 2;
      if (d < bestD) {
        bestD = d;
        best = cellCentre(f, { x, y });
      }
    }
  return best ?? { x: at.x, z: at.z };
}

const runMs = (p: Poof): number =>
  Math.max(
    P.fadeMs,
    Math.min(P.runMaxMs, (Math.hypot(p.home.x - p.x, p.home.z - p.z) / P.runSpeed) * 1000),
  );

/** How long the whole beat lasts. */
export function poofLength(p: Poof, reduceMotion: boolean): number {
  return reduceMotion ? P.calmMs : P.squashMs + Math.max(P.sparkleMs, runMs(p));
}

/** What to draw `ageMs` into the beat, or null once it is over. */
export function poofFrame(p: Poof, ageMs: number, reduceMotion: boolean): PoofFrame | null {
  if (ageMs < 0 || ageMs >= poofLength(p, reduceMotion)) return null;
  if (reduceMotion)
    return {
      leader: { scaleX: 1, scaleY: 1, opacity: 1 - ageMs / P.calmMs },
      burst: null,
      runner: null,
      bye: false,
      icon: true,
    };
  if (ageMs < P.squashMs) {
    const k = ageMs / P.squashMs;
    return {
      leader: { scaleX: 1 + 0.35 * k, scaleY: 1 - 0.6 * k, opacity: 1 },
      burst: null,
      runner: null,
      bye: false,
      icon: false,
    };
  }
  const e = ageMs - P.squashMs;
  const run = runMs(p);
  let runner: PoofFrame['runner'] = null;
  if (e < run) {
    const k = run > 0 ? e / run : 1;
    runner = {
      x: p.x + (p.home.x - p.x) * k,
      z: p.z + (p.home.z - p.z) * k,
      opacity: Math.min(1, (run - e) / P.fadeMs),
      facing: Math.atan2(p.home.x - p.x, p.home.z - p.z),
    };
  }
  return {
    leader: null,
    burst: e < P.sparkleMs ? e / P.sparkleMs : null,
    runner,
    bye: runner !== null && e < P.byeMs,
    icon: false,
  };
}

/** The act's sparkle colour (an unknown act, the Deep Hollow, uses Act I's). */
export const actSparkColour = (act: number | undefined): string =>
  R10B3.actSpark[act ?? 0] ?? R10B3.actSpark[0];

/** Sparkle `i` of 12 at burst progress `k`: an even ring flung out and up, easing to a stop. */
export function sparkleAt(p: Poof, i: number, k: number, out: { x: number; y: number; z: number }) {
  const a = (i / P.sparkles) * Math.PI * 2 + (i % 2) * 0.2;
  const r = P.spread * (1 - (1 - k) * (1 - k)) * (i % 3 === 0 ? 0.7 : 1);
  out.x = p.x + Math.cos(a) * r;
  out.z = p.z + Math.sin(a) * r;
  out.y = 0.5 + 0.6 * k * (1 - k) + (i % 4) * 0.08;
  return out;
}

/** The live beats on a floor; each renderer keeps one. */
export class FoePoofs {
  readonly list: Poof[] = [];
  /** Beats heard about (the event) but not yet placed on a floor. */
  private readonly heard: Array<{ packId: string; at: Vec2; nowMs: number }> = [];

  /** The `packBeaten` event: the beat starts at the next `place`, which has the floor. */
  heardBeaten(packId: string, at: Vec2, nowMs: number): void {
    this.heard.push({ packId, at: { x: at.x, z: at.z }, nowMs });
  }

  /** Start every beat heard of on this floor (call once a frame, before drawing). */
  place(f: Floor | null, act: number | undefined): void {
    for (const h of this.heard) this.start(f, h.packId, h.at, act, h.nowMs);
    this.heard.length = 0;
  }

  /** A pack was beaten (the `packBeaten` event): start its beat. */
  start(f: Floor | null, packId: string, at: Vec2, act: number | undefined, nowMs: number): void {
    if (!f) return;
    this.list.push({
      packId,
      x: at.x,
      z: at.z,
      startMs: nowMs,
      act: act ?? 0,
      home: nearestWall(f, at),
    });
  }

  /** Drop the finished beats (call once a frame). */
  prune(nowMs: number, reduceMotion: boolean): void {
    for (let i = this.list.length - 1; i >= 0; i--) {
      const p = this.list[i]!;
      if (nowMs - p.startMs >= poofLength(p, reduceMotion)) this.list.splice(i, 1);
    }
  }

  /** A new floor: nothing carries over. */
  clear(): void {
    this.list.length = 0;
  }
}
