import { describe, expect, it } from 'vitest';
import { REGION_ORDER } from '../../src/config/regions';
import { catchUp } from '../../src/sim/offline';
import { regionAwayMs } from '../../src/sim/regions';
import { applyCommand, createWorld } from '../../src/sim/world';

const DAY = 24 * 3_600_000;

/** R0124 (WORLD-58): only the Grove simulates while away; other regions age on entry. */
describe('regions frozen while away (R0124)', () => {
  it('a region left behind keeps its leaving time, and catch-up never steps it', () => {
    const world = createWorld(5, 0);
    expect(REGION_ORDER.length).toBeGreaterThanOrEqual(10);
    expect(regionAwayMs(world, 'grove')).toBe(0);
    expect(regionAwayMs(world, 'lane')).toBe(Infinity);
    applyCommand(world, { kind: 'travel', exit: 'grove-gate', sub: 'visit:fern' }, []);
    applyCommand(world, { kind: 'travel', exit: 'lane-gate' }, []);
    const left = { ...world.regionLeftMs };
    expect(left.lane).toBe(world.timeMs);
    world.settings.offlineAging.mode = 'indefinite';
    catchUp(world, 7 * DAY, 0);
    // The record is untouched; the lane's absence is simply the week, read on the way back.
    expect(world.regionLeftMs).toEqual(left);
    expect(regionAwayMs(world, 'lane')).toBe(world.timeMs - left.lane!);
    expect(regionAwayMs(world, 'lane')).toBeGreaterThanOrEqual(7 * DAY);
  });
});
