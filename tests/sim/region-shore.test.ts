import { describe, expect, it } from 'vitest';
import { REGIONS } from '../../src/config/regions';
import { inBoxes, regionLayout, walkableAt } from '../../src/config/region-layout';
import { SHORE_SPEC, tideAt, waterlineZ } from '../../src/config/region-shore';
import { SHORE_LOOK } from '../../src/config/tuning-r11d7';
import { planRegionWalk, seamlessOffset } from '../../src/sim/region-walk';

// WORLD-35 (R11 d7): the shore as a drawn region.
describe('the shore (WORLD-35)', () => {
  const l = regionLayout(SHORE_SPEC);
  const arrive = REGIONS.grove.exits.find((e) => e.id === 'grove-marsh')!.arrive;

  it('lands on open ground and walks from the landing to every part of the strip', () => {
    expect(walkableAt(l, arrive.x, arrive.z)).toBe(true);
    for (const [x, z] of [
      [-20, 4], // the beach
      [20, 3], // the rock pools
      [46, 15.6], // the stilt village's boardwalk
      [58, 20], // the far jetty
      [63, 2], // the lighthouse spit
      [-62, 4], // the west beach, over the stepping stones
    ] as const) {
      expect(walkableAt(l, x, z), `${x},${z}`).toBe(true);
      expect(planRegionWalk(l, arrive, { x, z }).length, `${x},${z}`).toBeGreaterThan(0);
    }
  });

  it('never lets the Keeper past the high-tide line except on the boardwalk and jetties', () => {
    // Cell by cell (the walk grid is 2 units; a cell is walkable by its centre).
    for (let iz = 0; iz < l.gh; iz++)
      for (let ix = 0; ix < l.gw; ix++) {
        const x = -70 + (ix + 0.5) * l.cell;
        const z = -24 + (iz + 0.5) * l.cell;
        if (z <= SHORE_LOOK.highTideZ || l.grid[iz * l.gw + ix] !== 1) continue;
        expect(inBoxes(SHORE_SPEC.decks, x, z), `${x},${z}`).toBe(true);
      }
  });

  it('turns the tide twice a day, moving the water line 4 units', () => {
    expect(tideAt(6)).toBeCloseTo(1);
    expect(tideAt(18)).toBeCloseTo(1);
    expect(tideAt(12)).toBeCloseTo(-1);
    expect(waterlineZ(1)).toBe(SHORE_LOOK.highTideZ);
    expect(waterlineZ(-1) - waterlineZ(1)).toBe(4);
  });

  it('re-bases exactly across the marsh border, both ways', () => {
    const there = seamlessOffset(REGIONS.grove.exits.find((e) => e.id === 'grove-marsh')!);
    const back = seamlessOffset(REGIONS.shore.exits.find((e) => e.id === 'shore-marsh')!);
    expect(there.x + back.x).toBeCloseTo(0);
    expect(there.z + back.z).toBeCloseTo(0);
  });
});
