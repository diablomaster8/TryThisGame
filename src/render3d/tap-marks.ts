/**
 * The Full 3D tap-to-move preview (MOVE-44, WORLD-41): soft footprints along the planned
 * path (one instanced disc mesh, squashed and turned to the walk), a ring on the ground at
 * the target, and a "?" puff (the emote ball's own sprite material) when the tap can't be
 * reached, all at the height of what is there (`render/tap-path.ts` places them, for Pixel
 * too). Up to three draw calls while shown, none otherwise.
 */
import * as THREE from 'three';
import { TAP_PRINTS } from '../config/tuning-r9d2';
import type { World } from '../sim/types';
import { TapPath } from '../render/tap-path';

export class TapMarks3D {
  private readonly path = new TapPath();
  private readonly dots: THREE.InstancedMesh;
  private readonly ring: THREE.Mesh;
  private readonly dotMat: THREE.MeshBasicMaterial;
  private readonly ringMat: THREE.MeshBasicMaterial;
  private readonly m = new THREE.Matrix4();
  private readonly q = new THREE.Quaternion();
  private readonly v = new THREE.Vector3();
  private readonly s = new THREE.Vector3(TAP_PRINTS.w, 1, TAP_PRINTS.l);
  private readonly up = new THREE.Vector3(0, 1, 0);
  private puff: THREE.Sprite | null = null;

  /** `puffMat` gives the emote "?" sprite material (shared, never changed here). */
  constructor(
    private readonly group: THREE.Object3D,
    private readonly puffMat: () => THREE.SpriteMaterial | undefined,
  ) {
    const flat = (g: THREE.BufferGeometry) => g.rotateX(-Math.PI / 2);
    this.dotMat = new THREE.MeshBasicMaterial({
      color: '#fff6dc',
      transparent: true,
      depthWrite: false,
    });
    this.ringMat = this.dotMat.clone();
    this.dots = new THREE.InstancedMesh(
      flat(new THREE.CircleGeometry(0.5, 10)),
      this.dotMat,
      TAP_PRINTS.max,
    );
    this.ring = new THREE.Mesh(flat(new THREE.RingGeometry(0.22, 0.32, 24)), this.ringMat);
    for (const o of [this.dots, this.ring]) {
      o.visible = false;
      o.frustumCulled = false;
      o.renderOrder = 2;
      o.name = 'tap-marks';
      group.add(o);
    }
  }

  update(world: World, nowMs: number, calm: boolean): void {
    if (!this.path.update(world, nowMs)) {
      this.dots.visible = this.ring.visible = false;
      if (this.puff) this.puff.visible = false;
      return;
    }
    const da = this.path.dotAlpha(nowMs, calm);
    this.dots.visible = da > 0 && this.path.dots.length > 0;
    if (this.dots.visible) {
      this.dotMat.opacity = 0.6 * da;
      const dots = this.path.dots;
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i]!;
        this.q.setFromAxisAngle(this.up, d.yaw);
        this.v.set(d.x, d.y + 0.03, d.z);
        this.dots.setMatrixAt(i, this.m.compose(this.v, this.q, this.s));
      }
      this.dots.count = dots.length;
      this.dots.instanceMatrix.needsUpdate = true;
    }
    const ma = this.path.markAlpha(nowMs, calm);
    const mk = this.path.mark;
    this.ring.visible = ma > 0 && !!mk;
    if (mk && this.ring.visible) {
      this.ringMat.opacity = 0.8 * ma;
      this.ring.position.set(mk.x, mk.y + 0.03, mk.z);
    }
    this.updatePuff(nowMs, calm);
  }

  /** WORLD-41: the "?" puff grows, rises and shrinks away (alpha-tested, so by size only). */
  private updatePuff(nowMs: number, calm: boolean): void {
    const life = this.path.puffLife(nowMs, calm);
    const u = this.path.unreached;
    if (life === null || !u) {
      if (this.puff) this.puff.visible = false;
      return;
    }
    if (!this.puff) {
      const mat = this.puffMat();
      if (!mat) return;
      this.puff = new THREE.Sprite(mat);
      this.puff.name = 'tap-puff';
      this.puff.renderOrder = 3;
      this.group.add(this.puff);
    }
    const grow = calm ? 1 : Math.min(1, 0.4 + life * 3) * (life > 0.75 ? (1 - life) * 4 : 1);
    this.puff.scale.setScalar(Math.max(0.01, TAP_PRINTS.puffSize * grow));
    this.puff.position.set(u.x, u.y + TAP_PRINTS.puffY + TAP_PRINTS.puffRise * life, u.z);
    this.puff.visible = true;
  }
}
