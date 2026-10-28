/**
 * WORLD-21: what the Keeper's jump can actually reach, worked out from the sim's own jump
 * numbers, and the check every jump route in `config/region-jumps.ts` must pass: its gap and
 * rise inside the metrics, the metrics inside the reach, and a walking way round that exists.
 * Pure arithmetic; the jump itself lives in lane A's code and is not touched here.
 */
import { REGIONS, type RegionId } from '../config/regions';
import { JUMP_METRICS, JUMP_ROUTES, type JumpRoute } from '../config/region-jumps';
import { KEEPER } from '../config/tuning';
import { GLIDE } from '../config/tuning-move';
import { JUMP } from '../config/tuning-sim';

export interface JumpReach {
  /** Peak heights, world units. */
  singleRise: number;
  doubleRise: number;
  /** Gaps cleared landing level with the take-off, walking and running. */
  singleGapWalk: number;
  singleGapRun: number;
  doubleGapWalk: number;
  doubleGapRun: number;
  /** Glide: horizontal units per unit dropped, at a walk. */
  glidePerDrop: number;
}

/** Time to fall `h` from rest under the fall gravity. */
const fallTime = (h: number): number => Math.sqrt((2 * h) / (JUMP.gravity * JUMP.fallGravityScale));

/** Time to rise `h` from a jump launched to peak at exactly `h`. */
const riseTime = (h: number): number => Math.sqrt((2 * h) / JUMP.gravity);

export function jumpReach(): JumpReach {
  const walk = KEEPER.speed;
  const run = KEEPER.speed * KEEPER.runMultiplier;
  const single = JUMP.height;
  // The second jump fires at the first's peak, the highest it can start.
  const double = JUMP.height + JUMP.doubleHeight;
  const singleAir = riseTime(single) + fallTime(single);
  const doubleAir = riseTime(JUMP.height) + riseTime(JUMP.doubleHeight) + fallTime(double);
  return {
    singleRise: single,
    doubleRise: double,
    singleGapWalk: walk * singleAir,
    singleGapRun: run * singleAir,
    doubleGapWalk: walk * doubleAir,
    doubleGapRun: run * doubleAir,
    glidePerDrop: (walk * GLIDE.airSpeed) / GLIDE.maxFall,
  };
}

/** Problems with one route, as sentences (none: it is fine). */
export function checkJumpRoute(region: RegionId, r: JumpRoute): string[] {
  const m = JUMP_METRICS;
  const out: string[] = [];
  const say = (s: string) => out.push(`${region}/${r.id}: ${s}`);
  if (!REGIONS[region].pois.some((p) => p.id === r.walkAround))
    say(`no walking way round (POI "${r.walkAround}" is not in the region)`);
  switch (r.kind) {
    case 'stones':
    case 'ledge':
      if (r.rise > m.single.rise) say(`rise ${r.rise} is over a single jump's ${m.single.rise}`);
      if (r.gap > (r.run ? m.single.gapRun : m.single.gapWalk)) say(`gap ${r.gap} too wide`);
      break;
    case 'double':
      if (r.rise > m.double.rise) say(`rise ${r.rise} is over a double jump's ${m.double.rise}`);
      if (r.gap > (r.run ? m.double.gapRun : m.double.gapWalk)) say(`gap ${r.gap} too wide`);
      break;
    case 'glide':
      if (r.rise >= 0) say('a glide drop must go down');
      else if (r.gap > -r.rise * m.glide.perDrop) say(`gap ${r.gap} too long for its drop`);
      break;
  }
  return out;
}

/** Every route in every region. */
export function checkJumpRoutes(): string[] {
  const out: string[] = [];
  for (const [region, routes] of Object.entries(JUMP_ROUTES) as [RegionId, JumpRoute[]][])
    for (const r of routes) out.push(...checkJumpRoute(region, r));
  return out;
}

/** Metrics the physics no longer covers (a change to the jump), as sentences. */
export function checkJumpMetrics(reach: JumpReach = jumpReach()): string[] {
  const m = JUMP_METRICS;
  const k = m.margin;
  const out: string[] = [];
  const need = (name: string, metric: number, real: number) => {
    if (metric > real * k) out.push(`${name} ${metric} is over ${k} × reach ${real.toFixed(2)}`);
  };
  need('single.rise', m.single.rise, reach.singleRise);
  need('single.gapWalk', m.single.gapWalk, reach.singleGapWalk);
  need('single.gapRun', m.single.gapRun, reach.singleGapRun);
  need('double.rise', m.double.rise, reach.doubleRise);
  need('double.gapWalk', m.double.gapWalk, reach.doubleGapWalk);
  need('double.gapRun', m.double.gapRun, reach.doubleGapRun);
  need('glide.perDrop', m.glide.perDrop, reach.glidePerDrop);
  return out;
}
