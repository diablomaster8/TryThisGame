/**
 * TECH-34: the step as an ordered registry. `stepWorld` (sim/world.ts) used to call each
 * subsystem by hand in a fixed order; now each is a `SimSystem` with an id, a place in the
 * order and a declaration of when it runs, and `stepWorld` is a loop over the sorted list.
 * This file is only the vocabulary and the runner (no subsystem imports, so it cannot form
 * an import cycle); the list itself sits beside `stepWorld`.
 *
 * Order numbers leave gaps (10, 20, ...) so a new system slots in without renumbering.
 * Systems with `rng: true` run inside one `withRng` block, before every system without it,
 * exactly as the hand-written step did; the sorted list is checked for that at load.
 */
import type { Rng } from './rng';
import type { SimEvent, World } from './types';

export interface StepCtx {
  world: World;
  dtMs: number;
  /** Wall-clock ms for this step, or undefined in pure sim runs (tests, scripts). */
  wallMs: number | undefined;
  /** Catch-up (time away) rather than live play. */
  offline: boolean;
  /** False for a scripted or hidden-tab step that must not count as play. */
  countPlay: boolean;
  events: SimEvent[];
}

/** When a system runs. Every system declares all three, so offline behaviour is never implicit. */
export interface SystemRuns {
  live: boolean;
  offline: boolean;
  /** Reserved for the coarse one-minute catch-up steps; today they step as offline. */
  coarse: boolean;
}

interface SystemBase {
  id: string;
  order: number;
  runs: SystemRuns;
  /** Run at most once per this many sim ms (not used yet: every system still runs each step). */
  everyMs?: number;
}
export interface RngSystem extends SystemBase {
  rng: true;
  step(ctx: StepCtx, rng: Rng): void;
}
export interface PlainSystem extends SystemBase {
  rng: false;
  step(ctx: StepCtx): void;
}
export type SimSystem = RngSystem | PlainSystem;

/** Sort by order and check the list: unique ids and orders, and every rng system first. */
export function orderSystems(list: readonly SimSystem[]): SimSystem[] {
  const sorted = [...list].sort((a, b) => a.order - b.order);
  const ids = new Set<string>();
  let plainSeen = false;
  for (let i = 0; i < sorted.length; i++) {
    const s = sorted[i]!;
    if (ids.has(s.id)) throw new Error(`Duplicate system id ${s.id}`);
    ids.add(s.id);
    if (i > 0 && sorted[i - 1]!.order === s.order) throw new Error(`Duplicate order ${s.order}`);
    if (!s.rng) plainSeen = true;
    else if (plainSeen) throw new Error(`System ${s.id} uses the rng after a plain system`);
  }
  return sorted;
}

/** Run the ordered systems for one step. */
export function runSystems(
  sorted: readonly SimSystem[],
  ctx: StepCtx,
  withRng: (world: World, fn: (rng: Rng) => void) => void,
): void {
  const on = (s: SimSystem): boolean => (ctx.offline ? s.runs.offline : s.runs.live);
  withRng(ctx.world, (rng) => {
    for (const s of sorted) if (s.rng && on(s)) s.step(ctx, rng);
  });
  for (const s of sorted) if (!s.rng && on(s)) s.step(ctx);
}
