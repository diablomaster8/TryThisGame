import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { Bursts, CALM } from '../../src/render3d/bursts';

type Item = { p: THREE.Vector3; v: THREE.Vector3; life: number };
const items = (b: Bursts) => (b as unknown as { list: Item[] }).list;
const o = { spread: 1.4, speed: 0.6, rise: -0.2, lifeMs: 4000 };

describe('3D bursts under reduced motion', () => {
  it('fly as before with motion on', () => {
    const b = new Bursts(new THREE.Group());
    b.burst('leaf', new THREE.Vector3(0, 3, 0), 10, o, 0);
    expect(items(b)).toHaveLength(10);
    const before = items(b).map((q) => q.p.clone());
    b.update(100, 0.1, () => 0);
    expect(items(b).some((q, i) => q.p.distanceTo(before[i]!) > 1e-4)).toBe(true);
  });

  it('become a few still, short glints when calm', () => {
    const b = new Bursts(new THREE.Group());
    b.calm = true;
    b.burst('sparkle', new THREE.Vector3(0, 1, 0), 40, o, 0);
    b.burst('leaf', new THREE.Vector3(0, 3, 0), 10, o, 0);
    expect(items(b)).toHaveLength(CALM.count * 2);
    for (const q of items(b)) expect(q.life).toBeLessThanOrEqual(CALM.lifeMs);
    const before = items(b).map((q) => q.p.clone());
    b.update(200, 0.2, () => 0);
    items(b).forEach((q, i) => expect(q.p.distanceTo(before[i]!)).toBeLessThan(1e-9));
  });
});
