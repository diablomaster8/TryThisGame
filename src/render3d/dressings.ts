import type * as THREE from 'three';
import type { SceneStage } from '../config/story';
import type { Daylight } from '../render/daylight';
import type { Tex } from '../samples/aaa-kit';
import type { World } from '../sim/types';
import type { LampSource } from './lamp-pool';
import { dress3dA } from './dress-a';
import { dress3dB } from './dress-b';
import { dress3dC } from './dress-c';
import { dress3dD } from './dress-d';
import { dress3dE } from './dress-e';
import { dress3dF } from './dress-f';

/**
 * FULL 3D DRESSING REGISTRY (campaign graphics, wave 0). How a package adds story dressing
 * to the 3D Grove without editing grove-3d-scene.ts:
 *
 * - Export a `Dressing3d` from your own `render3d/dress-<pkg>.ts`; it is already listed in
 *   `DRESSINGS_3D` below. Keep tunables in `config/tuning-<pkg>.ts`.
 * - `build(ctx)` runs once, at the end of the scene's constructor. Add Grove dressing to
 *   `ctx.world3d` (hidden off the home Grove) and other places' dressing to `ctx.scene` with
 *   your own visibility. Use instancing and merged meshes; materials from `ctx.tex`. Push
 *   tappables to `ctx.pickables` (set `userData.pick`). A new object's programs compile when
 *   first drawn: call `ctx.compile(obj)` after adding it, so the first frame does not stall.
 * - `update(world, stage, daylight, dt)` runs every frame from the scene's `update`, before
 *   the lamp pool is placed. `stage` is the scene at the head of the story queue (`{}` when
 *   none, or none authored); `daylight` is what the frame is lit with, staged hour included;
 *   `dt` is seconds.
 * - Lights: add no real lights. Glow is emissive under bloom. To borrow a lamp-pool point
 *   light this frame, push a `LampSource` to `ctx.lamps` in `update` (the list is cleared
 *   each frame; the pool gives its few lights to the sources nearest the camera's focus).
 *   Push only when `ctx.lampsOn()` is already true: lighting the pool by day switches every
 *   lit material to the night light set.
 * - Ask story questions with `stageFlags(world, stage)` from render/scene-stage.ts (chapter,
 *   storyline, Dawn & Dusk half, vigil wave, Corvin's pens, location, Grove kind). Find
 *   places with `markAt(location, name)` from config/stage-marks.ts.
 * - Read the world; never write it. Under `ctx.reduceMotion()` nothing flickers, pulses or
 *   bobs: draw the still form. `ctx.time.value` is the shared shader clock (seconds).
 * - `dispose()` (optional) runs if the scene is torn down. `build` runs once per scene.
 */
export interface Dress3dCtx {
  scene: THREE.Scene;
  /** The home Grove's group: shown only while the Keeper is home. */
  world3d: THREE.Group;
  tex: Tex;
  pickables: THREE.Object3D[];
  /** This frame's borrowed lamp-pool sources (see above). */
  lamps: LampSource[];
  /** Whether the lamp pool is lit this frame (dusk, night or a lit campaign lantern). */
  lampsOn: () => boolean;
  reduceMotion: () => boolean;
  time: { value: number };
  /** Link `obj`'s programs for every light set in use, without blocking. */
  compile: (obj: THREE.Object3D) => Promise<unknown>;
}

export interface Dressing3d {
  id: string;
  build(ctx: Dress3dCtx): void;
  update(world: World, stage: SceneStage, daylight: Daylight, dt: number): void;
  dispose?(): void;
}

export const DRESSINGS_3D: readonly Dressing3d[] = [
  dress3dA,
  dress3dB,
  dress3dC,
  dress3dD,
  dress3dE,
  dress3dF,
];

/** Runs the registry for one 3D scene: build once, update per frame, dispose at the end. */
export class Dressings3d {
  private built = false;

  /** Every package's dressing, in a fixed order (a to f). */
  constructor(private readonly list: readonly Dressing3d[] = DRESSINGS_3D) {}

  build(ctx: Dress3dCtx): void {
    if (this.built) return;
    this.built = true;
    for (const d of this.list) d.build(ctx);
  }

  update(world: World, stage: SceneStage, daylight: Daylight, dt: number): void {
    for (const d of this.list) d.update(world, stage, daylight, dt);
  }

  dispose(): void {
    for (const d of this.list) d.dispose?.();
  }
}
