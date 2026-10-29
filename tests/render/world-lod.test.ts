import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { tierForRes, WORLD_LOD } from '../../src/config/tuning-world';
import { walkLead } from '../../src/render/camera';
import { TerrainChunks } from '../../src/render3d/chunks';
import { CreatureLod } from '../../src/render3d/lod';
import { buildProxy, dropProxy, setProxy } from '../../src/render3d/lod-proxy';
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
    // Both inside the hull distance (R0079): one tiny, one large.
    const small = rig(0, 1);
    small.root.scale.setScalar(0.15);
    small.root.updateMatrixWorld(true);
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

describe('creature stand-ins and impostors (R0079)', () => {
  it('drops every hull past the hull distance, whatever the level', () => {
    const lod = new CreatureLod();
    const far = rig(0, -30);
    const cam = camera(0, 12, 0, 0);
    lod.update([far.root], cam, 0, 812);
    expect(far.root.position.distanceTo(cam.position)).toBeGreaterThan(
      WORLD_LOD.creature.hullMaxDist,
    );
    expect(far.hull.visible).toBe(false);
    lod.restoreAll();
    expect(far.hull.visible).toBe(true);
  });

  /** Two lit toon parts, one with vertex colours, as `buildSpecies` makes them. */
  function toonRig(): { root: THREE.Group; arm: THREE.Mesh } {
    const root = new THREE.Group();
    const bodyGeo = new THREE.SphereGeometry(0.5, 8, 6);
    const n = bodyGeo.attributes.position!.count;
    bodyGeo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(n * 3).fill(0.5), 3));
    const bodyMat = new THREE.MeshPhysicalMaterial({ vertexColors: true });
    bodyMat.userData.shader = { uniforms: { uGlowStrength: { value: 0 } } };
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    const arm = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.6, 0.2),
      new THREE.MeshPhysicalMaterial({ color: '#ff0000' }),
    );
    arm.position.set(0.6, 0, 0);
    const eye = new THREE.Mesh(
      new THREE.PlaneGeometry(0.1, 0.1),
      new THREE.MeshBasicMaterial({ transparent: true }),
    );
    body.add(eye);
    root.add(body, arm);
    root.updateMatrixWorld(true);
    return { root, arm };
  }

  it('merges the opaque parts into one skinned mesh that follows and hides each part', () => {
    const { root, arm } = toonRig();
    const p = buildProxy(root)!;
    expect(p.parts.length).toBe(2);
    expect(p.details.length).toBe(1);
    const verts = p.parts.reduce((a, m) => a + m.geometry.attributes.position!.count, 0);
    expect(p.mesh.geometry.attributes.position!.count).toBe(verts);
    // The arm's colour is baked into its vertices.
    const col = p.mesh.geometry.attributes.color!;
    expect(col.getX(verts - 1)).toBeCloseTo(1);
    expect(col.getY(verts - 1)).toBeCloseTo(0);
    setProxy(p, true);
    expect(arm.layers.isEnabled(0)).toBe(false);
    expect(p.mesh.visible).toBe(true);
    // The arm's bone is its transform relative to the root; hidden, it folds to a point.
    arm.position.set(0, 2, 0);
    root.updateMatrixWorld(true);
    p.mesh.skeleton.update();
    const m = new THREE.Matrix4().fromArray(p.mesh.skeleton.boneMatrices!, 16);
    expect(new THREE.Vector3().setFromMatrixPosition(m).y).toBeCloseTo(2);
    arm.visible = false;
    p.mesh.skeleton.update();
    expect(new THREE.Matrix4().fromArray(p.mesh.skeleton.boneMatrices!, 16).determinant()).toBe(0);
    setProxy(p, false);
    expect(arm.layers.isEnabled(0)).toBe(true);
    dropProxy(p);
    expect(root.children.includes(p.mesh)).toBe(false);
  });

  it('keeps the far tier past the near tiers, and the atlas within its memory', () => {
    const c = WORLD_LOD.creature;
    expect(c.proxyFrom).toBeLessThan(c.hullMaxDist);
    expect(c.hullMaxDist).toBeLessThanOrEqual(c.impostorFrom);
    expect(c.impostorFrom * (1 - c.band)).toBeGreaterThan(c.proxyFrom * (1 + c.band));
    expect(c.impostor.atlasPx ** 2 * 4).toBeLessThanOrEqual(8 * 1024 * 1024);
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
