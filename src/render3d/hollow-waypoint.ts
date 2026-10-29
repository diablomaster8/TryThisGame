import * as THREE from 'three';
import { cellCentre, type Floor } from '../sim/dungeon';
import { waypointCell, waypointHere } from '../sim/dungeon-levels';
import {
  mat,
  disposeObjects,
  type HollowCtx,
  type HollowModule,
  type HollowFrame,
} from './hollow-ctx';
import { cellTop } from './hollow-dress-path';

/**
 * The waypoint stone in Full 3D (R0148, DUNG-08): a ring of mossy stones around a glowing
 * green disc, on the cell `waypointCell` picks, shown only on levels that have one. The disc
 * breathes slowly (held still under reduced motion). Shared standard materials, so a floor
 * with a stone compiles no new program.
 */
export class HollowWaypoint implements HollowModule {
  private readonly objs: THREE.Object3D[] = [];
  private root: THREE.Group | null = null;
  private ctx: HollowCtx | null = null;
  private readonly glow = mat('#7fe08a', {
    emissive: new THREE.Color('#5fd06a'),
    emissiveIntensity: 0.9,
    roughness: 0.6,
  });

  build(f: Floor, ctx: HollowCtx): void {
    this.ctx = ctx;
    const c = waypointCell(f);
    const at = cellCentre(f, c);
    const y = cellTop(f, c);
    const g = new THREE.Group();
    g.name = 'hollow-waypoint';
    g.position.set(at.x, y, at.z);
    const moss = mat('#5f7a4a');
    const stone = mat('#8a8578');
    const rock = new THREE.DodecahedronGeometry(0.16, 0);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const m = new THREE.Mesh(rock, i % 2 ? moss : stone);
      m.position.set(Math.cos(a) * 0.62, 0.08, Math.sin(a) * 0.62);
      m.rotation.set(a, a * 1.7, 0);
      m.castShadow = true;
      g.add(m);
    }
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.5, 0.05, 20), this.glow);
    disc.position.y = 0.03;
    disc.receiveShadow = true;
    g.add(disc);
    g.visible = false;
    ctx.group.add(g);
    this.root = g;
    this.objs.push(g);
  }

  dispose(): void {
    disposeObjects(this.objs);
    this.root = null;
  }

  update(t: number, _keeper: { x: number; z: number }, fr: HollowFrame): void {
    if (!this.root) return;
    this.root.visible = fr.on && !!fr.run && waypointHere(fr.run) !== null;
    if (!this.root.visible) return;
    // A slow breath of light; the material is shared, so only this stone uses it.
    this.glow.emissiveIntensity = this.ctx?.reduceMotion ? 0.9 : 0.75 + 0.25 * Math.sin(t * 1.6);
  }
}
