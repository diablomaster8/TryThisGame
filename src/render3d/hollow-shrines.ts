import * as THREE from 'three';
import { SHRINE_TEXT } from '../config/strings-dungeon';
import { cellCentre, type Floor } from '../sim/dungeon';
import { cellTop } from './hollow-dress-path';
import {
  disposeObjects,
  mat,
  type HollowCtx,
  type HollowFrame,
  type HollowModule,
} from './hollow-ctx';
import { plate } from './hollow-plates';

/**
 * Shrines in Full 3D (R0159): a short mossy stone with a glowing orb and its kind's icon on a
 * plate above. Once used, the orb goes dull and the plate shows a ✓, so the change reads by
 * shape as well as light. Shared materials; the plates are small canvas sprites per floor.
 */
export class HollowShrines implements HollowModule {
  private readonly objs: THREE.Object3D[] = [];
  private items: Array<{
    id: string;
    orb: THREE.Mesh;
    icon: THREE.Sprite;
    done: THREE.Sprite;
  }> = [];
  private readonly stone = mat('#8a8578');
  private readonly lit = mat('#ffe9a0', {
    emissive: new THREE.Color('#ffd060'),
    emissiveIntensity: 1.1,
    roughness: 0.5,
  });
  private readonly dull = mat('#6d6a73', { roughness: 0.8 });

  build(f: Floor, ctx: HollowCtx): void {
    const geo = new THREE.CylinderGeometry(0.22, 0.3, 0.7, 8);
    const ball = new THREE.SphereGeometry(0.16, 12, 8);
    for (const s of f.shrines ?? []) {
      const at = cellCentre(f, s.cell);
      const g = new THREE.Group();
      g.name = 'hollow-shrine';
      g.position.set(at.x, cellTop(f, s.cell), at.z);
      const post = new THREE.Mesh(geo, this.stone);
      post.position.y = 0.35;
      post.castShadow = true;
      const orb = new THREE.Mesh(ball, this.lit);
      orb.position.y = 0.86;
      const icon = plate(SHRINE_TEXT.kinds[s.kind]?.icon ?? '✦', '#ffe9a0');
      const done = plate('✓', '#b8f0b8');
      icon.position.y = done.position.y = 1.4;
      done.visible = false;
      g.add(post, orb, icon, done);
      ctx.group.add(g);
      this.objs.push(g);
      this.items.push({ id: s.id, orb, icon, done });
    }
  }

  dispose(): void {
    for (const it of this.items)
      for (const s of [it.icon, it.done]) {
        s.material.map?.dispose();
        s.material.dispose();
      }
    disposeObjects(this.objs);
    this.items = [];
  }

  update(_t: number, _keeper: { x: number; z: number }, fr: HollowFrame): void {
    for (const it of this.items) {
      const used = !!fr.run?.shrinesUsed?.includes(it.id);
      it.orb.material = used ? this.dull : this.lit;
      it.icon.visible = !used;
      it.done.visible = used;
    }
  }
}
