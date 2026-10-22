import { Sprite, SpriteMaterial, type CanvasTexture, type Vector3 } from 'three';
import { markAt } from '../config/stage-marks';
import type { SceneStage } from '../config/story';
import { CG2_Y } from '../config/tuning-y';
import type { World } from '../sim/types';
import type { Daylight } from './daylight';
import { SceneClock } from './dress-e';
import { Y_STATE } from './dress-y-state';
import {
  boardFinal,
  boardFinalTexture,
  hash01,
  lanternString,
  postSplitFor,
  shuttersFor,
  windowsState,
  type LanternString,
} from './dress-y-shared';
import type { PixelDressCtx, PixelDressing } from './dressings';
import { POST_SPLIT } from './post';
import { stageFlags } from './scene-stage';
import { AtlasBuilder, type SpriteSheet } from './sprites/atlas';
import { C } from './sprites/palette';
import { PixelCanvas } from './sprites/pixel-canvas';
import { ddLayout } from './story-b-layout';

/**
 * Campaign-graphics 2 package y, pixel renderer ("light and grade"): the Night Grove's
 * dark windows (C5, through `Y_STATE` for the sprite pass), a split-tone post pass for the
 * dawn and the crisp morning (H11, M10), Dawn & Dusk's half cues (M6: dew, shutters,
 * chimney smoke), the shared lantern string (M11) and Logged In's final board (M15). The
 * shared rules are in render/dress-y-shared.ts. Lantern posts going dark (H13) is a 3D
 * matter: the pixel posts already follow `lanternLights` (render/dress-e.ts).
 */

const CELL = 32;
const LANTERN_COLORS = [C.ember, C.orange, C.sunYellow, C.rose, C.sunLight] as const;

/** The package's small sheet: paper lanterns, a glow, cord and pole, shutters, dew, smoke. */
export function buildYSheet(): SpriteSheet {
  const atlas = new AtlasBuilder(CELL, CELL, 6);
  LANTERN_COLORS.forEach((col, i) => {
    const pc = new PixelCanvas(CELL, CELL);
    pc.ellipse(16, 17, 6, 8, col);
    pc.rect(13, 8, 6, 2, C.darkBark);
    pc.rect(13, 24, 6, 2, C.darkBark);
    pc.rect(14, 12, 2, 8, C.cream);
    pc.px(16, 6, C.darkBark);
    pc.finish(C.ink, [col, C.cream]);
    atlas.add(`lantern-${i}`, pc);
  });
  const glow = new PixelCanvas(CELL, CELL);
  glow.disc(16, 16, 15, C.sunLight);
  atlas.add('glow', glow);
  const cord = new PixelCanvas(CELL, CELL);
  cord.rect(14, 14, 4, 4, C.darkBark);
  atlas.add('cord', cord);
  const pole = new PixelCanvas(CELL, CELL);
  pole.rect(13, 0, 6, 32, C.bark);
  pole.rect(13, 0, 2, 32, C.wood);
  atlas.add('pole', pole);
  for (const lit of [false, true]) {
    const sh = new PixelCanvas(CELL, CELL);
    sh.rect(2, 1, 28, 30, C.leaf);
    for (let y = 4; y < 30; y += 4) sh.rect(2, y, 28, 1, C.leafDeep);
    if (lit) sh.rect(14, 3, 4, 26, C.sunLight);
    sh.rect(2, 1, 28, 1, C.darkBark);
    sh.rect(2, 30, 28, 1, C.darkBark);
    sh.rect(2, 1, 1, 30, C.darkBark);
    sh.rect(29, 1, 1, 30, C.darkBark);
    atlas.add(lit ? 'shut-lit' : 'shut', sh);
  }
  const dew = new PixelCanvas(CELL, CELL);
  dew.px(16, 16, C.white);
  dew.px(15, 16, C.cream);
  dew.px(17, 16, C.cream);
  dew.px(16, 15, C.cream);
  dew.px(16, 17, C.cream);
  atlas.add('dew', dew);
  const puff = new PixelCanvas(CELL, CELL);
  puff.disc(16, 16, 11, C.greyLight);
  puff.disc(13, 13, 5, C.pale);
  atlas.add('puff', puff);
  return atlas.build();
}

class PixelY implements PixelDressing {
  readonly id = 'y';
  private ctx: PixelDressCtx | null = null;
  private clock = new SceneClock();
  private time = 0;
  private sheet: SpriteSheet | null = null;
  private tex: CanvasTexture | null = null;
  private board: Sprite | null = null;
  private strung: LanternString | null = null;
  /** The shutters' closed share 0..1 and its goal, eased per frame. */
  private shut = 0;
  private shutKey = '';

  build(ctx: PixelDressCtx): void {
    this.ctx = ctx;
    this.clock = new SceneClock();
    this.time = 0;
    this.sheet = null;
    this.board = null;
    this.tex = null;
    this.strung = null;
    this.shutKey = '';
  }

  update(world: World, stage: SceneStage, _daylight: Daylight, dt: number): void {
    const ctx = this.ctx;
    if (!ctx) return;
    const reduce = ctx.reduceMotion();
    const flags = stageFlags(world, stage);
    const home = flags.location === 'grove';
    this.time += dt;
    this.clock.tick(flags.sceneId, dt);

    // C5: the host draws the windows lit after dark; a stage that puts them out says so.
    Y_STATE.windowsOut = home && windowsState(flags, stage) === 'out';
    // H11, M10: the post pass's split tone (the host sets the tint; this sets the shadows).
    POST_SPLIT.value = home ? postSplitFor(flags, stage) : 0;

    const board = this.board;
    const want = home && boardFinal(stage);
    if (board) board.visible = false;
    const sp = ctx.sprites;
    if (!sp || !home) return;
    const batch = sp.batch;
    const right = (batch as unknown as { right: Vector3 }).right;
    const tx = -right.z;
    const tz = right.x;
    const sheet = (this.sheet ??= sp.sheets.get('y:sheet', buildYSheet));
    const rect = (key: string) => sheet.frames.get(key);

    // M15: the board's final message, bigger than the board, a little toward the viewer.
    if (want) this.drawBoard(ctx, tx, tz);

    // M11: the lantern string, instanced in the sense of one batch: poles, cord, paper lanterns.
    const str = lanternString(flags, stage);
    if (str) {
      this.strung = str;
      const S = CG2_Y.string;
      const pole = rect('pole');
      const glow = rect('glow');
      const cord = rect('cord');
      if (pole)
        for (const p of str.poles)
          batch.draw({
            sheet,
            rect: pole,
            flip: false,
            x: p.x + tx * 0.02,
            y: p.y,
            z: p.z + tz * 0.02,
            mode: 'billboard',
            w: 0.14,
            h: S.poleHeight,
          });
      if (cord)
        for (const p of str.cords)
          batch.draw({
            sheet,
            rect: cord,
            flip: false,
            x: p.x + tx * 0.03,
            y: p.y,
            z: p.z + tz * 0.03,
            mode: 'billboard',
            w: 0.06,
            h: 0.06,
          });
      str.lamps.forEach((p, i) => {
        const lamp = rect(`lantern-${i % LANTERN_COLORS.length}`);
        if (glow)
          batch.draw({
            sheet,
            rect: glow,
            flip: false,
            x: p.x + tx * 0.035,
            y: p.y - S.glow * 0.5 + 0.12,
            z: p.z + tz * 0.035,
            mode: 'billboard',
            w: S.glow,
            h: S.glow,
            opacity: S.glowOpacity * 0.5,
            tint: 1.2,
          });
        if (lamp)
          batch.draw({
            sheet,
            rect: lamp,
            flip: false,
            x: p.x + tx * 0.04,
            y: p.y - 0.2,
            z: p.z + tz * 0.04,
            mode: 'billboard',
            w: 0.46,
            h: 0.46,
            tint: 1.2,
          });
      });
    }

    // M6: Dawn & Dusk's half cues, on the four crest houses and the green.
    if (flags.half !== null) this.halfCues(ctx, flags.half, stage, flags, reduce, dt, tx, tz);
  }

  private drawBoard(ctx: PixelDressCtx, tx: number, tz: number): void {
    const m = markAt('grove', 'board');
    if (!m) return;
    const B = CG2_Y.firstLight.board;
    if (!this.board) {
      this.tex = boardFinalTexture();
      ctx.track(this.tex);
      const mat = new SpriteMaterial({ map: this.tex, depthWrite: false, fog: false });
      ctx.track(mat);
      this.board = new Sprite(mat);
      this.board.scale.set(B.w, B.h, 1);
      ctx.groups.grove.add(this.board);
    }
    this.board.position.set(m.x + tx * B.forward, B.lift, m.z + tz * B.forward);
    this.board.visible = true;
  }

  private halfCues(
    ctx: PixelDressCtx,
    half: 'dawn' | 'dusk',
    stage: SceneStage,
    flags: ReturnType<typeof stageFlags>,
    reduce: boolean,
    dt: number,
    tx: number,
    tz: number,
  ): void {
    const sp = ctx.sprites!;
    const batch = sp.batch;
    const right = (batch as unknown as { right: Vector3 }).right;
    const sheet = this.sheet!;
    const rect = (key: string) => sheet.frames.get(key);
    const H = CG2_Y.halves;
    const L = ddLayout();
    // The crest sprite is 5.2 wide on a 160-px raster, 146 high; windows at 47 and 113 px.
    const unit = 5.2 / 160;
    const winDx = 33 * unit;
    const winY = (146 - 97) * unit;
    const hh = 22 * unit * 1.2;
    const ww = 22 * unit * 1.2;

    // Shutters: open at dawn (rising as the scene opens), shut at dusk (closing).
    const goal = shuttersFor(flags, stage) === 'shut' ? 1 : 0;
    const key = `${flags.sceneId}|${goal}`;
    if (key !== this.shutKey) {
      this.shutKey = key;
      this.shut = reduce ? goal : 1 - goal;
    }
    const step = dt / H.shutter.seconds;
    this.shut = reduce ? goal : this.shut + Math.max(-step, Math.min(step, goal - this.shut));
    const closed = this.shut;
    const shutRect = rect(half === 'dusk' ? 'shut-lit' : 'shut');
    if (shutRect && closed > 0.02)
      for (const h of L.houses)
        for (const s of [-1, 1])
          batch.draw({
            sheet,
            rect: shutRect,
            flip: false,
            x: h.x + right.x * winDx * s + tx * 0.05,
            y: winY + hh * 0.5 - hh * closed,
            z: h.z + right.z * winDx * s + tz * 0.05,
            mode: 'billboard',
            w: ww,
            h: hh * closed,
          });

    if (half === 'dawn') {
      // Dew on the grass round the green: glints that twinkle, still when reduced.
      const dew = rect('dew');
      if (dew) {
        const D = H.dew;
        for (let i = 0; i < D.count; i++) {
          if (reduce && i % 2) continue;
          const a = hash01(i * 3.1) * Math.PI * 2;
          const r = Math.sqrt(hash01(i * 7.7 + 1)) * L.radius * D.radiusShare * 2;
          const k = reduce
            ? 0.75
            : 0.3 + 0.7 * Math.abs(Math.sin(this.time * D.hz * 2 + hash01(i) * 6.28));
          batch.draw({
            sheet,
            rect: dew,
            flip: false,
            x: L.centre.x + Math.cos(a) * r,
            y: 0.02,
            z: L.centre.z + Math.sin(a) * r,
            mode: 'billboard',
            w: D.size * 2,
            h: D.size * 2,
            opacity: D.opacity * k,
          });
        }
      }
      // One chimney's smoke, rising and thinning; three still puffs when reduced.
      const puff = rect('puff');
      const house = L.houses[H.smoke.house];
      if (puff && house) {
        const S = H.smoke;
        for (let i = 0; i < S.puffs; i++) {
          const phase = reduce
            ? (i + 0.5) / (S.puffs + 1)
            : (this.time / S.seconds + i / S.puffs) % 1;
          const fade = Math.sin(Math.PI * Math.min(1, phase * 1.15));
          batch.draw({
            sheet,
            rect: puff,
            flip: false,
            x: house.x + right.x * 1.5 + tx * 0.06 + phase * 0.5,
            y: 3.9 + phase * S.rise,
            z: house.z + right.z * 1.5 + tz * 0.06,
            mode: 'billboard',
            w: S.size * (0.5 + phase),
            h: S.size * (0.5 + phase),
            opacity: S.opacity * fade,
          });
        }
      }
    }
  }

  dispose(): void {
    Y_STATE.windowsOut = false;
    POST_SPLIT.value = 0;
    this.board?.removeFromParent();
    this.board = null;
    this.ctx = null;
  }
}

export const dressY: PixelDressing = new PixelY();
