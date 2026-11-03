import * as THREE from 'three';
import { PUDDLES } from '../config/tuning-r11d6';
import { puddleFill } from '../render/puddles';
import type { World } from '../sim/types';

/**
 * R0137 (WORLD-71): the Grove's rain puddles in Full 3D. One merged mesh of flat discs (one
 * draw call, 3 × 20 triangles) laid just above the meadow, shown only while it rains at home
 * and scaled by how full they are. `heightAt` lifts each to the ground under it.
 */
export class GrovePuddles {
  readonly mesh: THREE.Mesh;

  constructor(parent: THREE.Object3D, heightAt: (x: number, z: number) => number) {
    const parts: THREE.BufferGeometry[] = [];
    for (const p of PUDDLES.spots) {
      const g = new THREE.CircleGeometry(PUDDLES.radius, 20);
      g.rotateX(-Math.PI / 2);
      g.scale(1, 1, 0.75);
      g.translate(p.x, heightAt(p.x, p.z) + 0.04, p.z);
      parts.push(g);
    }
    const geo = new THREE.BufferGeometry();
    const pos: number[] = [];
    const idx: number[] = [];
    let base = 0;
    for (const g of parts) {
      const a = g.attributes.position!;
      for (let i = 0; i < a.count; i++) pos.push(a.getX(i), a.getY(i), a.getZ(i));
      for (const i of g.index!.array) idx.push(base + i);
      base += a.count;
      g.dispose();
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setIndex(idx);
    this.mesh = new THREE.Mesh(
      geo,
      new THREE.MeshBasicMaterial({
        color: '#7fa6cf',
        transparent: true,
        opacity: 0.6,
        depthWrite: false,
      }),
    );
    this.mesh.renderOrder = 2;
    this.mesh.frustumCulled = false;
    this.mesh.visible = false;
    this.mesh.name = 'grove-puddles';
    parent.add(this.mesh);
  }

  update(world: World): void {
    const fill = puddleFill(world);
    this.mesh.visible = fill > 0;
    if (fill > 0) (this.mesh.material as THREE.MeshBasicMaterial).opacity = 0.35 + fill * 0.35;
  }
}
