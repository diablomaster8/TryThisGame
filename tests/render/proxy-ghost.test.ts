import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { HIDDEN_LAYER, setFar, setProxy, type CreatureProxy } from '../../src/render3d/lod-proxy';

// R0451 (lane D r10): the Keeper's see-through twins follow their part onto the hidden layer
// when the stand-in takes over, so the x-ray pass never draws a part the stand-in replaced.
describe('stand-in and the see-through twins', () => {
  const twin = () => {
    const m = new THREE.Mesh(new THREE.BufferGeometry());
    m.userData.obxGhost = true;
    return m;
  };
  const proxy = () => {
    const part = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshPhysicalMaterial());
    const detail = new THREE.Mesh(new THREE.BufferGeometry());
    part.add(twin(), twin());
    detail.add(twin());
    const p = {
      mesh: new THREE.SkinnedMesh(),
      hull: new THREE.SkinnedMesh(),
      parts: [part],
      details: [detail],
      swapped: 0,
      tris: 0,
      on: false,
      far: false,
    } as CreatureProxy;
    return { p, part, detail };
  };
  const hidden = (o: THREE.Object3D) => o.layers.isEnabled(HIDDEN_LAYER) && !o.layers.isEnabled(0);

  it('hides and shows the part twins with the part', () => {
    const { p, part } = proxy();
    setProxy(p, true);
    expect(part.children.every(hidden)).toBe(true);
    setProxy(p, false);
    expect(part.children.every((c) => c.layers.isEnabled(0))).toBe(true);
  });

  it('hides the face bits twins when far', () => {
    const { p, detail } = proxy();
    setProxy(p, true);
    setFar(p, true);
    expect(detail.children.every(hidden)).toBe(true);
    setFar(p, false);
    expect(detail.children.every((c) => c.layers.isEnabled(0))).toBe(true);
  });
});
