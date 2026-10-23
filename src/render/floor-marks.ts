import { setFloorMarks, type StageMark } from '../config/stage-marks';
import { CG4_C4 } from '../config/tuning';
import {
  cellAt,
  cellCentre,
  cellIndex,
  FLOOR,
  runFloor,
  type Cell,
  type Floor,
} from '../sim/dungeon';
import type { World } from '../sim/types';

/**
 * Campaign graphics 4, K16: stage marks on the Hollow Below floor under way, from its seeded
 * rooms. The story stager calls `syncFloorMarks` before it places anyone
 * (render/scene-stage.ts); the marks change only when the floor does.
 *
 * Every mark a figure stands on keeps `CG4_C4.floorClear` cells clear of the floor's props
 * (the stairs' lit gateways, the chest, torches, crystals, loot), on dry ground at the
 * stairs' level where it can, so nobody is boxed in a gateway or washed out by its light.
 *
 * - `floor-up`, `floor-down`, `floor-chest`: a clear spot beside the stairs up, the stairs
 *   down and the chest, turned to the Keeper. `floor-up-at`, `floor-down-at`,
 *   `floor-chest-at`: the props' own cells (for a camera focus, never to stand on).
 * - `floor-room-1`..: every room's centre (the nearest clear cell); `floor-great` the great
 *   chamber's.
 * - The names the Beetle Road's below scenes use: `keeper` and `keeper-below` clear of the
 *   stairs up, toward the room; `guardhouse-bench`, `guardhouse-counter`, `banner-1` and
 *   `cart` round the Keeper, each turned to them.
 */

let shown = '';

const key = (x: number, y: number): string => `${x},${y}`;

/** The cells within `r` (Chebyshev) of a floor prop, which nobody is stood on. */
function blockedCells(f: Floor, r: number): Set<string> {
  const props: Cell[] = [
    f.stairsUp,
    ...(f.stairsDown ? [f.stairsDown] : []),
    f.chest,
    ...f.torches,
    ...f.crystals,
    ...f.loot.map((l) => l.cell),
  ];
  const out = new Set<string>();
  for (const c of props)
    for (let dy = -r; dy <= r; dy++)
      for (let dx = -r; dx <= r; dx++) out.add(key(c.x + dx, c.y + dy));
  return out;
}

/**
 * The open cell nearest `c`, searching outward a few rings: first a dry cell clear of the
 * props at `level` (the cast is drawn on the flat), then clear at any height, then any dry
 * cell not taken, then `c` itself.
 */
function openNear(
  f: Floor,
  c: Cell,
  taken: ReadonlySet<string>,
  blocked: ReadonlySet<string>,
  level: number | null = null,
): Cell {
  const passes: Array<(x: number, y: number) => boolean> = [
    (x, y) =>
      !blocked.has(key(x, y)) &&
      (level === null || Math.abs((f.elevation[cellIndex(f, x, y)] ?? 0) - level) < 0.05),
    (x, y) => !blocked.has(key(x, y)),
    () => true,
  ];
  for (const ok of passes)
    for (let r = 0; r <= 7; r++)
      for (let dy = -r; dy <= r; dy++)
        for (let dx = -r; dx <= r; dx++) {
          if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
          const x = c.x + dx;
          const y = c.y + dy;
          if (cellAt(f, x, y) === FLOOR && !taken.has(key(x, y)) && ok(x, y)) return { x, y };
        }
  return c;
}

const yawTo = (a: { x: number; z: number }, b: { x: number; z: number }): number =>
  Math.atan2(b.x - a.x, b.z - a.z);

function cellSize(f: Floor): number {
  return cellCentre(f, { x: 1, y: 0 }).x - cellCentre(f, { x: 0, y: 0 }).x;
}

function cellOfWorld(f: Floor, x: number, z: number): Cell {
  const s = cellSize(f);
  return { x: Math.floor(x / s + f.cols / 2), y: Math.floor(z / s + f.rows / 2) };
}

/** The middle of the room holding `c`, or `c`. */
function roomMiddle(f: Floor, c: Cell): Cell {
  const r = f.rooms.find((r) => c.x >= r.x && c.x < r.x + r.w && c.y >= r.y && c.y < r.y + r.h);
  return r ? { x: Math.floor(r.x + r.w / 2), y: Math.floor(r.y + r.h / 2) } : c;
}

/** The marks for one floor. */
export function floorMarks(f: Floor): Record<string, StageMark> {
  const out: Record<string, StageMark> = {};
  const blocked = blockedCells(f, CG4_C4.floorClear);
  const taken = new Set<string>();
  const at = (c: Cell, yaw = 0): StageMark => {
    const p = cellCentre(f, c);
    return { x: p.x, z: p.z, yaw };
  };
  const level = f.elevation[cellIndex(f, f.stairsUp.x, f.stairsUp.y)] ?? 0;
  const up = cellCentre(f, f.stairsUp);

  // The props' own cells, for a focus.
  out['floor-up-at'] = at(f.stairsUp);
  if (f.stairsDown) out['floor-down-at'] = at(f.stairsDown);
  out['floor-chest-at'] = at(f.chest);

  // The Keeper: clear of the stairs up, toward the room's middle, facing in.
  const mid = roomMiddle(f, f.stairsUp);
  const dx = Math.sign(mid.x - f.stairsUp.x);
  const dy = Math.sign(mid.y - f.stairsUp.y) || (dx === 0 ? 1 : 0);
  const reach = CG4_C4.floorClear + 1;
  const kc = openNear(
    f,
    { x: f.stairsUp.x + dx * reach, y: f.stairsUp.y + dy * reach },
    taken,
    blocked,
    level,
  );
  taken.add(key(kc.x, kc.y));
  const keeper = at(kc);
  keeper.yaw = yawTo(up, cellCentre(f, mid));
  if (Math.hypot(keeper.x - up.x, keeper.z - up.z) > 0.1) keeper.yaw = yawTo(up, keeper);
  out.keeper = keeper;
  out['keeper-below'] = keeper;

  // Round the Keeper, ahead of them: ahead, ahead-left, ahead-right, then beside. The first
  // of them is `floor-up` too: the one who meets the Keeper by the stairs.
  const fx = Math.sin(keeper.yaw);
  const fz = Math.cos(keeper.yaw);
  const s = cellSize(f);
  const spots: Array<[string, number, number]> = [
    ['guardhouse-bench', 2, 0],
    ['banner-1', 2, 1.4],
    ['cart', 2, -1.4],
    ['guardhouse-counter', 0.4, 2],
  ];
  for (const [name, ahead, side] of spots) {
    const wx = keeper.x + (fx * ahead + fz * side) * s;
    const wz = keeper.z + (fz * ahead - fx * side) * s;
    const c = openNear(f, cellOfWorld(f, wx, wz), taken, blocked, level);
    taken.add(key(c.x, c.y));
    const m = at(c);
    m.yaw = yawTo(m, keeper);
    out[name] = m;
  }
  out['floor-up'] = out['guardhouse-bench']!;

  // Beside the stairs down and the chest, turned toward the stairs up (the way in).
  const beside = (c: Cell): StageMark => {
    const b = openNear(f, c, taken, blocked);
    taken.add(key(b.x, b.y));
    const m = at(b);
    m.yaw = yawTo(m, up);
    return m;
  };
  if (f.stairsDown) out['floor-down'] = beside(f.stairsDown);
  out['floor-chest'] = beside(f.chest);

  // Room centres, each facing the stairs up.
  f.rooms.forEach((r, i) => {
    const c = openNear(
      f,
      { x: Math.floor(r.x + r.w / 2), y: Math.floor(r.y + r.h / 2) },
      new Set(),
      blocked,
    );
    const m = at(c);
    m.yaw = yawTo(m, up);
    out[`floor-room-${i + 1}`] = m;
    if (i === f.greatRoom) out['floor-great'] = m;
  });
  return out;
}

/** Keep the dungeon mark set on the world's floor (or empty off it). */
export function syncFloorMarks(world: World): void {
  const run = world.dungeon;
  const f = runFloor(world);
  const k = f && run ? `${run.seed}:${run.depth}:${run.genVersion}` : '';
  if (k === shown) return;
  shown = k;
  setFloorMarks(f ? floorMarks(f) : {});
}
