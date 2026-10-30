/**
 * Gran's Picnic (R0204, DUNG-70): the chest nook's rug is a rest spot. Standing on it for a
 * few seconds tops the party's energy up and cheers them, once per level, and wakes any
 * Nubbin that had dozed off on the way so nobody is stranded. The tent beside it is the
 * phone's "safe to close" spot: the run is already in every autosave, so this only says so.
 * Pure sim: no DOM.
 */
import { HOLLOW_R7 } from '../config/tuning-dungeon';
import { NEEDS } from '../config/tuning';
import { cellOf, type Floor } from './dungeon';
import { levelIdOf } from './dungeon-levels';
import type { DungeonRun, SimEvent, World } from './types';

const P = HOLLOW_R7.picnic;

/** Has this level's picnic been had already? */
export function picnicHad(run: DungeonRun): boolean {
  return run.picnics?.includes(levelIdOf(run)) ?? false;
}

function onCells(f: Floor, world: World, cells: { x: number; y: number }[]): boolean {
  const c = cellOf(f, world.keeper.pos);
  return cells.some((r) => r.x === c.x && r.y === c.y);
}

/** One step: count the Keeper's time on the rug, rest the party at the mark, note the tent. */
export function stepPicnic(
  world: World,
  run: DungeonRun,
  f: Floor,
  dtMs: number,
  events: SimEvent[],
): void {
  const nook = f.nook;
  if (!nook || run.zone === 'town') return;
  const tent = nook.tent && onCells(f, world, [nook.tent]);
  if (tent && !run.tentNoted) {
    run.tentNoted = true;
    events.push({ kind: 'picnicTent' });
  } else if (!tent && run.tentNoted) delete run.tentNoted;
  if (picnicHad(run) || !onCells(f, world, nook.rug)) {
    delete run.picnicMs;
    return;
  }
  run.picnicMs = (run.picnicMs ?? 0) + dtMs;
  if (run.picnicMs < P.sitMs) return;
  delete run.picnicMs;
  (run.picnics ??= []).push(levelIdOf(run));
  if (run.picnics.length > P.keep) run.picnics.shift();
  for (const id of run.party) {
    const n = world.nubbins.find((x) => x.id === id);
    if (!n || n.stage === 'egg' || n.stage === 'cocoon') continue;
    n.needs.energy = 1;
    n.needs.happiness = Math.min(NEEDS.happinessMax, n.needs.happiness + P.happy);
    if (n.behavior.state === 'nap') {
      n.behavior.state = 'wander';
      n.behavior.sinceMs = world.timeMs;
    }
  }
  events.push({ kind: 'picnicRest' });
}
