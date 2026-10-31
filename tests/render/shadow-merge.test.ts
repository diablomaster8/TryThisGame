import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { SHADOW_MERGE } from '../../src/config/tuning';
import { ShadowMerge, mergeable } from '../../src/render3d/shadow-merge';

/** A renderer stand-in: only the shadow map's `render` is wrapped; `inPass` runs inside it. */
function fakeRenderer(inPass: () => void = () => {}): {
  renderer: THREE.WebGLRenderer;
  shadowPass: () => void;
} {
  const map = { render: (...args: unknown[]) => void (args.length, inPass()) };
  const renderer = { shadowMap: map } as unknown as THREE.WebGLRenderer;
  return { renderer, shadowPass: () => map.render([], new THREE.Scene(), new THREE.Camera()) };
}

function caster(x: number, tris = 12): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial());
  expect((m.geometry.index!.count / 3) | 0).toBe(tris);
  m.position.set(x, 0, 0);
  m.castShadow = true;
  return m;
}

/** Sweeps: one to see, one to merge, then time for a rebuild. */
function settle(merge: ShadowMerge, root: THREE.Object3D, from = 0): number {
  let t = from;
  for (let i = 0; i < 3; i++) {
    root.updateMatrixWorld(true);
    merge.update(t);
    t += SHADOW_MERGE.rebuildMs;
  }
  return t;
}

describe('ShadowMerge (lane D r8 phone headroom)', () => {
  it('folds still casters into one shadow-only mesh, hidden outside the shadow pass', () => {
    const root = new THREE.Group();
    const parts = [caster(0), caster(3), caster(6)];
    root.add(...parts);
    let seenInPass = false;
    const { renderer, shadowPass } = fakeRenderer(() => {
      seenInPass = root.children.some((c) => c.name === 'shadow-merge' && c.visible);
    });
    const merge = new ShadowMerge(root, renderer);
    merge.enabled = true;
    settle(merge, root);
    expect(merge.merged).toBe(3);
    for (const p of parts) expect(p.castShadow).toBe(false);
    const proxy = root.children.find((c) => c.name === 'shadow-merge') as THREE.Mesh;
    expect(proxy).toBeTruthy();
    expect(proxy.castShadow).toBe(true);
    expect(proxy.visible).toBe(false);
    expect(proxy.geometry.index!.count).toBe(3 * 36);
    shadowPass();
    expect(seenInPass).toBe(true);
    expect(proxy.visible).toBe(false);
  });

  it('gives a mover its own shadow back, and lets it go for good after enough moves', () => {
    const root = new THREE.Group();
    const a = caster(0);
    const b = caster(4);
    root.add(a, b);
    const { renderer } = fakeRenderer();
    const merge = new ShadowMerge(root, renderer);
    merge.enabled = true;
    let t = settle(merge, root);
    expect(merge.merged).toBe(2);
    for (let i = 0; i < SHADOW_MERGE.moves; i++) {
      a.position.x += 1;
      t = settle(merge, root, t);
    }
    expect(a.castShadow).toBe(true);
    expect(merge.merged).toBe(1);
    // Still now, but it moved too often: it keeps casting on its own.
    settle(merge, root, t);
    expect(a.castShadow).toBe(true);
    expect(b.castShadow).toBe(false);
  });

  it('a hidden mesh drops out, but a LOD mesh keeps its merged shadow while hidden', () => {
    const root = new THREE.Group();
    const lod = caster(0);
    const plain = caster(4);
    root.add(lod, plain);
    const batch = caster(8);
    const { renderer } = fakeRenderer();
    const merge = new ShadowMerge(root, renderer);
    merge.addLod([lod], [batch]);
    merge.enabled = true;
    let t = settle(merge, root);
    expect(merge.merged).toBe(2);
    expect(batch.castShadow).toBe(false);
    lod.visible = false;
    plain.visible = false;
    t = settle(merge, root, t);
    expect(lod.castShadow).toBe(false);
    expect(plain.castShadow).toBe(true);
    expect(merge.merged).toBe(1);
    // Off: everything casts again, batches included.
    merge.enabled = false;
    merge.update(t);
    expect(lod.castShadow).toBe(true);
    expect(batch.castShadow).toBe(true);
    expect(root.children.some((c) => c.name === 'shadow-merge')).toBe(false);
  });

  it('leaves big, alpha-cut and transparent meshes alone', () => {
    const big = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1, 80, 80),
      new THREE.MeshBasicMaterial(),
    );
    big.castShadow = true;
    expect(mergeable(big, SHADOW_MERGE.maxTris)).toBe(false);
    const cut = caster(0);
    (cut.material as THREE.Material).alphaTest = 0.5;
    expect(mergeable(cut, SHADOW_MERGE.maxTris)).toBe(false);
    const glass = caster(0);
    (glass.material as THREE.Material).transparent = true;
    expect(mergeable(glass, SHADOW_MERGE.maxTris)).toBe(false);
    const inst = new THREE.InstancedMesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial(), 4);
    inst.castShadow = true;
    expect(mergeable(inst, SHADOW_MERGE.maxTris)).toBe(false);
    expect(mergeable(caster(0), SHADOW_MERGE.maxTris)).toBe(true);
  });
});
