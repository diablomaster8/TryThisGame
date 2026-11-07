import type { SceneStage } from '../config/story';
import type { Daylight } from './daylight';
import type { PixelDressCtx, PixelDressing } from './dressings';
import { StageTracker } from './stage-actors';
import { POSE_CUES, PoseDirector } from './stage-pose';
import type { World } from '../sim/types';

/**
 * Campaign graphics 4, package a1, pixel: works out the stage cues each frame (K1 sit and
 * kneel, K6 heads to the speaker, K7 line gestures, K39 the item-get). The world view and the
 * stage actors (dress-p) read them through `pixelPose` and pick the frame: `sit`, `kneel`,
 * `itemget` and `g-<gesture>` on the Keeper sheets, `sit` on the Nubbin sheets, and the
 * sprite angle turned toward the speaker. Nothing is drawn here.
 */
class PixelA1 implements PixelDressing {
  readonly id = 'a1';
  private ctx: PixelDressCtx | null = null;
  private tracker = new StageTracker();
  private director = new PoseDirector();

  build(ctx: PixelDressCtx): void {
    this.ctx = ctx;
    this.tracker = new StageTracker();
    this.director = new PoseDirector();
  }

  update(world: World, stage: SceneStage, daylight: Daylight, dt: number): void {
    void stage;
    void daylight;
    const ctx = this.ctx;
    if (!ctx) return;
    this.tracker.tick(world, dt);
    this.director.update(world, this.tracker, dt, ctx.reduceMotion());
  }

  dispose(): void {
    POSE_CUES.clear();
    this.ctx = null;
  }
}

export const dressA1: PixelDressing = new PixelA1();
