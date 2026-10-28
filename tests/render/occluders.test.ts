import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { Occluders } from '../../src/render3d/occluders';

describe('Occluders (R0018)', () => {
  const cam = new THREE.Vector3(0, 6, 12);
  const behind = [new THREE.Vector3(0, 1, -2), new THREE.Vector3(0, 1.7, -2)];
  const clear = [new THREE.Vector3(10, 1, 3), new THREE.Vector3(10, 1.7, 3)];

  it('hides the Keeper behind a box, and not beside it', () => {
    const o = new Occluders();
    o.add('t', 0, 0, 2, 2, 0, 3, 2);
    expect(o.update(cam, behind, 2, 1, true)).toBe(true);
    expect(o.update(cam, clear, 2, 1, true)).toBe(false);
  });

  it('eases in over 150 ms and out over 300 ms, and snaps under reduced motion', () => {
    const o = new Occluders();
    o.add('t', 0, 0, 2, 2, 0, 3, 2);
    o.update(cam, behind, 2, 0.075, false);
    expect(o.update(cam, behind, 2, 0.075, false)).toBe(true);
    o.update(cam, clear, 2, 0.15, false);
    o.clear('t');
    expect(o.update(cam, behind, 2, 0.1, false)).toBe(false);
  });
});
