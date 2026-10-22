import { CG2_X } from '../config/tuning';
import { markAt } from '../config/stage-marks';
import type { SceneStage } from '../config/story';
import type { Daylight } from '../render/daylight';
import { stageFlags } from '../render/scene-stage';
import { storyBState } from '../render/story-b-state';
import type { World } from '../sim/types';
import { subjectsOf } from './dress-a';
import type { Dress3dCtx, Dressing3d } from './dressings';
import { buildLychGate, type LychGate } from './gate-x';
import { groveHeight } from './terrain-shape';

/**
 * Campaign graphics 2, package x, Full 3D (C9): the Grove's gate, rebuilt as a symmetric
 * lychgate (`gate-x.ts`) in place of package b's, which `dress-b.ts` now leaves hidden. It
 * keeps b's states (shut, stuck, ajar or wide; ivy; The Hundred Days' bare gate and day
 * post), read through `storyBState`. While a scene is about the gate (staged at it, or the
 * gate in its focus or props, or one of the gate scenes) the occluder leaves it whole.
 * The occluder's own changes (H10, H14) are in `dress-a.ts` and `building-kit.ts`.
 */
export const dress3dX: Dressing3d = (() => {
  let ctx: Dress3dCtx | null = null;
  let gate: LychGate | null = null;
  let shown = -1;
  let ivy: boolean | null = null;
  let bare: boolean | null = null;
  let tally = -1;

  return {
    id: 'x',
    build(c) {
      ctx = c;
      const mark = markAt('grove', 'gate') ?? { x: 0, z: 23, yaw: Math.PI };
      gate = buildLychGate(c.tex);
      gate.group.position.set(mark.x, groveHeight(mark.x, mark.z), mark.z);
      // The occluder's building hiding (dress-a) takes the gate like a house: a roofed gate
      // cut by the frame's edge read as a giant roof there (campaign graphics 3). Its own
      // fade switch still keeps it whole while a scene is about the gate.
      gate.group.userData.house = true;
      c.world3d.add(gate.group);
      void c.compile(gate.group);
    },
    update(world: World, stage: SceneStage, _daylight: Daylight, dt: number) {
      if (!ctx || !gate) return;
      const queued = Object.keys(stage).length > 0;
      const st = storyBState(world, queued ? stage : null);
      // The leaves ease to their state, and cut under reduced motion.
      const target = st.gate.openness;
      shown =
        shown < 0 || ctx.reduceMotion() ? target : shown + (target - shown) * Math.min(1, dt * 2.2);
      gate.setOpenness(shown);
      if (ivy !== st.gate.overgrown) gate.setIvy((ivy = st.gate.overgrown));
      if (bare !== st.gate.bare) gate.setBare((bare = st.gate.bare));
      if (tally !== st.gate.tally) {
        gate.setTally((tally = st.gate.tally));
        void ctx.compile(gate.group);
      }
      const scene = stageFlags(world, queued ? stage : null).sceneId;
      const subject =
        subjectsOf(stage).has('gate') || (!!scene && CG2_X.gate.scenes.includes(scene));
      gate.fade.value = subject ? 0 : 1;
    },
    dispose() {
      gate?.dispose();
      gate = null;
    },
  };
})();
