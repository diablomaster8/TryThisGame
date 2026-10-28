/** MOVE-19: marked sprites are re-appended after the real quads and drawn by one child mesh. */
import { describe, expect, it } from 'vitest';
import type { SpriteSheet } from '../../src/render/sprites/atlas';
import { MegaAtlas, type AtlasSurface } from '../../src/render/sprites/mega-atlas';
import { SpriteBatch } from '../../src/render/sprite-batch';

const surface = (size: number): AtlasSurface => ({
  canvas: { width: size, height: size } as HTMLCanvasElement,
  ctx: { drawImage: () => undefined, clearRect: () => undefined } as unknown as AtlasSurface['ctx'],
});
const RECT = { x: 0, y: 0, w: 10, h: 10 };
const sheet = (): SpriteSheet => ({
  texture: { image: { width: 50, height: 50 } } as unknown as SpriteSheet['texture'],
  width: 50,
  height: 50,
  frames: new Map(),
  cellW: 10,
  cellH: 10,
  dispose: () => undefined,
});

describe('SpriteBatch x-ray pass', () => {
  it('draws marked quads from after the real ones, in one range, even across a grow', () => {
    const batch = new SpriteBatch(new MegaAtlas(100, surface));
    const s = sheet();
    batch.begin(0, 0.6);
    for (let i = 0; i < 64; i++) {
      batch.draw({ sheet: s, rect: RECT, flip: false, x: i, y: 0, z: 0, mode: 'billboard' });
    }
    batch.markXray(0xff0000);
    batch.end();
    expect(batch.mesh.geometry.drawRange.count).toBe(64 * 6);
    expect(batch.xray.visible).toBe(true);
    expect(batch.xray.geometry.drawRange).toEqual({ start: 64 * 6, count: 6 });
    batch.begin(0, 0.6);
    batch.draw({ sheet: s, rect: RECT, flip: false, x: 0, y: 0, z: 0, mode: 'billboard' });
    batch.end();
    expect(batch.xray.visible).toBe(false);
  });
});
