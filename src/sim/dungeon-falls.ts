/**
 * Kid-safe falls in the Hollow (R0031 with MOVE-25's rule): a Keeper who stands in a chasm,
 * or in deep water without the Swim perk, pops straight back to the last dry cell it stood
 * on. Nothing is lost and nothing hurts; a jump over the gap simply never touches down in
 * it. Party Nubbins cannot jump, so one left on the far side of a gap hops over to the
 * Keeper. Live play only: runtime state, never saved (a reload stands on dry ground).
 */
import { HOLLOW } from '../config/tuning';
import { cellAt, cellCentre, cellOf, CHASM, FLOOR, WATER, type Cell, type Floor } from './dungeon';
import { keeperPerks } from './perks';
import type { DungeonRun, SimEvent, World } from './types';

const lastSafe = new WeakMap<DungeonRun, Cell>();

/** Whether the Keeper can stand at this cell: not a chasm, not deep water unless it swims. */
function hazardAt(world: World, f: Floor, c: Cell): 'chasm' | 'water' | null {
  const v = cellAt(f, c.x, c.y);
  if (v === CHASM) return 'chasm';
  if (v === WATER && f.version >= 4 && !keeperPerks(world).wade) return 'water';
  return null;
}

function nearestDry(f: Floor, c: Cell): Cell {
  for (let r = 1; r < 10; r++)
    for (let dy = -r; dy <= r; dy++)
      for (let dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
        if (cellAt(f, c.x + dx, c.y + dy) === FLOOR) return { x: c.x + dx, y: c.y + dy };
      }
  return f.stairsUp;
}

/**
 * Note where the Keeper last stood on dry ground; a Keeper on its feet in a hazard goes back
 * there at once. Airborne over a gap is fine.
 */
export function stepFall(world: World, run: DungeonRun, f: Floor, events: SimEvent[]): void {
  const k = world.keeper;
  const c = cellOf(f, k.pos);
  const hazard = hazardAt(world, f, c);
  if (!hazard) {
    if (k.grounded && cellAt(f, c.x, c.y) === FLOOR) lastSafe.set(run, c);
    return;
  }
  if (!k.grounded || k.y > HOLLOW.gaps.standHeight) return;
  const saved = lastSafe.get(run);
  const back = saved && cellAt(f, saved.x, saved.y) === FLOOR ? saved : nearestDry(f, c);
  const to = cellCentre(f, back);
  const from = { x: k.pos.x, z: k.pos.z };
  k.pos.x = to.x;
  k.pos.z = to.z;
  k.vy = 0;
  k.moveTarget = null;
  k.intent = null;
  events.push({ kind: 'hollowFell', water: hazard === 'water', from, to });
}

// Which part of the floor a swimmer can walk to, by cell: chasms are the only breaks.
const parts = new WeakMap<Floor, Int32Array>();

function partOf(f: Floor): Int32Array {
  let part = parts.get(f);
  if (part) return part;
  part = new Int32Array(f.cells.length).fill(-1);
  let id = 0;
  for (let i = 0; i < f.cells.length; i++) {
    const v = f.cells[i];
    if (part[i]! >= 0 || (v !== FLOOR && v !== WATER)) continue;
    const queue = [i];
    part[i] = id;
    for (let q = 0; q < queue.length; q++) {
      const j = queue[q]!;
      const x = j % f.cols;
      for (const n of [j - 1, j + 1, j - f.cols, j + f.cols]) {
        if (n < 0 || n >= f.cells.length || part[n]! >= 0) continue;
        if ((n === j - 1 && x === 0) || (n === j + 1 && x === f.cols - 1)) continue;
        const w = f.cells[n];
        if (w !== FLOOR && w !== WATER) continue;
        part[n] = id;
        queue.push(n);
      }
    }
    id++;
  }
  parts.set(f, part);
  return part;
}

/**
 * A party Nubbin cut off from the Keeper by a chasm hops over once the Keeper has landed
 * and is far enough off: it reappears beside the Keeper.
 */
export function hopAcross(world: World, run: DungeonRun, f: Floor): void {
  const k = world.keeper;
  if (!k.grounded) return;
  const kc = cellOf(f, k.pos);
  if (cellAt(f, kc.x, kc.y) !== FLOOR) return;
  const part = partOf(f);
  const mine = part[kc.y * f.cols + kc.x];
  for (const id of run.party) {
    const n = world.nubbins.find((x) => x.id === id);
    if (!n || n.behavior.state === 'held' || n.behavior.state === 'carried') continue;
    if (Math.hypot(n.pos.x - k.pos.x, n.pos.z - k.pos.z) < HOLLOW.gaps.hopDistance) continue;
    const nc = cellOf(f, n.pos);
    if (part[nc.y * f.cols + nc.x] === mine) continue;
    n.pos.x = k.pos.x + Math.sin(n.facing) * 0.6;
    n.pos.z = k.pos.z + Math.cos(n.facing) * 0.6;
  }
}
