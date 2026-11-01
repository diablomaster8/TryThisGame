import { R10B3 } from '../config/tuning-r10b3';
import type { Floor } from '../sim/dungeon';
import { actSparkColour, FoePoofs, poofFrame, sparkleAt } from './foe-poof';
import type { PixelPackCtx } from './hollow-packs-pixel';
import { NATIVE_PPU } from './sprite-batch';
import { CLIPS, frameAt, frameKey } from './sprites/animations';
import { viewAngle } from './sprites/angles';
import { sheetFromImage, type SpriteSheet } from './sprites/atlas';
import { foeArtId } from './sprites/foe-family-art';
import { uniqueArtId } from './sprites/unique-art';

/**
 * The defeat beat in the Pixel renderer (R0157, lane B r10): see `foe-poof.ts`. The leader's
 * squash, the twelve act-coloured sparkles, the tiny runner fading into the wall with a ♪,
 * or under reduced motion the fade with one sparkle icon. The sparkles and the ♪ come from
 * one small sheet drawn once (a frame per act colour), so a frame never builds a texture.
 */
const SPARK = 10;

/** A four-point sparkle per act colour, plus a white ♪ for the "Bye!". */
function sparkSheet(): SpriteSheet | null {
  if (typeof document === 'undefined') return null;
  const n = R10B3.actSpark.length;
  const c = document.createElement('canvas');
  c.width = SPARK * (n + 1);
  c.height = SPARK;
  const g = c.getContext('2d');
  if (!g) return null;
  const map: Record<string, [number, number, number, number]> = {};
  for (let i = 0; i < n; i++) {
    const x = i * SPARK + SPARK / 2;
    const y = SPARK / 2;
    g.fillStyle = actSparkColour(i);
    g.fillRect(x - 1, 0, 2, SPARK);
    g.fillRect(0 + i * SPARK, y - 1, SPARK, 2);
    g.fillStyle = '#ffffff';
    g.fillRect(x - 1, y - 1, 2, 2);
    map[`act${i}`] = [i * SPARK, 0, SPARK, SPARK];
  }
  const nx = n * SPARK;
  g.fillStyle = '#ffffff';
  g.beginPath();
  g.ellipse(nx + 3.5, 7.5, 2.2, 1.8, -0.4, 0, Math.PI * 2);
  g.fill();
  g.fillRect(nx + 5, 1, 1.5, 7);
  g.fillRect(nx + 5, 1, 4, 1.5);
  map.note = [nx, 0, SPARK, SPARK];
  return sheetFromImage(c, map, SPARK, SPARK);
}

export class PixelHollowPoofs {
  readonly poofs = new FoePoofs();
  private sheet: SpriteSheet | null | undefined;
  private readonly at = { x: 0, y: 0, z: 0 };

  draw(f: Floor, act: number | undefined, ctx: PixelPackCtx): void {
    this.poofs.place(f, act);
    const list = this.poofs.list;
    if (list.length === 0) return;
    this.poofs.prune(ctx.nowMs, ctx.reduceMotion);
    if (this.sheet === undefined) this.sheet = sparkSheet();
    const fx = this.sheet;
    const { batch, sheets, yaw } = ctx;
    for (const p of list) {
      const fr = poofFrame(p, ctx.nowMs - p.startMs, ctx.reduceMotion);
      const spec = f.packs?.find((q) => q.id === p.packId);
      if (!fr || !spec) continue;
      const lead = spec.members[0];
      const art = spec.unique ? uniqueArtId(spec.unique) : foeArtId(spec, lead?.species ?? '');
      const sheet = lead ? sheets.species(art) : null;
      const tint = ctx.lightAt(p.x, p.z);
      if (sheet && fr.leader) {
        const rect =
          sheet.frames.get(frameKey('sad', 'front', 0)) ??
          sheet.frames.get(frameKey('idle', 'front', 0));
        if (rect)
          batch.draw({
            sheet,
            rect,
            flip: false,
            x: p.x,
            y: 0,
            z: p.z,
            w: (rect.w / NATIVE_PPU) * fr.leader.scaleX,
            h: (rect.h / NATIVE_PPU) * fr.leader.scaleY,
            mode: 'billboard',
            opacity: fr.leader.opacity,
            tint,
          });
      }
      const spark = fx?.frames.get(`act${Math.min(p.act, R10B3.actSpark.length - 1)}`);
      if (fx && spark && fr.icon)
        batch.draw({
          sheet: fx,
          rect: spark,
          flip: false,
          x: p.x,
          y: 1.3,
          z: p.z,
          mode: 'billboard',
        });
      if (fx && spark && fr.burst !== null)
        for (let i = 0; i < R10B3.poof.sparkles; i++) {
          const s = sparkleAt(p, i, fr.burst, this.at);
          batch.draw({
            sheet: fx,
            rect: spark,
            flip: false,
            x: s.x,
            y: s.y,
            z: s.z,
            mode: 'billboard',
            opacity: 1 - fr.burst * 0.6,
          });
        }
      if (sheet && fr.runner) {
        const view = viewAngle(fr.runner.facing, yaw);
        const rect = sheet.frames.get(
          frameKey('walk', view.angle, frameAt(CLIPS.walk, ctx.nowMs - p.startMs)),
        );
        const k = R10B3.poof.runnerScale;
        if (rect)
          batch.draw({
            sheet,
            rect,
            flip: view.flip,
            x: fr.runner.x,
            y: 0,
            z: fr.runner.z,
            w: (rect.w / NATIVE_PPU) * k,
            h: (rect.h / NATIVE_PPU) * k,
            mode: 'billboard',
            opacity: fr.runner.opacity,
            tint,
          });
        const note = fx?.frames.get('note');
        if (fx && note && fr.bye)
          batch.draw({
            sheet: fx,
            rect: note,
            flip: false,
            x: fr.runner.x,
            y: 1.1,
            z: fr.runner.z,
            mode: 'billboard',
          });
      }
    }
  }
}
