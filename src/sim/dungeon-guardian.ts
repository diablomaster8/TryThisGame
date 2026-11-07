/**
 * The Hollow's floor-5 guardian (R0260, FIGHT-72). The room that holds the way down on a
 * depth-5 level has a calm-only boss: walking into it starts the lane C guardian bout
 * (`startGuardian`, a tactics `calmBoss` in the guardian hall). A win is booked once per
 * level (and pays the keepsake through the slice); a loss or an unfightable start waits
 * until the Keeper steps out and back in. The same bout can be started by the
 * `guardianStart` command.
 */
import { BATTLE_R6 } from '../config/tuning-more/battle-ladder-fusion';
import { startGuardian } from './battle/story-bouts';
import { cellOf, type Floor } from './dungeon';
import { levelIdOf } from './dungeon-levels';
import type { DungeonRun, SimEvent, World } from './types';

/** The key the guardian's `tacticsEnd` carries on this level. */
export function guardianKey(run: DungeonRun): string {
  return `guardian:${levelIdOf(run)}`;
}

/** Whether this level has a guardian still to be calmed (for the UI and tests). */
export function guardianOpen(run: DungeonRun, f: Floor): boolean {
  return (
    !run.zone &&
    run.depth === BATTLE_R6.guardian.depth &&
    !!f.stairsDown &&
    !f.packs?.some((p) => p.kind === 'boss') &&
    !run.guardian?.done.includes(guardianKey(run))
  );
}

function inHall(f: Floor, c: { x: number; y: number }): boolean {
  const room = f.rooms.find(
    (r) =>
      f.stairsDown &&
      f.stairsDown.x >= r.x &&
      f.stairsDown.x < r.x + r.w &&
      f.stairsDown.y >= r.y &&
      f.stairsDown.y < r.y + r.h,
  );
  return !!room && c.x >= room.x && c.x < room.x + room.w && c.y >= room.y && c.y < room.y + room.h;
}

/** Live steps: walking into the guardian's hall starts the bout. Callers skip it in any fight. */
export function stepGuardian(world: World, run: DungeonRun, f: Floor, events: SimEvent[]): void {
  if (!guardianOpen(run, f)) return;
  const key = guardianKey(run);
  const inside = inHall(f, cellOf(f, world.keeper.pos));
  if (!inside) {
    if (run.guardian?.wait === key) delete run.guardian.wait;
    return;
  }
  if (run.guardian?.wait === key || world.tactics || (world.battle && !world.battle.result)) return;
  const state = (run.guardian ??= { done: [] });
  state.wait = key;
  if (!startGuardian(world, events, { depth: run.depth, key, ids: run.party })) return;
  world.keeper.moveTarget = null;
  world.keeper.intent = null;
  events.push({ kind: 'guardianHall', phase: 'start' });
}

/** The tactics core's hook: a guardian bout that just ended books the hall on a win. */
export function guardianEnded(world: World, fresh: SimEvent[], events: SimEvent[]): void {
  const run = world.dungeon;
  if (!run) return;
  const key = guardianKey(run);
  for (const e of fresh) {
    if (e.kind !== 'tacticsEnd' || e.source !== 'guardian' || e.key !== key) continue;
    if (e.winner !== 0) {
      events.push({ kind: 'guardianHall', phase: 'lost' });
      return;
    }
    const state = (run.guardian ??= { done: [] });
    if (!state.done.includes(key)) state.done.push(key);
    events.push({ kind: 'guardianHall', phase: 'won' });
    return;
  }
}
