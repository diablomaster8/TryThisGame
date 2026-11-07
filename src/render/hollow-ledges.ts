/**
 * Raised blocks of the Hollow in the Pixel view (R0031, R0191): the sim's shelves and terrace
 * ledges stand over the flat painted cave floor as real plateaus: a top that carries the same
 * floor painting (with its lit lip), and a rock front face on every side that faces lower
 * ground. Pure geometry plus a lift lookup, so it is tested without a GPU. The Keeper's feet
 * use `ledgeLift` to stand on the top. Walls' cave-cut shader is not applied: a Keeper on a
 * ledge must never see its own footing sink.
 */
import {
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Mesh,
  MeshLambertMaterial,
  type Texture,
} from 'three';
import { DUNGEON } from '../config/tuning';
import { shelfAt, shelfRise } from '../sim/dungeon-shelves';
import type { Floor } from '../sim/dungeon';
import { floorWorldSize } from './paint/dungeon';

/** Cell edge -> world; the floor is centred on the origin. */
const toWorld = (c: number, n: number) => (c - n / 2) * DUNGEON.cell;

/** How far the ground is raised at a world point inside the Hollow: 0 off every raised block. */
export function ledgeLift(f: Floor | null | undefined, x: number, z: number): number {
  if (!f?.shelves?.length) return 0;
  const cx = Math.floor(x / DUNGEON.cell + f.cols / 2);
  const cy = Math.floor(z / DUNGEON.cell + f.rows / 2);
  return shelfAt(f, { x: cx, y: cy }) >= 0 ? shelfRise(f, { x: cx, y: cy }) : 0;
}

export interface LedgeGeometry {
  top: BufferGeometry;
  sides: BufferGeometry;
  /** Whether any block exists. */
  count: number;
}

/** Top quads (floor-painting UVs) and outward-facing front faces for every raised cell. */
export function ledgeGeometry(f: Floor): LedgeGeometry {
  const { w, h } = floorWorldSize(f);
  const tops: number[] = [];
  const topUv: number[] = [];
  const sides: number[] = [];
  const sideN: number[] = [];
  const sideShade: number[] = [];
  const dirs = [
    [0, 1, [0, 0, 1], 0.78],
    [0, -1, [0, 0, -1], 0.62],
    [1, 0, [1, 0, 0], 0.7],
    [-1, 0, [-1, 0, 0], 0.7],
  ] as const;
  let count = 0;
  (f.shelves ?? []).forEach((s, si) => {
    for (const c of s.cells) {
      count++;
      const rise = shelfRise(f, c);
      const x0 = toWorld(c.x, f.cols);
      const z0 = toWorld(c.y, f.rows);
      const x1 = x0 + DUNGEON.cell;
      const z1 = z0 + DUNGEON.cell;
      const u0 = (x0 + w / 2) / w;
      const u1 = (x1 + w / 2) / w;
      const v0 = 1 - (z0 + h / 2) / h;
      const v1 = 1 - (z1 + h / 2) / h;
      const q: Array<[number, number, number]> = [
        [x0, rise, z0],
        [x0, rise, z1],
        [x1, rise, z1],
        [x1, rise, z0],
      ];
      const t: Array<[number, number]> = [
        [u0, v0],
        [u0, v1],
        [u1, v1],
        [u1, v0],
      ];
      for (const i of [0, 1, 2, 0, 2, 3]) {
        tops.push(...q[i]!);
        topUv.push(...t[i]!);
      }
      for (const [dx, dy, n, shade] of dirs) {
        if (shelfAt(f, { x: c.x + dx, y: c.y + dy }) === si) continue;
        const [ax0, az0, ax1, az1] =
          dy === 1
            ? [x0, z1, x1, z1]
            : dy === -1
              ? [x1, z0, x0, z0]
              : dx === 1
                ? [x1, z1, x1, z0]
                : [x0, z0, x0, z1];
        // A neighbour on a different block stands to its own height: only the part above it shows.
        const low = shelfAt(f, { x: c.x + dx, y: c.y + dy }) >= 0
          ? shelfRise(f, { x: c.x + dx, y: c.y + dy })
          : 0;
        if (low >= rise) continue;
        const p: Array<[number, number, number]> = [
          [ax0, low, az0],
          [ax1, low, az1],
          [ax1, rise, az1],
          [ax0, rise, az0],
        ];
        for (const i of [0, 1, 2, 0, 2, 3]) {
          sides.push(...p[i]!);
          sideN.push(...n);
          sideShade.push(shade, shade, shade);
        }
      }
    }
  });
  const top = new BufferGeometry();
  top.setAttribute('position', new Float32BufferAttribute(tops, 3));
  top.setAttribute('uv', new Float32BufferAttribute(topUv, 2));
  top.computeVertexNormals();
  const side = new BufferGeometry();
  side.setAttribute('position', new Float32BufferAttribute(sides, 3));
  side.setAttribute('normal', new Float32BufferAttribute(sideN, 3));
  side.setAttribute('color', new Float32BufferAttribute(sideShade, 3));
  return { top, sides: side, count };
}

/** The two meshes, or null on a floor with no raised blocks. */
export function buildLedgeMeshes(
  f: Floor,
  tex: Texture,
  rock: string,
): { top: Mesh; sides: Mesh; parts: Array<{ dispose(): void }> } | null {
  const g = ledgeGeometry(f);
  if (!g.count) return null;
  const topMat = new MeshLambertMaterial({
    map: tex,
    emissive: new Color(0x34344a),
    emissiveMap: tex,
  });
  const sideMat = new MeshLambertMaterial({
    color: new Color(rock),
    emissive: new Color(0x2a2236),
    vertexColors: true,
  });
  const top = new Mesh(g.top, topMat);
  top.userData.pick = { kind: 'ground', id: 'ground' };
  return {
    top,
    sides: new Mesh(g.sides, sideMat),
    parts: [g.top, g.sides, topMat, sideMat],
  };
}
