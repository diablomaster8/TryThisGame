import * as THREE from 'three';
import { elevationAt, type Floor } from '../sim/dungeon';
import {
  disposeObjects,
  mat,
  type HollowCtx,
  type HollowFrame,
  type HollowModule,
} from './hollow-ctx';

/**
 * The Shells a fleeing stray drops (R0162) in Full 3D: one instanced mesh of little gold
 * discs, refreshed each frame from `run.shellTrail`, spinning slowly (still under reduced
 * motion). One draw call however long the trail.
 */
export class HollowTrail implements HollowModule {
  private readonly objs: THREE.Object3D[] = [];
  private mesh: THREE.InstancedMesh | null = null;
  private floor: Floor | null = null;
  private ctx: HollowCtx | null = null;
  private readonly m = new THREE.Matrix4();
  private readonly q = new THREE.Quaternion();
  private readonly e = new THREE.Euler();
  private readonly one = new THREE.Vector3(1, 1, 1);
  private readonly p = new THREE.Vector3();
  private readonly gold = mat('#f3cf6a', {
    emissive: new THREE.Color('#b58a20'),
    emissiveIntensity: 0.5,
    roughness: 0.4,
  });

  build(f: Floor, ctx: HollowCtx): void {
    this.floor = f;
    this.ctx = ctx;
    const im = new THREE.InstancedMesh(
      new THREE.CylinderGeometry(0.13, 0.13, 0.04, 10),
      this.gold,
      MAX,
    );
    im.name = 'hollow-trail';
    im.count = 0;
    im.frustumCulled = false;
    ctx.group.add(im);
    this.mesh = im;
    this.objs.push(im);
  }

  dispose(): void {
    disposeObjects(this.objs);
    this.mesh = null;
    this.floor = null;
  }

  update(t: number, _keeper: { x: number; z: number }, fr: HollowFrame): void {
    const im = this.mesh;
    const f = this.floor;
    if (!im || !f) return;
    const trail = fr.on ? (fr.run?.shellTrail ?? []) : [];
    const n = Math.min(MAX, trail.length);
    const spin = this.ctx?.reduceMotion ? 0 : t * 2;
    for (let i = 0; i < n; i++) {
      const s = trail[i]!;
      this.p.set(s.x, elevationAt(f, s) + 0.18, s.z);
      this.q.setFromEuler(this.e.set(Math.PI / 2.4, spin + i, 0));
      im.setMatrixAt(i, this.m.compose(this.p, this.q, this.one));
    }
    if (n !== im.count || n > 0) {
      im.count = n;
      im.instanceMatrix.needsUpdate = true;
    }
  }
}

/** The most dropped Shells drawn at once (two snatches of five from each of six strays). */
const MAX = 64;
