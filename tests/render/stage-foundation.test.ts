import { describe, expect, it } from 'vitest';
import { markAt, PLACE_KEEPER, STAGE_MARKS } from '../../src/config/stage-marks';
import { fitPixel, SceneStager } from '../../src/render/scene-stage';
import { BuildingRegistry } from '../../src/render/stage-api';
import { startCampaign } from '../../src/sim/campaign';
import { createWorld } from '../../src/sim/world';

/** Campaign graphics 2, wave 0: marks, the Keeper's default mark, the push-in, the fit. */
function campaignWorld(queue: string[]) {
  const w = createWorld(1, 0);
  startCampaign(w, []);
  w.campaign!.queue = queue;
  w.location = 'grove';
  return w;
}

describe('stage foundation (campaign graphics 2, wave 0)', () => {
  it('has the storylines’ marks, a festival ring and a keeper mark for every place', () => {
    for (const m of [
      'fold-well',
      'guardhouse-bench',
      'banner-3',
      'board',
      'hush',
      'rootNode-chair',
    ])
      expect(STAGE_MARKS.grove[m], m).toBeDefined();
    for (let i = 1; i <= 4; i++) {
      expect(markAt('grove', `fold-door-${i}`)).toBeDefined();
      expect(markAt('grove', `house-${i}-door`)).toBeDefined();
    }
    for (let i = 1; i <= 12; i++) expect(markAt('grove', `festival-${i}`)).toBeDefined();
    for (const [place, mark] of Object.entries(PLACE_KEEPER)) {
      if (!mark) continue;
      const set = place === 'hollow' ? 'hollow' : place === 'corvin' ? 'corvin' : 'grove';
      expect(STAGE_MARKS[set][mark], place).toBeDefined();
    }
  });

  it('pushes an establishing shot in to a two-shot after the first line', () => {
    const w = campaignWorld(['c10-open']);
    const st = new SceneStager();
    st.update(w, 0);
    st.stage = { ...st.stage, shot: { kind: 'establish' } };
    expect(st.shotKind()).toBe('establish');
    expect(st.fits()).toBe(true);
    st.noteLine(1, 500);
    expect(st.pushedMs).toBe(500);
    expect(st.shotKind()).toBe('two');
    expect(st.fits()).toBe(false);
    st.stage = { ...st.stage, shot: { kind: 'establish', then: 'close' } };
    expect(st.shotKind()).toBe('close');
  });

  it('fits close points on the near zoom and spread ones on the far', () => {
    const views = [
      { w: 40, h: 22 },
      { w: 20, h: 11 },
    ];
    const safe = { x0: 0, y0: 0.15, x1: 1, y1: 0.75 };
    const near = fitPixel(
      [
        { x: 0, z: 0 },
        { x: 2, z: 0 },
      ],
      0,
      0.6,
      views,
      safe,
    );
    expect(near.zoom).toBe(1);
    const far = fitPixel(
      [
        { x: -12, z: 0 },
        { x: 12, z: 0 },
      ],
      0,
      0.6,
      views,
      safe,
    );
    expect(far.zoom).toBe(0);
    // The safe area sits high (a dialogue box below), so the aim moves toward the camera.
    expect(far.z).toBeGreaterThan(0);
  });

  it('hides and fades buildings through the registry', () => {
    const r = new BuildingRegistry();
    r.define('cottage', 'cottage', 1, 2);
    r.setFade('cottage', 2);
    expect(r.fadeOf('cottage')).toBe(1);
    expect(r.isHidden('cottage')).toBe(false);
    r.stageHidden = new Set(['cottage']);
    expect(r.hiddenIds()).toEqual(['cottage']);
    r.stageHidden = new Set();
    r.setHidden('cottage', true);
    expect(r.isHidden('cottage')).toBe(true);
    expect(r.list()[0]).toMatchObject({ id: 'cottage', x: 1, z: 2 });
  });
});
