import * as THREE from 'three';
import { cellCentre, type Floor } from '../sim/dungeon';
import { CaveLamps } from './cave-lamps';
import {
  disposeObjects,
  mat,
  type HollowCtx,
  type HollowFrame,
  type HollowModule,
} from './hollow-ctx';

/**
 * The Hollow's light: the torch posts and flames, the glowing crystals, and the four point
 * lights (`CaveLamps`, `cave-lamps.ts`) that follow the Keeper and the torches nearest it.
 */
export class HollowLight implements HollowModule {
  /** The four point lights; the scene sets their colour and motion. */
  readonly lamps: CaveLamps;
  private readonly objs: THREE.Object3D[] = [];
  private torchAt: THREE.Vector3[] = [];
  private flames: THREE.Mesh[] = [];

  constructor(parent: THREE.Object3D) {
    this.lamps = new CaveLamps(parent);
  }

  build(f: Floor, ctx: HollowCtx): void {
    // Torches: a post, a flame that glows; the lamps follow the nearest four.
    const flame = mat('#ffd080', { emissive: '#ff9a30', emissiveIntensity: 3 });
    for (const t of f.torches) {
      const p = cellCentre(f, t);
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 1.1, 6), mat('#5a3a22'));
      post.position.set(p.x, 0.55, p.z);
      const fire = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.3, 8), flame);
      fire.position.set(p.x, 1.25, p.z);
      this.flames.push(fire);
      ctx.group.add(post, fire);
      this.objs.push(post, fire);
      this.torchAt.push(new THREE.Vector3(p.x, 1.4, p.z));
    }
    const crystal = mat('#9ae8ff', { emissive: '#4ac8ff', emissiveIntensity: 1.4, roughness: 0.2 });
    for (const c of f.crystals) {
      const p = cellCentre(f, c);
      for (let i = 0; i < 3; i++) {
        const k = new THREE.Mesh(new THREE.OctahedronGeometry(0.16 + i * 0.05), crystal);
        k.scale.y = 2;
        k.position.set(
          p.x + Math.cos(i * 2.1) * 0.2,
          0.3 + i * 0.05,
          p.z + Math.sin(i * 2.1) * 0.2,
        );
        k.rotation.z = (i - 1) * 0.3;
        ctx.group.add(k);
        this.objs.push(k);
      }
    }
  }

  dispose(): void {
    disposeObjects(this.objs);
    this.torchAt = [];
    this.flames = [];
  }

  update(t: number, keeper: { x: number; z: number }, fr: HollowFrame): void {
    this.lamps.update(fr.on, keeper, this.torchAt, t);
    if (!fr.on || !fr.run) return;
    this.flames.forEach((fl, i) => {
      const k = 1 + Math.sin(t * 11 + i * 1.7) * 0.08 + Math.sin(t * 23 + i) * 0.05;
      fl.scale.set(2 - k, k, 2 - k);
    });
  }
}
