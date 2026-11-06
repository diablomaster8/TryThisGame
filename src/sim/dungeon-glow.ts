/**
 * R0690 (KIDS-22): the "Glow Cave", the Hollow for a Learning Grove sprout (`world.edu.band
 * === 'sprout'`). It builds on kid mode (`dungeon-kid.ts`): small floors, no traps, gentle
 * packs. On top of that a glow run (`DungeonRun.glow`):
 * - has at most `GLOW_CAVE.floors` floors; the chest is on the last;
 * - never takes Shells: strays are shy glowbugs that follow the Keeper and want a fruit;
 * - gives each floor one learning puzzle (tap the red gems, or match the shape on the door)
 *   that opens the way down (or the chest); the screen checks the tapping and reports
 *   `glowSolve`, which the sim only accepts for the floor the run is on;
 * - pays a cave sticker with the chest.
 * Pure and seeded: the puzzle for a floor depends only on the run's seed and the depth.
 */
import { GLOW_CAVE } from '../config/tuning-kids';
import { Rng } from './rng';
import type { DungeonRun, SimEvent, World } from './types';

export type GlowShape = (typeof GLOW_CAVE.shapes)[number];

export type GlowPuzzle =
  | { kind: 'gems'; red: number; decoys: number }
  | { kind: 'door'; shape: GlowShape; options: GlowShape[] };

/** Whether a run is a Glow Cave run. */
export function isGlow(run: DungeonRun | null | undefined): boolean {
  return !!run?.glow;
}

/** The puzzle a floor asks: gems on odd floors, the door on even ones (shape and order seeded). */
export function glowPuzzle(seed: number, depth: number): GlowPuzzle {
  const rng = Rng.fromSeed(`${seed}:${depth}:glow`);
  if (depth % 2 === 1)
    return { kind: 'gems', red: GLOW_CAVE.gems.red, decoys: GLOW_CAVE.gems.decoys };
  const shape = rng.pick(GLOW_CAVE.shapes);
  const options: GlowShape[] = [shape];
  while (options.length < GLOW_CAVE.doorOptions) {
    const other = rng.pick(GLOW_CAVE.shapes);
    if (!options.includes(other)) options.push(other);
  }
  // A seeded shuffle so the right picture is not always first.
  for (let i = options.length - 1; i > 0; i--) {
    const j = rng.int(0, i);
    [options[i], options[j]] = [options[j]!, options[i]!];
  }
  return { kind: 'door', shape, options };
}

/** Whether a floor's puzzle is solved. */
export function glowSolved(run: DungeonRun, depth = run.depth): boolean {
  return !!run.glowSolved?.includes(depth);
}

/** The screen reports a puzzle done: accepted only for this glow run's current floor. */
export function glowSolve(world: World, depth: number, events: SimEvent[]): void {
  const run = world.dungeon;
  if (!run?.glow || run.depth !== depth || glowSolved(run, depth)) return;
  (run.glowSolved ??= []).push(depth);
  events.push({ kind: 'glowSolved', depth });
}

/**
 * Whether a glow run holds back the stairs down or the chest: both wait for this floor's
 * puzzle, and the stairs do nothing on the last floor (the chest is there).
 */
export function glowBlocks(run: DungeonRun, to: 'down' | 'chest'): boolean {
  if (!run.glow) return false;
  if (!glowSolved(run)) return true;
  return to === 'down' && run.depth >= GLOW_CAVE.floors;
}

/** The chest's cave sticker (one per chest opened in a glow run). */
export function glowSticker(world: World, run: DungeonRun, events: SimEvent[]): void {
  if (!run.glow || !world.edu) return;
  world.edu.caveStickers = (world.edu.caveStickers ?? 0) + 1;
  events.push({ kind: 'glowSticker', count: world.edu.caveStickers });
}

/** A glowbug drifts toward the Keeper and stops beside them. */
export function glowFollow(
  pos: { x: number; z: number },
  to: { x: number; z: number },
  speed: number,
  dt: number,
  stopAt: number,
): void {
  const dx = to.x - pos.x;
  const dz = to.z - pos.z;
  const d = Math.hypot(dx, dz);
  if (d <= stopAt || d === 0) return;
  const step = Math.min(d - stopAt, speed * dt);
  pos.x += (dx / d) * step;
  pos.z += (dz / d) * step;
}
