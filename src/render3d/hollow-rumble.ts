import * as THREE from 'three';
import { RUMBLE_TEXT } from '../config/strings-dungeon';
import { cellCentre, type Floor } from '../sim/dungeon';
import { rumbleOpen } from '../sim/dungeon-rumble';
import { cellTop } from './hollow-dress-path';
import {
  CELL,
  disposeObjects,
  type HollowCtx,
  type HollowFrame,
  type HollowModule,
} from './hollow-ctx';
import { plate } from './hollow-plates';

/**
 * The rumble room's glowing door in Full 3D (R0282): a pulsing warm tile on each doorway cell
 * and a plate over the first, shown until the room is won. The room depends on the run's seed,
 * so the door is built on the first frame that has a run, not in `build`.
 */
export class HollowRumble implements HollowModule {
  private readonly objs: THREE.Object3D[] = [];
  private floor: Floor | null = null;
  private built = false;
  private tiles: THREE.Mesh[] = [];
  private label: THREE.Sprite | null = null;
  private readonly glow = new THREE.MeshBasicMaterial({
    color: '#ffb347',
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  private group: THREE.Group | null = null;

  build(f: Floor, ctx: HollowCtx): void {
    this.floor = f;
    this.group = ctx.group;
    this.built = false;
  }

  private make(f: Floor, run: NonNullable<HollowFrame['run']>): void {
    this.built = true;
    const rr = rumbleOpen(run, f);
    if (!rr || !this.group) return;
    const geo = new THREE.BoxGeometry(CELL * 0.9, 0.04, CELL * 0.9);
    for (const c of rr.door) {
      const at = cellCentre(f, c);
      const tile = new THREE.Mesh(geo, this.glow);
      tile.name = 'hollow-rumble-door';
      tile.position.set(at.x, cellTop(f, c) + 0.04, at.z);
      tile.renderOrder = 2;
      this.group.add(tile);
      this.objs.push(tile);
      this.tiles.push(tile);
    }
    const first = rr.door[0]!;
    const at = cellCentre(f, first);
    this.label = plate(`⚔ ${RUMBLE_TEXT.door}`, '#ffb347');
    this.label.position.set(at.x, cellTop(f, first) + 1.1, at.z);
    this.group.add(this.label);
    this.objs.push(this.label);
  }

  dispose(): void {
    this.label?.material.map?.dispose();
    this.label?.material.dispose();
    disposeObjects(this.objs);
    this.objs.length = 0;
    this.tiles = [];
    this.label = null;
    this.floor = null;
    this.built = false;
  }

  update(t: number, _keeper: { x: number; z: number }, fr: HollowFrame): void {
    const run = fr.run;
    if (!this.built && fr.on && run && this.floor) this.make(this.floor, run);
    if (!this.tiles.length) return;
    const show = fr.on && !!run && !!this.floor && !!rumbleOpen(run, this.floor);
    for (const tile of this.tiles) tile.visible = show;
    if (this.label) this.label.visible = show;
    this.glow.opacity = 0.45 + 0.25 * Math.sin(t * 3);
  }
}
