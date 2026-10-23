import { Vector3 } from 'three';
import { storyId, WEATHERED } from '../config/npc-looks';
import type { SceneStage } from '../config/story';
import { CG2_P } from '../config/tuning-p';
import type { World } from '../sim/types';
import type { Daylight } from './daylight';
import type { PixelDressCtx, PixelDressing } from './dressings';
import { terraceY } from './scene-stage';
import { festivalNubbinSpots, festivalScene, StageTracker } from './stage-actors';
import { AtlasBuilder, type SpriteSheet } from './sprites/atlas';
import { CLIPS, frameAt, frameKey } from './sprites/animations';
import { viewAngle } from './sprites/angles';
import { buildCarrySheet } from './sprites/keeper';
import { C } from './sprites/palette';
import { PixelCanvas } from './sprites/pixel-canvas';
import { buildShadowSheet } from './sprites/props';
import type { SpriteBatch } from './sprite-batch';
import { pixelPose } from './stage-pose';

/**
 * Campaign graphics 2, package p, pixel ("people"): the storylines' speakers on the ground
 * (C1, from the stage's cast, render-only), their carry props (N3), the weathered Moss (C6,
 * set for the sheet cache), the speaker chevron (H6) and the festival's extra Nubbins (H9).
 * Story-look sheets (C2) and the Keeper accessories (M1, M13) come from the Keeper sheet
 * itself (render/sprites/keeper.ts), so they need nothing here.
 */

/** H6: the 5 wide, 4 tall chevron, pointing down, on an 8 px cell. */
function buildPipSheet(): SpriteSheet {
  const atlas = new AtlasBuilder(8, 8, 1);
  const pc = new PixelCanvas(8, 8);
  pc.rect(1.5, 2, 5, 1, C.sunLight);
  pc.rect(1.5, 3, 5, 1, C.sunYellow);
  pc.rect(2.5, 4, 3, 1, C.sunYellow);
  pc.rect(3.5, 5, 1, 1, C.orange);
  pc.finish(C.ink, [C.sunLight, C.sunYellow]);
  atlas.add('pip', pc);
  return atlas.build();
}

const cameraYaw = (batch: SpriteBatch): number => {
  const right = (batch as unknown as { right: Vector3 }).right;
  return Math.atan2(-right.z, right.x);
};

class PixelP implements PixelDressing {
  readonly id = 'p';
  private ctx: PixelDressCtx | null = null;
  private tracker = new StageTracker();
  private time = 0;

  build(ctx: PixelDressCtx): void {
    this.ctx = ctx;
    this.tracker = new StageTracker();
    this.time = 0;
  }

  update(world: World, stage: SceneStage, daylight: Daylight, dt: number): void {
    const ctx = this.ctx;
    if (!ctx) return;
    this.time += dt;
    const tracker = this.tracker;
    tracker.tick(world, dt);
    // C6: the sheet cache greys these Nubbins from the next frame on.
    WEATHERED.ids = tracker.weathered(world);
    const sp = ctx.sprites;
    if (!sp) return;
    const batch = sp.batch;
    const yaw = cameraYaw(batch);
    const reduce = ctx.reduceMotion();
    const nowMs = this.time * 1000;
    const dim = Math.max(0.35, 1 - 0.5 * daylight.darkness);
    const here = world.location === 'grove';
    const groundY = (x: number, z: number): number => (here ? terraceY(x, z) : 0);
    // The camera's toward-the-viewer direction on the ground, for overlays.
    const right = (batch as unknown as { right: Vector3 }).right;
    const tx = -right.z;
    const tz = right.x;

    const shadowSheet = sp.sheets.get('p:shadow', buildShadowSheet);
    const shadowRect = shadowSheet.frames.get(frameKey('shadow', 'front', 0));
    const shadow = (x: number, y: number, z: number, r: number): void => {
      if (!shadowRect) return;
      batch.draw({
        sheet: shadowSheet,
        rect: shadowRect,
        flip: false,
        x,
        y,
        z,
        mode: 'flat',
        w: r * 2,
        h: r * 2,
        opacity: 0.35,
      });
    };

    // C1: the storyline speakers the stage puts on the ground.
    const actors = tracker.actors(world);
    for (const a of actors) {
      const sheet = sp.sheets.keeper(storyId(a.who));
      const clip = a.pose === 'walk' ? 'walk' : 'idle';
      // Package a1 (K1, K6, K7): a seat, a gesture or the head turned to the speaker.
      const pose =
        clip === 'walk'
          ? null
          : pixelPose(`stage-${a.who}`, nowMs, (c) => sheet.frames.has(frameKey(c, 'front', 0)));
      const view = viewAngle(pose?.face ?? a.yaw, yaw);
      const rect = sheet.frames.get(
        pose?.clip
          ? frameKey(pose.clip, view.angle, pose.frame)
          : frameKey(clip, view.angle, reduce ? 0 : frameAt(CLIPS[clip], nowMs + a.x * 97)),
      );
      const y = groundY(a.x, a.z) + (pose?.lift ?? 0);
      shadow(a.x, y, a.z, CG2_P.actor.shadow);
      if (!rect) continue;
      batch.draw({
        sheet,
        rect,
        flip: view.flip,
        x: a.x,
        y,
        z: a.z,
        mode: 'billboard',
        tint: dim,
      });
    }

    // N3: what the cast hold in the hand.
    const carriers = tracker.carriers(world, actors);
    if (carriers.length) {
      const sheet = sp.sheets.get('p:carry', buildCarrySheet);
      for (const c of carriers) {
        const rect = sheet.frames.get(`carry-${c.prop}`);
        if (!rect) continue;
        const y = groundY(c.x, c.z);
        batch.draw({
          sheet,
          rect,
          flip: false,
          x: c.x + tx * 0.02,
          y,
          z: c.z + tz * 0.02,
          mode: 'billboard',
          tint: dim,
        });
      }
    }

    // H9: the festival's Nubbins, standing in the gaps of the Keepers' ring.
    if (here && festivalScene(tracker.stage)) {
      const spots = festivalNubbinSpots(
        world.location,
        CG2_P.festival.nubbinRadius,
        CG2_P.festival.nubbinCount,
      );
      const looks: Array<() => SpriteSheet> = [
        () => sp.sheets.species('chao'),
        () => sp.sheets.rival('sun', 'normal'),
        () => sp.sheets.rival('moon', 'normal'),
      ];
      spots.forEach((s, i) => {
        const sheet = looks[i % looks.length]!();
        const view = viewAngle(s.yaw, yaw);
        const rect = sheet.frames.get(
          frameKey('idle', view.angle, reduce ? 0 : frameAt(CLIPS.idle, nowMs + i * 411)),
        );
        const y = groundY(s.x, s.z);
        shadow(s.x, y, s.z, 0.38);
        if (!rect) return;
        batch.draw({
          sheet,
          rect,
          flip: view.flip,
          x: s.x,
          y,
          z: s.z,
          mode: 'billboard',
          tint: dim,
        });
      });
    }

    // H6: the chevron over whoever speaks. The bob is two output pixels, still when reduced.
    const who = tracker.speakerSpot(world);
    if (who) {
      const sheet = sp.sheets.get('p:pip', buildPipSheet);
      const rect = sheet.frames.get('pip');
      if (rect) {
        const P = CG2_P.pip;
        const bob = reduce
          ? 0
          : Math.round(0.5 + 0.5 * Math.sin(this.time * P.pixelBobHz * Math.PI * 2)) * P.pixelBob;
        const lift = (who.kind === 'nubbin' ? P.pixelLiftNubbin : P.pixelLiftKeeper) * who.scale;
        batch.draw({
          sheet,
          rect,
          flip: false,
          x: who.x + tx * 0.03,
          y: groundY(who.x, who.z) + lift + bob,
          z: who.z + tz * 0.03,
          mode: 'billboard',
          w: P.pixelSize,
          h: P.pixelSize,
        });
      }
    }
    void stage;
  }

  dispose(): void {
    WEATHERED.ids = new Set();
    this.ctx = null;
  }
}

export const dressP: PixelDressing = new PixelP();
