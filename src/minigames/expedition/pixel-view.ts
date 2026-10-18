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
import { progressOf, RUNNER_H, type RunState } from './run';
import type { ExpeditionTheme, ExpeditionView } from './view';

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
  private viewW: number = EXPEDITION.maxViewW;
  private theme: ExpeditionTheme = 'meadow';

  constructor() {
    this.element = el('canvas', 'expedition-canvas');
    const ctx = this.element.getContext('2d');
    if (!ctx) throw new Error('2D canvas context unavailable');
    this.ctx = ctx;
  }

  start(runner: Nubbin, sheet: SpriteSheet, theme: ExpeditionTheme): void {
    this.theme = theme;
    this.art ??= buildExpeditionArt();
    this.runner = { sheet, name: runner.name };
  }

  resize(rect: DOMRect): void {
    const aspect = rect.width / Math.max(1, rect.height);
    this.viewW = Math.round(
      Math.max(EXPEDITION.minViewW, Math.min(EXPEDITION.maxViewW, EXPEDITION.viewH * aspect)),
    );
    this.element.width = this.viewW * PX;
    this.element.height = EXPEDITION.viewH * PX;
    // Letterbox: scale to fit while keeping the low-res aspect.
    const scale = Math.min(rect.width / this.viewW, rect.height / EXPEDITION.viewH);
    this.element.style.width = `${Math.floor(this.viewW * scale)}px`;
    this.element.style.height = `${Math.floor(EXPEDITION.viewH * scale)}px`;
  }

  stop(): void {
    this.runner = null;
  }

  dispose(): void {
    this.runner = null;
  }

  draw(run: RunState, nowMs: number): void {
    const ctx = this.ctx;
    // The backing canvas is PX times the design size; draw in design units.
    ctx.setTransform(PX, 0, 0, PX, 0, 0);
    const blit = (img: HTMLCanvasElement, x: number, y: number) =>
      ctx.drawImage(img, x, y, img.width / PX, img.height / PX);
    const art = this.art;
    if (!art) return;
    const W = this.viewW;
    const H = EXPEDITION.viewH;
    ctx.imageSmoothingEnabled = false;

    // Sky bands.
    const pal =
      this.theme === 'hollow'
        ? [C.ink, C.nightBlue, C.deepGreen, C.darkBark, C.ink]
        : [C.shallows, C.water, C.pale, C.bark, C.darkBark];
    ctx.fillStyle = color(pal[0]!);
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = color(pal[1]!);
    ctx.fillRect(0, 0, W, 60);
    ctx.fillStyle = color(pal[2]!);
    ctx.fillRect(0, EXPEDITION.groundY - 70, W, 70);

    // Parallax clouds and hills.
    const cloudShift = (run.distance * 0.2) % (W + 60);
    for (let i = 0; i < 4; i++) {
      const x = ((i * 150 - cloudShift) % (W + 60)) - 30;
      blit(art.cloud, x < -40 ? x + W + 60 : x, 20 + (i % 2) * 24);
    }
    const hillShift = (run.distance * 0.45) % 140;
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
    const bob = Math.floor(nowMs / 250) % 2;
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
        const hit = run.lastEvent?.kind === 'hit' && run.timeMs - run.lastEvent.atMs < 300;
        if (!hit || Math.floor(nowMs / 60) % 2 === 0) {
          const image = sheet.texture.image as HTMLCanvasElement;
          const dx = Math.round(EXPEDITION.runnerX - rect.w / (2 * PX));
          const dy = Math.round(run.runnerY - RUNNER_H - 4);
          ctx.drawImage(image, rect.x, rect.y, rect.w, rect.h, dx, dy, rect.w / PX, rect.h / PX);
        }
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

    // Progress bar.
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
