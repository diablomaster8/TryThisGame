import * as THREE from 'three';
import { TRAP_TEXT } from '../config/strings-dungeon';
import { cellCentre, type Floor } from '../sim/dungeon';
import { trapArmed } from '../sim/dungeon-traps';
import { cellTop } from './hollow-dress-path';
import {
  CELL,
  disposeObjects,
  mat,
  type HollowCtx,
  type HollowFrame,
  type HollowModule,
} from './hollow-ctx';
import { plate } from './hollow-plates';

/**
 * Trap tells in Full 3D (R0161): each trap is a slightly raised pale tile you can see coming.
 * Once a scout has spotted it, its icon floats over it; once sprung, the tile sits flush until
 * it re-arms. The Learning Grove has no traps, so the floor builds none there.
 */
export class HollowTraps implements HollowModule {
  private readonly objs: THREE.Object3D[] = [];
  private items: Array<{ id: string; tile: THREE.Mesh; icon: THREE.Sprite; base: number }> = [];
  private readonly tileMat = mat('#b9b0a0', { roughness: 0.85 });

  build(f: Floor, ctx: HollowCtx): void {
    const geo = new THREE.BoxGeometry(CELL * 0.8, 0.1, CELL * 0.8);
    for (const t of f.traps ?? []) {
      const at = cellCentre(f, t.cell);
      const base = cellTop(f, t.cell);
      const tile = new THREE.Mesh(geo, this.tileMat);
      tile.name = 'hollow-trap';
      tile.position.set(at.x, base + RAISE, at.z);
      tile.receiveShadow = true;
      const icon = plate(TRAP_TEXT.icon[t.kind] ?? '!', '#ffe14d');
      icon.position.set(at.x, base + 0.7, at.z);
      icon.visible = false;
      ctx.group.add(tile, icon);
      this.objs.push(tile, icon);
      this.items.push({ id: t.id, tile, icon, base });
    }
  }

  dispose(): void {
    for (const it of this.items) {
      it.icon.material.map?.dispose();
      it.icon.material.dispose();
    }
    disposeObjects(this.objs);
    this.items = [];
  }

  update(_t: number, _keeper: { x: number; z: number }, fr: HollowFrame): void {
    const run = fr.run;
    const off = !fr.on || !run || !!run.noTraps;
    for (const it of this.items) {
      it.tile.visible = !off;
      it.icon.visible = !off && !!run!.trapsSpotted?.includes(it.id);
      if (!off) it.tile.position.y = it.base + (trapArmed(run!, it.id) ? RAISE : -0.03);
    }
  }
}

/** How far an armed trap's tile stands proud of the floor. */
const RAISE = 0.05;
