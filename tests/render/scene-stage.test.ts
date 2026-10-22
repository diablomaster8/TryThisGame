import { describe, expect, it } from 'vitest';
import { CAMERA, READ3D } from '../../src/config/tuning';
import { markAt, STAGE_MARKS } from '../../src/config/stage-marks';
import { OrbitCamera } from '../../src/render/camera';
import { resolveStage, SceneStager, stageFlags } from '../../src/render/scene-stage';
import { STORYLINE_DAWN, STORYLINE_DUSK } from '../../src/content/storyline-dawndusk';
import { registerStorylines } from '../../src/sim/story-scenes';
import { startCampaign } from '../../src/sim/campaign';
import { spawnNpc } from '../../src/sim/npcs';
import { createWorld } from '../../src/sim/world';

function campaignWorld(queue: string[]) {
  const w = createWorld(1, 0);
  startCampaign(w, []);
  w.campaign!.queue = queue;
  w.location = 'grove';
  return w;
}

describe('the shared story stager (campaign graphics C1, C2, C5)', () => {
  it('lights c10-open at night from its stage, and the clock again once the queue empties', () => {
    const w = campaignWorld(['c10-open']);
    const st = new SceneStager();
    expect(st.update(w)).toBe(true);
    expect(st.hour).toBe(22.5);
    expect(st.stage.shot?.kind).toBe('wide');
    w.campaign!.queue = [];
    expect(st.update(w)).toBe(true);
    expect(st.hourOr(12)).toBe(12);
  });

  it('falls back to the hour the narration names', () => {
    // An unstaged scene (the staged c2-corvin names its own 17:00).
    const w = campaignWorld(['end-empty-lantern']);
    const st = new SceneStager();
    st.update(w);
    expect(st.hour).toBe(READ3D.stage.nightHour);
  });

  it('draws a staged scene at its own hour', () => {
    const w = campaignWorld(['c2-corvin']);
    const st = new SceneStager();
    st.update(w);
    expect(st.hour).toBe(17);
  });

  it("follows Dawn & Dusk's half when a scene names no hour (M13)", () => {
    registerStorylines([STORYLINE_DAWN, STORYLINE_DUSK]);
    const w = campaignWorld(['end-dusk-half-day']);
    w.campaign!.storyline = 'dusk';
    expect(resolveStage(w)?.stage.hour).toBe(19);
    w.campaign!.storyline = 'dawn';
    w.campaign!.queue = ['end-dawn-half-day'];
    expect(resolveStage(w)?.stage.hour).toBe(6.5);
    // An opening carries its own stage, which says the same.
    w.campaign!.queue = ['dawn-c1-open'];
    expect(resolveStage(w)?.stage.hour).toBe(6.5);
  });

  it('stages no hour underground', () => {
    const w = campaignWorld(['c10-open']);
    w.location = 'hollow';
    const st = new SceneStager();
    st.update(w);
    expect(st.hour).toBeNull();
  });

  it('brings a far speaker in beside the Keeper, turned to them, and frames them', () => {
    const w = campaignWorld(['c5-considered']);
    const npc = spawnNpc(w, 'corvin');
    npc.pos = { x: 40, z: 40 };
    const k = w.keeper.pos;
    const st = new SceneStager();
    st.update(w);
    const at = st.holds.get(npc.id)!;
    expect(Math.hypot(at.x - k.x, at.z - k.z)).toBeCloseTo(READ3D.stage.bringIn);
    expect(st.faces.get(npc.id)).toBeCloseTo(Math.atan2(k.x - at.x, k.z - at.z));
    expect(st.frame(w)).toContainEqual(at);
    // The sim's NPC has not moved.
    expect(npc.pos).toEqual({ x: 40, z: 40 });
  });

  it('puts a cast on its marks', () => {
    const w = campaignWorld(['c2-corvin']);
    const npc = spawnNpc(w, 'corvin');
    const st = new SceneStager();
    st.update(w);
    // Author a cast after the fact, as a scene's stage would.
    st.stage = { cast: [{ who: 'corvin', mark: 'gate' }] };
    (st as unknown as { place(world: typeof w): void }).place(w);
    const gate = markAt('grove', 'gate')!;
    expect(st.holds.get(npc.id)).toEqual({ x: gate.x, z: gate.z });
    expect(st.faces.get(npc.id)).toBe(gate.yaw);
  });
});

describe('stage marks', () => {
  it('has every mark the spec lists', () => {
    const grove = [
      'gate',
      'gate-outside',
      'signpost',
      'step',
      'porch',
      'window',
      'pond-lantern',
      'stream-lantern',
      'wall-lantern',
      'grass-lantern',
      'hill-path',
      'flat-stone',
      'hill-top',
      'briar',
      'falls-foot',
      'ledge',
      'fold-square',
      'mill',
      'shore-jetty',
      'green-centre',
      'house-1',
      'house-2',
      'house-3',
      'house-4',
      'shrine',
      'bell',
      'guardhouse',
      'cart',
      'lobby',
      'board',
      'root-chair',
    ];
    for (const m of grove) expect(STAGE_MARKS.grove[m], m).toBeDefined();
    for (const m of ['hollow-camp', 'hollow-stone']) expect(STAGE_MARKS.hollow[m]).toBeDefined();
    for (const m of ['corvin-gate', 'corvin-door', 'pen-1', 'pen-2', 'pen-3'])
      expect(STAGE_MARKS.corvin[m]).toBeDefined();
    expect(markAt('dungeon', 'gate')).toBeUndefined();
  });
});

describe('stageFlags', () => {
  it('answers the chapter, the vigil and Corvin’s pens without writing the world', () => {
    const w = campaignWorld(['c10-open']);
    const before = JSON.stringify(w);
    const f = stageFlags(w, { place: 'hill' });
    expect(f.campaign).toBe('hazel');
    expect(f.chapter).toBe(w.campaign!.chapter);
    expect(f.vigilWave).toBeNull();
    expect(f.pens).toEqual([false, false, false]);
    expect(f.place).toBe('hill');
    expect(f.sceneId).toBe('c10-open');
    expect(JSON.stringify(w)).toBe(before);
    w.campaign!.flags.corvin = 'forced';
    w.campaign!.vigil = { progressMs: 0, waves: 1, lull: false, done: false };
    const g = stageFlags(w, null);
    expect(g.pens).toEqual([true, true, true]);
    expect(g.corvin).toBe('forced');
    expect(g.vigilWave).toBe(1);
  });
});

describe('the pixel story zoom (H14)', () => {
  it('holds the near zoom for a shot and gives the player’s back', () => {
    const cam = new OrbitCamera();
    cam.reduceMotion = true;
    cam.setZoom(0, 0);
    cam.holdZoom(CAMERA.pixelsPerUnit.length - 1, 0);
    expect(cam.currentZoomIndex).toBe(CAMERA.pixelsPerUnit.length - 1);
    cam.holdZoom(null, 0);
    expect(cam.currentZoomIndex).toBe(0);
  });
});

describe('marks clear of the gate (review fix 5)', () => {
  it('keeps the guard house, the cart and the Dawn & Dusk houses 6 units from the gate fence', () => {
    const gate = STAGE_MARKS.grove['gate']!;
    // The gate's posts and fence run about 4 units either side of the gate along x.
    const fenceDist = (p: { x: number; z: number }) => {
      const x = Math.max(gate.x - 4, Math.min(gate.x + 4, p.x));
      return Math.hypot(p.x - x, p.z - gate.z);
    };
    for (const m of [
      'guardhouse',
      'cart',
      'green-centre',
      'house-1',
      'house-2',
      'house-3',
      'house-4',
    ])
      expect(fenceDist(STAGE_MARKS.grove[m]!), m).toBeGreaterThanOrEqual(6);
  });
});

describe('focus marks and the Keeper on a mark', () => {
  it('resolves a focus entry as a cast id first, then as a mark', () => {
    const w = campaignWorld(['c2-corvin']);
    const st = new SceneStager();
    st.update(w);
    const house = markAt('grove', 'house-1')!;
    expect(st.spotOf(w, 'house-1')).toEqual({ x: house.x, z: house.z });
    // H7: a scene at a place puts the Keeper on that place's keeper mark (here the gate's).
    const k = markAt('grove', 'keeper-gate')!;
    expect(st.spotOf(w, 'you')).toEqual({ x: k.x, z: k.z });
    expect(st.spotOf(w, 'no-such-mark')).toBeNull();
  });

  it('draws the Keeper on its cast mark without moving the sim Keeper', () => {
    const w = campaignWorld(['c2-corvin']);
    const before = { ...w.keeper.pos };
    const st = new SceneStager();
    st.update(w);
    st.stage = { cast: [{ who: 'you', mark: 'step' }] };
    (st as unknown as { place(world: typeof w): void }).place(w);
    const step = markAt('grove', 'step')!;
    expect(st.keeperHold).toEqual({ x: step.x, z: step.z });
    expect(st.frame(w)[0]).toEqual({ x: step.x, z: step.z });
    expect(w.keeper.pos).toEqual(before);
  });
});
