import { Vector3 } from 'three';
import { LOOK_STATE, storyId } from '../config/npc-looks';
import { TALE_GRADE } from '../config/campaign-look';
import type { SceneStage } from '../config/story';
import { CG4_B4 } from '../config/tuning-b4';
import type { Memorial, World } from '../sim/types';
import type { Daylight } from './daylight';
import type { PixelDressCtx, PixelDressing } from './dressings';
import { memorialSpot } from './memorial-spot';
import { POST_TALE } from './post';
import { stageFlags, terraceY } from './scene-stage';
import { StageTracker } from './stage-actors';
import { NATIVE_PPU } from './sprite-batch';
import { AtlasBuilder, type SpriteSheet } from './sprites/atlas';
import { frameKey } from './sprites/animations';
import { buildCocoonSheet } from './sprites/egg';
import { KEEPER_SIZE } from './sprites/keeper';
import { C } from './sprites/palette';
import { PixelCanvas } from './sprites/pixel-canvas';

/**
 * Campaign graphics 4, package b4, pixel ("people"):
 * - K11: sets the tale grade (render/post.ts `POST_TALE`) while a `stage.tale` scene plays,
 *   and `LOOK_STATE.tale`, which the world view reads to hide every present-day Keeper that
 *   is not in the cast (Moss stays), and which `storyId` reads to dress Hazel as young Hazel.
 * - K38: `LOOK_STATE.campaign` and `chapter`, so Hazel from chapter 11 wears her older look;
 *   here the stick she leans on, drawn at her hand.
 * - K37: a separate campaign's departure: the soft pale cocoon fading at the campaign's
 *   memorial spot, then the flower growing there on the scene's last line. No other imagery.
 * The look sheets themselves (Fern's story look, the Hazels) are in config/npc-looks.ts.
 */

/** A walking stick on the Keeper grid, in Hazel's right hand (the viewer's right). */
function buildStickSheet(): SpriteSheet {
  const atlas = new AtlasBuilder(KEEPER_SIZE, KEEPER_SIZE, 1);
  const pc = new PixelCanvas(KEEPER_SIZE, KEEPER_SIZE);
  pc.thinLine(22.5, 21.5, 24.5, 30.5, C.bark);
  pc.thinLine(23, 21.5, 25, 30.5, C.wood);
  // The crook.
  pc.rect(21.5, 20.5, 2, 1, C.bark);
  pc.px(21.5, 21.5, C.bark);
  pc.finish(C.ink, [C.wood]);
  atlas.add('stick', pc);
  return atlas.build();
}

class PixelB4 implements PixelDressing {
  readonly id = 'b4';
  private ctx: PixelDressCtx | null = null;
  private tracker = new StageTracker();
  private tale = 0;
  private flowerT = 0;
  private stick: SpriteSheet | null = null;

  build(ctx: PixelDressCtx): void {
    this.ctx = ctx;
    this.tracker = new StageTracker();
    this.tale = 0;
    this.flowerT = 0;
    this.stick = null;
    // The post pass draws the tale grade here, so the screen overlay stands down for it.
    TALE_GRADE.pixelPost = true;
  }

  update(world: World, stage: SceneStage, daylight: Daylight, dt: number): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const reduce = ctx.reduceMotion();
    const tracker = this.tracker;
    tracker.tick(world, dt);
    const flags = stageFlags(world, stage);
    const home = world.location === 'grove';

    TALE_GRADE.pixelPost = true;
    // K11, K38: what the looks and the world view read.
    const tale = stage.tale === true && home;
    LOOK_STATE.tale = tale;
    LOOK_STATE.campaign = flags.campaign;
    LOOK_STATE.chapter = flags.chapter;

    // K11: the grade eases in over a moment (still, and immediate, under reduced motion).
    const want = tale ? 1 : 0;
    const k = reduce ? 1 : Math.min(1, dt / CG4_B4.tale.post.easeS);
    this.tale += (want - this.tale) * k;
    if (Math.abs(this.tale - want) < 0.01) this.tale = want;
    POST_TALE.value = this.tale;

    const sp = ctx.sprites;
    if (!sp || !home) return;
    const batch = sp.batch;
    const right = (batch as unknown as { right: Vector3 }).right;
    const tx = -right.z * 0.04;
    const tz = right.x * 0.04;
    const dim = Math.max(0.35, 1 - 0.5 * daylight.darkness);

    // K38: Hazel's stick, at her hand, from chapter 11 on (a told tale shows her young).
    if (storyId('hazel') === 'hazel-old' && world.npcs.some((n) => n.trainer === 'hazel')) {
      const at = tracker.spotOf(world, 'hazel');
      const sheet = (this.stick ??= sp.sheets.get('b4:stick', buildStickSheet));
      const rect = sheet.frames.get('stick');
      if (at && rect)
        batch.draw({
          sheet,
          rect,
          flip: false,
          x: at.x + tx,
          y: terraceY(at.x, at.z),
          z: at.z + tz,
          mode: 'billboard',
          tint: dim,
        });
    }

    // K37: a departure in a separate campaign: the cocoon fades, the flower comes.
    const D = CG4_B4.departure;
    if (stage.props?.cocoon !== 'show' || !flags.storyline) {
      this.flowerT = 0;
      return;
    }
    const spot = nextMemorial(world);
    const last = LOOK_STATE.lines > 0 && LOOK_STATE.line >= LOOK_STATE.lines - 1;
    const p = LOOK_STATE.lines > 1 ? LOOK_STATE.line / (LOOK_STATE.lines - 1) : 1;
    const y = terraceY(spot.x, spot.z);
    const fade = 1 - Math.min(1, p / D.fadeBy);
    if (fade > 0.01) {
      const sheet = sp.sheets.get('cocoon:depart', () => buildCocoonSheet('depart'));
      const rect = sheet.frames.get(frameKey('idle', 'front', 0));
      if (rect)
        batch.draw({
          sheet,
          rect,
          flip: false,
          x: spot.x,
          y,
          z: spot.z,
          mode: 'billboard',
          opacity: D.cocoonOpacity * fade,
          tint: dim,
        });
    }
    this.flowerT = last ? this.flowerT + dt : 0;
    if (last) {
      const grow = reduce ? 1 : Math.min(1, this.flowerT / D.flowerGrowS);
      const props = sp.sheets.props();
      const rect = props.frames.get(frameKey('flower', 'front', 0));
      if (rect && grow > 0.02)
        batch.draw({
          sheet: props,
          rect,
          flip: false,
          x: spot.x,
          y,
          z: spot.z,
          mode: 'billboard',
          w: (rect.w / NATIVE_PPU) * grow,
          h: (rect.h / NATIVE_PPU) * grow,
          tint: dim,
        });
    }
  }

  dispose(): void {
    TALE_GRADE.pixelPost = false;
    POST_TALE.value = 0;
    LOOK_STATE.tale = false;
    LOOK_STATE.campaign = 'hazel';
    LOOK_STATE.chapter = 0;
    this.ctx = null;
    this.stick = null;
  }
}

/** Where the next departed one's flower will stand: the campaign's memorial spot (N7). */
export function nextMemorial(world: World): { x: number; z: number } {
  const next: Memorial = { id: 'b4-departure', name: '', pos: { ...world.keeper.pos } };
  return memorialSpot({ ...world, memorials: [...world.memorials, next] } as World, next);
}

export const dressB4: PixelDressing = new PixelB4();
