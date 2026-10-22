import { describe, expect, it } from 'vitest';
import { nubbinSits } from '../../src/config/npc-looks';
import { E_STAGES } from '../../src/config/tuning-e';
import { hushPresence, lanternLights } from '../../src/render/dress-e';
import type { StageFlags } from '../../src/render/scene-stage';

const flags = (over: Partial<StageFlags>): StageFlags => ({
  campaign: 'hazel',
  storyline: null,
  chapter: 4,
  storyChapter: null,
  half: null,
  vigilWave: null,
  vigilLull: false,
  vigilDone: false,
  pens: [false, false, false],
  corvin: null,
  location: 'grove',
  grove: 'main',
  place: null,
  sceneId: null,
  grave: false,
  tale: false,
  moon: null,
  inside: null,
  ...over,
});

describe('package e: lantern states', () => {
  it('Lantern Night lights four posts and flickers the long-grass one', () => {
    const s = lanternLights(flags({ sceneId: 'c4-close' }), E_STAGES['c4-close']!, 0, false);
    expect(s).toEqual({
      'lantern-1': 'lit',
      'lantern-2': 'lit',
      'lantern-3': 'lit',
      'lantern-4': 'flicker',
    });
  });

  it('the vigil puts the stream lantern out, then shrinks the long-grass one', () => {
    const w1 = lanternLights(flags({ vigilWave: 1 }), {}, 0, false);
    expect(w1['lantern-2']).toBe('out');
    expect(w1['lantern-4']).toBe('lit');
    const w2 = lanternLights(flags({ vigilWave: 2 }), {}, 0, false);
    expect(w2['lantern-4']).toBe('low');
    expect(lanternLights(flags({ vigilWave: 2, vigilDone: true }), {}, 0, false)).toEqual({});
  });

  it('the Hush puts lamps out nearest-first, and all at once under reduced motion', () => {
    const f = flags({ sceneId: 'h-c9-open' });
    expect(Object.values(lanternLights(f, {}, 0, false))).toEqual(Array(4).fill('lit'));
    expect(Object.values(lanternLights(f, {}, 60, false))).toEqual(Array(4).fill('out'));
    expect(Object.values(lanternLights(f, {}, 0, true))).toEqual(Array(4).fill('out'));
    expect(hushPresence('h-c9-open', 0, true)).toBe(1);
    expect(hushPresence('c4-close', 5, false)).toBe(0);
  });

  it('says nothing away from the Grove', () => {
    expect(lanternLights(flags({ location: 'hollow', vigilWave: 1 }), {}, 0, false)).toEqual({});
  });
});

describe('package e: Moss sits', () => {
  it('only Moss, only on a sit entry', () => {
    const stage = E_STAGES['c4-open']!;
    expect(nubbinSits(stage, 'm1', 'm1')).toBe(true);
    expect(nubbinSits(stage, 'm1', 'x')).toBe(false);
    expect(nubbinSits({}, 'm1', 'm1')).toBe(false);
  });
});
