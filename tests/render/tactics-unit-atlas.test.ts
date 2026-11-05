/**
 * R0253 (FIGHT-61): every creature on the Pixel tactics board shares one texture, so the
 * units go out in one draw. The packer never overlaps or moves a frame, and a full 12-unit
 * board's frames fit one atlas with no repacking frame after frame.
 */
import { describe, expect, it } from 'vitest';
import type { FrameRect, SpriteSheet } from '../../src/render/sprites/atlas';
import { ShelfPacker, UnitAtlas } from '../../src/minigames/tactics/unit-atlas';

const fakeCanvas = (): HTMLCanvasElement => {
  const c = { width: 0, height: 0 } as HTMLCanvasElement;
  const ctx = { fillRect: () => undefined, drawImage: () => undefined, fillStyle: '' };
  (c as unknown as { getContext: () => unknown }).getContext = () => ctx;
  return c;
};

const sheet = (keys: string[], cell = 64): SpriteSheet => {
  const frames = new Map<string, FrameRect>();
  keys.forEach((k, i) => frames.set(k, { x: i * cell, y: 0, w: cell, h: cell }));
  return {
    texture: { image: {} } as unknown as SpriteSheet['texture'],
    width: keys.length * cell,
    height: cell,
    frames,
    cellW: cell,
    cellH: cell,
    dispose: () => undefined,
  };
};

const overlaps = (a: FrameRect, b: FrameRect) =>
  a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

describe('tactics unit atlas', () => {
  it('shelf-packs without overlaps and grows only taller', () => {
    const p = new ShelfPacker(256, 64, 1024);
    const placed: FrameRect[] = [];
    for (let i = 0; i < 40; i++) {
      const w = 20 + ((i * 7) % 30);
      const h = 16 + ((i * 11) % 40);
      const at = p.add(w, h);
      expect(at).not.toBeNull();
      placed.push({ x: at!.x, y: at!.y, w, h });
    }
    for (let i = 0; i < placed.length; i++) {
      const r = placed[i]!;
      expect(r.x + r.w).toBeLessThanOrEqual(256);
      expect(r.y + r.h).toBeLessThanOrEqual(p.height);
      for (let j = i + 1; j < placed.length; j++) expect(overlaps(r, placed[j]!)).toBe(false);
    }
    expect(p.height).toBeGreaterThan(64);
    expect(p.add(300, 10)).toBeNull();
  });

  it('packs twelve creatures into one texture once, then reuses it', () => {
    const keys = Array.from({ length: 37 }, (_, i) => `k${i}`);
    const atlas = new UnitAtlas(1024, 512, 4096, fakeCanvas);
    const sheets = Array.from({ length: 12 }, () => sheet(keys));
    const warm = () => keys;
    const rects = new Map<string, FrameRect>();
    sheets.forEach((s, i) => {
      for (const k of keys) {
        const r = atlas.frame(s, k, warm);
        expect(r).not.toBeNull();
        rects.set(`${i}|${k}`, r!);
      }
    });
    expect(atlas.size).toBe(12 * 37);
    const all = [...rects.values()];
    for (let i = 0; i < all.length; i++)
      for (let j = i + 1; j < all.length; j++) expect(overlaps(all[i]!, all[j]!)).toBe(false);
    // The white block for bars and markers stays clear of every frame.
    for (const r of all) expect(overlaps(r, { x: 0, y: 0, w: 4, h: 4 })).toBe(false);
    // A second frame of the same board adds nothing (no re-upload).
    const v = atlas.version;
    sheets.forEach((s) => keys.forEach((k) => atlas.frame(s, k, warm)));
    expect(atlas.version).toBe(v);
    expect(atlas.canvas.height).toBeLessThanOrEqual(4096);
  });
});
