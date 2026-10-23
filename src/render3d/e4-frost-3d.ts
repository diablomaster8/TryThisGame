import * as THREE from 'three';
import { markAt } from '../config/stage-marks';
import { CG2_X } from '../config/tuning';
import { CG4_E4 } from '../config/tuning-e4';
import { FROST_PX, paintFrostDecal } from '../render/paint/frost-w';
import type { Dress3dCtx } from './dressings';
import { FrostDecals } from './frost-fx';
import { groveHeight } from './terrain';

/**
 * K45 in Full 3D: frost blooming over the lychgate while Corvin stands outside it. It
 * reuses package w's frost (`frost-fx.ts`): the same ragged decal painter, and `FrostDecals`
 * itself lays the ground frost round each post's foot. Up the posts the decal is stretched
 * into a frost card on each of their four faces, growing from the ground to the height in
 * `CG4_E4.frost` over the scene's first seconds (all eight cards are one instanced draw).
 * Reduced motion shows it fully grown.
 */
export class GateFrost3d {
  private readonly mesh: THREE.InstancedMesh;
  private readonly tex: THREE.CanvasTexture;
  private readonly decals: FrostDecals;
  private readonly posts: Array<{ id: string; x: number; z: number }>;
  private readonly m4 = new THREE.Matrix4();
  private readonly q = new THREE.Quaternion();
  private readonly pos = new THREE.Vector3();
  private readonly scl = new THREE.Vector3();
  private readonly axis = new THREE.Vector3(0, 1, 0);
  private readonly y0: number;

  constructor(ctx: Dress3dCtx) {
    const mark = markAt('grove', 'gate') ?? { x: 0, z: 23, yaw: Math.PI };
    const G = CG2_X.gate;
    this.posts = [-1, 1].map((s, i) => ({
      id: `gate-post-${i}`,
      x: mark.x + s * G.half,
      z: mark.z,
    }));
    this.y0 = groveHeight(mark.x, mark.z);
    this.decals = new FrostDecals(ctx.world3d, this.posts);
    this.tex = new THREE.CanvasTexture(paintFrostDecal().toCanvas());
    this.tex.colorSpace = THREE.SRGBColorSpace;
    const mat = new THREE.MeshBasicMaterial({
      map: this.tex,
      transparent: true,
      opacity: CG4_E4.frost.opacity,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -3,
      polygonOffsetUnits: -3,
      toneMapped: false,
    });
    // The decal is grey; lift it to the pale frost colour.
    mat.color.set(CG4_E4.frost.color).multiplyScalar(1.9);
    this.mesh = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), mat, 8);
    this.mesh.count = 0;
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 2;
    this.mesh.name = 'e4-gate-frost';
    ctx.world3d.add(this.mesh);
    void ctx.compile(this.mesh);
    void FROST_PX;
  }

  /** `k` is the growth 0..1 (0 hides it). */
  update(k: number): void {
    const grown = new Map<string, number>();
    if (k <= 0.01) {
      this.mesh.visible = false;
      this.decals.set(grown);
      return;
    }
    const G = CG2_X.gate;
    const e = 1 - (1 - k) * (1 - k);
    const h = CG4_E4.frost.height * e;
    const faces: Array<[number, number]> = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ];
    let n = 0;
    for (const p of this.posts) {
      grown.set(p.id, k);
      for (const [fx, fz] of faces) {
        this.q.setFromAxisAngle(this.axis, Math.atan2(fx, fz));
        this.pos.set(
          p.x + fx * (G.post / 2 + 0.012),
          this.y0 + h / 2 + 0.05,
          p.z + fz * (G.post / 2 + 0.012),
        );
        this.scl.set(G.post * 1.8, Math.max(0.05, h), 1);
        this.m4.compose(this.pos, this.q, this.scl);
        this.mesh.setMatrixAt(n++, this.m4);
      }
    }
    this.mesh.count = n;
    this.mesh.instanceMatrix.needsUpdate = true;
    this.mesh.visible = true;
    this.decals.set(grown);
  }

  dispose(): void {
    this.mesh.removeFromParent();
    this.mesh.geometry.dispose();
    (this.mesh.material as THREE.Material).dispose();
    this.tex.dispose();
    this.decals.dispose();
  }
}
