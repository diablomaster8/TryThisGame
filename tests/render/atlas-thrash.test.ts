/**
 * HOT-2: the Pixel Grove's sprite atlas must not repack (and re-upload all 64 MB of it)
 * frame after frame. The sheet sizes are the ones a Grove with three children, the Keeper
 * and the story cast drew in one frame (logged by the spike probe, 2026-10-30), in the
 * order the view draws them: scenery and props, the cast, then the Nubbins and effects.
 */
import { describe, expect, it } from 'vitest';
import type { SpriteSheet } from '../../src/render/sprites/atlas';
import { MegaAtlas, type AtlasSurface } from '../../src/render/sprites/mega-atlas';

const surface = (size: number): AtlasSurface => ({
  canvas: { width: size, height: size } as HTMLCanvasElement,
  ctx: { drawImage: () => undefined, clearRect: () => undefined } as unknown as AtlasSurface['ctx'],
});

const sheet = (w: number, h: number): SpriteSheet => ({
  texture: { image: { width: w, height: h } } as unknown as SpriteSheet['texture'],
  width: w,
  height: h,
  frames: new Map(),
  cellW: 32,
  cellH: 32,
  dispose: () => undefined,
});

const SCENE: Array<[number, number]> = [
  [2038, 659],
  [2034, 590],
  [1880, 199],
  [2022, 90],
  [1004, 94],
  [922, 66],
  ...Array.from({ length: 10 }, (): [number, number] => [640, 768]),
  [640, 896],
  [640, 1856],
  [640, 1856],
  [640, 1856],
  [192, 72],
  [128, 64],
  [32, 32],
];

function play(atlas: MegaAtlas, sheets: SpriteSheet[], frames: number): number {
  let repacks = 0;
  for (let f = 0; f < frames; f++) {
    atlas.beginFrame();
    const g = atlas.generation;
    for (const s of sheets) expect(atlas.place(s)).not.toBeNull();
    if (atlas.generation !== g) repacks++;
  }
  return repacks;
}

describe('HOT-2: the sprite atlas under a crowded Grove', () => {
  it('settles: a frame-after-frame working set stops repacking after warm-up', () => {
    const atlas = new MegaAtlas(4096, surface);
    const sheets = SCENE.map(([w, h]) => sheet(w, h));
    play(atlas, sheets, 3);
    expect(play(atlas, sheets, 60)).toBe(0);
    // It fits one page, so no second 64 MB page is opened for it.
    expect(atlas.pagesOpen).toBe(1);
  });

  it('settles with eight Nubbins too, on a second page', () => {
    const atlas = new MegaAtlas(4096, surface);
    const sheets = [
      ...SCENE,
      ...Array.from({ length: 5 }, (): [number, number] => [640, 1856]),
    ].map(([w, h]) => sheet(w, h));
    play(atlas, sheets, 3);
    expect(play(atlas, sheets, 60)).toBe(0);
    expect(atlas.pagesOpen).toBe(2);
  });

  it('a view that swaps sheets as the camera turns opens page two, then settles', () => {
    const atlas = new MegaAtlas(100, surface);
    const left = [sheet(50, 50), sheet(50, 50), sheet(50, 50)];
    const right = [sheet(50, 50), sheet(50, 50), sheet(50, 50)];
    // Turn every 10 frames: each view alone fits one page, both together do not.
    let repacks = 0;
    for (let turn = 0; turn < 20; turn++) {
      const g = atlas.generation;
      play(atlas, turn % 2 ? right : left, 10);
      if (turn >= 4) repacks += atlas.generation - g;
    }
    expect(atlas.pagesOpen).toBe(2);
    expect(repacks).toBe(0);
  });

  it('slow changes stay on one page', () => {
    const atlas = new MegaAtlas(100, surface);
    for (let turn = 0; turn < 6; turn++)
      play(
        atlas,
        Array.from({ length: 3 }, () => sheet(50, 50)),
        200,
      );
    expect(atlas.pagesOpen).toBe(1);
  });

  it('a new Nubbin in a full Grove costs one repack, not one per frame', () => {
    const atlas = new MegaAtlas(4096, surface);
    const sheets = SCENE.map(([w, h]) => sheet(w, h));
    play(atlas, sheets, 3);
    sheets.splice(8, 0, sheet(640, 1856));
    expect(play(atlas, sheets, 60)).toBeLessThanOrEqual(1);
  });
});
