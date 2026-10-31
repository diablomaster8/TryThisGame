/**
 * Kid mode for the Hollow (R0188, DUNG-45): a gentler cave for small children. It is on in
 * every Learning Grove save and can be switched on at the cave mouth in any other
 * (`world.hollow.kid`, an optional save field). A kid run (`DungeonRun.kid`) gets:
 * - smaller floors (the `kid` level, about half a standard floor's cells);
 * - no traps, so nothing ever sets the Keeper back;
 * - packs of one or two foes with no champion modifiers, fought with FIGHT's gentle flag;
 * - "Show me the way" on unless the grown-up switched it off.
 * Pure sim: no DOM.
 */
import { HOLLOW_R9D } from '../config/dungeon-r9-d';
import type { Floor } from './dungeon';
import type { World } from './types';

const K = HOLLOW_R9D.kid;

/** Whether new Hollow runs are kid runs: always in a Learning Grove, else the toggle. */
export function hollowKid(world: World): boolean {
  return !!world.edu || world.hollow.kid === true;
}

/** Whether the run under way is a kid run. */
export function kidRun(world: World): boolean {
  return world.location === 'dungeon' && !!world.dungeon?.kid;
}

/** Whether the guide defaults to on: kid mode, or gentle bouts (R0208). */
function guideDefault(world: World): boolean {
  return hollowKid(world) || world.settings.bouts === 'gentle';
}

/** "Show me the way": the Keeper's choice, else on in kid mode and off otherwise. */
export function guideOn(world: World): boolean {
  return world.hollow.guide ?? guideDefault(world);
}

/** The guide switched; off is remembered as `false` only where the default would be on. */
export function setGuide(world: World, on: boolean): void {
  if (on) world.hollow.guide = true;
  else if (guideDefault(world)) world.hollow.guide = false;
  else delete world.hollow.guide;
}

/** Kid mode switched at the cave mouth (a Learning Grove keeps it on). */
export function setHollowKid(world: World, on: boolean): void {
  if (world.edu) return;
  // The guide's off switch only meant something against the old default.
  if (world.hollow.guide === false) delete world.hollow.guide;
  if (on) world.hollow.kid = true;
  else delete world.hollow.kid;
}

/**
 * Make a freshly generated floor kid-sized in its dangers: no traps, packs of at most
 * `packMax` with no modifiers (a champion or elite becomes a plain pack). Bosses keep their
 * kind but come alone. Runs once, on the floor's own cached copy for kid runs.
 */
export function gentleFloor(f: Floor): Floor {
  f.traps = [];
  for (const p of f.packs ?? []) {
    const keep = p.kind === 'boss' || p.kind === 'unique' ? 1 : K.packMax;
    p.members = p.members.slice(0, keep).map((m) => ({ ...m, mods: [] }));
    if (p.kind === 'champion' || p.kind === 'elite') p.kind = 'normal';
  }
  return f;
}
