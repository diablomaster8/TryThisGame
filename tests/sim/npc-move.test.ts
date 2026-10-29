import { describe, expect, it } from 'vitest';
import { SCENE_STAGES } from '../../src/config/scene-stages';
import { E_STAGES } from '../../src/config/tuning-e';
import { CAMPAIGN_SCENES } from '../../src/content/campaign';
import { STORYLINE_BEETLE } from '../../src/content/storyline-beetle';
import { STORYLINE_DAWN, STORYLINE_DUSK } from '../../src/content/storyline-dawndusk';
import { STORYLINE_HUNDRED } from '../../src/content/storyline-hundred';
import { STORYLINE_LOGGED } from '../../src/content/storyline-logged';
import type { SceneStage } from '../../src/config/story';
import { markAt, placeSet } from '../../src/config/stage-marks';
import { SIM } from '../../src/config/tuning';
import { blocked } from '../../src/sim/obstacles';
import { stepNpcs } from '../../src/sim/npcs';
import { Rng } from '../../src/sim/rng';
import { ensureTrainers, walkOnRoute } from '../../src/sim/scene-cast';
import { createWorld } from '../../src/sim/world';
import { walkLength, walkPose, type Walk } from '../../src/render/walk-on';
import type { Vec2, World } from '../../src/sim/types';

// R0036: staged walk-ons and wandering visitors keep out of every solid the Keeper is
// stopped by, using the shared Nubbin grid.

function bare(): World {
  const w = createWorld(7, 0);
  w.nubbins = [];
  return w;
}

const LINES = [
  STORYLINE_HUNDRED,
  STORYLINE_LOGGED,
  STORYLINE_BEETLE,
  STORYLINE_DAWN,
  STORYLINE_DUSK,
];

/** Every scripted scene's resolved stage, as the stager merges it (resolveStage). */
function allStages(): [string, SceneStage][] {
  const scenes: { id: string; stage?: SceneStage }[] = [...CAMPAIGN_SCENES];
  for (const sl of LINES) {
    for (const c of sl.chapters) {
      scenes.push(c.opening, c.closing);
      for (const b of c.beats ?? []) scenes.push(b.scene);
    }
    scenes.push(...sl.extra);
  }
  return scenes.map((s) => [s.id, { ...E_STAGES[s.id], ...SCENE_STAGES[s.id], ...s.stage }]);
}

interface Sample {
  scene: string;
  who: string;
  at: Vec2;
}

/** Samples along every `from` walk-on in the script, every 0.1 units. */
function sweep(world: World, routed: boolean): { walks: number; inside: Sample[] } {
  const inside: Sample[] = [];
  let walks = 0;
  for (const [id, stage] of allStages()) {
    if (stage.place && placeSet(stage.place) !== 'grove') continue;
    for (const c of stage.cast ?? []) {
      if (!c.from) continue;
      const from = markAt('grove', c.from);
      const to = markAt('grove', c.mark);
      if (!from || !to) continue;
      const a = { x: from.x, z: from.z };
      const b = { x: to.x, z: to.z };
      if (Math.hypot(b.x - a.x, b.z - a.z) < 0.3) continue;
      walks++;
      const via = routed ? walkOnRoute(world, a, b) : [];
      const w: Walk = {
        kind: 'actor',
        key: c.who,
        from: a,
        to: b,
        yaw: 0,
        endFace: 0,
        startMs: 0,
        durMs: 1000,
        done: false,
        ...(via.length ? { via } : {}),
      };
      const n = Math.ceil(walkLength(w) / 0.1);
      for (let i = 1; i < n; i++) {
        // Undo the ease so samples are evenly spaced along the path.
        const t = i / n;
        const p = walkPose(w, 1000 * easeInv(t), false);
        if (blocked({ x: p.x, z: p.z }, world, 0, 'keeper'))
          inside.push({ scene: id, who: c.who, at: { x: p.x, z: p.z } });
      }
    }
  }
  return { walks, inside };
}

/** Inverse of the smoothstep ease in walkPose, by bisection. */
function easeInv(e: number): number {
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 30; i++) {
    const m = (lo + hi) / 2;
    if (m * m * (3 - 2 * m) < e) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}

describe('staged walk-ons (R0036)', () => {
  it('no walk-on passes inside a solid once the sim has routed it', () => {
    const w = bare();
    const before = sweep(w, false);
    const after = sweep(w, true);
    console.log(
      `walk-ons ${before.walks}: samples inside solids before ${before.inside.length}, after ${after.inside.length}`,
    );
    const bad = new Set(after.inside.map((s) => `${s.scene}/${s.who}`));
    expect([...bad]).toEqual([]);
  });
});

describe('visitor wandering (R0036)', () => {
  it('stays out of solids for several sim minutes', () => {
    const w = bare();
    ensureTrainers(w);
    // The Keeper stands far off so nobody turns to face them.
    w.keeper.pos = { x: -40, z: -40 };
    const rng = new Rng(11);
    const bad: string[] = [];
    let moved = 0;
    const last = new Map<string, Vec2>();
    for (let i = 0; i < 6000; i++) {
      w.timeMs += SIM.stepMs;
      stepNpcs(w, SIM.stepMs, rng);
      for (const n of w.npcs) {
        if (blocked(n.pos, w, 0, 'keeper'))
          bad.push(`${n.trainer}@${n.pos.x.toFixed(2)},${n.pos.z.toFixed(2)}`);
        const l = last.get(n.id);
        if (l && Math.hypot(l.x - n.pos.x, l.z - n.pos.z) > 0) moved++;
        last.set(n.id, { x: n.pos.x, z: n.pos.z });
      }
    }
    console.log(`wander: samples inside solids ${bad.length}, moving samples ${moved}`);
    expect(bad).toEqual([]);
    expect(moved).toBeGreaterThan(100);
  });
});
