import { describe, expect, it } from 'vitest';
import { PKG_E4_STAGES } from '../../src/config/scene-stages-pkg-e4';
import type { SceneStage } from '../../src/config/story';
import { CG4_E4 } from '../../src/config/tuning-e4';
import {
  paintBird,
  paintCrop,
  paintGateFrost,
  paintHead,
  paintMoth,
  paintPlotSoil,
  paintWindowFigure,
  type HeadShape,
} from '../../src/render/e4-art';
import {
  figureFor,
  hazelSeason,
  streakAnchors,
  wantsBoot,
  wantsFigures,
  wantsGateFrost,
  wantsRising,
  wantsWreath,
} from '../../src/render/e4-shared';
import type { StageFlags } from '../../src/render/scene-stage';

/**
 * Package e4 (campaign graphics 4, world detail): the shared rules that both renderers ask
 * (which scene wants which effect, which lamp reaches the water, which season the plot
 * wears) and the pure pixel painters (every state paints something and the states differ).
 */
function flags(over: Partial<StageFlags> = {}): StageFlags {
  return {
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
  } as StageFlags;
}

const covered = (r: { mask: Uint8Array }) => r.mask.reduce((n, v) => n + v, 0);

describe('scene rules', () => {
  it('window figures, wreath and rising lanterns follow their props', () => {
    expect(wantsFigures({ props: { windowFigures: 'show' } })).toBe(true);
    expect(wantsFigures({})).toBe(false);
    expect(wantsWreath({ props: { wreath: 'show' } })).toBe(true);
    expect(wantsWreath({ props: { wreath: 'hide' } })).toBe(false);
    expect(wantsRising({}, flags({ sceneId: 'c12-close' }))).toBe(true);
    expect(wantsRising({}, flags({ sceneId: 'c1-open' }))).toBe(false);
    expect(
      wantsRising({ props: { risingLanterns: 'hide' } }, flags({ sceneId: 'c12-close' })),
    ).toBe(false);
  });

  it('the gate frost is c11-gate, and the boot is Logged In chapter 1 only', () => {
    expect(wantsGateFrost({}, flags({ sceneId: 'c11-gate' }))).toBe(true);
    expect(wantsGateFrost({}, flags({ sceneId: 'c11-open' }))).toBe(false);
    expect(wantsBoot({}, flags({ campaign: 'logged', sceneId: 'l-c1-open' }))).toBe(true);
    expect(wantsBoot({}, flags({ campaign: 'hazel', sceneId: 'l-c1-open' }))).toBe(false);
    expect(wantsBoot({}, flags({ campaign: 'logged', sceneId: 'l-c2-open' }))).toBe(false);
  });

  it('the plot wears the staged season, else the chapter’s, and only in Hazel at home', () => {
    expect(hazelSeason({ season: 'autumn' }, flags())).toBe('autumn');
    expect(hazelSeason({}, flags({ chapter: 2 }))).toBe('spring');
    expect(hazelSeason({}, flags({ chapter: 5 }))).toBe('summer');
    expect(hazelSeason({}, flags({ chapter: 9 }))).toBe('winter');
    expect(hazelSeason({}, flags({ campaign: 'logged' }))).toBeNull();
    expect(hazelSeason({}, flags({ location: 'corvin' }))).toBeNull();
    const exclusive: SceneStage = { exclusive: true };
    expect(hazelSeason(exclusive, flags())).toBeNull();
  });

  it('a figure is stable for a house and scene, and in range', () => {
    for (let k = 0; k < 20; k++) {
      const f = figureFor(k, 'c9-partner');
      expect(f).toBeGreaterThanOrEqual(0);
      expect(f).toBeLessThan(CG4_E4.figures.variants);
      expect(figureFor(k, 'c9-partner')).toBe(f);
    }
  });

  it('the pond lamp throws a streak and every anchor sits on or near the water', () => {
    const a = streakAnchors();
    expect(a.some((s) => s.id === 'lantern-3')).toBe(true);
    for (const s of a) expect(Math.hypot(s.x - 7, s.z - 6)).toBeLessThan(14);
  });

  it('the overlay stages every item the content wave needs', () => {
    expect(PKG_E4_STAGES['c11-gate']?.props?.gateFrost).toBe('show');
    expect(PKG_E4_STAGES['c12-close']?.props?.risingLanterns).toBe('show');
    expect(PKG_E4_STAGES['end-hazels-grove']?.props?.risingLanterns).toBe('show');
    expect(PKG_E4_STAGES['l-c1-open']?.props?.bootUp).toBe('show');
    expect(PKG_E4_STAGES['c9-partner']?.props?.windowFigures).toBe('show');
    expect(PKG_E4_STAGES['c10-vigil']?.props?.pondIce).toBe('hide');
  });
});

describe('painters', () => {
  it('each window figure paints and the three differ', () => {
    const a = [0, 1, 2].map((v) => paintWindowFigure(24, 22, v));
    for (const r of a) expect(covered(r)).toBe(24 * 22);
    expect(Array.from(a[0]!.data)).not.toEqual(Array.from(a[1]!.data));
    expect(Array.from(a[1]!.data)).not.toEqual(Array.from(a[2]!.data));
  });

  it('the four plot states and their crops differ', () => {
    const seasons = ['spring', 'summer', 'autumn', 'winter'] as const;
    const soils = seasons.map((s) => Array.from(paintPlotSoil(s).data).join());
    expect(new Set(soils).size).toBe(4);
    const crops = seasons.map((s) => paintCrop(s, 1));
    for (const c of crops) expect(covered(c)).toBeGreaterThan(8);
    expect(new Set(crops.map((c) => covered(c))).size).toBeGreaterThan(2);
  });

  it('the four lantern heads have four different silhouettes, lit, out and low', () => {
    const shapes: HeadShape[] = ['round', 'square', 'hex', 'tall'];
    const masks = shapes.map((s) => Array.from(paintHead(s, 'lit', '#ffffff').mask).join(''));
    expect(new Set(masks).size).toBe(4);
    for (const s of shapes) {
      const lit = paintHead(s, 'lit', '#ffffff');
      const out = paintHead(s, 'out', '#ffffff');
      const low = paintHead(s, 'low', '#ffffff');
      expect(Array.from(lit.data)).not.toEqual(Array.from(out.data));
      expect(Array.from(low.data)).not.toEqual(Array.from(out.data));
      // The glass changes the colours; the shape (the mask) is the same lit or out.
      expect(Array.from(lit.mask)).toEqual(Array.from(out.mask));
    }
  });

  it('the gate frost spreads stage by stage and stays on the gate', () => {
    const gate = paintPlotSoil('summer');
    const n = CG4_E4.frost.stages;
    const amounts = Array.from({ length: n }, (_, i) => covered(paintGateFrost(gate, i + 1, n)));
    for (let i = 1; i < n; i++) expect(amounts[i]!).toBeGreaterThanOrEqual(amounts[i - 1]!);
    expect(amounts[n - 1]!).toBeGreaterThan(amounts[0]!);
    const last = paintGateFrost(gate, n, n);
    for (let i = 0; i < last.mask.length; i++) if (last.mask[i]) expect(gate.mask[i]).toBe(1);
  });

  it('birds and moths have two distinct frames', () => {
    expect(Array.from(paintBird(0).mask)).not.toEqual(Array.from(paintBird(1).mask));
    expect(Array.from(paintMoth(0).mask)).not.toEqual(Array.from(paintMoth(1).mask));
  });
});
