/**
 * Turned decor in Pixel (R0007, MOVE-04 ↻ Turn): a fence, bench or flower bed placed with a
 * yaw shows its three-quarter or end-on frame, mirrored for the other side, as the 3D mesh
 * turns. Set DECOR_SHEET=path.png to write a contact sheet (front, quarter, side per kind).
 */
import { writeFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { decorFrame, drawTurnedDecor, TURNED_DECOR } from '../../src/render/sprites/props';
import { blitScaled, encodePng, solid } from '../tools/png';

const Q = Math.PI / 4;

describe('turned decor frames (R0007)', () => {
  it('an unturned piece and a round piece use the front frame', () => {
    expect(decorFrame('fence', 0, 0)).toEqual({ key: 'fence:front:0', flip: false });
    expect(decorFrame('fence', undefined, 3)).toEqual({ key: 'fence:front:0', flip: false });
    expect(decorFrame('statue', 2 * Q, 0)).toEqual({ key: 'statue:front:0', flip: false });
  });

  it('picks the quarter and end-on frames by yaw against the camera', () => {
    expect(decorFrame('fence', 2 * Q, 0).key).toBe('fence:side:0');
    expect(decorFrame('fence', 6 * Q, 0).key).toBe('fence:side:0');
    expect(decorFrame('fence', 4 * Q, 0).key).toBe('fence:front:0');
    const a = decorFrame('bench', Q, 0);
    const b = decorFrame('bench', -Q, 0);
    expect(a.key).toBe('bench:frontQuarter:0');
    expect(b.key).toBe('bench:frontQuarter:0');
    expect(a.flip).not.toBe(b.flip);
    // Turning the camera with the piece leaves the frame unchanged.
    expect(decorFrame('fence', 3 * Q, 2 * Q)).toEqual(decorFrame('fence', Q, 0));
    // A back quarter mirrors its opposite front quarter (the fence reads the same both ways).
    expect(decorFrame('fence', 3 * Q, 0)).toEqual(decorFrame('fence', -Q, 0));
  });

  it('draws every turned frame', () => {
    for (const k of TURNED_DECOR)
      for (const a of ['frontQuarter', 'side'] as const)
        expect(drawTurnedDecor(k, a).bounds(), `${k} ${a}`).not.toBeNull();
  });
});

it.skipIf(!process.env.DECOR_SHEET)('writes a turned decor contact sheet', () => {
  const s = 6;
  const cell = 32 * s;
  const width = cell * 2;
  const height = cell * TURNED_DECOR.length;
  const rgba = solid(width, height, '#7fae5a');
  TURNED_DECOR.forEach((k, r) => {
    blitScaled(rgba, width, drawTurnedDecor(k, 'frontQuarter'), 0, r * cell, s);
    blitScaled(rgba, width, drawTurnedDecor(k, 'side'), cell, r * cell, s);
  });
  writeFileSync(process.env.DECOR_SHEET!, encodePng(width, height, rgba));
});
