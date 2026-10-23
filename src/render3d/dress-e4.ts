import { LANTERN_POSTS } from '../config/tuning';
import { CG4_E4 } from '../config/tuning-e4';
import type { SceneStage } from '../config/story';
import type { Daylight } from '../render/daylight';
import { SceneClock } from '../render/dress-e';
import { windowsState } from '../render/dress-y-shared';
import { BootOverlay } from '../render/e4-boot';
import {
  hazelSeason,
  lanternLights,
  pondIceWanted,
  streakAnchors,
  wantsBoot,
  wantsFigures,
  wantsGateFrost,
  wantsRising,
  wantsWreath,
} from '../render/e4-shared';
import { stageFlags } from '../render/scene-stage';
import { litLanterns } from '../sim/campaign';
import type { World } from '../sim/types';
import type { Dress3dCtx, Dressing3d } from './dressings';
import { LanternHeads3d } from './e4-heads-3d';
import { GateFrost3d } from './e4-frost-3d';
import { Fauna3d, RisingLanterns3d } from './e4-sky-3d';
import { Streaks3d } from './e4-water-3d';
import { WindowFigures3d } from './e4-windows-3d';
import { PlotAndCottage3d } from './e4-world-3d';

/**
 * Campaign graphics 4, package e4, Full 3D ("world detail"): figures in lit windows (K18),
 * lamp streaks on the pond (K19), the crop plot's seasons (K27), lantern heads and hung
 * tags (K28), rising lanterns (K42), the cottage's seasonal decor (K43), day birds and
 * night moths (K44), frost over the gate (K45) and Logged In's boot-up grid (K46). Each is
 * its own small class in `e4-*-3d.ts` (one or two draws each, instanced or merged, emissive
 * with bloom, no new lights); this file only asks the shared rules in `render/e4-shared.ts`
 * what the scene wants and hands each class its frame. Reduced motion is each class's own.
 */
export const dress3dE4: Dressing3d = (() => {
  let ctx: Dress3dCtx | null = null;
  let clock = new SceneClock();
  let boot: BootOverlay | null = null;
  let figures: WindowFigures3d | null = null;
  let streaks: Streaks3d | null = null;
  let heads: LanternHeads3d | null = null;
  let world: PlotAndCottage3d | null = null;
  let rising: RisingLanterns3d | null = null;
  let fauna: Fauna3d | null = null;
  let frost: GateFrost3d | null = null;

  return {
    id: 'e4',
    build(c) {
      ctx = c;
      clock = new SceneClock();
      boot = new BootOverlay(c.scene);
      figures = new WindowFigures3d(c);
      streaks = new Streaks3d(c);
      heads = new LanternHeads3d(c, LANTERN_POSTS);
      world = new PlotAndCottage3d(c);
      rising = new RisingLanterns3d(c);
      fauna = new Fauna3d(c, LANTERN_POSTS);
      frost = new GateFrost3d(c);
    },
    update(w: World, stage: SceneStage, daylight: Daylight, dt: number) {
      if (!ctx || !boot || !figures || !streaks || !heads || !world || !rising || !fauna || !frost)
        return;
      const reduce = ctx.reduceMotion();
      const flags = stageFlags(w, stage);
      const t = clock.tick(flags.sceneId, dt);
      const home = flags.location === 'grove';
      const here = home && stage.exclusive !== true;
      const lampsOn = ctx.lampsOn();
      const dark = daylight.darkness;

      boot.set(wantsBoot(stage, flags) ? t : -1, reduce);

      const states = here ? lanternLights(flags, stage, t, reduce) : {};
      const kept = litLanterns(w);
      const look = (id: string) => states[id] ?? (lampsOn || kept.has(id) ? 'lit' : 'out');

      // K28
      const named =
        stage.props?.lanternHeads === 'show' ||
        (stage.props?.lanternHeads !== 'hide' && flags.campaign === 'hazel' && flags.chapter >= 3);
      heads.update(named, here);

      // K19
      const iced = pondIceWanted(stage, flags.campaign, flags.chapter);
      streaks.update(
        here && !iced
          ? streakAnchors().map((s) => {
              const st = look(s.id);
              return { s, k: st === 'out' ? 0 : st === 'low' ? 0.5 : 1 };
            })
          : [],
        ctx.camera,
        dt,
        reduce,
      );

      // K18: figures at the lit windows, or at Corvin's one.
      const fig = wantsFigures(stage) && stage.exclusive !== true;
      const winOut = windowsState(flags, stage) === 'out';
      if (fig && home && lampsOn && !winOut) figures.update(true, flags.sceneId, false, ctx.camera);
      else if (fig && flags.location === 'corvin')
        figures.update(true, flags.sceneId, true, ctx.camera);
      else figures.update(false, flags.sceneId, false, ctx.camera);

      // K27, K43
      const season = hazelSeason(stage, flags);
      const decor = season && wantsWreath(stage) && season !== 'summer' ? season : null;
      world.update(here, season, decor);

      // K42, K44
      rising.update(here && wantsRising(stage, flags), t, reduce);
      const F = CG4_E4.fauna;
      const lit = new Set<string>();
      for (const p of LANTERN_POSTS) if (look(p.id) !== 'out') lit.add(p.id);
      fauna.update(
        here && dark < F.dayBelow && daylight.phase !== 'dusk',
        here && lampsOn && dark >= F.nightFrom,
        lit,
        dt,
        reduce,
      );

      // K45
      frost.update(
        here && wantsGateFrost(stage, flags)
          ? reduce
            ? 1
            : Math.min(1, t / CG4_E4.frost.seconds)
          : 0,
      );
    },
    dispose() {
      boot?.dispose();
      figures?.dispose();
      streaks?.dispose();
      heads?.dispose();
      world?.dispose();
      rising?.dispose();
      fauna?.dispose();
      frost?.dispose();
      ctx = null;
      boot = figures = streaks = heads = world = rising = fauna = frost = null;
    },
  };
})();
