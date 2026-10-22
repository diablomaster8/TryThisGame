import type { Group, Object3D, Scene, Texture } from 'three';
import type { SceneStage } from '../config/story';
import type { World } from '../sim/types';
import type { Daylight } from './daylight';
import type { SpriteBatch } from './sprite-batch';
import type { ScreenRect, StageBuildings, Vec2xy } from './stage-api';
import type { SheetCache } from './sprites/sheets';
import { dressA } from './dress-a';
import { dressB } from './dress-b';
import { dressC } from './dress-c';
import { dressD } from './dress-d';
import { dressE } from './dress-e';
import { dressF } from './dress-f';
import { dressP } from './dress-p';
import { dressS } from './dress-s';
import { dressK } from './dress-k';
import { dressW } from './dress-w';
import { dressX } from './dress-x';
import { dressY } from './dress-y';
import { dressU } from './dress-u';

/**
 * PIXEL DRESSING REGISTRY (campaign graphics, wave 0). How a package adds story dressing to
 * the pixel renderer without editing grove-scene.ts:
 *
 * - Export a `PixelDressing` from your own `render/dress-<pkg>.ts`; it is already listed in
 *   `PIXEL_DRESSINGS` below. Keep tunables in `config/tuning-<pkg>.ts`.
 * - `build(ctx)` runs once, when the GroveScene is built. Add meshes to `ctx.groups.*` (each
 *   group shows only at its location: grove, hollow, corvin, dungeon) or to `ctx.scene`.
 *   Push anything tappable to `ctx.pickables` (set `userData.pick`) and anything disposable
 *   through `ctx.track`.
 * - `update(world, stage, daylight, dt)` runs every drawn frame, inside the WorldView's sprite
 *   pass: between `batch.begin` and `batch.end`, so camera-facing sprites drawn into
 *   `ctx.sprites.batch` this frame are part of it (`ctx.sprites` is null in tests). `stage` is
 *   the scene at the head of the story queue (`{}` when none, or none authored); `daylight`
 *   is what the frame is lit with, staged hour included; `dt` is seconds.
 * - Ask story questions with `stageFlags(world, stage)` from render/scene-stage.ts (chapter,
 *   storyline, Dawn & Dusk half, vigil wave, Corvin's pens, location, Grove kind). Find
 *   places with `markAt(location, name)` from config/stage-marks.ts.
 * - Read the world; never write it. Under `ctx.reduceMotion()` nothing flickers, pulses or
 *   bobs: draw the still form.
 * - `dispose()` (optional) runs when the scene is torn down. A dressing is a module-level
 *   object and a new game builds a new scene, so `build` may run again after `dispose`:
 *   keep per-scene state in fields that `build` resets.
 */
export interface PixelDressCtx {
  scene: Scene;
  groups: { grove: Group; hollow: Group; corvin: Group; dungeon: Group };
  /** The scene's painted, animated textures, shared (never dispose them). */
  textures: { water: Texture; glint: Texture; falls: Texture };
  sprites: { readonly batch: SpriteBatch; readonly sheets: SheetCache } | null;
  pickables: Object3D[];
  reduceMotion: () => boolean;
  track: (d: { dispose(): void }) => void;
  /** Second pass (cg2-api.md): the Grove's buildings, to list, hide and thin. */
  buildings: StageBuildings;
  /** The pixel camera: world point to CSS pixels in the view, null before the first frame. */
  camera: { toScreen(x: number, y: number, z: number): Vec2xy | null };
  /** The view's HUD-safe rectangle in CSS pixels (below the top bar, above the dialogue). */
  safeRect: () => ScreenRect;
}

export interface PixelDressing {
  id: string;
  build(ctx: PixelDressCtx): void;
  update(world: World, stage: SceneStage, daylight: Daylight, dt: number): void;
  dispose?(): void;
}

export const PIXEL_DRESSINGS: readonly PixelDressing[] = [
  dressA,
  dressB,
  dressC,
  dressD,
  dressE,
  dressF,
  dressP,
  dressS,
  dressK,
  dressW,
  dressX,
  dressY,
  dressU,
];

/** Runs the registry for one GroveScene: build once, update per frame, dispose at the end. */
export class PixelDressings {
  private built = false;

  /** Every package's dressing, in a fixed order (a to f, then the second pass's p..u). */
  constructor(private readonly list: readonly PixelDressing[] = PIXEL_DRESSINGS) {}

  build(ctx: PixelDressCtx): void {
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
