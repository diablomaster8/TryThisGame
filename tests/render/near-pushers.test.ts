import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { NearestPushers } from '../../src/render3d/near-pushers';

describe('grass pushers nearest the camera', () => {
  it('keeps the nearest few, nearest first, as the sort did', () => {
    const slots = Array.from({ length: 3 }, () => new THREE.Vector4(9, 9, 9, 9));
    const near = new NearestPushers(slots);
    const pts = [
      [5, 0, 1],
      [1, 0, 2],
      [0, 3, 3],
      [-2, 0, 4],
      [10, 10, 5],
      [0.5, 0.5, 6],
    ] as const;
    near.begin(0, 0);
    for (const [x, z, r] of pts) near.offer(x, z, r);
    near.end();
    const want = [...pts]
      .sort((a, b) => Math.hypot(a[0], a[1]) - Math.hypot(b[0], b[1]))
      .slice(0, 3)
      .map(([x, z, r]) => [x, z, r, 0]);
    expect(slots.map((s) => s.toArray())).toEqual(want);
  });

  it('clears the slots it does not fill', () => {
    const slots = Array.from({ length: 3 }, () => new THREE.Vector4(9, 9, 9, 9));
    const near = new NearestPushers(slots);
    near.begin(0, 0);
    near.offer(1, 1, 1);
    near.end();
    expect(slots.map((s) => s.toArray())).toEqual([
      [1, 1, 1, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
  });
});
