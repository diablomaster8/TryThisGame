import { describe, expect, it } from 'vitest';
import { groundType, partnerEmote, walkMs, walkPose, type Walk } from '../../src/render/walk-on';
import { PrintTrail } from '../../src/render/walk-prints';

const walk: Walk = {
  kind: 'actor',
  key: 'corvin',
  from: { x: 0, z: 0 },
  to: { x: 0, z: 10 },
  yaw: 0,
  endFace: 3,
  startMs: 1000,
  durMs: 4000,
  done: false,
};

describe('walk-ons (K5)', () => {
  it('walks from the start mark to the end mark', () => {
    expect(walkPose(walk, 500, false)).toEqual({ x: 0, z: 0, walking: false });
    const mid = walkPose(walk, 3000, false);
    expect(mid.z).toBeCloseTo(5, 5);
    expect(mid.walking).toBe(true);
    expect(walkPose(walk, 9000, false)).toEqual({ x: 0, z: 10, walking: false });
  });
  it('appears on the mark under reduced motion', () => {
    expect(walkPose(walk, 1500, true)).toEqual({ x: 0, z: 10, walking: false });
  });
  it('clamps the time a walk takes', () => {
    expect(walkMs(0.1)).toBe(800);
    expect(walkMs(500)).toBe(4800);
  });
});

describe('footprints (K36)', () => {
  it('drops one print a stride, only on snow, mud or sand', () => {
    const t = new PrintTrail();
    const at = (z: number) => [{ key: 'a', x: 0, z, yaw: 0 }];
    expect(t.feed(at(0), 0)).toHaveLength(0);
    expect(t.feed(at(0.3), 0)).toHaveLength(0);
    expect(t.feed(at(0.7), 0)).toHaveLength(1);
  });
  it('reads the ground from the story', () => {
    const f = (campaign: string, chapter: number, storyChapter: number | null) =>
      groundType({ campaign, chapter, storyChapter, location: 'grove' } as never);
    expect(f('hazel', 11, null)).toBe('snow');
    expect(f('hazel', 3, null)).toBeNull();
    expect(f('beetle', 2, 1)).toBe('sand');
    expect(f('hundred', 7, 6)).toBe('mud');
  });
});

describe('partner reactions (K40)', () => {
  it('maps a line mood to an emote ball', () => {
    expect(partnerEmote('happy')).toBe('heart');
    expect(partnerEmote('sad')).toBe('spiral');
    expect(partnerEmote('shock')).toBe('exclaim');
    expect(partnerEmote('angry')).toBeNull();
    expect(partnerEmote(undefined)).toBeNull();
  });
});
