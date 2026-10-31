/**
 * The Full 3D tap-to-move preview (MOVE-44): fading footprint dots along the planned path
 * (one instanced disc mesh) and a ring on the ground at the target, at the height of what
 * is there (`render/tap-path.ts` places both, for Pixel too). Two draw calls while shown,
 * none otherwise (three while an R0035 ✕ / ⤒ flag shows).
 */
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { TAP_PATH } from '../config/tuning-move';
import { TAP_FLAG } from '../config/tuning-move-r10';
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

  constructor(group: THREE.Object3D) {
    const flat = (g: THREE.BufferGeometry) => g.rotateX(-Math.PI / 2);
    this.dotMat = new THREE.MeshBasicMaterial({
      color: '#fff6dc',
      transparent: true,
      depthWrite: false,
    });
    this.ringMat = this.dotMat.clone();
    this.dots = new THREE.InstancedMesh(
      flat(new THREE.CircleGeometry(0.12, 10)),
      this.dotMat,
      TAP_PATH.dots,
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
      this.dotMat.opacity = 0.7 * da;
      this.path.dots.forEach((d, i) => {
        this.dots.setMatrixAt(i, this.m.makeTranslation(d.x, d.y + 0.03, d.z));
      });
      this.dots.count = this.path.dots.length;
      this.dots.instanceMatrix.needsUpdate = true;
    }
    const ma = this.path.markAlpha(nowMs, calm);
    const mk = this.path.mark;
    this.ring.visible = ma > 0 && !!mk;
    if (mk && this.ring.visible) {
      this.ringMat.opacity = 0.8 * ma;
      this.ring.position.set(mk.x, mk.y + 0.03, mk.z);
    }
  }
}
