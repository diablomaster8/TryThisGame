import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { HOLLOW_PERF } from '../../src/config/tuning-dungeon-tap';
import { CELL, type HollowCtx } from '../../src/render3d/hollow-ctx';
import { ROCK_LO, STALAG, STALAG_LO, STRAND, STRAND_LO } from '../../src/render3d/hollow-dress-geo';
import {
  cellRects,
  IndexPack,
  InstancePack,
  lodTwin,
  planarRect,
} from '../../src/render3d/hollow-lod';
import {
  HollowSectors,
  sectorDistance,
  sectorLods,
  sectorNear,
  tagSector,
} from '../../src/render3d/hollow-sectors';
import { floorOf } from '../../src/sim/dungeon';

/**
 * R0194 part 2 (DUNG-51): far sectors of a big Hollow level draw low-detail twins over the
 * same vertices, swapped with hysteresis, and whole-floor draws are packed to the window.
 */

const big = floorOf(7, 10, 3);
const tris = (g: THREE.BufferGeometry) =>
  (g.index ? g.index.count : g.attributes.position!.count) / 3;
const S = 3;

describe('Far ground cut (R0194 part 2)', () => {
  it('draws a flat cell as one rectangle', () => {
    expect(cellRects(() => 0.4, S, 0.004)).toEqual([[0, 0, 3, 3]]);
    // A plane that slopes is still one rectangle.
    expect(cellRects((i, j) => i * 0.1 + j * 0.05, S, 0.004)).toEqual([[0, 0, 3, 3]]);
  });

  it('keeps a ledge fine and merges the flat rest, covering every sub-quad once', () => {
    // A step on the last column: sub-vertices at i = 3 are lower.
    const h = (i: number) => (i >= 3 ? -0.25 : 0);
    const rects = cellRects(h, S, 0.004);
    expect(rects.length).toBeLessThan(S * S);
    const seen = new Uint8Array(S * S);
    for (const [i0, j0, i1, j1] of rects) {
      expect(planarRect(h, [i0, j0, i1, j1], 0.004)).toBe(true);
      for (let j = j0; j < j1; j++) for (let i = i0; i < i1; i++) seen[j * S + i]!++;
    }
    expect([...seen].every((n) => n === 1)).toBe(true);
  });

  it('never passes over a vertex off the rectangle (no cracks)', () => {
    const bump = (i: number, j: number) => (i === 1 && j === 1 ? 0.3 : 0);
    expect(planarRect(bump, [0, 0, 3, 3], 0.004)).toBe(false);
    for (const r of cellRects(bump, S, 0.004)) expect(planarRect(bump, r, 0.004)).toBe(true);
  });
});

describe('Far sector detail (R0194 part 2)', () => {
  it('is on for big levels only', () => {
    expect(sectorLods(big)).toBe(true);
    expect(sectorLods(floorOf(7, 1, 3))).toBe(false);
  });

  it('measures cells to a sector and holds its detail across the band', () => {
    expect(sectorDistance(16, 1, 1, 20, 20)).toBe(0);
    expect(sectorDistance(16, 2, 1, 20, 20)).toBe(12);
    const { near, hold } = HOLLOW_PERF.lod;
    expect(sectorNear(near, false)).toBe(true);
    expect(sectorNear(near + 1, false)).toBe(false);
    expect(sectorNear(near + hold, true)).toBe(true);
    expect(sectorNear(near + hold + 1, true)).toBe(false);
  });

  it('swaps a sector to its twin once far, and back once near', () => {
    const group = new THREE.Group();
    const hi = new THREE.Object3D();
    tagSector(hi, { col: 2, row: 2 }, false, 'hi');
    const lo = new THREE.Object3D();
    tagSector(lo, { col: 2, row: 2 }, false, 'lo');
    group.add(hi, lo);
    const s = new HollowSectors();
    s.build(big, { group } as unknown as HollowCtx);
    const at = (cx: number, cy: number) =>
      s.update(0, { x: (cx + 0.5 - big.cols / 2) * CELL, z: (cy + 0.5 - big.rows / 2) * CELL });
    const { near, hold } = HOLLOW_PERF.lod;
    // Sector (2, 2) spans cells 32..47; walk left from inside it.
    at(40, 40);
    expect([hi.visible, lo.visible]).toEqual([true, false]);
    at(32 - near - 1, 40);
    expect([hi.visible, lo.visible]).toEqual([true, false]);
    at(32 - near - hold - 1, 40);
    expect([hi.visible, lo.visible]).toEqual([false, true]);
    at(32 - near - 1, 40);
    expect([hi.visible, lo.visible]).toEqual([false, true]);
    at(32 - near, 40);
    expect([hi.visible, lo.visible]).toEqual([true, false]);
  });

  it('keeps far props light and shares the instances with their twin', () => {
    expect(tris(STRAND_LO())).toBeLessThan(tris(STRAND()) / 2);
    expect(tris(STALAG_LO())).toBeLessThan(tris(STALAG()) / 2);
    expect(tris(ROCK_LO())).toBeLessThanOrEqual(20);
    const im = new THREE.InstancedMesh(STALAG(), new THREE.MeshBasicMaterial(), 3);
    im.setColorAt(0, new THREE.Color('#ffffff'));
    const lo = lodTwin(im, STALAG_LO(), { col: 1, row: 2 });
    expect(lo.instanceMatrix).toBe(im.instanceMatrix);
    expect(lo.instanceColor).toBe(im.instanceColor);
    expect([im.userData.sectorLod, lo.userData.sectorLod, lo.visible]).toEqual(['hi', 'lo', false]);
  });
});

describe('Window packs (R0194 part 2)', () => {
  it('draws only the instances inside, keeping logical colours', () => {
    const im = new THREE.InstancedMesh(STALAG(), new THREE.MeshBasicMaterial(), 4);
    const at = [0, 10, 20, 30].map((x) => ({ x, z: 0 }));
    at.forEach((p, i) => {
      im.setMatrixAt(i, new THREE.Matrix4().makeTranslation(p.x, 0, 0));
      im.setColorAt(i, new THREE.Color(i / 4, 0, 0));
    });
    const pack = new InstancePack(im, at);
    pack.pack((x) => x >= 10 && x <= 20);
    expect([im.count, pack.shown, [...pack.slot]]).toEqual([2, 2, [-1, 0, 1, -1]]);
    const m = new THREE.Matrix4();
    im.getMatrixAt(1, m);
    expect(m.elements[12]).toBe(20);
    pack.setColorAt(2, new THREE.Color(0, 1, 0));
    const c = new THREE.Color();
    im.getColorAt(1, c);
    expect(c.g).toBe(1);
    pack.pack(() => true);
    im.getColorAt(2, c);
    expect([im.count, c.g]).toEqual([4, 1]);
  });

  it('cuts a merged mesh to the triangles inside', () => {
    const g = new THREE.PlaneGeometry(40, 4, 4, 1).rotateX(-Math.PI / 2);
    const mesh = new THREE.Mesh(g, new THREE.MeshBasicMaterial());
    const pack = new IndexPack(mesh);
    pack.pack((x) => x > 0);
    expect(g.drawRange.count).toBe((tris(g) * 3) / 2);
    pack.pack(() => false);
    expect(mesh.visible).toBe(false);
  });
});
