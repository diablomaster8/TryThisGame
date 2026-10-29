import type { Material } from 'three';
import { FogField } from '../render/paint/dungeon-fog';
import { lootShown } from '../sim/dungeon-sight';
import type { Floor } from '../sim/dungeon';
import type { DungeonRun } from '../sim/types';
import type { HollowFrame, HollowModule } from './hollow-ctx';

/**
 * The Full 3D Hollow's fog of war (R0153): one `FogField` for the page, which every cave
 * material is patched with when it is made (so the warm-up samples link the fogged
 * programs), sized per floor in `build` and refilled from the explored mask in `update`.
 * Runs first among the modules so the others read this frame's fog.
 */
export const HOLLOW_FOG = new FogField();

/** Patch a cave material for the fog; returns it, so a constructor can wrap the `new`. */
export const fogged = <M extends Material>(m: M): M => HOLLOW_FOG.patch(m);

export class HollowFog implements HollowModule {
  private floor: Floor | null = null;

  build(floor: Floor): void {
    this.floor = floor;
    HOLLOW_FOG.setFloor(floor);
  }

  dispose(): void {
    this.floor = null;
    HOLLOW_FOG.setFloor(null);
  }

  update(_t: number, keeper: { x: number; z: number }, fr: HollowFrame): void {
    HOLLOW_FOG.update(fr.on ? fr.run : null, keeper);
  }

  /** Whether a find on this cell may draw or be tapped (it has been seen). */
  seen(run: DungeonRun | null, cell: { x: number; y: number }): boolean {
    return !run || !this.floor || lootShown(run, this.floor, cell);
  }
}
