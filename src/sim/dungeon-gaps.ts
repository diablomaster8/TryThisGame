/**
 * Hollow platforming (R0031, MOVE-31): the pass that turns a version-3 floor into a
 * version-4 one. Water becomes deep (the Swim perk or a crossing gets you over), stepping
 * stones leave water gaps to jump, and chasm cuts open across some passages. The rule the
 * pass keeps: on the shallow floors every gap has a walking way round; deeper, the stairs,
 * the chest, the landmark and the waypoint may need the double jump, and a few side pockets
 * sit behind a jump with a find in each. Nothing that was reachable is ever stranded.
 *
 * Reachability is a breadth-first search over standable cells (dry FLOOR) with "jump
 * edges": a straight run of one or two hazard cells (chasm or water) with dry ground beyond.
 * Terrace ledges stay ramps for now (the Keeper's ground in the Hollow is lane A's).
 */
import { HOLLOW } from '../config/tuning';
import { cellDist, CHASM, FLOOR, WALL, WATER, type Cell, type Floor } from './dungeon';
import { densityPacks, endlessBand, type FoeBand } from './dungeon-density';
import { placeShrines } from './dungeon-shrines';
import { waypointCell } from './dungeon-levels';
import { propCells } from './dungeon-props';
import { Rng } from './rng';
import { NUBBIN_TYPES } from './types';

const G = HOLLOW.gaps;
const FOUR = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
] as const;

function hazard(v: number | undefined): boolean {
  return v === CHASM || v === WATER;
}

/**
 * Cells reachable from `start`: on foot only, or with jump edges over up to `G.maxJump`
 * hazard cells. `from` seeds more than one start (the fix-up's reached set).
 */
export function reachMask(f: Floor, start: Cell | Cell[], jumps: boolean): Uint8Array {
  const { cols, rows, cells } = f;
  const seen = new Uint8Array(cols * rows);
  const queue: number[] = [];
  for (const s of Array.isArray(start) ? start : [start]) {
    const i = s.y * cols + s.x;
    if (cells[i] !== FLOOR || seen[i]) continue;
    seen[i] = 1;
    queue.push(i);
  }
  for (let q = 0; q < queue.length; q++) {
    const i = queue[q]!;
    const x = i % cols;
    const y = (i - x) / cols;
    for (const [dx, dy] of FOUR) {
      for (let k = 1; k <= (jumps ? G.maxJump + 1 : 1); k++) {
        const nx = x + dx * k;
        const ny = y + dy * k;
        if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) break;
        const j = ny * cols + nx;
        const v = cells[j];
        if (v === FLOOR) {
          if (!seen[j]) {
            seen[j] = 1;
            queue.push(j);
          }
          break;
        }
        if (!hazard(v)) break;
      }
    }
  }
  return seen;
}

/** A dry cell next to (or at) `c`, for targets such as a landmark standing in its pool. */
function standNear(f: Floor, c: Cell): Cell | null {
  for (let r = 0; r <= 3; r++)
    for (let dy = -r; dy <= r; dy++)
      for (let dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
        const x = c.x + dx;
        const y = c.y + dy;
        if (x >= 0 && y >= 0 && x < f.cols && y < f.rows && f.cells[y * f.cols + x] === FLOOR)
          return { x, y };
      }
  return null;
}

/** The cells a floor must let the Keeper reach: stairs, chest, landmark, waypoint, boss. */
export function keyCells(f: Floor): Cell[] {
  const out: Cell[] = [f.chest, waypointCell(f)];
  if (f.stairsDown) out.push(f.stairsDown);
  if (f.layout?.boss) out.push(f.layout.boss);
  if (f.landmark) {
    const c = standNear(f, f.landmark.cell);
    if (c) out.push(c);
  }
  return out.filter((c) => f.cells[c.y * f.cols + c.x] === FLOOR);
}

/** Whether the floor's rule holds: key cells on foot when shallow, with jumps when deep. */
export function keysReachable(f: Floor, depth: number): boolean {
  const reach = reachMask(f, f.stairsUp, depth >= G.nookFromDepth);
  return keyCells(f).every((c) => reach[c.y * f.cols + c.x] === 1);
}

/**
 * Dry a path of water cells (fords) from the reached part to the nearest stranded dry cell,
 * until nothing dry is stranded under the floor's rule. Water only: chasms are never filled.
 */
function ford(f: Floor, jumps: boolean, fords: Cell[]): void {
  const { cols, rows, cells } = f;
  for (let round = 0; round < G.fixups; round++) {
    const reach = reachMask(f, f.stairsUp, jumps);
    let stranded = false;
    for (let i = 0; i < cells.length && !stranded; i++) stranded = cells[i] === FLOOR && !reach[i];
    if (!stranded) return;
    // Breadth-first out of the reached set through water only.
    const from = new Int32Array(cols * rows).fill(-2);
    const queue: number[] = [];
    for (let i = 0; i < cells.length; i++)
      if (reach[i]) {
        from[i] = -1;
        queue.push(i);
      }
    let hit = -1;
    for (let q = 0; q < queue.length && hit < 0; q++) {
      const i = queue[q]!;
      const x = i % cols;
      const y = (i - x) / cols;
      for (const [dx, dy] of FOUR) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
        const j = ny * cols + nx;
        if (from[j] !== -2) continue;
        if (cells[j] === FLOOR && !reach[j]) {
          from[j] = i;
          hit = j;
          break;
        }
        if (cells[j] !== WATER) continue;
        from[j] = i;
        queue.push(j);
      }
    }
    if (hit < 0) return;
    for (let j = from[hit]!; j >= 0 && !reach[j]; j = from[j]!) {
      if (cells[j] !== WATER) continue;
      cells[j] = FLOOR;
      fords.push({ x: j % cols, y: Math.floor(j / cols) });
    }
  }
}

/** Straight cuts across passages at most `G.maxWidth` wide, one or two cells long. */
export function candidates(f: Floor, busy: Set<number>): Cell[][] {
  const { cols, rows, cells } = f;
  const at = (x: number, y: number) =>
    x < 0 || y < 0 || x >= cols || y >= rows ? WALL : cells[y * cols + x]!;
  const out: Cell[][] = [];
  // Passages along x (cut a column segment), then along y (cut a row segment).
  for (const along of ['x', 'y'] as const) {
    const pt = (u: number, v: number): [number, number] => (along === 'x' ? [u, v] : [v, u]);
    const uMax = along === 'x' ? cols : rows;
    const vMax = along === 'x' ? rows : cols;
    for (let u = 2; u < uMax - 3; u++) {
      for (let v = 1; v < vMax - 1; v++) {
        if (at(...pt(u, v - 1)) !== WALL || at(...pt(u, v)) !== FLOOR) continue;
        let v1 = v;
        while (v1 - v < G.maxWidth && at(...pt(u, v1 + 1)) === FLOOR) v1++;
        if (at(...pt(u, v1 + 1)) !== WALL) continue;
        const section = (uu: number, walled: boolean) => {
          for (let vv = v; vv <= v1; vv++) if (at(...pt(uu, vv)) !== FLOOR) return false;
          return !walled || (at(...pt(uu, v - 1)) === WALL && at(...pt(uu, v1 + 1)) === WALL);
        };
        for (let g = 1; g <= G.maxJump; g++) {
          let ok = section(u - 1, false) && section(u + g, false);
          const cut: Cell[] = [];
          for (let k = 0; k < g && ok; k++) {
            ok = section(u + k, true);
            for (let vv = v; vv <= v1 && ok; vv++) {
              const [x, y] = pt(u + k, vv);
              if (busy.has(y * cols + x)) ok = false;
              cut.push({ x, y });
            }
          }
          if (ok) out.push(cut);
        }
      }
    }
  }
  return out;
}

/** Cells nothing may be cut through: every placed thing, with room round the big ones. */
export function busyCells(f: Floor): Set<number> {
  const busy = new Set<number>();
  const mark = (c: Cell, r = 0) => {
    for (let dy = -r; dy <= r; dy++)
      for (let dx = -r; dx <= r; dx++) busy.add((c.y + dy) * f.cols + c.x + dx);
  };
  for (const c of [f.stairsUp, f.chest, waypointCell(f)]) mark(c, G.keepClear);
  if (f.stairsDown) mark(f.stairsDown, G.keepClear);
  if (f.landmark) mark(f.landmark.cell, f.landmark.radius);
  if (f.layout?.boss) mark(f.layout.boss, G.keepClear);
  for (const c of [
    ...f.loot.map((l) => l.cell),
    ...f.strayStarts,
    ...f.wildSpots.map((w) => w.cell),
    ...f.torches,
    ...f.crystals,
    ...(f.packs ?? []).map((p) => p.cell),
    ...(f.layout?.spawns ?? []),
    ...(f.layout?.shrines ?? []),
    ...(f.nook ? [...f.nook.rug, ...f.nook.lanterns, ...(f.nook.tent ? [f.nook.tent] : [])] : []),
  ])
    mark(c, 1);
  for (const cr of f.crossings) for (const c of [cr.from, cr.to, ...cr.cells]) mark(c, 1);
  for (const i of propCells(f)) busy.add(i);
  return busy;
}

/**
 * Make `f` (a fresh version-3 floor) a version-4 one. Deterministic per seed and depth.
 * Mutates and returns the floor.
 */
export function platformFloor(
  f: Floor,
  seed: number,
  depth: number,
  band: FoeBand = endlessBand(depth),
): Floor {
  const rng = new Rng((seed ^ 0x5eed_9a95 ^ (depth * 0x9e37)) >>> 0);
  const deep = depth >= G.nookFromDepth;
  f.version = 4;
  f.gaps = [];
  f.fords = [];
  // Crossings: decks over every run on the shallow floors; deeper, stepping stones on every
  // other cell, with a water gap before each to jump.
  for (const cr of f.crossings) {
    const stones = cr.kind === 'stones' && depth >= G.stonesFromDepth;
    cr.cells.forEach((c, i) => {
      if (!stones || i % 2 === 1 || i === cr.cells.length - 1) f.cells[c.y * f.cols + c.x] = FLOOR;
    });
  }
  ford(f, deep, f.fords);
  if (depth < G.fromDepth) {
    placeShrines(f, seed, depth);
    densityPacks(f, seed, depth, band);
    return f;
  }

  const busy = busyCells(f);
  const all = candidates(f, busy);
  // A seeded shuffle, so floors differ in where they cut.
  for (let i = all.length - 1; i > 0; i--) {
    const j = rng.int(0, i);
    [all[i], all[j]] = [all[j]!, all[i]!];
  }
  const baseJump = reachMask(f, f.stairsUp, true);
  const covered = (reach: Uint8Array) => {
    for (let i = 0; i < baseJump.length; i++)
      if (baseJump[i] && !reach[i] && f.cells[i] === FLOOR) return false;
    return true;
  };
  const near = (cut: Cell[]) =>
    f.gaps!.some((g) => g.cells.some((a) => cut.some((b) => cellDist(a, b) < G.spacing)));
  const apply = (cut: Cell[], v: number) => {
    for (const c of cut) f.cells[c.y * f.cols + c.x] = v;
  };
  const keys = keyCells(f);
  const used = new Set<Cell[]>();

  // Side pockets behind a jump first: the cut strands a small dry pocket from walking only.
  let nooks = 0;
  if (deep) {
    const goal = rng.int(G.nooks[0], G.nooks[1]);
    for (const cut of all) {
      if (nooks >= goal) break;
      if (near(cut)) continue;
      const walkBefore = reachMask(f, f.stairsUp, false);
      apply(cut, CHASM);
      const walk = reachMask(f, f.stairsUp, false);
      const pocket: number[] = [];
      for (let i = 0; i < walk.length; i++)
        if (walkBefore[i] && !walk[i] && f.cells[i] === FLOOR) pocket.push(i);
      const keyLost = keys.some((c) => walkBefore[c.y * f.cols + c.x] && !walk[c.y * f.cols + c.x]);
      if (
        keyLost ||
        pocket.length < G.nookCells[0] ||
        pocket.length > G.nookCells[1] ||
        !covered(reachMask(f, f.stairsUp, true))
      ) {
        apply(cut, FLOOR);
        continue;
      }
      used.add(cut);
      f.gaps.push({ cells: cut, nook: true });
      nooks++;
      const inPocket = new Set(pocket);
      if (!f.loot.some((l) => inPocket.has(l.cell.y * f.cols + l.cell.x))) {
        const free = pocket.filter((i) => !busy.has(i));
        const i = free.length > 0 ? free[rng.int(0, free.length - 1)]! : pocket[0]!;
        f.loot.push({
          id: `nook-${nooks}`,
          kind: 'essence',
          cell: { x: i % f.cols, y: Math.floor(i / f.cols) },
          amount: 1,
          param: rng.pick(NUBBIN_TYPES),
        });
      }
    }
  }

  // The plain cuts: a walking way round on the shallow floors; deeper they may stand in the
  // way, so long as everything stays reachable with the double jump.
  const [cutLo, cutHi] = deep ? G.cuts.deep : G.cuts.shallow;
  const want = rng.int(cutLo, cutHi);
  let cuts = 0;
  const baseWalk = reachMask(f, f.stairsUp, false);
  for (const cut of all) {
    if (cuts >= want) break;
    if (used.has(cut) || near(cut)) continue;
    apply(cut, CHASM);
    let ok: boolean;
    if (deep) ok = covered(reachMask(f, f.stairsUp, true));
    else {
      const walk = reachMask(f, f.stairsUp, false);
      ok = true;
      for (let i = 0; i < walk.length && ok; i++)
        if (baseWalk[i] && !walk[i] && f.cells[i] === FLOOR) ok = false;
    }
    if (!ok) {
      apply(cut, FLOOR);
      continue;
    }
    f.gaps.push({ cells: cut, nook: false });
    cuts++;
  }
  // A chasm sits level with the ground round it, so blends and fog read it as that height.
  for (const g of f.gaps)
    for (const c of g.cells) {
      let lo = Infinity;
      for (const [dx, dy] of FOUR) {
        const j = (c.y + dy) * f.cols + c.x + dx;
        if (f.cells[j] === FLOOR) lo = Math.min(lo, f.elevation[j] ?? 0);
      }
      if (lo < Infinity) f.elevation[c.y * f.cols + c.x] = lo;
    }
  // Shrines (R0159), then packs by the version-4 density rules on the final ground (R0158).
  placeShrines(f, seed, depth);
  densityPacks(f, seed, depth, band);
  return f;
}

/** How many of a floor's side pockets need a jump (the test reads this). */
export function jumpNooks(f: Floor): number {
  return (f.gaps ?? []).filter((g) => g.nook).length;
}
