import { describe, expect, it } from 'vitest';
import { EDU } from '../../src/config/edu';
import {
  EDU_STICKER_PAGES,
  EDU_STICKERS,
  ownedStickers,
  pageStickers,
  stickerPage,
} from '../../src/config/edu-stickers';
import { deserialize, serialize } from '../../src/sim/save';
import { applyCommand, createWorld } from '../../src/sim/world';

describe('R0685 (KIDS-17) sticker book', () => {
  it('has sixty unique stickers, ten on each of six pages, with short spoken names', () => {
    expect(EDU_STICKERS).toHaveLength(60);
    expect(new Set(EDU_STICKERS.map((s) => s.id)).size).toBe(60);
    for (const p of EDU_STICKER_PAGES) expect(pageStickers(p.id)).toHaveLength(10);
    for (const s of EDU_STICKERS) {
      expect(s.say.split(/\s+/).length).toBeLessThanOrEqual(14);
      expect(EDU_STICKER_PAGES.some((p) => p.id === stickerPage(s.id))).toBe(true);
    }
    // The first six stickers come one from each page.
    expect(EDU_STICKERS.slice(0, 6).map((s) => stickerPage(s.id))).toEqual(
      EDU_STICKER_PAGES.map((p) => p.id),
    );
  });

  it('earning nine stars adds the next sticker, in a fixed order, and it survives a reload', () => {
    const w = createWorld(1, 0);
    applyCommand(w, { kind: 'eduStart', age: 4 }, []);
    for (let i = 0; i < EDU.starsPerSticker / 3; i++)
      applyCommand(w, { kind: 'eduResult', game: 'colours', stars: 3 }, []);
    expect(ownedStickers(w.edu!.stickers).map((s) => s.id)).toEqual([EDU_STICKERS[0]!.id]);
    const back = deserialize(serialize(w, 0)).world;
    expect(ownedStickers(back.edu!.stickers)[0]!.id).toBe('grove-1');
  });

  it('an old save’s sticker count names that many stickers', () => {
    expect(ownedStickers(5)).toHaveLength(5);
    expect(ownedStickers(500)).toHaveLength(60);
    expect(ownedStickers(-1)).toHaveLength(0);
  });
});
