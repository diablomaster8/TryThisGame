/**
 * WORLD-11 dev tool: how many walking seconds from a random spot to the nearest point of
 * interest of each tier, per region. Samples 500 seeded points over each laid-out region and
 * prints the 90th percentile per tier against the ladder in `WORLD_WALK.tierS`; exits 1 when
 * any is over. Distance is straight-line over the walking speed until the nav path (WORLD-01)
 * can be asked for, so it flatters places with water or cliffs in the way.
 * Run: `npx tsx tests/tools/poi-spacing.ts`
 */
import { WILD_PROPS } from '../../src/config/grove-layout';
import { WOOD_MICRO } from '../../src/config/region-wood';
import { REGIONS, REGION_ORDER, type PoiTier, type RegionId } from '../../src/config/regions';
import { GROVE, WORLD_WALK } from '../../src/config/tuning';

type Spot = { x: number; z: number };

/** Micro spots (a tree, a rock, a bush to poke) are not POIs in the data; the Grove and Wood list theirs. */
function microSpots(id: RegionId): Spot[] {
  if (id === 'wood') return [...WOOD_MICRO];
  if (id !== 'grove') return [];
  return [...GROVE.trees, ...GROVE.rocks, ...WILD_PROPS];
}

function spotsOf(id: RegionId, tier: PoiTier): Spot[] {
  const pois = REGIONS[id].pois.filter((p) => p.tier === tier);
  // A bigger POI also does a smaller one's job.
  const bigger = REGIONS[id].pois.filter(
    (p) => (tier === 'micro' && p.tier !== undefined) || (tier === 'minor' && p.tier === 'major'),
  );
  return [...pois, ...bigger, ...(tier === 'micro' ? microSpots(id) : [])];
}

function p90(values: number[]): number {
  const s = [...values].sort((a, b) => a - b);
  return s[Math.floor(s.length * 0.9)] ?? 0;
}

let seed = 12345;
const rand = (): number => {
  seed = (seed * 1103515245 + 12345) % 2147483648;
  return seed / 2147483648;
};

let failed = false;
for (const id of REGION_ORDER) {
  const r = REGIONS[id];
  if (!r.pois.some((p) => p.tier)) {
    console.log(`${id}: no tiered layout yet`);
    continue;
  }
  const line: string[] = [];
  for (const tier of ['micro', 'minor', 'major'] as const) {
    const spots = spotsOf(id, tier);
    const times: number[] = [];
    for (let i = 0; i < 500; i++) {
      const x = (rand() - 0.5) * r.size.w;
      const z = (rand() - 0.5) * r.size.h;
      let best = Infinity;
      for (const s of spots) best = Math.min(best, Math.hypot(s.x - x, s.z - z));
      times.push(best / WORLD_WALK.speed);
    }
    const t = p90(times);
    const max = WORLD_WALK.tierS[tier];
    const ok = t <= max;
    if (!ok) failed = true;
    line.push(`${tier} p90 ${t.toFixed(1)} s (≤ ${max}) ${ok ? 'ok' : 'OVER'}`);
  }
  console.log(`${id}: ${line.join(' · ')}`);
}
process.exit(failed ? 1 : 0);
