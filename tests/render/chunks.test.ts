import { describe, expect, it } from 'vitest';
import { WORLD_STREAM } from '../../src/config/tuning';
import { ActiveChunks, chunkOf, SpriteCuller } from '../../src/render/chunks';
import type { SpriteDraw } from '../../src/render/sprite-batch';

describe('chunk grid (WORLD-09)', () => {
  it('cuts the world into chunk-sized squares, negatives included', () => {
    expect(chunkOf(0, 0)).toEqual({ cx: 0, cz: 0 });
    expect(chunkOf(-0.1, WORLD_STREAM.chunk)).toEqual({ cx: -1, cz: 1 });
  });

  it('keeps a 5×5 block and drops a chunk only past the hysteresis ring', () => {
    const a = new ActiveChunks(2, 1, 16);
    expect(a.update(8, 8).added.length).toBe(25);
    // One chunk east: a new column joins, nothing leaves yet.
    const step = a.update(24, 8);
    expect(step.added.length).toBe(5);
    expect(step.removed.length).toBe(0);
    // Back and forth along the edge builds nothing more.
    expect(a.update(8, 8).added.length).toBe(0);
    expect(a.update(24, 8).added.length).toBe(0);
    // Four chunks east: the west columns are past rings + keepRings and go.
    const far = a.update(8 + 16 * 4, 8);
    expect(far.removed.length).toBeGreaterThan(0);
    expect(a.count).toBe(5 * 6);
  });
});

describe('sprite culler', () => {
  const cam = {
    target: { x: 0, y: 0, z: 0 },
    currentYaw: 0,
    pitch: (35 * Math.PI) / 180,
    visibleWidth: 20,
    visibleHeight: 30,
  };
  const sprite = (x: number, z: number, mode: SpriteDraw['mode'] = 'billboard') =>
    ({ x, y: 0, z, mode }) as SpriteDraw;

  it('keeps what is on screen and near its edge, drops what is far off', () => {
    const c = new SpriteCuller();
    c.update(cam);
    expect(c.visible(sprite(0, 0), 2, 2)).toBe(true);
    expect(c.visible(sprite(12, 0), 2, 2)).toBe(true);
    expect(c.visible(sprite(40, 0), 2, 2)).toBe(false);
    expect(c.visible(sprite(0, 80), 2, 2)).toBe(false);
    expect(c.visible(sprite(0, -80), 2, 2)).toBe(false);
  });

  it('turns with the camera', () => {
    const c = new SpriteCuller();
    c.update({ ...cam, currentYaw: Math.PI / 2 });
    // Looking along x now, so a sprite 40 east is straight ahead in depth, not off to the side.
    expect(c.visible(sprite(0, 40), 2, 2)).toBe(false);
    expect(c.visible(sprite(12, 0), 2, 2)).toBe(true);
  });
});
