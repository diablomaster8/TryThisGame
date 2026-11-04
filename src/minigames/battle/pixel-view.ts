import { BATTLE_TEXT } from '../../config/strings-battle';
import { PX } from '../../render/sprites/pixel-canvas';
import { CLIPS, frameAt, frameKey, type ClipName } from '../../render/sprites/animations';
import type { SpriteSheet } from '../../render/sprites/atlas';
import { drawShadowText } from '../../render/sprites/font';
import { C, color } from '../../render/sprites/palette';
import type { BattleState } from '../../sim/battle';
import { idleKind, idlePose, reducedMotion } from '../../ui/battle-idle';
import { el } from '../../ui/dom';
import type { BattleCast, BattleFrame, BattleView } from './view';

/** The stage's low-res height; its width follows the stage's aspect. */
const VIEW_H = 160;

/**
 * The battle stage in pixel art (moved out of `ui/battle-screen.ts` for R0219, unchanged): a
 * low-res canvas with a backdrop by bout kind, two pads, each side's shown combatant from its
 * sprite sheet's side view (theirs mirrored), the hit shake, the miss sway, the wind-up lunge,
 * the walk home, the nap under a leaf, the rising numbers and the personality idles (FIGHT-78).
 * Under reduced motion nothing shakes and numbers fade in place.
 */
export class BattlePixelView implements BattleView {
  readonly element: HTMLCanvasElement;
  readonly ready = true;
  private readonly ctx: CanvasRenderingContext2D;
  private viewW = 260;
  private cast: BattleCast | null = null;

  constructor() {
    this.element = el('canvas', 'bs-canvas');
    const ctx = this.element.getContext('2d');
    if (!ctx) throw new Error('2D canvas context unavailable');
    this.ctx = ctx;
  }

  start(_s: BattleState, cast: BattleCast): void {
    this.cast = cast;
  }

  resize(rect: DOMRect): void {
    const aspect = rect.width / Math.max(1, rect.height);
    this.viewW = Math.round(Math.max(160, Math.min(420, VIEW_H * aspect)));
    this.element.width = this.viewW * PX;
    this.element.height = VIEW_H * PX;
  }

  stop(): void {
    this.cast = null;
  }

  dispose(): void {
    this.stop();
  }

  draw(s: BattleState, f: BattleFrame, now: number): void {
    const { e, k } = f;
    const ctx = this.ctx;
    const W = this.viewW;
    const H = VIEW_H;
    ctx.setTransform(PX, 0, 0, PX, 0, 0);
    ctx.imageSmoothingEnabled = false;
    const sky =
      s.context.kind === 'story' ? C.darkPlum : s.context.kind === 'circuit' ? C.skyLight : C.wood;
    ctx.fillStyle = color(sky);
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = color(s.context.kind === 'story' ? C.plum : C.sand);
    ctx.fillRect(0, H * 0.55, W, H * 0.45);
    // Two pads: ours lower left, theirs upper right.
    ctx.fillStyle = color(C.sandDeep);
    ctx.fillRect(Math.round(W * 0.1), Math.round(H * 0.86), Math.round(W * 0.36), 6);
    ctx.fillRect(Math.round(W * 0.56), Math.round(H * 0.52), Math.round(W * 0.34), 5);
    const still = reducedMotion();
    const cast = this.cast;
    for (const side of [1, 0] as const) {
      const c = f.shown[side];
      if (!c) continue;
      const x = side === 0 ? W * 0.28 : W * 0.73;
      const floor = side === 0 ? H * 0.88 : H * 0.54;
      const hp = f.hp(c);
      const out = hp <= 0 || (c.friend && !f.busy);
      let dx = 0;
      let clip: ClipName = out ? (side === 0 ? 'sleep' : 'walk') : 'idle';
      if (e && !still) {
        const by = 'by' in e ? e.by : null;
        if (e.k === 'use' && by === c.id) dx = (side === 0 ? 1 : -1) * Math.sin(k * Math.PI) * 10;
        if (e.k === 'hit' && e.to === c.id) dx = Math.sin(k * Math.PI * 6) * 3 * (1 - k);
        if (e.k === 'miss' && e.to === c.id) dx = Math.sin(k * Math.PI * 2) * 6;
        if (e.k === 'tuckered' && e.who === c.id && side === 1) dx = k * W * 0.4;
        if (e.k === 'befriend' && e.who === c.id) dx = -k * W * 0.3;
      }
      if (e && e.k === 'hit' && e.to === c.id) clip = 'sad';
      if (e && (e.k === 'befriend' || e.k === 'cuddle')) clip = 'happy';
      if (out && side === 1 && !(e && 'who' in e && e.who === c.id)) continue;
      const sheet = cast ? cast.sheet(c) : null;
      // FIGHT-78: a personality idle while the bout waits for the Keeper.
      let dy = 0;
      if (!e && !out && !s.result && s.phase === 'choose') {
        const n = c.nubbinId ? cast?.nubbin(c) : null;
        const idle = idlePose(
          idleKind({ ...c, moody: n?.moody ?? null }),
          c.id,
          s.seed,
          now,
          still,
        );
        dx += idle.dx;
        dy = idle.dy;
        if (idle.glyph)
          drawShadowText(ctx, idle.glyph, x + 10, floor - 34, color(C.cream), color(C.darkPlum));
      }
      if (sheet) this.drawSprite(sheet, clip, now, x + dx, floor + dy, side === 1);
      if (out && side === 0) {
        ctx.fillStyle = color(C.leaf);
        ctx.fillRect(Math.round(x - 12), Math.round(floor - 14), 24, 4);
        drawShadowText(ctx, BATTLE_TEXT.zzz, x + 14, floor - 30, color(C.cream), color(C.darkPlum));
        // Slapstick (FUN-74): "too dizzy to continue", the spiral over a sat-down Nubbin.
        drawShadowText(ctx, '💫', x - 14, floor - 30, color(C.cream), color(C.darkPlum));
      }
      const pop = f.pop;
      if (pop?.id === c.id && now - pop.at < 700) {
        const t = (now - pop.at) / 700;
        const rise = still ? 0 : t * 10;
        ctx.globalAlpha = still ? Math.min(1, t * 3) : 1 - t * 0.5;
        drawShadowText(
          ctx,
          pop.text,
          x,
          floor - 44 - rise,
          color(C.cream),
          color(C.darkPlum),
          1,
          'center',
        );
        ctx.globalAlpha = 1;
      }
    }
  }

  private drawSprite(
    sheet: SpriteSheet,
    clip: ClipName,
    now: number,
    x: number,
    floor: number,
    flip: boolean,
  ): void {
    const f = frameAt(CLIPS[clip], now);
    const rect =
      sheet.frames.get(frameKey(clip, 'side', f)) ?? sheet.frames.get(frameKey('idle', 'side', 0));
    if (!rect) return;
    const image = sheet.texture.image as HTMLCanvasElement;
    const w = rect.w / PX;
    const h = rect.h / PX;
    const dx = Math.round(x - w / 2);
    const dy = Math.round(floor - h + 2);
    const ctx = this.ctx;
    ctx.save();
    if (flip) {
      ctx.translate(dx + w, dy);
      ctx.scale(-1, 1);
      ctx.drawImage(image, rect.x, rect.y, rect.w, rect.h, 0, 0, w, h);
    } else ctx.drawImage(image, rect.x, rect.y, rect.w, rect.h, dx, dy, w, h);
    ctx.restore();
  }
}
