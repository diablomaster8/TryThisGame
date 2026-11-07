/**
 * HOT (load time, 2026-11-06): a cold start used to bake every sprite sheet and build every
 * story dressing in its first frame (17 s at 4x CPU before the Grove showed). Scenery, props,
 * the cast and off-screen Nubbins now stream in a sheet a frame, and the dressings build one
 * package a frame from the second frame on. These pin that ordering.
 */
import { describe, expect, it } from 'vitest';
import type { SpriteSheet } from '../../src/render/sprites/atlas';
import { SheetCache } from '../../src/render/sprites/sheets';
import { PixelDressings, type PixelDressCtx, type PixelDressing } from '../../src/render/dressings';
import { FRAME_WORK } from '../../src/platform/frame-spikes';
import type { World } from '../../src/sim/types';
import type { Daylight } from '../../src/render/daylight';

const sheet = (name: string): SpriteSheet =>
  ({ frames: new Map([[name, {}]]), dispose: () => undefined }) as unknown as SpriteSheet;

/** What the frame log does at the top of each game frame. */
function nextFrame(): void {
  FRAME_WORK.frame++;
  FRAME_WORK.bakes = 0;
}

describe('streamed sheets (load time)', () => {
  it('skips streamed bakes on the first frame, then bakes one a frame', () => {
    const cache = new SheetCache(() => 0);
    nextFrame();
    // The Keeper's sheet always bakes; a streamed one waits on the first frame.
    cache.get('keeper', () => sheet('keeper'));
    const first = cache.streamed((c) => c.get('scenery', () => sheet('scenery')));
    expect(first.frames.size).toBe(0);
    expect(cache.has('scenery')).toBe(false);
    nextFrame();
    expect(cache.streamed((c) => c.get('scenery', () => sheet('scenery'))).frames.size).toBe(1);
    // One streamed bake per frame: the next waits for the next frame.
    expect(cache.streamed((c) => c.get('props', () => sheet('props'))).frames.size).toBe(0);
    nextFrame();
    expect(cache.streamed((c) => c.get('props', () => sheet('props'))).frames.size).toBe(1);
    // Baked sheets come back at once, any frame.
    expect(cache.streamed((c) => c.get('scenery', () => sheet('x'))).frames.has('scenery')).toBe(
      true,
    );
  });

  it('never defers a plain get', () => {
    const cache = new SheetCache(() => 0);
    nextFrame();
    cache.streamed((c) => c.get('a', () => sheet('a')));
    expect(cache.get('b', () => sheet('b')).frames.size).toBe(1);
  });
});

describe('lazy story dressings (load time)', () => {
  it('builds none in the first frame, then one package a frame, in order', () => {
    const log: string[] = [];
    const pkg = (id: string): PixelDressing => ({
      id,
      build: () => log.push(`build ${id}`),
      update: () => log.push(`update ${id}`),
    });
    const d = new PixelDressings([pkg('a'), pkg('b')]);
    d.buildLazily({} as PixelDressCtx);
    const frame = (): void => d.update({} as World, {}, {} as Daylight, 0.016);
    frame();
    expect(log).toEqual([]);
    frame();
    expect(log).toEqual(['build a', 'update a']);
    frame();
    frame();
    expect(log).toEqual([
      'build a',
      'update a',
      'build b',
      'update a',
      'update b',
      'update a',
      'update b',
    ]);
  });
});
