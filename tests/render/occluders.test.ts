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

describe('Occluders: rim and the story houses (R0018, round 10)', () => {
  it('gives each part of the silhouette a swollen rim drawn first, with no new kind of material', () => {
    const o = new Occluders();
    const rig = new THREE.Group();
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.3), new THREE.MeshStandardMaterial());
    body.position.y = 0.6;
    rig.add(body);
    o.ghost(true, rig);
    const twins = body.children as THREE.Mesh[];
    expect(twins.length).toBe(2);
    const [rim, fill] = twins as [THREE.Mesh, THREE.Mesh];
    expect(rim.renderOrder).toBeLessThan(fill.renderOrder);
    const rm = rim.material as THREE.MeshBasicMaterial;
    const fm = fill.material as THREE.MeshBasicMaterial;
    expect(rm.type).toBe(fm.type);
    expect(rm.depthFunc).toBe(THREE.GreaterDepth);
    expect(rm.transparent).toBe(fm.transparent);
    // About a pixel's worth past the part on every side.
    const s = new THREE.Vector3().setFromMatrixScale(rim.matrix).x;
    expect(s * 0.3 - 0.3).toBeGreaterThan(0.02);
    expect(s * 0.3 - 0.3).toBeLessThan(0.06);
    o.ghost(false, rig);
    expect(rm.visible).toBe(false);
    o.ghost(true, rig);
    expect(body.children.length).toBe(2); // twins are made once
  });

  it('hides a Keeper a unit behind each building from every camera yaw', () => {
    // Stall, shed, barn, a placed nursery and workshop, Corvin's house, the guard house
    // and a visit house, as their builders register them: [hx, hz, top, roof].
    const boxes: Array<[string, number, number, number, number]> = [
      ['stall', 1.3, 0.8, 2.4, 1.7],
      ['shed', 1.1, 0.9, 2.4, 1.4],
      ['barn', 2.1, 1.6, 4, 2.2],
      ['nursery', 2.75, 2.09, 3.57, 1.98],
      ['workshop', 3.45, 2.58, 4.55, 2.61],
      ['corvin', 3.85, 2.65, 4.22, 2.4],
      ['cabin', 2.25, 1.85, 4.18, 2.3],
      ['visit', 3.55, 2.65, 4.69, 2.7],
    ];
    const miss: string[] = [];
    for (const [id, hx, hz, top, roof] of boxes) {
      const o = new Occluders();
      o.add(id, 0, 0, hx, hz, -0.2, top, roof);
      for (let k = 0; k < 8; k++) {
        const yaw = (k / 8) * Math.PI * 2;
        // The default orbit: 12 u out at about 35 degrees down.
        const cam = new THREE.Vector3(
          Math.sin(yaw) * 12 * Math.cos(0.61),
          12 * Math.sin(0.61),
          Math.cos(yaw) * 12 * Math.cos(0.61),
        );
        // On the far side, a unit past the wall the camera looks across.
        // The box's reach toward the camera, then a unit more.
        const ex = Math.abs(Math.sin(yaw)) * hx + Math.abs(Math.cos(yaw)) * hz;
        const d = ex + 1;
        const kx = -Math.sin(yaw) * d;
        const kz = -Math.cos(yaw) * d;
        const marks = [new THREE.Vector3(kx, 0.8, kz), new THREE.Vector3(kx, 1.5, kz)];
        if (!o.update(cam, marks, 2, 1, true)) miss.push(`${id}@${k}`);
      }
    }
    expect(miss).toEqual([]);
  });

  it('knows which owners have boxes', () => {
    const o = new Occluders();
    expect(o.has('story')).toBe(false);
    o.add('story', 0, 0, 1, 1, 0, 2, 1);
    expect(o.has('story')).toBe(true);
    o.clear('story');
    expect(o.has('story')).toBe(false);
  });
});
