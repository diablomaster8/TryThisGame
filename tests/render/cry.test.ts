import { describe, expect, it } from 'vitest';
import { DRAWN_ANGLES } from '../../src/render/sprites/angles';
import {
  CHILD_NEUTRAL,
  CRY_CLIP,
  cryPose,
  drawChao,
  lookOf,
  poseFor,
} from '../../src/render/sprites/chao';

/** Crying looks like crying (LOOK-21): its own seated clip with fists, a wail and tears. */
describe('the cry clip', () => {
  it('draws both frames at every angle, unlike sad (the sheet adds them as cry:<angle>:<f>)', () => {
    const look = lookOf(CHILD_NEUTRAL);
    for (const a of DRAWN_ANGLES)
      for (let f = 0; f < CRY_CLIP.frames; f++) {
        const cry = Array.from(drawChao(a, cryPose(f), look).data);
        expect(cry.some((v) => v > 0)).toBe(true);
        expect(cry, `${a} ${f}`).not.toEqual(Array.from(drawChao(a, poseFor('sad', f), look).data));
      }
  });

  it('is distinct from sad, and its frames alternate the fists and add tears', () => {
    const look = lookOf(CHILD_NEUTRAL);
    const px = (p: ReturnType<typeof poseFor>) => Array.from(drawChao('front', p, look).data);
    expect(px(cryPose(0))).not.toEqual(px(poseFor('sad', 1)));
    expect(px(cryPose(0))).not.toEqual(px(cryPose(1)));
    expect(cryPose(0).legs).toBe('out');
    expect(cryPose(1).tears).toBe(true);
    expect(cryPose(0).tears).toBeUndefined();
  });
});
