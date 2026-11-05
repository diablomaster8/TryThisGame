import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { HOLLOW_PERF } from '../../src/config/tuning-dungeon-tap';
import { CELL, type HollowCtx } from '../../src/render3d/hollow-ctx';
import { LOOT, lootRanges, STALAG, STRAND } from '../../src/render3d/hollow-dress-geo';
import {
  HollowSectors,
  sectorGroups,
  sectorParts,
  sectorRows,
  sectorSizeOf,
  tagSector,
} from '../../src/render3d/hollow-sectors';
import { floorOf } from '../../src/sim/dungeon';

/**
 * R0194 (DUNG-51): a 96×72 Hollow level streams by square sectors, its merged meshes are cut
 * per sector without losing a triangle, small props reach only the nearest 2×2 sectors, and
 * the repeated dressing stays low-poly.
 */

const big = floorOf(7, 10, 3);
const size = sectorSizeOf(big);
const cellOf = (x: number, z: number) => ({
  sx: Math.floor((x / CELL + big.cols / 2) / size),
  sy: Math.floor((z / CELL + big.rows / 2) / size),
});

describe('Hollow sectors on a big level (R0194)', () => {
  it('streams a 96×72 level by square sectors', () => {
    expect([big.cols, big.rows]).toEqual([96, 72]);
    expect(size).toBe(HOLLOW_PERF.levelSector);
    expect(sectorRows(big)).toBe(true);
  });

  it('puts every item in the sector under it, and keeps them all', () => {
    const pts = Array.from({ length: 500 }, (_, i) => ({
      x: (((i * 37) % 96) - 48 + 0.5) * CELL,
      z: (((i * 53) % 72) - 36 + 0.5) * CELL,
    }));
    const groups = sectorGroups(big, pts, (p) => p);
    expect(groups.reduce((n, [, g]) => n + g.length, 0)).toBe(pts.length);
    for (const [key, g] of groups)
      for (const p of g) expect(cellOf(p.x, p.z)).toEqual({ sx: key!.col, sy: key!.row });
  });

  it('cuts a merged mesh per sector, sharing its buffers, every triangle once', () => {
    const plane = new THREE.PlaneGeometry(96 * CELL, 72 * CELL, 48, 36).rotateX(-Math.PI / 2);
    const mesh = new THREE.Mesh(plane, new THREE.MeshBasicMaterial());
    mesh.castShadow = true;
    const parts = sectorParts(big, mesh);
    expect(parts.length).toBe(6 * 5);
    const idx = plane.index!;
    const pos = plane.getAttribute('position');
    let total = 0;
    for (const p of parts) {
      expect(p.geometry.getAttribute('position')).toBe(pos);
      expect(p.geometry.index).toBe(idx);
      expect(p.castShadow).toBe(true);
      expect(p.geometry.boundingSphere).not.toBeNull();
      const { start, count } = p.geometry.drawRange;
      total += count;
      for (let i = start; i < start + count; i += 3) {
        let x = 0;
        let z = 0;
        for (let k = 0; k < 3; k++) {
          x += pos.getX(idx.getX(i + k)) / 3;
          z += pos.getZ(idx.getX(i + k)) / 3;
        }
        expect(cellOf(x, z)).toEqual({ sx: p.userData.sectorCol, sy: p.userData.sectorRow });
      }
    }
    expect(total).toBe(idx.count);
  });

  it('shows the rock 3×3 round the Keeper and small props only the nearest 2×2', () => {
    const group = new THREE.Group();
    for (let col = 0; col < 6; col++)
      for (let row = 0; row < 5; row++) {
        const rock = new THREE.Object3D();
        tagSector(rock, { col, row });
        const prop = new THREE.Object3D();
        tagSector(prop, { col, row }, true);
        prop.userData.prop = true;
        group.add(rock, prop);
      }
    const s = new HollowSectors();
    s.build(big, { group } as unknown as HollowCtx);
    // The Keeper in cell (67, 21): sector (4, 1), in its right and upper halves.
    s.update(0, { x: (67.5 - 48) * CELL, z: (21.5 - 36) * CELL });
    const shown = (prop: boolean) =>
      group.children
        .filter((o) => o.visible && !!o.userData.prop === prop)
        .map((o) => `${o.userData.sectorCol},${o.userData.sectorRow}`)
        .sort();
    expect(shown(false)).toEqual(['3,0', '3,1', '3,2', '4,0', '4,1', '4,2', '5,0', '5,1', '5,2']);
    expect(shown(true)).toEqual(['3,0', '3,1', '4,0', '4,1']);
  });
});

describe('Low-poly Hollow dressing (R0194)', () => {
  it('draws each loot kind from its own contiguous run of the shared geometry', () => {
    const g = LOOT();
    const ranges = lootRanges(g);
    expect([...ranges.keys()].sort()).toEqual([0, 1, 2, 3, 4, 5, 6]);
    const kind = g.getAttribute('aKind');
    let total = 0;
    for (const [k, [a, b]] of ranges) {
      total += b - a;
      for (let i = a; i < b; i++) expect(kind.getX(g.index!.getX(i))).toBe(k);
    }
    expect(total).toBe(g.index!.count);
  });

  it('keeps the root strand and stalagmite light', () => {
    const tris = (g: THREE.BufferGeometry) =>
      (g.index ? g.index.count : g.attributes.position!.count) / 3;
    expect(tris(STRAND())).toBeLessThanOrEqual(400);
    expect(tris(STALAG())).toBeLessThanOrEqual(84);
  });
});
