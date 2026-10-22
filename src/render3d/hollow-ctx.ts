import * as THREE from 'three';
import { DUNGEON } from '../config/tuning';
import type { CaveBand } from '../render/cave-bands';
import type { Floor } from '../sim/dungeon';
import type { DungeonRun } from '../sim/types';
import type { Tex } from '../samples/aaa-kit';

/**
 * What the four Hollow modules (`hollow-rock`, `-light`, `-dress`, `-atmos`) share: the
 * context `Hollow` hands each one, the per-frame values it passes to `update`, and the
 * few helpers more than one of them uses (the cell size, the cached material maker, the
 * cell hash).
 */
export interface HollowCtx {
  /** Where a module adds what it builds (`dispose` takes it all out again). */
  readonly group: THREE.Group;
  readonly tex: Tex;
  readonly sky: { sun: THREE.DirectionalLight; hemi: THREE.HemisphereLight };
  /** The 1-based floor depth: set before `build` by `Hollow.set(f, depth)`, kept by `update`. */
  depth: number;
  /** `bandFor(depth)`, kept in step with `depth`. */
  band: CaveBand;
  /** The scene's reduced-motion flag as of the last `update`. */
  reduceMotion: boolean;
}

/** What `Hollow.update` passes down each frame. */
export interface HollowFrame {
  /** A floor is built and a run is on it. */
  on: boolean;
  run: DungeonRun | null;
  camera: THREE.Vector3 | undefined;
  party: ReadonlyArray<{ x: number; z: number }>;
}

/**
 * The shape of each module: construct once (shared materials from `ctx.tex`), then
 * `build(floor, ctx)` for each floor, `dispose()` before the next, and `update` per frame.
 */
export interface HollowModule {
  build(floor: Floor, ctx: HollowCtx): void;
  dispose(): void;
  update?(t: number, keeper: { x: number; z: number }, fr: HollowFrame): void;
}

/** Take a built object out of the scene and free its geometry. */
export function disposeObjects(objs: THREE.Object3D[]): void {
  for (const c of objs) {
    c.removeFromParent();
    c.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose();
    });
  }
  objs.length = 0;
}

export const CELL = DUNGEON.cell;
export const WALL_H = 2.4;

/**
 * One material per colour and settings for the page's life: every floor reuses them, so a
 * new floor makes no materials and leaves none behind (review 2026-10-21, bug 45).
 */
const MATS = new Map<string, THREE.MeshStandardMaterial>();
export const mat = (color: string, o: THREE.MeshStandardMaterialParameters = {}) => {
  const key = `${color}|${JSON.stringify(o)}`;
  let m = MATS.get(key);
  if (!m) {
    m = new THREE.MeshStandardMaterial({ color, roughness: 0.9, ...o });
    MATS.set(key, m);
  }
  return m;
};

/** A repeatable hash of a cell, 0..1, for placing stones. */
export const cellHash = (x: number, y: number, k = 0): number => {
  const v = Math.sin(x * 12.9898 + y * 78.233 + k * 37.719) * 43758.5453;
  return v - Math.floor(v);
};
