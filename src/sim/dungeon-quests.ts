/**
 * Act quests (R0166, DUNG-26, lane B round 9): two per act, D2-shaped, from the table in
 * `config/dungeon-r9-c.ts`. The camp's quest-giver hands them out (`takeActQuest`); each
 * then watches its own level of the act's dungeon:
 * - clear: every pack on the level is beaten;
 * - find: the level's treasure chest is opened (the lost thing is inside);
 * - rescue: the Keeper reaches the lost one, waiting at the far end of the level;
 * - unique: the named foe is beaten on its level.
 * The reward (Shells, sometimes a Homing Acorn) lands once, the moment the goal is met.
 * Quest markers (!) for the automap come from `actQuestMarks`.
 *
 * Pure sim: no DOM.
 */
import { actStartDepth } from '../config/dungeon-acts';
import { ACT_QUESTS, HOLLOW_R9C, type ActQuestDef } from '../config/dungeon-r9-c';
import { cellOf, FLOOR, type Cell, type Floor } from './dungeon';
import { actOpen } from './dungeon-acts';
import { dryRegions } from './dungeon-roles';
import { serviceHere } from './dungeon-towns';
import type { DungeonRun, SimEvent, World } from './types';

/** The act's quests, in table order. */
export function questsOfAct(act: number): ActQuestDef[] {
  return ACT_QUESTS.filter((q) => q.act === act);
}

export function questState(world: World, id: string): 'active' | 'done' | null {
  return world.hollow.actQuests?.[id] ?? null;
}

/** Take a quest at the act's camp quest-giver: its act must be open, and it is taken once. */
export function takeActQuest(world: World, id: string, events: SimEvent[]): boolean {
  const q = ACT_QUESTS.find((x) => x.id === id);
  if (!q || questState(world, id) || !actOpen(world, q.act)) return false;
  const run = world.dungeon;
  if (!run || run.zone !== 'town' || run.act !== q.act) return false;
  if (serviceHere(world)?.kind !== 'quest') return false;
  (world.hollow.actQuests ??= {})[id] = 'active';
  events.push({ kind: 'hollowR9', what: 'questTaken', id });
  return true;
}

/** The act level (1-based) the run stands on inside an act's dungeon, else 0. */
function actLevel(run: DungeonRun): number {
  if (run.act === undefined || run.zone) return 0;
  return run.depth - actStartDepth(run.act) + 1;
}

const rescueCells = new WeakMap<Floor, Cell>();

/** Where a lost one waits: the open cell farthest from the stairs up on their own ground. */
export function rescueCell(f: Floor): Cell {
  const hit = rescueCells.get(f);
  if (hit) return hit;
  const r = dryRegions(f);
  const home = r[f.stairsUp.y * f.cols + f.stairsUp.x] ?? -1;
  let best = f.chest;
  let bestD = -1;
  for (let y = 0; y < f.rows; y++)
    for (let x = 0; x < f.cols; x++) {
      const i = y * f.cols + x;
      if (f.cells[i] !== FLOOR || (home !== -1 && r[i] !== home)) continue;
      const d = Math.hypot(x - f.stairsUp.x, y - f.stairsUp.y);
      if (d > bestD) {
        bestD = d;
        best = { x, y };
      }
    }
  rescueCells.set(f, best);
  return best;
}

/** The quests running on this very level. */
function questsHere(world: World, run: DungeonRun): ActQuestDef[] {
  const level = actLevel(run);
  if (!level) return [];
  return ACT_QUESTS.filter(
    (q) => q.act === run.act && q.level === level && questState(world, q.id) === 'active',
  );
}

function met(world: World, run: DungeonRun, f: Floor, q: ActQuestDef): boolean {
  switch (q.kind) {
    case 'clear': {
      const packs = run.packs ?? [];
      return packs.length > 0 && packs.every((p) => p.state === 'beaten');
    }
    case 'find':
      return run.chestOpen;
    case 'rescue': {
      const c = rescueCell(f);
      const k = cellOf(f, world.keeper.pos);
      return Math.hypot(k.x - c.x, k.y - c.y) <= HOLLOW_R9C.quests.rescueCells;
    }
    case 'unique': {
      const pack = f.packs?.find((p) => p.unique === q.unique);
      return !!pack && run.packs?.find((p) => p.id === pack.id)?.state === 'beaten';
    }
  }
}

/** Once a step underground: a quest on this level whose goal is met pays out, once. */
export function stepActQuests(world: World, run: DungeonRun, f: Floor, events: SimEvent[]) {
  for (const q of questsHere(world, run)) {
    if (!met(world, run, f, q)) continue;
    world.hollow.actQuests![q.id] = 'done';
    world.inventory.shells += q.shells;
    run.haul.shells += q.shells;
    world.hollow.acorns += q.acorns;
    events.push({ kind: 'hollowR9', what: 'questDone', id: q.id, n: q.shells });
  }
}

/** The "!" markers for the automap: each running quest's goal on this level. */
export function actQuestMarks(world: World, run: DungeonRun, f: Floor): Cell[] {
  const out: Cell[] = [];
  for (const q of questsHere(world, run)) {
    if (q.kind === 'find') out.push(f.chest);
    else if (q.kind === 'rescue') out.push(rescueCell(f));
    else if (q.kind === 'unique') {
      const p = f.packs?.find((x) => x.unique === q.unique);
      if (p) out.push(p.cell);
    } else
      for (const p of f.packs ?? []) {
        const live = run.packs?.find((x) => x.id === p.id);
        if (live && live.state !== 'beaten') {
          const c = cellOf(f, live.pos);
          out.push(c);
        }
      }
  }
  return out;
}

/** The objective chip's quest on this level, if any (its id), for the Hollow bar. */
export function questChipHere(world: World): string | null {
  const run = world.dungeon;
  if (!run) return null;
  return questsHere(world, run)[0]?.id ?? null;
}
