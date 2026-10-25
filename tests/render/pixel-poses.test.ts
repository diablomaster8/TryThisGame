/**
 * The pixel love and tumble clips (parity with the 3D poses): love blushes, tumble rolls a
 * quarter turn a frame about the sprite's own middle, for the Chao and the generic drawer.
 */
import { describe, expect, it } from 'vitest';
import { CLIPS } from '../../src/render/sprites/animations';
import { drawChao, lookOf, CHILD_NEUTRAL, poseFor } from '../../src/render/sprites/chao';
import { drawCreature } from '../../src/render/sprites/creature';
import { C } from '../../src/render/sprites/palette';
import { PixelCanvas } from '../../src/render/sprites/pixel-canvas';
import { speciesArt } from '../../src/render/sprites/species-art';
import { SPECIES } from '../../src/sim/species';

const count = (pc: PixelCanvas, idx: number) =>
  Array.from(pc.data).filter((v) => v === idx + 1).length;
const filled = (pc: PixelCanvas) => Array.from(pc.data).filter((v) => v !== 0).length;

describe('pixel love and tumble', () => {
  it('has the clips', () => {
    expect(CLIPS.love.frames).toBe(2);
    expect(CLIPS.tumble.frames).toBe(4);
  });

  it('blushes in love', () => {
    const look = lookOf(CHILD_NEUTRAL);
    const happy = drawChao('front', poseFor('happy', 0), look);
    const love = drawChao('front', poseFor('love', 0), look);
    expect(count(love, C.rose)).toBeGreaterThan(count(happy, C.rose));
  });

  it('rolls a quarter turn a frame and keeps every pixel', () => {
    const look = lookOf(CHILD_NEUTRAL);
    const frames = [0, 1, 2, 3].map((f) => drawChao('side', poseFor('tumble', f), look));
    for (let i = 1; i < 4; i++)
      expect(Array.from(frames[i]!.data)).not.toEqual(Array.from(frames[0]!.data));
    for (const f of frames)
      expect(Math.abs(filled(f) - filled(frames[0]!))).toBeLessThan(filled(frames[0]!) * 0.05);
    const id = Object.keys(SPECIES).find((k) => k !== 'chao' && speciesArt(k));
    const art = id ? speciesArt(id) : undefined;
    if (art) {
      const a = drawCreature('side', poseFor('tumble', 0), art);
      const b = drawCreature('side', poseFor('tumble', 2), art);
      expect(Array.from(b.data)).not.toEqual(Array.from(a.data));
    }
  });

  it('turns four quarter turns back to the start', () => {
    const pc = new PixelCanvas(8, 8);
    pc.rect(1, 2, 3, 5, C.rose);
    pc.px(5, 5, C.ink);
    let r = pc;
    for (let i = 0; i < 4; i++) r = r.rotatedQuarter(1);
    expect(Array.from(r.data)).toEqual(Array.from(pc.data));
  });
});
