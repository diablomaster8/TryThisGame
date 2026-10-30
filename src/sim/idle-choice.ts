/**
 * R0524 (SOUL-05): the everyday idle choice as one weighted table instead of a cascade of
 * coin flips, where an early branch starved the later ones. `chooseIdle` (behavior.ts)
 * still runs its hard overrides first (curfew, partners, the shy bush, rain, the bathhouse,
 * courting, snow, friends, lessons, a wary Shadow); what is left is this table: each
 * eligible action's base weight times its personality multiplier, picked with the seeded
 * rng. The bases (`IDLE_ACTIONS`) reproduce the old cascade's shares when every action is
 * open, so a Grove plays as before; a new action or multiplier is one row, not a branch.
 */
import { IDLE_ACTIONS, type IdleActionId } from '../config/tuning-fun-r7';
import { idleMultipliers } from './personality';

/** What the table needs to know about this moment. */
export interface IdleContext {
  keeperNear: boolean;
  wary: boolean;
  toy: boolean;
  shroom: boolean;
  /** Eggs never swim. */
  canSwim: boolean;
  /** The idle multipliers in force (an adult's personality, or a child's leaning at half). */
  mult: ReturnType<typeof idleMultipliers>;
}

type Table = Record<IdleActionId, { base: number; mult: keyof IdleContext['mult'] | null }>;

/** Each eligible action's weight now; ineligible ones are left out. */
export function idleWeights(
  ctx: IdleContext,
  table: Table = IDLE_ACTIONS,
): Partial<Record<IdleActionId, number>> {
  const open: Record<IdleActionId, boolean> = {
    greet: ctx.keeperNear && !ctx.wary,
    play: ctx.toy,
    shroom: ctx.shroom,
    swim: ctx.canSwim,
    sit: true,
    wander: true,
  };
  const out: Partial<Record<IdleActionId, number>> = {};
  for (const id of Object.keys(table) as IdleActionId[]) {
    if (!open[id]) continue;
    const row = table[id];
    const w = row.base * (row.mult ? ctx.mult[row.mult] : 1);
    if (w > 0) out[id] = w;
  }
  return out;
}

/** The same weights as shares that add to 1, for the debug panel and the tests. */
export function idleOdds(ctx: IdleContext, table: Table = IDLE_ACTIONS): Record<string, number> {
  const w = idleWeights(ctx, table);
  const total = Object.values(w).reduce((a, b) => a + b, 0) || 1;
  return Object.fromEntries(Object.entries(w).map(([k, v]) => [k, v / total]));
}
