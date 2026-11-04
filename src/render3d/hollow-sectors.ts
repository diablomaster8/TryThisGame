import type * as THREE from 'three';
import { HOLLOW_PERF } from '../config/tuning-dungeon-tap';
import { FIELD_R10 } from '../config/tuning-r10b2';
import { sectorWindow } from '../render/field-sectors';
import { CELL, type HollowCtx, type HollowModule } from './hollow-ctx';
import type { Floor } from '../sim/dungeon';

/**
 * Sector streaming for a field's scattered props in Full 3D (lane B r10, R0147). The ground
 * and rock draw only the sectors round the Keeper through their draw range
 * (`hollow-rock.ts`); the dress's big instanced scatters (roots and vines, ground decals)
 * are made one mesh per sector column (`sectorGroups`), tagged with
 * `userData.sectorCol`, and this module shows only the columns of the 3×3 window round the
 * Keeper. A crossing only flips `visible`: nothing is built, uploaded or compiled.
 */

/**
 * The sector width (cells) a floor is streamed in, or 0 when it draws whole: a field (R0147),
 * or a big dungeon level (R0194, DUNG-51).
 */
export function sectorSizeOf(f: Floor): number {
  if (!FIELD_R10.stream) return 0;
  if (f.zone === 'field') return FIELD_R10.sector;
  return !f.zone && f.cols * f.rows >= HOLLOW_PERF.minCells ? HOLLOW_PERF.levelSector : 0;
}

/** `list` split by sector column on a field (by each item's world x); one group elsewhere. */
export function sectorGroups<T>(f: Floor, list: T[], x: (t: T) => number): Array<[number, T[]]> {
  const size = sectorSizeOf(f);
  if (!size || list.length === 0) return list.length ? [[-1, list]] : [];
  const n = Math.ceil(f.cols / size);
  const out: T[][] = Array.from({ length: n }, () => []);
  for (const t of list) {
    const cx = Math.floor(x(t) / CELL + f.cols / 2);
    out[Math.min(n - 1, Math.max(0, Math.floor(cx / size)))]!.push(t);
  }
  return out.map((g, i): [number, T[]] => [i, g]).filter(([, g]) => g.length > 0);
}

export class HollowSectors implements HollowModule {
  private meshes: THREE.Object3D[] = [];
  private floor: Floor | null = null;
  private col = -1;

  build(f: Floor, ctx: HollowCtx): void {
    this.floor = sectorSizeOf(f) ? f : null;
    this.col = -1;
    this.meshes = this.floor
      ? ctx.group.children.filter((o) => typeof o.userData.sectorCol === 'number')
      : [];
  }

  dispose(): void {
    this.meshes = [];
    this.floor = null;
  }

  update(_t: number, keeper: { x: number; z: number }): void {
    const f = this.floor;
    if (!f || this.meshes.length === 0) return;
    const size = sectorSizeOf(f);
    const cx = Math.floor(keeper.x / CELL + f.cols / 2);
    const col = Math.floor(cx / size);
    if (col === this.col) return;
    this.col = col;
    const w = sectorWindow(f.cols, f.rows, size, cx, 0);
    for (const m of this.meshes) {
      const c = m.userData.sectorCol as number;
      m.visible = c >= w.sx0 && c <= w.sx1;
    }
  }
}
