import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { describe, expect, it } from 'vitest';
import { CROWN_SPRING } from '../../src/config/tuning';
import { splitCrown } from '../../src/samples/crown-spring';
import type { Prim } from '../../src/samples/sculpted';

/** A head ball with a point on top, as one indexed mesh, and the crown's primitives. */
function head(): { mesh: THREE.Mesh; prims: Prim[]; group: THREE.Group } {
  const ball = new THREE.SphereGeometry(0.6, 24, 16).translate(0, 2, 0);
  const cone = new THREE.CylinderGeometry(0.05, 0.42, 0.7, 16, 8).translate(0, 2.65, 0);
  const geo = mergeGeometries([ball, cone])!;
  const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial());
  const group = new THREE.Group();
  group.add(mesh);
  const prims: Prim[] = [
    {
      kind: 'cone',
      a: new THREE.Vector3(0, 2.3, 0),
      b: new THREE.Vector3(0, 3, 0),
      r: 0.42,
      r2: 0.05,
      color: '#ffffff',
      tag: 'crown',
    },
  ];
  return { mesh, prims, group };
}

describe('crown spring (R0380, LOOK-11)', () => {
  it('moves the point into its own mesh under a crown pivot, the head keeping its buffers', () => {
    const { mesh, prims, group } = head();
    const before = mesh.geometry.index!.count;
    const pos = mesh.geometry.attributes.position!;
    const spring = splitCrown(prims, group, mesh, new THREE.Vector3())!;
    expect(spring).not.toBeNull();
    const point = spring.pivot.children[0] as THREE.Mesh;
    expect(mesh.geometry.attributes.position).toBe(pos);
    expect(point.geometry.attributes.position!.count).toBeLessThan(pos.count);
    expect(point.userData.forceOutline).toBe(true);
    // The band at the cut is in both meshes, so nothing is lost.
    expect(mesh.geometry.index!.count + point.geometry.index!.count).toBeGreaterThanOrEqual(before);
    expect(spring.pivot.position.y).toBeCloseTo(2.55, 5);
  });

  it('lags a head turn within its limit, and holds still under reduced motion', () => {
    const { mesh, prims, group } = head();
    const spring = splitCrown(prims, group, mesh, new THREE.Vector3())!;
    let peak = 0;
    for (let i = 0; i < 60; i++) {
      // A quick half turn over the first 20 frames.
      group.rotation.y = Math.min(1, i / 20) * Math.PI * 0.5;
      group.updateMatrixWorld(true);
      spring.update(1 / 60, false);
      peak = Math.max(peak, Math.abs(spring.pivot.rotation.z), Math.abs(spring.pivot.rotation.x));
    }
    expect(peak).toBeGreaterThan(0.01);
    expect(peak).toBeLessThanOrEqual(CROWN_SPRING.maxLag * 1.4 + 1e-9);
    spring.update(1 / 60, true);
    expect(spring.pivot.rotation.z).toBe(0);
    expect(spring.pivot.rotation.x).toBe(0);
  });

  it('leaves a head without a crown alone', () => {
    const { mesh, group } = head();
    expect(splitCrown([], group, mesh, new THREE.Vector3())).toBeNull();
  });
});
