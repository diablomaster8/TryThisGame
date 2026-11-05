/**
 * Where the timber arches and the parked mine cart go along a Hollow floor's main path
 * (R0032, round 11). The sim reads this for solid posts and a solid cart
 * (`dungeon-props.ts`); the 3D dressing draws them from the same list, so what is drawn is
 * what is solid. The placement is read from the floor data the dressing used to read: the
 * stairs, chest, torches, crystals, loot, nook, landmark, crossings and vistas hold their
 * cells first.
 *
 * Pure sim: no DOM, no Three.js.
 */
import { DUNGEON, GROVE3D } from '../config/tuning';
import { cellAt, cellCentre, FLOOR, type Cell, type Floor } from './dungeon';
import { across, cellHash, mainPath } from './dungeon-mainpath';

export interface ArchPiece {
  cell: Cell;
  /** Along-path direction (cells), and the perpendicular in world axes. */
  dx: number;
  dy: number;
  px: number;
  pz: number;
  /** The beam centre and the half span to each post, in world units. */
  cx: number;
  cz: number;
  half: number;
  ry: number;
}

export interface CartPiece {
  /** World centre and the angle its long axis points (sin gives x, cos gives z). */
  x: number;
  z: number;
  axis: number;
  /** The cell whose ground height it stands on. */
  cell: Cell;
}

export interface SetPieces {
  arches: ArchPiece[];
  /** The rail run's cells, which the dressing lays the track along, and the parked cart. */
  rails: Cell[];
  cart: CartPiece | null;
}

const pieces = new WeakMap<Floor, SetPieces>();
const keyOf = (c: Cell): string => `${c.x},${c.y}`;

/** Cells the other set pieces already hold. */
function heldCells(f: Floor): Set<string> {
  const busy = new Set<string>();
  const add = (c: Cell | null | undefined) => {
    if (c) busy.add(keyOf(c));
  };
  for (const c of [f.stairsUp, f.stairsDown, f.chest, ...f.torches, ...f.crystals]) add(c);
  for (const l of f.loot) add(l.cell);
  if (f.nook) for (const c of [...f.nook.rug, ...f.nook.lanterns, f.nook.tent]) add(c);
  if (f.landmark) {
    const r = Math.ceil(f.landmark.radius * 0.7);
    for (let dy = -r; dy <= r; dy++)
      for (let dx = -r; dx <= r; dx++)
        add({ x: f.landmark.cell.x + dx, y: f.landmark.cell.y + dy });
  }
  for (const cr of f.crossings) for (const c of cr.cells) add(c);
  const V = { n: [0, -1], s: [0, 1], w: [-1, 0], e: [1, 0] } as const;
  for (const v of f.vistas) {
    const [, dy] = V[v.dir];
    const ax = dy === 0 ? 0 : 1;
    const ay = dy === 0 ? 1 : 0;
    for (let k = 0; k < v.width; k++) add({ x: v.cell.x + ax * k, y: v.cell.y + ay * k });
  }
  return busy;
}

function pathDir(path: Cell[], i: number): readonly [number, number] {
  const a = path[Math.max(0, i - 2)]!;
  const b = path[Math.min(path.length - 1, i + 2)]!;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.abs(dx) >= Math.abs(dy) ? [Math.sign(dx) || 1, 0] : [0, Math.sign(dy) || 1];
}

/** The floor's arches, rail run and cart, made once per floor. */
export function setPieces(f: Floor): SetPieces {
  const hit = pieces.get(f);
  if (hit) return hit;
  const out: SetPieces = { arches: [], rails: [], cart: null };
  pieces.set(f, out);
  const cell = DUNGEON.cell;
  const busy = heldCells(f);
  const path = mainPath(f);
  const A = GROVE3D.cave.dress.arch;
  let last = -99;
  let wasNarrow = false;
  let gap = A.spacing[0];
  for (let i = 2; i < path.length - 2; i++) {
    const c = path[i]!;
    const [dx, dy] = pathDir(path, i);
    const { left, right } = across(f, c, dx, dy);
    const narrow = left < 4 && right < 4 && left + right + 1 <= A.maxWidth;
    const mouth = narrow && !wasNarrow;
    wasNarrow = narrow;
    if (!narrow || busy.has(keyOf(c)) || cellAt(f, c.x, c.y) !== FLOOR) continue;
    if (!(mouth ? i - last >= 3 : i - last >= gap)) continue;
    last = i;
    gap = A.spacing[0] + Math.round(cellHash(c.x, c.y, 3) * (A.spacing[1] - A.spacing[0]));
    const p = cellCentre(f, c);
    const px = -dy;
    const pz = dx;
    const mid = (right - left) / 2;
    out.arches.push({
      cell: c,
      dx,
      dy,
      px,
      pz,
      cx: p.x + px * mid * cell,
      cz: p.z + pz * mid * cell,
      half: ((left + right + 1) / 2) * cell - 0.16,
      ry: Math.atan2(px, pz),
    });
    busy.add(keyOf(c));
  }
  // The longest run of dry, narrow, free path cells carries the rails.
  const R = GROVE3D.cave.dress.rails;
  let best: [number, number] = [0, 0];
  let start = -1;
  for (let i = 0; i <= path.length; i++) {
    const c = path[i];
    let ok = false;
    if (c && i > 0 && i < path.length - 1) {
      const [dx, dy] = pathDir(path, i);
      const w = across(f, c, dx, dy);
      ok = cellAt(f, c.x, c.y) === FLOOR && w.left + w.right <= 2 && !busy.has(keyOf(c));
      ok &&= ![f.stairsUp, f.stairsDown, f.chest].some((s) => s && s.x === c.x && s.y === c.y);
    }
    if (ok && start < 0) start = i;
    if (!ok && start >= 0) {
      if (i - start > best[1] - best[0]) best = [start, i];
      start = -1;
    }
  }
  if (best[1] - best[0] < R.minLen) return out;
  const run = path.slice(best[0], Math.min(best[1], best[0] + R.maxLen));
  out.rails = run;
  // The cart sits at the second-to-last smoothed point, lying along the track.
  const pts = run.map((b, i) => {
    const a = cellCentre(f, run[Math.max(0, i - 1)]!);
    const m = cellCentre(f, b);
    const c = cellCentre(f, run[Math.min(run.length - 1, i + 1)]!);
    return { x: (a.x + m.x * 2 + c.x) / 4, z: (a.z + m.z * 2 + c.z) / 4 };
  });
  const j = Math.max(0, pts.length - 2);
  const end = pts[j]!;
  const prev = pts[Math.max(0, j - 1)]!;
  const next = pts[Math.min(pts.length - 1, j + 1)]!;
  let tx = next.x - prev.x;
  let tz = next.z - prev.z;
  const tl = Math.hypot(tx, tz) || 1;
  tx /= tl;
  tz /= tl;
  // The dressing's side vector is (-tz, tx) and its box is turned a quarter from that.
  out.cart = { x: end.x, z: end.z, axis: Math.atan2(-tz, tx) + Math.PI / 2, cell: run[j]! };
  return out;
}
