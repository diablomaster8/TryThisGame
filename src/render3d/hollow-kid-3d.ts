import * as THREE from 'three';
import { cellCentre, isExplored, type Floor } from '../sim/dungeon';
import { berryId, hasBerries, kidBerryCells } from '../sim/dungeon-kid-play';
import { mat, type HollowCtx, type HollowFrame, type HollowModule } from './hollow-ctx';
import { cellTop } from './hollow-dress-path';

/**
 * Kid mode's counting berries in Full 3D (R0188, lane B r10): a little red berry with a leaf
 * on each of the level's five berry cells (`sim/dungeon-kid-play.ts`), shown once its cell is
 * explored and gone once picked. Shared geometry and the Hollow's shared standard materials,
 * so a kid floor compiles no new program; ten small meshes, and only on kid runs.
 */
const BERRY = new THREE.SphereGeometry(0.17, 10, 8);
const LEAF = new THREE.ConeGeometry(0.07, 0.14, 5);

export class HollowKid3D implements HollowModule {
  private readonly items: Array<{ g: THREE.Group; i: number; x: number; y: number }> = [];
  private ctx: HollowCtx | null = null;
  private floor: Floor | null = null;

  build(f: Floor, ctx: HollowCtx): void {
    this.ctx = ctx;
    this.floor = f;
    const red = mat('#d0384f', { roughness: 0.45 });
    const green = mat('#4f9a3c');
    kidBerryCells(f).forEach((c, i) => {
      const at = cellCentre(f, c);
      const g = new THREE.Group();
      g.name = 'kid-berry';
      g.position.set(at.x, cellTop(f, c) + 0.17, at.z);
      const b = new THREE.Mesh(BERRY, red);
      b.castShadow = true;
      const l = new THREE.Mesh(LEAF, green);
      l.position.y = 0.17;
      g.add(b, l);
      g.visible = false;
      ctx.group.add(g);
      this.items.push({ g, i, x: c.x, y: c.y });
    });
  }

  dispose(): void {
    // The shapes are shared for the page's life; only the groups go.
    for (const it of this.items) it.g.removeFromParent();
    this.items.length = 0;
    this.floor = null;
  }

  update(t: number, _keeper: { x: number; z: number }, fr: HollowFrame): void {
    const run = fr.run;
    const on = fr.on && !!run && hasBerries(run) && !!this.floor;
    const bob = this.ctx?.reduceMotion ? 0 : Math.sin(t * 2.2) * 0.04;
    for (const it of this.items) {
      it.g.visible =
        on && !run!.taken.includes(berryId(it.i)) && isExplored(run!, this.floor!, it.x, it.y);
      if (it.g.visible) it.g.children[0]!.position.y = bob;
    }
  }
}
