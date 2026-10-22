import { setFloorMarks, type StageMark } from '../config/stage-marks';
import { cellCentre, isWalkable, runFloor, type Cell, type Floor } from '../sim/dungeon';
import type { World } from '../sim/types';

/**
 * Campaign graphics 4, K16: stage marks on the Hollow Below floor under way, from its seeded
 * rooms. The story stager calls `syncFloorMarks` before it places anyone
 * (render/scene-stage.ts); the marks change only when the floor does.
 *
 * - `floor-up`, `floor-down`, `floor-chest`: the stairs and the chest.
 * - `floor-room-1`..: every room's centre (the nearest open cell to it); `floor-great` the
 *   great chamber's.
 * - The names the Beetle Road's below scenes already use, so they stand on the floor rather
 *   than in the Grove: `keeper` and `keeper-below` a step off the stairs up, and
 *   `guardhouse-bench`, `guardhouse-counter`, `banner-1` and `cart` round the Keeper, each
 *   on open ground and turned to them.
 */

let shown = '';

/** The open cell nearest `c` (itself if open), searching outward a few rings. */
function openNear(f: Floor, c: Cell, avoid: ReadonlySet<string> = new Set()): Cell {
  for (let r = 0; r <= 6; r++)
    for (let dy = -r; dy <= r; dy++)
      for (let dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
        const x = c.x + dx;
        const y = c.y + dy;
        if (isWalkable(f, x, y) && !avoid.has(`${x},${y}`)) return { x, y };
      }
  return c;
}

const yawTo = (a: { x: number; z: number }, b: { x: number; z: number }): number =>
  Math.atan2(b.x - a.x, b.z - a.z);

/** The marks for one floor. */
export function floorMarks(f: Floor): Record<string, StageMark> {
  const out: Record<string, StageMark> = {};
  const at = (c: Cell, yaw = 0): StageMark => {
    const p = cellCentre(f, c);
    return { x: p.x, z: p.z, yaw };
  };
  // Room centres, each facing the stairs up.
  const up = cellCentre(f, f.stairsUp);
  f.rooms.forEach((r, i) => {
    const c = openNear(f, { x: Math.floor(r.x + r.w / 2), y: Math.floor(r.y + r.h / 2) });
    const m = at(c);
    m.yaw = yawTo(m, up);
    out[`floor-room-${i + 1}`] = m;
    if (i === f.greatRoom) out['floor-great'] = m;
  });
  out['floor-up'] = at(f.stairsUp);
  if (f.stairsDown) out['floor-down'] = at(f.stairsDown);
  out['floor-chest'] = at(f.chest);
  // The scene's group: the Keeper a step off the stairs, toward the room's middle; the
  // others two cells round them, turned to them.
  const used = new Set([`${f.stairsUp.x},${f.stairsUp.y}`]);
  const home = f.rooms.find(
    (r) =>
      f.stairsUp.x >= r.x &&
      f.stairsUp.x < r.x + r.w &&
      f.stairsUp.y >= r.y &&
      f.stairsUp.y < r.y + r.h,
  );
  const mid = home
    ? { x: Math.floor(home.x + home.w / 2), y: Math.floor(home.y + home.h / 2) }
    : f.stairsUp;
  const sx = Math.sign(mid.x - f.stairsUp.x);
  const sy = Math.sign(mid.y - f.stairsUp.y) || (sx === 0 ? 1 : 0);
  const kc = openNear(f, { x: f.stairsUp.x + sx, y: f.stairsUp.y + sy }, used);
  used.add(`${kc.x},${kc.y}`);
  const keeper = at(kc);
  // Face the way in (from the stairs toward the room's middle).
  keeper.yaw = yawTo(cellCentre(f, f.stairsUp), cellCentre(f, mid));
  out.keeper = keeper;
  out['keeper-below'] = keeper;
  // Round the Keeper, ahead of them: ahead, ahead-left, ahead-right, then beside.
  const fx = Math.sin(keeper.yaw);
  const fz = Math.cos(keeper.yaw);
  const spots: Array<[number, number]> = [
    [2, 0],
    [2, 1.4],
    [2, -1.4],
    [0.4, 2],
  ];
  const names = ['guardhouse-bench', 'banner-1', 'cart', 'guardhouse-counter'];
  spots.forEach(([ahead, side], i) => {
    // Ahead along the facing, `side` across it, in cells.
    const wx = keeper.x + (fx * ahead + fz * side) * cellSize(f);
    const wz = keeper.z + (fz * ahead - fx * side) * cellSize(f);
    const c = openNear(f, cellOfWorld(f, wx, wz), used);
    used.add(`${c.x},${c.y}`);
    const m = at(c);
    m.yaw = yawTo(m, keeper);
    out[names[i]!] = m;
  });
  return out;
}

function cellSize(f: Floor): number {
  const a = cellCentre(f, { x: 0, y: 0 });
  const b = cellCentre(f, { x: 1, y: 0 });
  return b.x - a.x;
}

function cellOfWorld(f: Floor, x: number, z: number): Cell {
  const s = cellSize(f);
  return { x: Math.floor(x / s + f.cols / 2), y: Math.floor(z / s + f.rows / 2) };
}

/** Keep the dungeon mark set on the world's floor (or empty off it). */
export function syncFloorMarks(world: World): void {
  const run = world.dungeon;
  const f = runFloor(world);
  const key = f && run ? `${run.seed}:${run.depth}:${run.genVersion}` : '';
  if (key === shown) return;
  shown = key;
  setFloorMarks(f ? floorMarks(f) : {});
}
