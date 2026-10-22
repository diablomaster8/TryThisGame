import { describe, expect, it } from 'vitest';
import { GROVE3D } from '../../src/config/tuning';
import { bandFor } from '../../src/render/cave-bands';
import { assignTorches } from '../../src/render3d/cave-lamps';

/** The Hollow's colour script by depth and its torch-lamp assignment (art pass, items 7, 8). */
describe('cave bands', () => {
  it('picks the band whose range holds the floor', () => {
    expect(bandFor(1).name).toBe('mossy earth');
    expect(bandFor(5).name).toBe('mossy earth');
    expect(bandFor(6).name).toBe('blue crystal grotto');
    expect(bandFor(11).name).toBe('amber fungus cavern');
    expect(bandFor(20).name).toBe('pastel prism depths');
  });

  it('clamps outside the table', () => {
    expect(bandFor(0)).toBe(GROVE3D.cave.bands[0]);
    expect(bandFor(99)).toBe(GROVE3D.cave.bands[GROVE3D.cave.bands.length - 1]);
  });

  it('keeps every background a readable mid-tone, never black', () => {
    for (const b of GROVE3D.cave.bands) {
      const n = parseInt(b.background.slice(1), 16);
      const max = Math.max(n >> 16, (n >> 8) & 255, n & 255);
      expect(max).toBeGreaterThanOrEqual(0x20);
    }
  });
});

describe('torch lamps', () => {
  const row = [0, 4, 8, 12, 16].map((x) => ({ x, z: 0 }));

  it('lights the nearest torches', () => {
    const got = assignTorches([-1, -1, -1], row, { x: 0, z: 0 }, 0);
    expect([...got].sort()).toEqual([0, 1, 2]);
  });

  it('keeps a lit torch until another is clearly nearer', () => {
    // At x 6.5, torch 3 (x 12) is 0.5 nearer than torch 0 (x 0): not enough to swap.
    expect(assignTorches([0, 1, 2], row, { x: 6.5, z: 0 }, 2)).toEqual([0, 1, 2]);
    // At x 9, torch 3 is 6 nearer: the lamp at torch 0 moves to it, the others stay put.
    expect(assignTorches([0, 1, 2], row, { x: 9, z: 0 }, 2)).toEqual([3, 1, 2]);
  });

  it('leaves a lamp dark when there are fewer torches than lamps', () => {
    expect(assignTorches([-1, -1, -1], row.slice(0, 2), { x: 0, z: 0 }, 0)).toEqual([0, 1, -1]);
  });
});
