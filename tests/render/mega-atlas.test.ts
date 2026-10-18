/**
 * The mega atlas evicts least-recently-used sheets instead of filling up for good, never
 * evicts a sheet drawn this frame, uploads only new regions, and only allocates its
 * canvas on first use. A fake 2D surface stands in for the canvas.
 */
import { describe, expect, it, vi } from 'vitest';
import type { Texture, Vector2 } from 'three';
import type { SpriteSheet } from '../../src/render/sprites/atlas';
import { MegaAtlas, type AtlasSurface } from '../../src/render/sprites/mega-atlas';
import { SpriteBatch } from '../../src/render/sprite-batch';

function fakeSurface(log: string[] = []): (size: number) => AtlasSurface {
  return (size) => {
    log.push(`alloc ${size}`);
    return {
      canvas: { width: size, height: size } as HTMLCanvasElement,
      ctx: {
        drawImage: () => undefined,
        clearRect: () => undefined,
      } as unknown as AtlasSurface['ctx'],
    };
  };
}

function sheet(w = 50, h = 50): SpriteSheet {
  return {
    texture: { image: { width: w, height: h } } as unknown as SpriteSheet['texture'],
    width: w,
    height: h,
    frames: new Map([['idle:front:0', { x: 0, y: 0, w: 10, h: 10 }]]),
    cellW: 10,
    cellH: 10,
    dispose: () => undefined,
  };
}

const RECT = { x: 0, y: 0, w: 10, h: 10 };

describe('MegaAtlas', () => {
  it('allocates its canvas only when the first sheet arrives', () => {
    const log: string[] = [];
    const atlas = new MegaAtlas(100, fakeSurface(log));
    expect(atlas.canvas).toBeNull();
    expect(log).toEqual([]);
    atlas.beginFrame();
    expect(atlas.place(sheet())).not.toBeNull();
    expect(log).toEqual(['alloc 100']);
    expect(atlas.canvas).not.toBeNull();
  });

  it('evicts the least recently used sheets when full', () => {
    const atlas = new MegaAtlas(100, fakeSurface());
    const [a, b, c, d, e] = [sheet(), sheet(), sheet(), sheet(), sheet()];
    atlas.beginFrame();
    for (const s of [a, b, c, d]) expect(atlas.place(s)).not.toBeNull();
    // Next frame b, c and d are used again, a is not.
    atlas.beginFrame();
    for (const s of [b, c, d]) atlas.place(s);
    atlas.beginFrame();
    for (const s of [b, c, d]) atlas.place(s);
    const gen = atlas.generation;
    expect(atlas.place(e)).not.toBeNull();
    expect(atlas.generation).toBe(gen + 1);
    expect(atlas.has(a)).toBe(false);
    for (const s of [b, c, d, e]) expect(atlas.has(s)).toBe(true);
  });

  it('never evicts a sheet drawn this frame, and refills only up to the headroom line', () => {
    const atlas = new MegaAtlas(100, fakeSurface());
    const [a, b, c, d, e] = [sheet(), sheet(), sheet(), sheet(), sheet()];
    atlas.beginFrame();
    for (const s of [a, b, c, d]) atlas.place(s);
    atlas.beginFrame();
    atlas.place(d); // d pinned this frame; a, b and c are older and equally old
    expect(atlas.place(e)).not.toBeNull();
    expect(atlas.has(d)).toBe(true);
    expect(atlas.has(e)).toBe(true);
    // d and e fill the top shelf; the next shelf would cross the 75% line, so the older
    // sheets wait until something draws them again.
    expect(atlas.sheetCount).toBe(2);
    // Every resident sheet still resolves to a UV inside the atlas.
    for (const s of [a, b, c, d, e]) {
      const uv = atlas.uv(s, RECT);
      if (!atlas.has(s)) expect(uv).toBeNull();
      else for (const v of uv!) expect(v).toBeGreaterThanOrEqual(0);
    }
  });

  it('leaves room after a repack, so the next new sheet does not repack again', () => {
    const atlas = new MegaAtlas(100, fakeSurface());
    atlas.beginFrame();
    for (let i = 0; i < 4; i++) atlas.place(sheet());
    atlas.beginFrame();
    const gen = atlas.generation;
    expect(atlas.place(sheet())).not.toBeNull(); // full: one repack
    expect(atlas.generation).toBe(gen + 1);
    expect(atlas.place(sheet())).not.toBeNull(); // lands in the headroom
    expect(atlas.generation).toBe(gen + 1);
    atlas.beginFrame();
    expect(atlas.place(sheet())).not.toBeNull(); // lands in the headroom
    expect(atlas.generation).toBe(gen + 1);
  });

  it('returns null and warns once when this frame alone does not fit', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const atlas = new MegaAtlas(100, fakeSurface());
    const sheets = [sheet(), sheet(), sheet(), sheet()];
    atlas.beginFrame();
    for (const s of sheets) atlas.place(s);
    expect(atlas.place(sheet())).toBeNull();
    expect(atlas.place(sheet())).toBeNull();
    expect(warn).toHaveBeenCalledTimes(1);
    // The pinned sheets survived the failed repack.
    for (const s of sheets) expect(atlas.has(s)).toBe(true);
    warn.mockRestore();
  });

  it('uploads only the new region after the first full upload', () => {
    const atlas = new MegaAtlas(100, fakeSurface());
    const copies: Array<{ src: Texture; x: number; y: number }> = [];
    const renderer = {
      copyTextureToTexture: (src: Texture, _dst: Texture, _r?: null, at?: Vector2 | null) => {
        copies.push({ src, x: at?.x ?? 0, y: at?.y ?? 0 });
      },
    };
    atlas.beginFrame();
    atlas.place(sheet());
    expect(atlas.texture.version).toBeGreaterThan(0); // first fill: one full upload
    const fullVersion = atlas.texture.version;
    atlas.flush(renderer);
    expect(copies).toHaveLength(0);
    atlas.place(sheet(50, 20));
    atlas.flush(renderer);
    expect(atlas.texture.version).toBe(fullVersion); // no full re-upload
    // Placed at canvas (50, 0), 20 tall: GL row 100 - 0 - 20 with flipY.
    expect(copies).toEqual([{ src: expect.anything(), x: 50, y: 80 }]);
    atlas.flush(renderer);
    expect(copies).toHaveLength(1);
  });
});

describe('SpriteBatch with an evicting atlas', () => {
  it("re-points the frame's earlier quads after a repack", () => {
    const atlas = new MegaAtlas(100, fakeSurface());
    const batch = new SpriteBatch(atlas);
    const [a, b, c, d, e] = [sheet(), sheet(), sheet(), sheet(), sheet()];
    const draw = (s: SpriteSheet) =>
      batch.draw({ sheet: s, rect: RECT, flip: false, x: 0, y: 0, z: 0, mode: 'billboard' });
    batch.begin(0, 0.6);
    for (const s of [a, b, c, d]) draw(s);
    batch.end();
    batch.begin(0, 0.6);
    draw(d);
    const gen = atlas.generation;
    const before = atlas.uv(d, RECT);
    draw(e); // forces a repack, which moves d (pinned, so it goes in first, at the origin)
    expect(atlas.generation).toBe(gen + 1);
    expect(atlas.uv(d, RECT)).not.toEqual(before);
    batch.end();
    expect(batch.drawn).toBe(2);
    const uvs = batch.mesh.geometry.getAttribute('uv').array;
    const expectUv = (i: number, s: SpriteSheet) => {
      const [u0, v0, u1, v1] = atlas.uv(s, RECT)!;
      const want = Float32Array.from([u0, v0, u1, v0, u0, v1, u1, v1]);
      expect(Array.from(uvs.slice(i * 8, i * 8 + 8))).toEqual(Array.from(want));
    };
    expectUv(0, d);
    expectUv(1, e);
  });
});
