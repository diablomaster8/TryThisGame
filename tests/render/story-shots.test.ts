import { describe, expect, it } from 'vitest';
import { CAMERA, GROVE3D, STAGE2 } from '../../src/config/tuning';
import { E_STAGES } from '../../src/config/tuning-e';
import { SCENE_STAGES } from '../../src/config/scene-stages';
import { placeSet } from '../../src/config/stage-marks';
import { STORYLINE_BEETLE } from '../../src/content/storyline-beetle';
import { STORYLINE_DAWN, STORYLINE_DUSK } from '../../src/content/storyline-dawndusk';
import { STORYLINE_HUNDRED } from '../../src/content/storyline-hundred';
import { STORYLINE_LOGGED } from '../../src/content/storyline-logged';
import { yawIndexToRadians } from '../../src/render/camera';
import { fitPixel, SceneStager, speaksAsKeeper } from '../../src/render/scene-stage';
import { projectPixel, type FitPoint } from '../../src/render/stage-fit';
import {
  fitShot3d,
  fovFor,
  projectShot,
  type Lens,
  type SafeNdc,
} from '../../src/render3d/fit-shot';
import { STAGE4 } from '../../src/config/tuning-f4';
import { markAt } from '../../src/config/stage-marks';
import { standHeight } from '../../src/render3d/terrain-shape';
import { startCampaign } from '../../src/sim/campaign';
import { registerStorylines, sceneFor } from '../../src/sim/story-scenes';
import type { World } from '../../src/sim/types';
import { createWorld } from '../../src/sim/world';

/**
 * K49: every staged scene's fit, resolved without a browser at a desktop (1280x720) and an
 * upright phone (390x844), in both renderers' pure fits (`fitPixel`, `fitShot3d`). Each
 * speaker with a spot is made the speaker in turn; the test fails when their feet or head
 * fall outside the HUD-safe rect. The safe rects are the HUD's usual ones (top bar above,
 * dialogue box and the phone's action bar below), as shares of the view.
 */

const LINES = [
  STORYLINE_HUNDRED,
  STORYLINE_LOGGED,
  STORYLINE_BEETLE,
  STORYLINE_DAWN,
  STORYLINE_DUSK,
];
registerStorylines(LINES);

/** Which storyline owns each scene id (any object with an id and lines inside it). */
const OWNER = new Map<string, string>();
for (const sl of LINES) {
  const walk = (o: unknown): void => {
    if (!o || typeof o !== 'object') return;
    if (Array.isArray(o)) return o.forEach(walk);
    const r = o as Record<string, unknown>;
    if (typeof r.id === 'string' && Array.isArray(r.lines)) OWNER.set(r.id, sl.id);
    for (const v of Object.values(r)) walk(v);
  };
  walk(sl);
}

const VIEWS = {
  desk: { w: 1280, h: 720, safe: { x0: 0, y0: 60 / 720, x1: 1, y1: 500 / 720 } },
  phone: { w: 390, h: 844, safe: { x0: 0, y0: 64 / 844, x1: 1, y1: 530 / 844 } },
} as const;

/** Scenes known to fail, each with its reason. Keep it short. */
const ALLOW: Readonly<Record<string, string>> = {};

const TOL = 0.01;

function worldFor(id: string): World | null {
  const stage = { ...E_STAGES[id], ...SCENE_STAGES[id] };
  const w = createWorld(1, 0);
  startCampaign(w, []);
  const sl = OWNER.get(id);
  if (sl) w.campaign!.storyline = sl;
  w.campaign!.queue = [id];
  const set = stage.place ? placeSet(stage.place) : 'grove';
  w.location = set;
  return sceneFor(w, id, 'main') ? w : null;
}

interface Miss {
  id: string;
  who: string;
  view: string;
  renderer: string;
}

function check(): { misses: Miss[]; scenes: number; shots: number } {
  const misses: Miss[] = [];
  let scenes = 0;
  let shots = 0;
  const ids = [...new Set([...Object.keys(E_STAGES), ...Object.keys(SCENE_STAGES)])];
  for (const id of ids) {
    const w = worldFor(id);
    if (!w) continue;
    const st = new SceneStager();
    st.update(w, 0);
    if (!st.active) continue;
    scenes++;
    const yaw = st.stage.shot?.yaw ?? yawIndexToRadians(CAMERA.initialYawIndex);
    const ground = (x: number, z: number) => (w.location === 'grove' ? standHeight(x, z) : 0);
    const speakers = [...new Set(st.lines.map((l) => l.who))].filter(
      (who) => who !== 'narrator' && !speaksAsKeeper(w, who, st.stage),
    );
    for (const who of speakers) {
      const spot = st.spotOf(w, who);
      if (!spot) continue;
      st.speaker = who;
      st.line = Math.max(
        0,
        st.lines.findIndex((l) => l.who === who),
      );
      const framed = st.frame(w);
      const pts: FitPoint[] = framed.some((p) => p.speaker)
        ? framed
        : [...framed, { ...spot, speaker: true }];
      for (const [vk, v] of Object.entries(VIEWS)) {
        shots++;
        const aspect = v.w / v.h;
        // Pixel: the far and near steps, as the game hands them to fitPixel.
        const views = CAMERA.pixelsPerUnit.map((p) => ({ w: (540 / p) * aspect, h: 540 / p }));
        const f = fitPixel(
          pts,
          yaw,
          CAMERA.pitchRad,
          views,
          v.safe,
          STAGE2.figureH,
          STAGE2.fitRadius,
        );
        const view = views[f.zoom]!;
        const inPixel = [0, 1.6].every((up) => {
          const s = projectPixel(spot, f, yaw, CAMERA.pitchRad, view, up);
          return (
            s.x >= v.safe.x0 - TOL &&
            s.x <= v.safe.x1 + TOL &&
            s.y >= v.safe.y0 - TOL &&
            s.y <= v.safe.y1 + TOL
          );
        });
        if (!inPixel) misses.push({ id, who, view: vk, renderer: 'pixel' });
        // 3D: the fitted shot at the wide pitch.
        const lens = { fov: fovFor(aspect), aspect, near: GROVE3D.near, far: GROVE3D.far };
        const safe = {
          sx0: v.safe.x0 * 2 - 1,
          sx1: v.safe.x1 * 2 - 1,
          sy1: 1 - v.safe.y0 * 2,
          sy0: 1 - v.safe.y1 * 2,
        };
        const pitchDeg = GROVE3D.pitchDeg + 6;
        const g = fitShot3d(pts, yaw, pitchDeg, lens, safe, ground, undefined, v.h);
        // K3 review: on a phone a person is never drawn under STAGE4.minPersonPx tall.
        if (aspect < 1) {
          const feet = projectShot(spot, { ...g, yaw, pitchDeg }, lens, ground, 0);
          const head = projectShot(spot, { ...g, yaw, pitchDeg }, lens, ground, STAGE4.personH);
          if (((head.y - feet.y) / 2) * v.h < STAGE4.minPersonPx - 1)
            misses.push({
              id,
              who,
              view: vk,
              renderer: `3d-small ${Math.round(((head.y - feet.y) / 2) * v.h)}px d${g.distance.toFixed(1)}`,
            });
        }
        const in3d = [0.1, 1.6].every((up) => {
          const n = projectShot(spot, { ...g, yaw, pitchDeg }, lens, ground, up);
          return (
            n.z <= 1 &&
            n.x >= safe.sx0 - TOL * 2 &&
            n.x <= safe.sx1 + TOL * 2 &&
            n.y >= safe.sy0 - TOL * 2 &&
            n.y <= safe.sy1 + TOL * 2
          );
        });
        if (!in3d) misses.push({ id, who, view: vk, renderer: '3d' });
      }
    }
  }
  return { misses, scenes, shots };
}

/** Shares of the view a point lands at in 3D (y down), from NDC. */
const share3d = (n: { x: number; y: number }) => ({ x: (n.x + 1) / 2, y: (1 - n.y) / 2 });

const lensOf = (v: { w: number; h: number }): Lens => {
  const aspect = v.w / v.h;
  return { fov: fovFor(aspect), aspect, near: GROVE3D.near, far: GROVE3D.far };
};
const ndcOf = (s: { x0: number; y0: number; x1: number; y1: number }): SafeNdc => ({
  sx0: s.x0 * 2 - 1,
  sx1: s.x1 * 2 - 1,
  sy1: 1 - s.y0 * 2,
  sy0: 1 - s.y1 * 2,
});
const inside = (
  p: { x: number; y: number },
  s: { x0: number; y0: number; x1: number; y1: number },
) => p.x >= s.x0 - TOL && p.x <= s.x1 + TOL && p.y >= s.y0 - TOL && p.y <= s.y1 + TOL;

describe('the story shot test (K49)', () => {
  it('keeps every speaker of every staged scene inside the HUD-safe rect, both renderers', () => {
    const { misses, scenes, shots } = check();
    expect(scenes).toBeGreaterThan(100);
    expect(shots).toBeGreaterThan(200);
    const bad = misses.filter((m) => !ALLOW[m.id]);
    expect(bad.map((m) => `${m.id} ${m.who} ${m.view} ${m.renderer}`)).toEqual([]);
  });

  it("keeps the Keeper in Hazel ch10's opening on an upright phone, pixel (K3)", () => {
    const w = worldFor('c10-open')!;
    const st = new SceneStager();
    st.update(w, 0);
    const pts = st.frame(w);
    expect(pts.some((p) => p.fit)).toBe(true);
    const v = VIEWS.phone;
    const aspect = v.w / v.h;
    const views = CAMERA.pixelsPerUnit.map((p) => ({ w: (540 / p) * aspect, h: 540 / p }));
    const yaw = yawIndexToRadians(CAMERA.initialYawIndex);
    const f = fitPixel(pts, yaw, CAMERA.pitchRad, views, v.safe, STAGE2.figureH, STAGE2.fitRadius);
    const k = st.keeperSpot(w);
    for (const up of [0, 1.6]) {
      const s = projectPixel(k, f, yaw, CAMERA.pitchRad, views[f.zoom]!, up);
      expect(s.x).toBeGreaterThanOrEqual(v.safe.x0);
      expect(s.x).toBeLessThanOrEqual(v.safe.x1);
      expect(s.y).toBeGreaterThanOrEqual(v.safe.y0);
      expect(s.y).toBeLessThanOrEqual(v.safe.y1);
    }
  });

  it("keeps the Keeper a readable size in Hazel ch10's opening on a phone, 3D (K3 review)", () => {
    const w = worldFor('c10-open')!;
    const st = new SceneStager();
    st.update(w, 0);
    const v = VIEWS.phone;
    const lens = lensOf(v);
    const yaw = yawIndexToRadians(CAMERA.initialYawIndex);
    const pitchDeg = GROVE3D.pitchDeg + 6;
    const g = fitShot3d(
      st.frame(w),
      yaw,
      pitchDeg,
      lens,
      ndcOf(v.safe),
      standHeight,
      undefined,
      v.h,
    );
    const k = st.keeperSpot(w);
    const feet = projectShot(k, { ...g, yaw, pitchDeg }, lens, standHeight, 0);
    const head = projectShot(k, { ...g, yaw, pitchDeg }, lens, standHeight, STAGE4.personH);
    expect(((head.y - feet.y) / 2) * v.h).toBeGreaterThanOrEqual(STAGE4.minPersonPx - 1);
  });

  it('keeps the pond in frame on the line that names it, both renderers on a phone (K3 review)', () => {
    const w = worldFor('c10-open')!;
    const st = new SceneStager();
    st.update(w, 0);
    const i = st.lines.findIndex((l) => /\bpond\b/i.test(l.text));
    expect(i).toBeGreaterThanOrEqual(0);
    st.speaker = st.lines[i]!.who;
    st.noteLine(i, 1, st.speaker);
    const pts = st.frame(w);
    const pond = markAt('grove', 'pond-centre')!;
    const v = VIEWS.phone;
    const aspect = v.w / v.h;
    const yaw = yawIndexToRadians(CAMERA.initialYawIndex);
    const views = CAMERA.pixelsPerUnit.map((p) => ({ w: (540 / p) * aspect, h: 540 / p }));
    const f = fitPixel(pts, yaw, CAMERA.pitchRad, views, v.safe, STAGE2.figureH, STAGE2.fitRadius);
    expect(inside(projectPixel(pond, f, yaw, CAMERA.pitchRad, views[f.zoom]!), v.safe)).toBe(true);
    const lens = lensOf(v);
    const pitchDeg = GROVE3D.pitchDeg + 6;
    const g = fitShot3d(pts, yaw, pitchDeg, lens, ndcOf(v.safe), standHeight, undefined, v.h);
    const n = projectShot(pond, { ...g, yaw, pitchDeg }, lens, standHeight, 0);
    expect(inside(share3d(n), v.safe)).toBe(true);
  });
});
