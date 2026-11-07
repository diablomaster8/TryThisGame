/**
 * WORLD-25/09: a drawn region's ground, worked out once from its data. A region declares a
 * path (a loop or a line), a stream, its points of interest and a few solid pieces; from those
 * this builds the walk grid the sim moves the Keeper on, the trees that fill everything that is
 * not open ground (solid only near walkable cells, WORLD-25), the small props, and the grass
 * tufts, all cut into the `WORLD_STREAM.chunk` squares both renderers stream. Pure and seeded
 * (no `Math.random`), so the sim, the two renderers and the tests all see the same wood.
 * Region-local coordinates, centred: x east, z south (WORLD-56).
 */
import { REGION_LAYOUT } from './tuning-more/world-region-engine';
import { WORLD_STREAM } from './tuning-world';
import type { PoiDef, RegionId } from './regions';

export interface RegionSolid {
  x: number;
  z: number;
  /** A circle of radius `r`, or an axis-aligned box `w` × `h` when given. */
  r: number;
  w?: number;
  h?: number;
}

/** What a region hands the layout: everything is data, region-local. */
export interface RegionSpec {
  id: RegionId;
  size: { w: number; h: number };
  seed: number;
  path: readonly { x: number; z: number }[];
  /** Whether the path's last point joins its first. */
  loop: boolean;
  stream?: readonly { x: number; z: number }[];
  /** Where the stream may be crossed on foot (a bridge), as open circles. */
  crossings?: readonly { x: number; z: number; r: number }[];
  pois: readonly PoiDef[];
  /** Extra open lines: from each exit to the path, say. */
  spurs?: readonly (readonly { x: number; z: number }[])[];
  /** Solid pieces on open ground (buildings, rocks), drawn by the region's own code. */
  solids?: readonly RegionSolid[];
  /** Small props on open ground, by kind index (each renderer has its own set of looks). */
  micro?: readonly { x: number; z: number }[];
  /** R11 d7: open areas (a beach, a terrace, a square), as boxes centred on (x, z). */
  open?: readonly RegionBox[];
  /** R11 d7: standing water (the sea, a lagoon, a lake): never walked, never wooded. */
  water?: readonly RegionBox[];
  /** R11 d7: boardwalks and jetties: walkable even over water. */
  decks?: readonly RegionBox[];
  /** R11 d7: the share of fill trees kept (0..1, default 1): a beach or a terrace is sparse. */
  treeKeep?: number;
  /**
   * R11 d7 (WORLD-36): terraces for a vertical region, bands across z with a level each. The
   * band edges are cliffs (not walkable) except where the main path climbs them as a ramp.
   */
  terraces?: readonly RegionTerrace[];
}

/** A box centred on (x, z), `w` × `h` units. */
export interface RegionBox {
  x: number;
  z: number;
  w: number;
  h: number;
}

/** A terrace: from `z0` to `z1` (z0 < z1) the ground stands at `y`; the gap to the next is a cliff. */
export interface RegionTerrace {
  z0: number;
  z1: number;
  y: number;
}

/** Whether (x, z) is inside any of the boxes. */
export function inBoxes(boxes: readonly RegionBox[] | undefined, x: number, z: number): boolean {
  if (!boxes) return false;
  for (const b of boxes)
    if (Math.abs(x - b.x) <= b.w / 2 && Math.abs(z - b.z) <= b.h / 2) return true;
  return false;
}

/**
 * R11 d7: the ground's height at (x, z) in a terraced region (0 elsewhere): each terrace's own
 * level, ramping linearly across the gap between two terraces (the cliff, or the path's ramp).
 */
export function terraceHeight(spec: RegionSpec, z: number): number {
  const t = spec.terraces;
  if (!t || t.length === 0) return 0;
  for (let i = 0; i < t.length; i++) {
    const a = t[i]!;
    if (z >= a.z0 && z <= a.z1) return a.y;
    const b = t[i + 1];
    if (b && z > a.z1 && z < b.z0) return a.y + ((z - a.z1) / (b.z0 - a.z1)) * (b.y - a.y);
  }
  return z < t[0]!.z0 ? t[0]!.y : t[t.length - 1]!.y;
}

/** Whether z falls in a cliff band between two terraces. */
function inCliff(spec: RegionSpec, z: number): boolean {
  const t = spec.terraces;
  if (!t) return false;
  for (let i = 0; i + 1 < t.length; i++) if (z > t[i]!.z1 && z < t[i + 1]!.z0) return true;
  return false;
}

/** A tree: position, scale, look (0..2) and whether its trunk is solid. */
export interface LayoutTree {
  x: number;
  z: number;
  s: number;
  kind: number;
  solid: boolean;
}

export interface LayoutProp {
  x: number;
  z: number;
  kind: number;
}

/** One chunk's share of the scenery: indices into the layout's lists. */
export interface LayoutChunk {
  cx: number;
  cz: number;
  trees: number[];
  props: number[];
  /** Grass tufts, packed x, z, scale. */
  tufts: Float32Array;
}

export interface RegionLayout {
  spec: RegionSpec;
  cell: number;
  /** Walk grid size in cells, and the grid itself: 1 walkable, 0 wooded, 2 water. */
  gw: number;
  gh: number;
  grid: Uint8Array;
  /** Forest drawn this far past each edge (units); the ground and the chunk range include it. */
  margin: number;
  trees: LayoutTree[];
  props: LayoutProp[];
  solids: RegionSolid[];
  chunks: Map<string, LayoutChunk>;
  /** The chunk index range covering the region. */
  cmin: { cx: number; cz: number };
  cmax: { cx: number; cz: number };
}

/** A small seeded generator (mulberry32): the layout's only randomness. */
function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A stable 0..1 roll for a spot, apart from the layout's stream (keeps the Wood unchanged). */
function hashKeep(x: number, z: number): number {
  let h = Math.imul((x * 100) | 0, 0x27d4eb2d) ^ Math.imul((z * 100) | 0, 0x165667b1);
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b);
  h ^= h >>> 13;
  return (h >>> 0) / 4294967296;
}

/** Distance from a point to a polyline (closed when `loop`). */
export function toLine(
  x: number,
  z: number,
  line: readonly { x: number; z: number }[],
  loop: boolean,
): number {
  let best = Infinity;
  const n = loop ? line.length : line.length - 1;
  for (let i = 0; i < n; i++) {
    const a = line[i]!;
    const b = line[(i + 1) % line.length]!;
    const dx = b.x - a.x;
    const dz = b.z - a.z;
    const l2 = dx * dx + dz * dz || 1;
    const t = Math.max(0, Math.min(1, ((x - a.x) * dx + (z - a.z) * dz) / l2));
    const d = Math.hypot(a.x + dx * t - x, a.z + dz * t - z);
    if (d < best) best = d;
  }
  return best;
}

/** The nearest point on a polyline. */
function nearestOn(
  x: number,
  z: number,
  line: readonly { x: number; z: number }[],
  loop: boolean,
): { x: number; z: number } {
  let best = Infinity;
  let out = { x: line[0]!.x, z: line[0]!.z };
  const n = loop ? line.length : line.length - 1;
  for (let i = 0; i < n; i++) {
    const a = line[i]!;
    const b = line[(i + 1) % line.length]!;
    const dx = b.x - a.x;
    const dz = b.z - a.z;
    const l2 = dx * dx + dz * dz || 1;
    const t = Math.max(0, Math.min(1, ((x - a.x) * dx + (z - a.z) * dz) / l2));
    const px = a.x + dx * t;
    const pz = a.z + dz * t;
    const d = Math.hypot(px - x, pz - z);
    if (d < best) {
      best = d;
      out = { x: px, z: pz };
    }
  }
  return out;
}

/** How open a point is: <= 0 on open ground (path, spur, clearing), else the distance to it. */
export function openness(spec: RegionSpec, x: number, z: number, spurs: SpurList): number {
  const L = REGION_LAYOUT;
  let d = toLine(x, z, spec.path, spec.loop) - L.pathHalf;
  for (const s of spurs) d = Math.min(d, toLine(x, z, s, false) - L.pathHalf);
  for (const p of spec.pois) {
    const r = L.clearing[p.tier ?? 'micro'];
    if (r > 0) d = Math.min(d, Math.hypot(x - p.x, z - p.z) - r);
  }
  for (const c of spec.crossings ?? []) d = Math.min(d, Math.hypot(x - c.x, z - c.z) - c.r);
  // Open boxes: negative inside, the distance to the box outside.
  for (const b of spec.open ?? []) {
    const ex = Math.abs(x - b.x) - b.w / 2;
    const ez = Math.abs(z - b.z) - b.h / 2;
    d = Math.min(d, ex > 0 || ez > 0 ? Math.hypot(Math.max(ex, 0), Math.max(ez, 0)) : -1);
  }
  return d;
}

type SpurList = readonly (readonly { x: number; z: number }[])[];

/** The spur paths: the spec's own, and one to every point of interest off the path. */
function spursOf(spec: RegionSpec): SpurList {
  const out: { x: number; z: number }[][] = (spec.spurs ?? []).map((s) => [...s]);
  for (const p of spec.pois) {
    if (toLine(p.x, p.z, spec.path, spec.loop) <= REGION_LAYOUT.spurFrom) continue;
    out.push([{ x: p.x, z: p.z }, nearestOn(p.x, p.z, spec.path, spec.loop)]);
  }
  return out;
}

const built = new Map<RegionId, RegionLayout>();

/** The region's layout, built on first use and kept (it is small: a few hundred KB at most). */
export function regionLayout(spec: RegionSpec): RegionLayout {
  const had = built.get(spec.id);
  if (had && had.spec === spec) return had;
  const L = REGION_LAYOUT;
  const rand = seeded(spec.seed);
  const cell = L.cell;
  const hw = spec.size.w / 2;
  const hh = spec.size.h / 2;
  const gw = Math.ceil(spec.size.w / cell);
  const gh = Math.ceil(spec.size.h / cell);
  const spurs = spursOf(spec);
  const grid = new Uint8Array(gw * gh);
  for (let iz = 0; iz < gh; iz++) {
    for (let ix = 0; ix < gw; ix++) {
      const x = -hw + (ix + 0.5) * cell;
      const z = -hh + (iz + 0.5) * cell;
      let open = openness(spec, x, z, spurs) <= 0;
      const deck = inBoxes(spec.decks, x, z);
      const wet =
        !deck &&
        ((!!spec.stream && toLine(x, z, spec.stream, false) < L.streamHalf) ||
          inBoxes(spec.water, x, z)) &&
        !(spec.crossings ?? []).some((c) => Math.hypot(x - c.x, z - c.z) < c.r);
      // A cliff between terraces is walked only up the main path (its ramp).
      if (open && inCliff(spec, z) && toLine(x, z, spec.path, spec.loop) > L.pathHalf) open = false;
      grid[iz * gw + ix] = wet ? 2 : open || deck ? 1 : 0;
    }
  }
  // Trees on a jittered grid wherever the ground is not open or wet.
  const trees: LayoutTree[] = [];
  const sp = L.treeSpacing;
  const M = L.edge;
  for (let z = -hh - M + sp / 2; z < hh + M; z += sp) {
    for (let x = -hw - M + sp / 2; x < hw + M; x += sp) {
      const tx = x + (rand() - 0.5) * 2 * L.treeJitter;
      const tz = z + (rand() - 0.5) * 2 * L.treeJitter;
      const s = 0.8 + rand() * 0.6;
      const kind = Math.floor(rand() * 3);
      // Past the edge: the forest goes on, never solid, never walked.
      if (Math.abs(tx) > hw - 0.5 || Math.abs(tz) > hh - 0.5) {
        const lane = (spec.spurs ?? []).some((s2) => toLine(tx, tz, s2, false) < L.pathHalf + 1);
        // R11 d7: no margin trees standing in the sea, and a sparse region's margin is sparse too.
        const skip =
          inBoxes(spec.water, tx, tz) ||
          inBoxes(spec.open, tx, tz) ||
          (spec.treeKeep !== undefined && hashKeep(tx, tz) > spec.treeKeep);
        if (!lane && !skip) trees.push({ x: tx, z: tz, s, kind, solid: false });
        continue;
      }
      const open = openness(spec, tx, tz, spurs);
      if (open < L.treeClear) continue;
      if (spec.stream && toLine(tx, tz, spec.stream, false) < L.streamHalf + 1) continue;
      if (inBoxes(spec.water, tx, tz) || inBoxes(spec.decks, tx, tz)) continue;
      // A sparse region keeps only some of its fill (drawn after the roll, so the wood is unchanged).
      if (spec.treeKeep !== undefined && hashKeep(tx, tz) > spec.treeKeep) continue;
      if ((spec.solids ?? []).some((b) => Math.hypot(tx - b.x, tz - b.z) < b.r + 2)) continue;
      trees.push({ x: tx, z: tz, s, kind, solid: open <= 3 });
    }
  }
  const props: LayoutProp[] = (spec.micro ?? []).map((m, i) => ({ x: m.x, z: m.z, kind: i % 5 }));
  // The chunks: each tree, prop and tuft goes to the chunk it stands in.
  const size = WORLD_STREAM.chunk;
  const cmin = { cx: Math.floor((-hw - M) / size), cz: Math.floor((-hh - M) / size) };
  const cmax = {
    cx: Math.floor((hw + M - 1e-6) / size),
    cz: Math.floor((hh + M - 1e-6) / size),
  };
  const chunks = new Map<string, LayoutChunk>();
  for (let cz = cmin.cz; cz <= cmax.cz; cz++) {
    for (let cx = cmin.cx; cx <= cmax.cx; cx++) {
      // Grass tufts on open ground in this chunk, seeded by the chunk so each is stable.
      const r = seeded(spec.seed ^ ((cx + 64) * 7919 + (cz + 64) * 104729));
      const tufts: number[] = [];
      for (let i = 0; i < L.tuftsPerChunk * 3 && tufts.length < L.tuftsPerChunk * 3; i++) {
        const x = (cx + r()) * size;
        const z = (cz + r()) * size;
        if (Math.abs(x) > hw || Math.abs(z) > hh) continue;
        const o = openness(spec, x, z, spurs);
        // At the edges of open ground, where grass grows thick against the trees.
        if (o > -0.4 && o < 2.5 && !inBoxes(spec.water, x, z) && !inBoxes(spec.decks, x, z))
          tufts.push(x, z, 0.7 + r() * 0.6);
      }
      chunks.set(`${cx},${cz}`, { cx, cz, trees: [], props: [], tufts: new Float32Array(tufts) });
    }
  }
  const home = (x: number, z: number) =>
    chunks.get(`${Math.floor(x / size)},${Math.floor(z / size)}`);
  trees.forEach((t, i) => home(t.x, t.z)?.trees.push(i));
  props.forEach((p, i) => home(p.x, p.z)?.props.push(i));
  const layout: RegionLayout = {
    spec,
    cell,
    gw,
    gh,
    grid,
    margin: M,
    trees,
    props,
    solids: [...(spec.solids ?? [])],
    chunks,
    cmin,
    cmax,
  };
  built.set(spec.id, layout);
  return layout;
}

/** The walk-grid cell under a point, or -1 outside the region. */
export function cellAt(l: RegionLayout, x: number, z: number): number {
  const ix = Math.floor((x + l.spec.size.w / 2) / l.cell);
  const iz = Math.floor((z + l.spec.size.h / 2) / l.cell);
  if (ix < 0 || iz < 0 || ix >= l.gw || iz >= l.gh) return -1;
  return iz * l.gw + ix;
}

/** Whether the Keeper may stand at (x, z): on a walkable cell. */
export function walkableAt(l: RegionLayout, x: number, z: number): boolean {
  const c = cellAt(l, x, z);
  return c >= 0 && l.grid[c] === 1;
}
