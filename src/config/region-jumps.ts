/**
 * WORLD-21: the jump spaces. A world built to fixed jump metrics makes jumps feel fair; one
 * built by eye makes them feel random. These are the gaps and rises each kind of jump space is
 * built to, and the routes that use them, per region. The metrics are checked against the
 * Keeper's real jump (`JUMP`, `KEEPER`, `GLIDE`, lane A's numbers) by `sim/regions-jump.ts`
 * and its test, so a change to the jump that breaks a space fails the build instead of a
 * player's run.
 *
 * Measured from the physics on 2026-10-28: a single jump peaks at 0.95 u and clears about
 * 1.7 u walking and 3.1 u running; a double jump peaks at 1.70 u and clears about 2.8 u
 * walking and 5.1 u running; the Fly perk's glide carries 2.6 u (walking) to 4.7 u (running)
 * per unit dropped for at most 1.2 s. So a double jump climbs one terrace level and a half,
 * not two (two levels are 1.8 u), and a glide drop is a short hop down, not a long sail.
 */
import type { RegionId } from './regions';

/** What each jump space may ask, with a margin under the physics. */
export const JUMP_METRICS = {
  /** One terrace level (`TERRACE.maxStep`). */
  level: 0.9,
  single: { rise: 0.9, gapWalk: 1.6, gapRun: 2.0 },
  double: { rise: 1.5, gapWalk: 2.6, gapRun: 3.6 },
  /** A glide drop: horizontal units per unit dropped, at a walk. */
  glide: { perDrop: 2.4 },
  /** Share of the physical reach a space may use (the rest is the margin). */
  margin: 0.95,
} as const;

export type JumpSpaceKind = 'stones' | 'ledge' | 'double' | 'glide';

/**
 * One jump route: the hardest gap and rise along it, whether it needs a run-up, and the
 * point of interest a walking route reaches the same place by (kids, and the skip setting).
 * A route never gates the story; a `double` route only saves time.
 */
export interface JumpRoute {
  id: string;
  kind: JumpSpaceKind;
  /** Widest gap to cross, world units (edge to edge). */
  gap: number;
  /** Highest rise to climb in one jump; a glide's drop is negative. */
  rise: number;
  run: boolean;
  /** Where it starts and ends. */
  from: { x: number; z: number };
  to: { x: number; z: number };
  /** The POI id, in the same region, a walking path reaches `to` by. */
  walkAround: string;
}

/**
 * The routes per region. None is built yet: the Grove has no gap or ledge (its terraces have
 * ramps), and the first ones come with the Wood (WORLD-25): stepping stones over its stream
 * (gap 1.6), a ledge ladder up the lookout, a double-jump shortcut and a glide drop from the
 * lookout. Each is added here as it is built, and the check runs on it from then on.
 */
export const JUMP_ROUTES: Partial<Record<RegionId, readonly JumpRoute[]>> = {};
