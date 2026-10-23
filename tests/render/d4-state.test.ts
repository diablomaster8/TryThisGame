import { describe, expect, it } from 'vitest';
import { CG4_D4 } from '../../src/config/tuning-d4';
import {
  hushFog,
  hushPathAt,
  hushWalk,
  levelOf,
  moonPhaseFor,
  pathWear,
  snowCover,
  WetTracker,
  WindState,
} from '../../src/render/d4-state';
import type { StageFlags } from '../../src/render/scene-stage';

const flags = (over: Partial<StageFlags>): StageFlags => ({
  campaign: 'hazel',
  storyline: null,
  chapter: 1,
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

describe('K24 moon', () => {
  it('uses the stage moon, else the chapter default, with the Long Night new', () => {
    expect(moonPhaseFor(flags({ chapter: 10 }))).toBe('new');
    expect(moonPhaseFor(flags({ chapter: 3 }))).toBe('crescent');
    expect(moonPhaseFor(flags({ chapter: 10, moon: 'full' }))).toBe('full');
    expect(moonPhaseFor(flags({ campaign: 'hundred', storyline: 'hundred', chapter: 9 }))).toBe(
      'new',
    );
  });
});

describe('K25 snow and K26 wear', () => {
  it('rises with the vigil waves and holds to the dawn', () => {
    const at = (vigilWave: number | null, vigilDone = false) =>
      snowCover(flags({ chapter: 10, vigilWave, vigilDone }));
    expect(at(null)).toBe(0);
    expect(at(0)).toBeLessThan(at(1));
    expect(at(1)).toBeLessThan(at(2));
    expect(at(2, true)).toBe(at(2));
    expect(snowCover(flags({ chapter: 5, vigilWave: 2 }))).toBe(0);
    expect(snowCover(flags({ campaign: 'hundred', chapter: 10, vigilWave: 2 }))).toBe(0);
  });

  it('switches the pixel repaint at three levels', () => {
    const lv = (w: number) =>
      levelOf(snowCover(flags({ chapter: 10, vigilWave: w })), CG4_D4.snow.levels);
    expect([lv(0), lv(1), lv(2)]).toEqual([1, 2, 3]);
  });

  it('wears the paths in over Hazel’s twelve chapters', () => {
    const w = (c: number) => pathWear(flags({ chapter: c }));
    expect(w(1)).toBe(0);
    expect(w(6)).toBeGreaterThan(w(3));
    expect(w(12)).toBeCloseTo(CG4_D4.wear.max);
    expect(levelOf(w(1), CG4_D4.wear.levels)).toBe(0);
    expect(levelOf(w(12), CG4_D4.wear.levels)).toBe(3);
  });
});

describe('K34 puddles', () => {
  it('grows in rain over a scene and dries over the next', () => {
    const t = new WetTracker();
    expect(t.update(true, CG4_D4.wet.riseS / 2)).toBeCloseTo(0.5);
    expect(t.update(true, CG4_D4.wet.riseS)).toBe(1);
    expect(t.update(false, CG4_D4.wet.dryS / 2)).toBeCloseTo(0.5);
    expect(t.update(false, CG4_D4.wet.dryS)).toBe(0);
  });
});

describe('K35 wind', () => {
  it('leans harder in a windy scene and eases between scenes; reduced motion cuts', () => {
    const w = new WindState();
    const calm = w.lean;
    w.update({ weather: 'wind' }, 0.1, false);
    expect(w.lean).toBeGreaterThan(calm);
    expect(w.windy).toBeLessThan(1);
    w.update({ weather: 'wind' }, 0.1, true);
    expect(w.windy).toBe(1);
    expect(w.lean).toBeCloseTo(CG4_D4.wind.leanWindy);
  });
});

describe('K17 the Hush’s walk', () => {
  it('starts on its mark and ends toward the Fold', () => {
    const p = CG4_D4.hush.path;
    expect(hushPathAt(0)).toEqual(p[0]);
    expect(hushPathAt(1)).toEqual(p[p.length - 1]);
  });

  it('takes a stretch per scene, and stands at its end under reduced motion', () => {
    const first = hushWalk('h-c9-open', 0, false)!;
    const later = hushWalk('h-c9-open', CG4_D4.hush.stretchS, false)!;
    expect(later.u).toBeGreaterThan(first.u);
    expect(hushWalk('h-c9-open', 0, true)!.u).toBeCloseTo(later.u);
    expect(hushWalk('h-c9-mountain', 0, true)!.u).toBeGreaterThan(later.u);
    expect(hushWalk('c3-open', 5, false)).toBeNull();
    expect(hushWalk(null, 5, false)).toBeNull();
  });

  it('lays a fog band behind it and a tendril to each lantern put out', () => {
    const place = hushWalk('h-c9-mountain', 0, true)!;
    const bare = hushFog(place, new Map());
    expect(bare).toHaveLength(CG4_D4.hush.pathPuffs);
    const posts = [{ id: 'lantern-1', x: -4, z: 4 }];
    const grown = hushFog(place, new Map([['lantern-1', 1]]), posts);
    expect(grown).toHaveLength(CG4_D4.hush.pathPuffs + CG4_D4.hush.tendrilPuffs);
    const half = hushFog(place, new Map([['lantern-1', 0.5]]), posts);
    expect(half.length).toBeGreaterThan(bare.length);
    expect(half.length).toBeLessThan(grown.length);
  });
});
