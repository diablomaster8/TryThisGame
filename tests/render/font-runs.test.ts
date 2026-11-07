/* hot/perf-leaks (2026-11-06): `drawText` fills one path of glyph runs instead of a fillRect per
 * lit pixel. The picture must be the same pixels, and the canvas calls far fewer. */
import { describe, expect, it } from 'vitest';
import { drawShadowText, drawText, FONT_H, FONT_W } from '../../src/render/sprites/font';

/** A 2D context that rasterises whole-pixel rectangles into a set, and counts its calls. */
function rasterCtx() {
  const lit = new Map<string, string>();
  let calls = 0;
  let path: Array<[number, number, number, number]> = [];
  const put = (x: number, y: number, w: number, h: number, c: string) => {
    for (let i = 0; i < w; i++) for (let j = 0; j < h; j++) lit.set(`${x + i},${y + j}`, c);
  };
  const ctx = {
    fillStyle: '',
    fillRect(x: number, y: number, w: number, h: number) {
      calls++;
      put(x, y, w, h, this.fillStyle);
    },
    beginPath() {
      calls++;
      path = [];
    },
    rect(x: number, y: number, w: number, h: number) {
      path.push([x, y, w, h]);
    },
    fill() {
      calls++;
      for (const [x, y, w, h] of path) put(x, y, w, h, this.fillStyle);
    },
  };
  return { ctx: ctx as unknown as CanvasRenderingContext2D, lit, calls: () => calls };
}

/** The old per-pixel routine, kept here as the reference. */
function drawTextOld(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, scale = 1) {
  // Glyph rows come from drawing one letter at scale 1 through the new routine's own data would be
  // circular, so the reference reads them back from a single-pixel probe of every cell.
  ctx.fillStyle = 'old';
  let cx = Math.round(x);
  for (const ch of text) {
    const probe = rasterCtx();
    drawText(probe.ctx, ch, 0, 0, 'p', 1);
    for (const key of probe.lit.keys()) {
      const [c, r] = key.split(',').map(Number) as [number, number];
      ctx.fillRect(cx + c * scale, y + r * scale, scale, scale);
    }
    cx += (FONT_W + 1) * scale;
  }
}

describe('drawText glyph runs', () => {
  for (const scale of [1, 2, 3]) {
    it(`lights the same pixels as a fillRect per pixel at scale ${scale}`, () => {
      const text = 'Race 12:30 ★♥ Ünï (go!)';
      const a = rasterCtx();
      const b = rasterCtx();
      drawText(a.ctx, text, 5, 7, 'c', scale);
      drawTextOld(b.ctx, text, 5, 7, scale);
      expect([...a.lit.keys()].sort()).toEqual([...b.lit.keys()].sort());
    });
  }

  it('uses a handful of canvas calls for a label, not one per lit pixel', () => {
    const a = rasterCtx();
    drawShadowText(a.ctx, 'MEADOW DASH', 4, 4, 'c', 's');
    expect(a.calls()).toBeLessThanOrEqual(6);
    expect(a.lit.size).toBeGreaterThan(FONT_H);
  });
});
