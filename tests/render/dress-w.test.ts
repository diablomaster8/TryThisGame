import { describe, expect, it } from 'vitest';
import { LANTERN_POSTS } from '../../src/config/tuning';
import { hushPresence, lanternLights } from '../../src/render/dress-e';
import { pondIceWanted } from '../../src/render/dress-w';
import { paintGround } from '../../src/render/ground';
import { HushTrail } from '../../src/render/hush-trail';
import { paintSnowCrown } from '../../src/render/paint/scenery';
import type { StageFlags } from '../../src/render/scene-stage';

const flags = (over: Partial<StageFlags>): StageFlags => ({
  campaign: 'hundred',
  storyline: 'hundred',
  chapter: 9,
  storyChapter: 8,
  half: null,
  vigilWave: null,
  vigilLull: false,
  vigilDone: false,
  pens: [false, false, false],
  corvin: null,
  location: 'grove',
  grove: 'main',
  place: null,
  sceneId: 'h-c9-open',
  ...over,
});

describe('package w: the Hush starts with its line', () => {
  it('keeps every lantern lit and the colossus away until the line shows', () => {
    const lit = lanternLights(flags({}), {}, -1, false);
    expect(Object.values(lit)).toEqual(Array(4).fill('lit'));
    // Reduced motion also waits for the line, then goes out at once.
    expect(Object.values(lanternLights(flags({}), {}, -1, true))).toEqual(Array(4).fill('lit'));
    expect(Object.values(lanternLights(flags({}), {}, 0, true))).toEqual(Array(4).fill('out'));
    expect(hushPresence('h-c9-open', -1, false)).toBe(0);
    expect(hushPresence('h-c9-open', -1, true)).toBe(0);
    expect(hushPresence('h-c9-close', -1, false)).toBe(1);
  });
});

describe('package w: the Hush trail', () => {
  const ids = LANTERN_POSTS.map((p) => ({ id: p.id }));
  it('frosts each post as it goes out and holds the frost for the chapter', () => {
    const t = new HushTrail();
    const out = {
      'lantern-1': 'out',
      'lantern-2': 'lit',
      'lantern-3': 'lit',
      'lantern-4': 'lit',
    } as const;
    t.update(flags({}), out, ids, true, false, 0.5, false);
    const a = t.update(flags({}), out, ids, true, false, 0.5, false);
    expect(a.get('lantern-1')).toBeGreaterThan(0);
    expect(a.has('lantern-2')).toBe(false);
    // Later in the walk the lamp is lit again (the close) and the frost stays, full grown.
    const b = t.update(flags({ sceneId: 'h-c9-close' }), {}, ids, false, true, 5, false);
    expect(b.get('lantern-1')).toBe(1);
    expect(b.size).toBe(4);
    // Leaving the chapter clears it.
    expect(t.update(flags({ chapter: 10 }), {}, ids, false, false, 1, false).size).toBe(0);
  });
  it('arrives fully grown under reduced motion', () => {
    const t = new HushTrail();
    const all = {
      'lantern-1': 'out',
      'lantern-2': 'out',
      'lantern-3': 'out',
      'lantern-4': 'out',
    } as const;
    const g = t.update(flags({}), all, ids, true, false, 0, true);
    expect([...g.values()]).toEqual([1, 1, 1, 1]);
  });
});

describe('package w: the pond ice', () => {
  it('follows the stage prop, else Hazel chapter 10', () => {
    expect(pondIceWanted({ props: { pondIce: 'show' } }, 'hundred', 3)).toBe(true);
    expect(pondIceWanted({ props: { pondIce: 'hide' } }, 'hazel', 10)).toBe(false);
    expect(pondIceWanted({}, 'hazel', 10)).toBe(true);
    expect(pondIceWanted({}, 'hazel', 4)).toBe(false);
  });
});

describe('package w: winter paint', () => {
  it('lays snow only on the canopy tops, not the trunk, in a 1 px blue shade at the base', () => {
    const w = 20;
    const h = 30;
    const data = new Uint8ClampedArray(w * h * 4);
    const put = (x: number, y: number, r: number, g: number, b: number) => {
      const i = (y * w + x) * 4;
      data.set([r, g, b, 255], i);
    };
    for (let y = 4; y < 16; y++) for (let x = 3; x < 17; x++) put(x, y, 60, 140, 70);
    for (let y = 16; y < 28; y++) for (let x = 9; x < 11; x++) put(x, y, 110, 70, 40);
    const r = paintSnowCrown({ data, width: w, height: h }, 5, 1);
    const snow = (x: number, y: number) => r.mask[y * w + x] === 1;
    expect(snow(10, 4)).toBe(true);
    expect(snow(10, 27)).toBe(false);
    expect(snow(10, 20)).toBe(false);
    // Nothing below the crown's own depth.
    expect(snow(10, 14)).toBe(false);
  });

  it('frosts the grass but leaves the base painting alone', () => {
    const base = paintGround(7, {}, 2);
    const winter = paintGround(7, {}, 2, 'winter');
    expect(winter.rgba.length).toBe(base.rgba.length);
    let differ = 0;
    for (let i = 0; i < base.rgba.length; i += 4)
      if (base.rgba[i + 1] !== winter.rgba[i + 1]) differ++;
    expect(differ).toBeGreaterThan(base.rgba.length / 16);
    expect(paintGround(7, {}, 2, null).rgba).toEqual(base.rgba);
  });
});
