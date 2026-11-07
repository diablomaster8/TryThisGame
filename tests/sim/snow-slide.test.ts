import { describe, expect, it } from 'vitest';
import { RIDGE_SNOW_Y, RIDGE_SPEC } from '../../src/config/region-ridge';
import { terraceHeight } from '../../src/config/region-layout';
import { SNOW_SLIDE } from '../../src/config/tuning-r15d1';
import { KEEPER } from '../../src/config/tuning';
import { regionLocation, stepRegionWalk } from '../../src/sim/region-walk';
import { sliding } from '../../src/sim/snow-slide';
import { createWorld } from '../../src/sim/world';
import type { RegionId } from '../../src/config/regions';
import type { World } from '../../src/sim/types';

function at(region: RegionId, x: number, z: number): World {
  const w = createWorld(5, 0);
  w.location = regionLocation(region);
  w.keeper.pos = { x, z };
  return w;
}

/** Distance covered holding the stick east (x +1) for `secs` seconds. */
function run(w: World, secs: number): number {
  const x0 = w.keeper.pos.x;
  w.keeper.input = { x: 1, z: 0 };
  for (let i = 0; i < secs * 10; i++) stepRegionWalk(w, 100, []);
  return w.keeper.pos.x - x0;
}

describe('R0118: the snow slide on the ridge', () => {
  it('(-28, -50) is snow and (-18, 60) is not', () => {
    expect(terraceHeight(RIDGE_SPEC, -50)).toBeGreaterThanOrEqual(RIDGE_SNOW_Y);
    expect(terraceHeight(RIDGE_SPEC, 60)).toBeLessThan(RIDGE_SNOW_Y);
  });

  it('on the snow the stick runs faster, and the Keeper coasts on after letting go', () => {
    const snow = at('ridge', -20, -50);
    const dSnow = run(snow, 3);
    const foot = at('ridge', -20, 66);
    const dFoot = run(foot, 3);
    expect(dFoot).toBeGreaterThan(0);
    expect(dSnow).toBeGreaterThan(dFoot * 0.9);
    // Let go: the slide carries on a while and then stops.
    expect(sliding(snow)).toBe(true);
    snow.keeper.input = { x: 0, z: 0 };
    const x1 = snow.keeper.pos.x;
    stepRegionWalk(snow, 100, []);
    expect(snow.keeper.pos.x).toBeGreaterThan(x1);
    for (let i = 0; i < 100; i++) stepRegionWalk(snow, 100, []);
    expect(sliding(snow)).toBe(false);
    // No coast on the bare foot.
    foot.keeper.input = { x: 0, z: 0 };
    const xf = foot.keeper.pos.x;
    stepRegionWalk(foot, 100, []);
    expect(foot.keeper.pos.x).toBe(xf);
  });

  it('steers slowly: a turn takes several steps to change the heading', () => {
    const w = at('ridge', -20, -50);
    run(w, 2);
    w.keeper.input = { x: 0, z: 1 };
    const z0 = w.keeper.pos.z;
    const x0 = w.keeper.pos.x;
    stepRegionWalk(w, 100, []);
    // Still mostly going east on the first step of the turn.
    expect(w.keeper.pos.x - x0).toBeGreaterThan(Math.abs(w.keeper.pos.z - z0));
    expect(SNOW_SLIDE.speedMul).toBeGreaterThan(1);
    expect(KEEPER.speed).toBeGreaterThan(0);
  });

  it('is not seasonal: other regions never slide, in any season', () => {
    const w = at('wood', -6, 30);
    w.debugSeason = 'winter';
    run(w, 2);
    w.keeper.input = { x: 0, z: 0 };
    expect(sliding(w)).toBe(false);
    const x = w.keeper.pos.x;
    stepRegionWalk(w, 100, []);
    expect(w.keeper.pos.x).toBe(x);
  });
});
