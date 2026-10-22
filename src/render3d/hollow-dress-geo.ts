import * as THREE from 'three';
import { GROVE3D } from '../config/tuning';
import { cellAt, WATER, type Floor } from '../sim/dungeon';
import type { DungeonLootKind } from '../sim/types';
import { CELL } from './hollow-ctx';
import { BALL, BOX, CONE, CYL, Kit, prim, ROCK, SPHERE } from './hollow-dress-kit';

/**
 * The dressing's shared shapes (`hollow-dress.ts`), made once per page: the rounded
 * stalagmite, the hanging root strand with its vine and berries, every loot model and the
 * chest lid in one kind-stamped geometry, the unit planes, and the still pools' mesh.
 */

export const LOOT_KIND: Record<DungeonLootKind, number> = {
  shells: 0,
  stone: 1,
  seed: 2,
  essence: 3,
  critter: 4,
  egg: 5,
};
export const LID_KIND = 6;

/** A rounded stalagmite, base at y 0 and tip at 1, radius 1 (item 20: no sharp spikes). */
export const STALAG = () =>
  prim('stalag', () => {
    const pts = [
      [1, 0],
      [0.96, 0.1],
      [0.78, 0.3],
      [0.56, 0.52],
      [0.38, 0.72],
      [0.24, 0.88],
      [0.1, 0.98],
      [0, 1],
    ].map(([r, y]) => new THREE.Vector2(r, y));
    return new THREE.LatheGeometry(pts, 8);
  });

/** One root strand hanging from y 0 down about 2.2: a root, a vine round it, glowing berries. */
export const STRAND = () =>
  prim('strand', () => {
    const k = new Kit();
    const D = GROVE3D.cave.dress;
    const pt = (t: number) =>
      new THREE.Vector3(
        Math.sin(t * 2.2) * 0.12,
        -t * 2.2,
        Math.sin(t * 3.1 + 1) * 0.08 + t * 0.12,
      );
    for (let i = 0; i < 7; i++)
      k.rod(pt(i / 7), pt((i + 1) / 7), 0.075 - i * 0.008, i % 2 ? '#6e4a30' : '#7a5636');
    // Two rootlets.
    k.rod(pt(0.35), pt(0.35).add(new THREE.Vector3(0.28, -0.35, 0.05)), 0.02, '#7a5636');
    k.rod(pt(0.6), pt(0.6).add(new THREE.Vector3(-0.22, -0.3, 0.1)), 0.018, '#7a5636');
    // The vine winding round it, with leaves.
    let prev: THREE.Vector3 | null = null;
    for (let i = 0; i <= 16; i++) {
      const t = i / 16;
      const c = pt(t * 0.92);
      const a = t * 9;
      const p = new THREE.Vector3(c.x + Math.cos(a) * 0.09, c.y, c.z + Math.sin(a) * 0.09);
      if (prev) k.rod(prev, p, 0.016, '#4f8a42');
      if (i % 3 === 1)
        k.part(
          SPHERE(),
          p.x + Math.cos(a) * 0.06,
          p.y,
          p.z + Math.sin(a) * 0.06,
          0.12,
          0.03,
          0.07,
          '#6aa84f',
          0.05,
          a,
        );
      prev = p;
    }
    for (let b = 0; b < D.berriesPerRoot; b++) {
      const c = pt(0.35 + (b / Math.max(1, D.berriesPerRoot - 1)) * 0.55);
      for (let j = 0; j < 3; j++)
        k.part(
          BALL(),
          c.x + Math.cos(j * 2.1 + b) * 0.07,
          c.y - j * 0.04,
          c.z + Math.sin(j * 2.1 + b) * 0.07,
          0.12,
          0.12,
          0.12,
          D.berry,
          1.6,
        );
    }
    return k.build()!;
  });

/** Every loot model and the chest lid in one geometry, each part stamped with its kind. */
export const LOOT = () =>
  prim('loot', () => {
    const k = new Kit();
    k.kind = LOOT_KIND.shells;
    for (const [x, z] of [
      [-0.1, 0.05],
      [0.08, 0.09],
      [-0.02, -0.08],
      [0.12, -0.06],
    ] as const)
      k.part(SPHERE(), x, -0.12, z, 0.18, 0.08, 0.14, '#f2d34c', 0.7);
    k.kind = LOOT_KIND.stone;
    k.part(ROCK(), 0, 0, 0, 0.32, 0.22, 0.27, '#9a9aac', 0.35);
    k.kind = LOOT_KIND.seed;
    k.part(SPHERE(), 0, 0, 0, 0.19, 0.24, 0.19, '#8a5a32', 0.4);
    k.part(CYL(0.5, 5), 0.03, 0.17, 0, 0.03, 0.14, 0.03, '#4a9c42');
    k.part(SPHERE(), 0.07, 0.24, 0, 0.14, 0.05, 0.08, '#8fd262', 0.2);
    k.kind = LOOT_KIND.essence;
    k.part(CONE(6), 0, 0.02, 0, 0.22, 0.34, 0.22, '#b58cff', 0.9);
    k.part(CYL(0.5, 12), 0, -0.16, 0, 0.26, 0.03, 0.26, '#7a5ad0', 0.2);
    k.kind = LOOT_KIND.critter;
    k.part(SPHERE(), 0, 0, 0, 0.16, 0.16, 0.16, '#3a3346');
    for (const x of [-0.03, 0.03])
      k.part(SPHERE(), x, 0.02, 0.07, 0.036, 0.036, 0.036, '#ffffff', 0.4);
    k.kind = LOOT_KIND.egg;
    k.part(SPHERE(), 0, 0, 0, 0.34, 0.44, 0.34, '#f3efe2', 0.45);
    for (let i = 0; i < 6; i++) {
      const a = i * 2.4;
      const y = -0.1 + (i % 3) * 0.09;
      const r = Math.sqrt(Math.max(0, 1 - (y / 0.22) ** 2)) * 0.165;
      k.part(SPHERE(), Math.cos(a) * r, y, Math.sin(a) * r, 0.05, 0.05, 0.05, '#c9a0ff', 0.3);
    }
    // The chest lid, its hinge at the origin, opening toward +z.
    k.kind = LID_KIND;
    k.part(BOX(), 0, 0.07, 0.235, 0.72, 0.14, 0.47, '#a06a32', 0.15);
    k.part(BOX(), 0, 0.075, 0.235, 0.1, 0.15, 0.48, '#e0c060', 0.6);
    return k.build()!;
  });

export const PLANE = () => prim('plane', () => new THREE.PlaneGeometry(1, 1));
export const FLAT = () => prim('flat', () => new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2));

/**
 * The still pools, one mesh over every wet cell at its own surface height (water sits below
 * the ground around it), carrying the painted water's `depth`: zero at a corner that
 * touches dry ground, so foam rings the shore.
 */
export function poolGeometry(f: Floor): THREE.BufferGeometry | null {
  const wet = (x: number, y: number) => cellAt(f, x, y) === WATER;
  const top = (x: number, y: number) => f.elevation[y * f.cols + x] ?? 0;
  const corners = new Map<number, number>();
  const pos: number[] = [];
  const depth: number[] = [];
  const index: number[] = [];
  const corner = (ix: number, iz: number): number => {
    const key = iz * (f.cols + 1) + ix;
    const had = corners.get(key);
    if (had !== undefined) return had;
    const i = pos.length / 3;
    corners.set(key, i);
    let sum = 0;
    let n = 0;
    for (const [x, y] of [
      [ix - 1, iz - 1],
      [ix, iz - 1],
      [ix - 1, iz],
      [ix, iz],
    ] as const)
      if (wet(x, y)) {
        sum += top(x, y);
        n++;
      }
    pos.push((ix - f.cols / 2) * CELL, (n ? sum / n : 0) + 0.02, (iz - f.rows / 2) * CELL);
    depth.push(n === 4 ? 0.8 : 0);
    return i;
  };
  for (let y = 0; y < f.rows; y++)
    for (let x = 0; x < f.cols; x++) {
      if (!wet(x, y)) continue;
      const a = corner(x, y);
      const b = corner(x + 1, y);
      const c = corner(x, y + 1);
      const d = corner(x + 1, y + 1);
      // A centre vertex with water under it, so a pool one cell wide still has open water
      // in the middle and foam only at its banks.
      const m = pos.length / 3;
      pos.push((x + 0.5 - f.cols / 2) * CELL, top(x, y) + 0.02, (y + 0.5 - f.rows / 2) * CELL);
      depth.push(0.8);
      index.push(a, c, m, c, d, m, d, b, m, b, a, m);
    }
  if (!index.length) return null;
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('depth', new THREE.Float32BufferAttribute(depth, 1));
  g.setIndex(index);
  return g;
}
