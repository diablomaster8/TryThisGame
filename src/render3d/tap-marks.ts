/**
 * The Full 3D tap-to-move preview (MOVE-44, WORLD-41): soft footprints along the planned
 * path (one instanced disc mesh, squashed and turned to the walk), a ring on the ground at
 * the target, and a "?" puff (the emote ball's own sprite material) when the tap can't be
 * reached, all at the height of what is there (`render/tap-path.ts` places them, for Pixel
 * too). Up to three draw calls while shown, none otherwise (one more while an R0035 ✕ / ⤒
 * flag shows).
 */
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { TAP_FLAG } from '../config/tuning-move-r10';
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
  /** R0035 (lane A r10): a grey ✕ flat where a refused tap landed; a ⤒ over a jump-only ledge. */
  private readonly cross: THREE.Mesh;
  private readonly arrow: THREE.Mesh;
  private readonly crossMat: THREE.MeshBasicMaterial;
  private readonly arrowMat: THREE.MeshBasicMaterial;
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
    const sz = TAP_FLAG.size;
    const bar = (a: number) => new THREE.PlaneGeometry(sz, sz * 0.18).rotateZ(a);
    this.crossMat = this.dotMat.clone();
    this.crossMat.color.set('#b3a9bd');
    this.cross = new THREE.Mesh(
      flat(mergeGeometries([bar(Math.PI / 4), bar(-Math.PI / 4)], false)!),
      this.crossMat,
    );
    const up = new THREE.Shape();
    const h = sz / 2;
    up.moveTo(-h * 0.2, -h);
    up.lineTo(h * 0.2, -h);
    up.lineTo(h * 0.2, h * 0.1);
    up.lineTo(h * 0.6, h * 0.1);
    up.lineTo(0, h * 0.65);
    up.lineTo(-h * 0.6, h * 0.1);
    up.lineTo(-h * 0.2, h * 0.1);
    up.closePath();
    const cap = new THREE.PlaneGeometry(sz * 0.8, sz * 0.14).translate(0, h * 0.86, 0);
    this.arrowMat = this.dotMat.clone();
    this.arrowMat.color.set('#ffd23f');
    this.arrow = new THREE.Mesh(
      mergeGeometries([new THREE.ShapeGeometry(up), cap], false)!,
      this.arrowMat,
    );
    // It turns to face whichever camera draws it (no camera is handed in here), so its front
    // side is always the one seen and the shared material needs no double-sided variant.
    this.arrow.onBeforeRender = (_r, _s, cam) => {
      this.arrow.quaternion.copy(cam.quaternion);
      this.arrow.updateMatrixWorld();
    };
    for (const o of [this.cross, this.arrow]) {
      o.visible = false;
      o.frustumCulled = false;
      o.renderOrder = 2;
      o.name = 'tap-marks';
      group.add(o);
    }
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
      this.dots.visible = this.ring.visible = this.cross.visible = this.arrow.visible = false;
      if (this.puff) this.puff.visible = false;
      return;
    }
    // R0035: the refused / jump-only flag.
    const fl = this.path.flag;
    const fa = this.path.flagAlpha(nowMs, calm);
    const up = !!fl && fa > 0 && fl.kind === 'jump';
    this.cross.visible = !!fl && fa > 0 && !up;
    this.arrow.visible = up;
    if (fl && this.cross.visible) {
      this.crossMat.opacity = 0.9 * fa;
      this.cross.position.set(fl.x, fl.y + 0.04, fl.z);
    }
    if (fl && up) {
      this.arrowMat.opacity = fa;
      const bob = calm ? 0 : Math.sin((nowMs / TAP_FLAG.bobMs) * Math.PI * 2) * TAP_FLAG.bob;
      this.arrow.position.set(fl.x, fl.y + TAP_FLAG.lift + TAP_FLAG.size / 2 + bob, fl.z);
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
