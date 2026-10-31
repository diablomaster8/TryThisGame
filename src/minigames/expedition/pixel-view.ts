import { reducedMotion } from '../../platform/motion';
import { EXPEDITION } from '../../config/tuning';
import { drawShadowText } from '../../render/sprites/font';
import { PX } from '../../render/sprites/pixel-canvas';
import { NAMES } from '../../config/strings';
import { CLIPS, frameAt, frameKey } from '../../render/sprites/animations';
import type { SpriteSheet } from '../../render/sprites/atlas';
import { C, color } from '../../render/sprites/palette';
import type { Nubbin } from '../../sim/types';
import { el } from '../../ui/dom';
import { buildExpeditionArt, type ExpeditionArt } from './art';
import { skyBands } from '../race/pixel-track';
import { progressOf, RUNNER_H, type RunState } from './run';
import type { ExpeditionTheme, ExpeditionView } from './view';

/** R0324: a hit's spin, and how long the lost Shells fly (ms of run time). */
const HIT_SPIN_MS = 450;
const HIT_SHELLS_MS = 800;

/**
 * The Expedition's pixel view: a low-res 2D canvas letterboxed into the screen, the
 * shipped look in both modes until Full 3D got its own (G17). The drawing is the
 * original screen code, moved here unchanged.
 */
export class ExpeditionPixelView implements ExpeditionView {
  readonly element: HTMLCanvasElement;
  readonly ready = true;
  private readonly ctx: CanvasRenderingContext2D;
  private art: ExpeditionArt | null = null;
  private runner: { sheet: SpriteSheet; name: string } | null = null;
  /** R0324: no spin under reduced motion (the old blink instead). */
  private reduceMotion = false;
  private viewW: number = EXPEDITION.maxViewW;
  /**
   * Extra sky above the run in portrait, in low-res pixels: the track keeps its size and the
   * screen fills with sky, not a thin strip between black bars (review 2026-10-21, bug 23).
   */
  private headroom = 0;
  private theme: ExpeditionTheme = 'meadow';

  constructor() {
    this.element = el('canvas', 'expedition-canvas');
    const ctx = this.element.getContext('2d');
    if (!ctx) throw new Error('2D canvas context unavailable');
    this.ctx = ctx;
  }

  start(runner: Nubbin, sheet: SpriteSheet, theme: ExpeditionTheme): void {
    this.reduceMotion = reducedMotion();
    this.theme = theme;
    this.art ??= buildExpeditionArt();
    this.runner = { sheet, name: runner.name };
  }

  resize(rect: DOMRect): void {
    const aspect = rect.width / Math.max(1, rect.height);
    this.viewW = Math.round(
      Math.max(EXPEDITION.minViewW, Math.min(EXPEDITION.maxViewW, EXPEDITION.viewH * aspect)),
    );
    const tall = (this.viewW * rect.height) / Math.max(1, rect.width);
    this.headroom = Math.round(
      Math.max(0, Math.min(tall, EXPEDITION.viewH * EXPEDITION.maxHeadroom) - EXPEDITION.viewH),
    );
    const viewH = EXPEDITION.viewH + this.headroom;
    this.element.width = this.viewW * PX;
    this.element.height = viewH * PX;
    // Letterbox: scale to fit while keeping the low-res aspect.
    const scale = Math.min(rect.width / this.viewW, rect.height / viewH);
    this.element.style.width = `${Math.floor(this.viewW * scale)}px`;
    this.element.style.height = `${Math.floor(viewH * scale)}px`;
  }

  stop(): void {
    this.runner = null;
  }

  dispose(): void {
    this.runner = null;
  }

  draw(run: RunState, nowMs: number): void {
    const ctx = this.ctx;
    // The backing canvas is PX times the design size; draw in design units, the run itself
    // below any portrait headroom.
    ctx.setTransform(PX, 0, 0, PX, 0, 0);
    ctx.fillStyle = color(this.theme === 'hollow' ? C.nightBlue : C.water);
    ctx.fillRect(0, 0, this.viewW, this.headroom);
    ctx.setTransform(PX, 0, 0, PX, 0, this.headroom * PX);
    const blit = (img: HTMLCanvasElement, x: number, y: number) =>
      ctx.drawImage(img, x, y, img.width / PX, img.height / PX);
    const art = this.art;
    if (!art) return;
    const W = this.viewW;
    const H = EXPEDITION.viewH;
    ctx.imageSmoothingEnabled = false;

    // Sky bands, paling toward the horizon. The band above the hills used to be one flat
    // off-white fill (review 2026-10-24); it is now the lit horizon with a far ridge on it.
    const hollow = this.theme === 'hollow';
    const pal = hollow
      ? [C.ink, C.nightBlue, C.deepGreen, C.darkBark, C.ink]
      : [C.shallows, C.water, C.skyLight, C.bark, C.darkBark];
    skyBands(
      ctx,
      W,
      0,
      EXPEDITION.groundY,
      hollow
        ? [C.ink, C.nightBlue, C.nightBlue, C.tealDeep, C.deepGreen]
        : [C.water, C.water, C.shallows, C.shallows, C.skyLight],
    );
    // R0500: under reduced motion the far layers hold still; only the ground scrolls.
    const far = this.reduceMotion ? 0 : run.distance;
    this.drawRidge(far, W, hollow);

    // Parallax clouds and hills.
    const cloudShift = (far * 0.2) % (W + 60);
    for (let i = 0; i < 4; i++) {
      const x = ((i * 150 - cloudShift) % (W + 60)) - 30;
      blit(art.cloud, x < -40 ? x + W + 60 : x, 20 + (i % 2) * 24);
    }
    const hillShift = (far * 0.45) % 140;
    for (let x = -hillShift - 140; x < W + 140; x += 140) {
      blit(art.hill, x, EXPEDITION.groundY - 40);
    }

    // Ground: one grassy row, then earth with a few scrolling pebbles.
    ctx.fillStyle = color(pal[3]!);
    ctx.fillRect(0, EXPEDITION.groundY + 16, W, H - EXPEDITION.groundY - 16);
    const groundShift = run.distance % 16;
    for (let x = -groundShift - 16; x < W + 16; x += 16) {
      blit(art.groundTile, x, EXPEDITION.groundY);
    }
    ctx.fillStyle = color(pal[4]!);
    const pebbleShift = Math.floor(run.distance) % 48;
    for (let x = -pebbleShift; x < W + 48; x += 48) {
      ctx.fillRect(x + 7, EXPEDITION.groundY + 26, 2, 2);
      ctx.fillRect(x + 29, EXPEDITION.groundY + 41, 3, 2);
    }

    // Things.
    const bob = this.reduceMotion ? 0 : Math.floor(nowMs / 250) % 2;
    for (const t of run.things) {
      const sx = Math.round(t.x - run.distance);
      if (sx + t.w < 0 || sx > W) continue;
      switch (t.kind) {
        case 'shell':
          blit(art.shell[bob] ?? art.shell[0]!, sx, Math.round(t.y));
          break;
        case 'essence':
          blit(art.essence[t.type ?? 'normal'], sx, Math.round(t.y + (bob ? 1 : 0)));
          break;
        case 'critter':
          blit(art.bubble[bob] ?? art.bubble[0]!, sx, Math.round(t.y + (bob ? -1 : 1)));
          break;
        case 'rock':
          blit(art.rock, sx, Math.round(t.y));
          break;
        case 'log':
          blit(art.log, sx, Math.round(t.y));
          break;
        case 'bush':
          blit(art.bush, sx, Math.round(t.y));
          break;
      }
    }

    // Runner: the Nubbin's own side-view frames (walk on the ground, flap in the air).
    if (this.runner) {
      const sheet = this.runner.sheet;
      const clip = run.onGround ? 'walk' : 'flap';
      const f = frameAt(CLIPS[clip], run.timeMs);
      const rect = sheet.frames.get(frameKey(clip, 'side', f));
      if (rect) {
        // R0324 (FUN-35): a hit is a cartoon spin (a blink under reduced motion).
        const since = run.lastEvent?.kind === 'hit' ? run.timeMs - run.lastEvent.atMs : Infinity;
        const spin = since < HIT_SPIN_MS && !this.reduceMotion;
        if (spin || since >= 300 || Math.floor(nowMs / 60) % 2 === 0) {
          const image = sheet.texture.image as HTMLCanvasElement;
          const w = rect.w / PX;
          const h = rect.h / PX;
          const dx = Math.round(EXPEDITION.runnerX - w / 2);
          const dy = Math.round(run.runnerY - RUNNER_H - 4);
          if (spin) {
            ctx.save();
            ctx.translate(dx + w / 2, dy + h / 2);
            ctx.rotate((since / HIT_SPIN_MS) * Math.PI * 2);
            ctx.drawImage(image, rect.x, rect.y, rect.w, rect.h, -w / 2, -h / 2, w, h);
            ctx.restore();
          } else ctx.drawImage(image, rect.x, rect.y, rect.w, rect.h, dx, dy, w, h);
        }
        if (since < HIT_SHELLS_MS) this.drawLostShells(run, since);
      }
    }

    // Pickup sparkle.
    if (run.lastEvent && run.lastEvent.kind !== 'hit' && run.timeMs - run.lastEvent.atMs < 250) {
      ctx.fillStyle = color(C.white);
      const px = EXPEDITION.runnerX + 10;
      const py = run.runnerY - RUNNER_H - 8;
      ctx.fillRect(px, py, 2, 2);
      ctx.fillRect(px + 6, py - 4, 2, 2);
      ctx.fillRect(px - 5, py - 3, 2, 2);
    }

    this.drawTop(run, W);
  }

  /** R0324: the Shells a hit cost arc back out of the runner and bounce away. */
  private drawLostShells(run: RunState, since: number): void {
    const n = Math.min(5, run.lastEvent?.dropped ?? 0);
    if (n === 0) return;
    const ctx = this.ctx;
    const t = since / 1000;
    ctx.fillStyle = color(C.white);
    for (let i = 0; i < n; i++) {
      const vx = -30 - i * 14;
      const vy = -70 - i * 12;
      const x = EXPEDITION.runnerX + vx * t;
      let y = run.runnerY - RUNNER_H / 2 + vy * t + 160 * t * t;
      // One bounce off the ground, then away.
      if (y > EXPEDITION.groundY - 2) y = EXPEDITION.groundY - 2 - Math.abs(Math.sin(t * 9)) * 6;
      ctx.fillRect(Math.round(x), Math.round(y), 3, 2);
    }
  }

  /**
   * A far ridge on the horizon, behind the hills: a soft blue range in the meadow, dark
   * stalagmites in the Hollow. Its own slow parallax, from a fixed hash of the column.
   */
  private drawRidge(distance: number, W: number, hollow: boolean): void {
    const ctx = this.ctx;
    const base = EXPEDITION.groundY - 18;
    const shift = Math.floor(distance * 0.18);
    ctx.fillStyle = color(hollow ? C.ink : C.lilacGrey);
    for (let x = 0; x < W; x++) {
      const wx = x + shift;
      const h = hollow
        ? 6 + ((((wx >> 3) * 2654435761) >>> 0) % 26) * (wx % 8 < 4 ? 1 : 0.5)
        : 18 + 10 * Math.sin(wx / 23) + 6 * Math.sin(wx / 9 + 1);
      ctx.fillRect(x, Math.round(base - h), 1, Math.round(h) + 18);
    }
    if (hollow) return;
    // Snow caps catch the light on the high points.
    ctx.fillStyle = color(C.white);
    for (let x = 0; x < W; x++) {
      const wx = x + shift;
      const h = 18 + 10 * Math.sin(wx / 23) + 6 * Math.sin(wx / 9 + 1);
      if (h > 29) ctx.fillRect(x, Math.round(base - h), 1, 2);
    }
    ctx.fillStyle = color(C.greyLight);
    ctx.fillRect(0, base + 6, W, 12);
  }

  private drawTop(run: RunState, W: number): void {
    const ctx = this.ctx;
    // Progress bar and name, along the very top.
    ctx.setTransform(PX, 0, 0, PX, 0, 0);
    ctx.fillStyle = 'rgba(13,10,26,0.5)';
    ctx.fillRect(8, 8, W - 16, 4);
    ctx.fillStyle = color(C.sunYellow);
    ctx.fillRect(8, 8, Math.round((W - 16) * progressOf(run)), 4);

    // Name tag.
    ctx.fillStyle = color(C.cream);
    drawShadowText(
      ctx,
      this.runner?.name ?? NAMES.creature,
      8,
      18,
      color(C.cream),
      color(C.darkPlum),
    );
  }
}
