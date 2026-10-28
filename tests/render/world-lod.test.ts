import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { tierForRes, WORLD_LOD } from '../../src/config/tuning-world';
import { walkLead } from '../../src/render/camera';
import { TerrainChunks } from '../../src/render3d/chunks';
import { CreatureLod } from '../../src/render3d/lod';
import { TERRAIN_SEGS, TERRAIN_SIZE } from '../../src/render3d/terrain-shape';

/** A flat stand-in for the poured terrain: the same grid and index layout. */
function ground(): THREE.Mesh {
  const geo = new THREE.PlaneGeometry(TERRAIN_SIZE, TERRAIN_SIZE, TERRAIN_SEGS, TERRAIN_SEGS);
  geo.rotateX(-Math.PI / 2);
  return new THREE.Mesh(geo);
}

function camera(x: number, z: number, lookX: number, lookZ: number): THREE.PerspectiveCamera {
  const c = new THREE.PerspectiveCamera(40, 375 / 812, 0.1, 400);
  c.position.set(x, 10, z);
  c.lookAt(lookX, 0, lookZ);
  c.updateMatrixWorld();
  return c;
}

describe('terrain chunks (WORLD-09)', () => {
  it('draws only the chunks near the view, from the full index, in one range', () => {
    const mesh = ground();
    const full = Array.from(mesh.geometry.index!.array);
    const t = new TerrainChunks();
    t.update(mesh, camera(40, 52, 44, 44));
    expect(t.total).toBe(49);
    expect(t.drawn).toBeGreaterThan(0);
    expect(t.drawn).toBeLessThan(t.total / 2);
    const n = mesh.geometry.drawRange.count;
    expect(n % 6).toBe(0);
    // Every drawn cell is a cell of the original grid.
    const cells = new Set<string>();
    for (let i = 0; i < full.length; i += 6) cells.add(full.slice(i, i + 6).join());
    const idx = mesh.geometry.index!.array;
    for (let i = 0; i < n; i += 6)
      expect(cells.has(Array.from(idx.slice(i, i + 6)).join())).toBe(true);
  });

  it('draws every chunk when the whole field is in view, and holds the set when frozen', () => {
    const mesh = ground();
    const t = new TerrainChunks();
    const top = new THREE.PerspectiveCamera(90, 1, 0.1, 400);
    top.position.set(0, 120, 0.01);
    top.lookAt(0, 0, 0);
    top.updateMatrixWorld();
    t.update(mesh, top);
    expect(t.drawn).toBe(t.total);
    expect(mesh.geometry.drawRange.count).toBe(TERRAIN_SEGS * TERRAIN_SEGS * 6);
    t.frozen = true;
    t.update(mesh, camera(40, 52, 44, 44));
    expect(t.drawn).toBe(t.total);
  });
});

/** A rig: a group with one shadow-casting part that carries an outline hull. */
function rig(x: number, z: number): { root: THREE.Group; part: THREE.Mesh; hull: THREE.Mesh } {
  const root = new THREE.Group();
  const part = new THREE.Mesh(new THREE.SphereGeometry(0.5));
  part.castShadow = true;
  const hull = new THREE.Mesh(part.geometry);
  hull.userData.hull = true;
  part.add(hull);
  root.add(part);
  root.position.set(x, 0.5, z);
  root.updateMatrixWorld(true);
  return { root, part, hull };
}

describe('creature LOD (WORLD-03/12)', () => {
  it('stops casting off screen, keeps it on screen, and hands everything back', () => {
    const lod = new CreatureLod();
    const near = rig(0, 0);
    const far = rig(60, -60);
    const cam = camera(0, 12, 0, 0);
    lod.update([near.root, far.root], cam, 0, 812);
    expect(near.part.castShadow).toBe(true);
    expect(far.part.castShadow).toBe(false);
    expect(lod.inView).toBe(1);
    // Gone from the list (back to the pool): its caster comes back.
    lod.update([near.root], cam, 0, 812);
    expect(far.part.castShadow).toBe(true);
  });

  it('drops hulls on small creatures from level 2 and all of them at level 3', () => {
    const lod = new CreatureLod();
    const small = rig(0, -30);
    const big = rig(0, 8);
    const cam = camera(0, 12, 0, 0);
    lod.update([small.root, big.root], cam, 0, 812);
    expect(small.hull.visible && big.hull.visible).toBe(true);
    lod.update([small.root, big.root], cam, 2, 812);
    expect(small.hull.visible).toBe(false);
    expect(big.hull.visible).toBe(true);
    lod.update([small.root, big.root], cam, 3, 812);
    expect(big.hull.visible).toBe(false);
    lod.restoreAll();
    expect(small.hull.visible && big.hull.visible).toBe(true);
    expect(WORLD_LOD.creature.hullMinPx).toBeGreaterThan(0);
  });
});

describe('device tier (WORLD-14)', () => {
  it('reads the tier from the sculpt grid', () => {
    expect(tierForRes(104)).toBe('desktop');
    expect(tierForRes(80)).toBe('desktop');
    expect(tierForRes(64)).toBe('phone');
    expect(tierForRes(48)).toBe('slow');
  });
});

describe('walking lead (WORLD-18)', () => {
  it('leads by a share of a portrait view, keeps the base elsewhere, none while carrying', () => {
    const portrait = { visibleWidth: 11.75, visibleHeight: 25 };
    const lead = walkLead(portrait, 0.6, false);
    expect(lead).toBeCloseTo(0.32 * 11.75);
    expect(lead).toBeLessThanOrEqual(11.75 / 2 - 2);
    expect(walkLead({ visibleWidth: 30, visibleHeight: 17 }, 0.6, false)).toBe(0.6);
    expect(walkLead(portrait, 0.6, true)).toBe(0);
  });
});
