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
  /**
   * Run at most once per this many sim ms, with `dtMs` set to the time since it last ran.
   * Only for systems whose result does not depend on how often they run; the runner keeps
   * the wait outside the World, so saves and the step hash never see it.
   */
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

/** Time each throttled system has waited, per world (outside the save). */
const waited = new WeakMap<World, Map<string, number>>();

/** Whether `s` runs this step; a throttled system also gets its accumulated dt. */
function due(s: SimSystem, ctx: StepCtx): StepCtx | null {
  if (!(ctx.offline ? s.runs.offline : s.runs.live)) return null;
  if (s.everyMs === undefined) return ctx;
  let map = waited.get(ctx.world);
  if (!map) waited.set(ctx.world, (map = new Map()));
  const total = (map.get(s.id) ?? 0) + ctx.dtMs;
  if (total < s.everyMs) {
    map.set(s.id, total);
    return null;
  }
  map.set(s.id, 0);
  return { ...ctx, dtMs: total };
}

/** Run the ordered systems for one step. */
export function runSystems(
  sorted: readonly SimSystem[],
  ctx: StepCtx,
  withRng: (world: World, fn: (rng: Rng) => void) => void,
): void {
  withRng(ctx.world, (rng) => {
    for (const s of sorted) {
      if (!s.rng) continue;
      const c = due(s, ctx);
      if (c) s.step(c, rng);
    }
  });
  for (const s of sorted) {
    if (s.rng) continue;
    const c = due(s, ctx);
    if (c) s.step(c);
  }
}
