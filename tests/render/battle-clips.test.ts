import { describe, expect, it } from 'vitest';
import {
  BATTLE_CLIP_ANGLES,
  BATTLE_CLIP_NAMES,
  CLIPS,
  frameKey,
} from '../../src/render/sprites/animations';
import { CHILD_NEUTRAL, drawChao, lookOf, poseFor } from '../../src/render/sprites/chao';

describe('R0239 battle clips', () => {
  it('defines the eight verbs with the planned frame counts', () => {
    const frames = Object.fromEntries(BATTLE_CLIP_NAMES.map((c) => [c, CLIPS[c].frames]));
    expect(frames).toEqual({
      windup: 2,
      bonk: 2,
      splash: 2,
      hit: 1,
      dodge: 2,
      cheer: 2,
      tuckered: 2,
      wave: 2,
    });
  });
  it('gives every frame its own pose and draws it at the front and side angles', () => {
    const look = lookOf(CHILD_NEUTRAL);
    let added = 0;
    for (const clip of BATTLE_CLIP_NAMES)
      for (let f = 0; f < CLIPS[clip].frames; f++) {
        expect(poseFor(clip, f)).not.toEqual(poseFor('idle', 0));
        for (const angle of BATTLE_CLIP_ANGLES) {
          expect(frameKey(clip, angle, f)).toBe(`${clip}:${angle}:${f}`);
          expect(drawChao(angle, poseFor(clip, f), look).width).toBeGreaterThan(0);
          added++;
        }
      }
    // The count the sheet budget note: 15 frames x 2 angles added to each sheet.
    expect(added).toBe(30);
  });
});
