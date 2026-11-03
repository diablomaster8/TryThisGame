/**
 * R11 d7 (WORLD-39): the Grove as a seamless neighbour sees it. The Grove is not a region
 * module (it has its own scene), so from inside a neighbour across a seamless border the region
 * engine draws this stand-in strip of it instead: the south marsh's meadow and reeds, the stream
 * running out under the border, and the trees and rocks that stand near that edge, all from the
 * Grove's own data (`GROVE`). Never walked: the Keeper crosses back to the real Grove first.
 * Grove coordinates (centred, ±48).
 */
import { GROVE } from './tuning';
import type { RegionSpec } from './region-layout';

const H = GROVE.size / 2;

/** The Grove's south strip: open meadow (no fill trees), the stream as it runs out. */
export const GROVE_EDGE_SPEC: RegionSpec = {
  id: 'grove',
  size: { w: GROVE.size, h: GROVE.size },
  seed: 0x67_0e,
  path: [
    { x: 12, z: 30 },
    { x: 12, z: H },
  ],
  loop: false,
  stream: GROVE.river.outflow,
  pois: [],
  // All open: the Grove's ground is meadow, so the engine's fill trees never stand on it.
  open: [{ x: 0, z: 0, w: GROVE.size + 40, h: GROVE.size + 40 }],
  treeKeep: 0,
  // The real Grove's trees, rocks and the marsh reeds near its south edge (the edge module
  // draws these spots by kind: 0 tree, 1 rock, 2 reeds).
  micro: [],
};

/** What the edge module stands in the strip: the Grove's own pieces within reach of its south edge. */
export function groveEdgePieces(depth: number): { x: number; z: number; kind: 0 | 1 | 2 }[] {
  const out: { x: number; z: number; kind: 0 | 1 | 2 }[] = [];
  const near = (z: number) => z > H - depth;
  for (const t of GROVE.trees) if (near(t.z)) out.push({ x: t.x, z: t.z, kind: 0 });
  for (const r of GROVE.rocks) if (near(r.z)) out.push({ x: r.x, z: r.z, kind: 1 });
  // Reeds along the marsh banks of the outflow.
  for (const p of GROVE.river.outflow)
    if (near(p.z)) {
      out.push({ x: p.x - 2.4, z: p.z, kind: 2 });
      out.push({ x: p.x + 2.6, z: p.z + 1, kind: 2 });
    }
  return out;
}
