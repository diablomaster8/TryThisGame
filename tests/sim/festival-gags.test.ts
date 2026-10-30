import { describe, expect, it } from 'vitest';
import { FESTIVAL_GAGS } from '../../src/content/festival-gags';
import { festivalGagDue } from '../../src/sim/festival-gags';
import { catchUp } from '../../src/sim/offline';
import type { Season, World } from '../../src/sim/types';
import { applyCommand, createWorld } from '../../src/sim/world';

/** R0359 (FUN-70): each season's festival vignette plays once per save. */
function hatchedWorld(): World {
  const world = createWorld(9, 0);
  world.nubbins[0]!.stage = 'child';
  return world;
}

describe('festival gags (R0359)', () => {
  it('each season is due once, until its vignette has played', () => {
    const world = hatchedWorld();
    for (const season of ['spring', 'summer', 'autumn', 'winter'] as Season[]) {
      world.season = season;
      expect(festivalGagDue(world)).toBe(season);
      expect(FESTIVAL_GAGS[season].lines).toHaveLength(4);
      applyCommand(world, { kind: 'festivalGagSeen', season }, []);
      expect(festivalGagDue(world)).toBeNull();
    }
    // A year later, nothing replays.
    world.season = 'spring';
    expect(festivalGagDue(world)).toBeNull();
    expect(world.festivalGags).toEqual(['spring', 'summer', 'autumn', 'winter']);
  });

  it('waits for the first hatch, skips a Learning Grove and chapters 9 to 11', () => {
    const fresh = createWorld(9, 0);
    expect(festivalGagDue(fresh)).toBeNull();
    const kids = hatchedWorld();
    kids.edu = { band: 'sprout' } as World['edu'];
    expect(festivalGagDue(kids)).toBeNull();
    const late = hatchedWorld();
    late.campaign = { chapter: 10, step: 0, flags: {} } as unknown as World['campaign'];
    expect(festivalGagDue(late)).toBeNull();
    late.campaign!.chapter = 12;
    expect(festivalGagDue(late)).toBe(late.season);
  });

  it('a catch-up never spends one unseen', () => {
    const world = hatchedWorld();
    world.settings.offlineAging.mode = 'indefinite';
    catchUp(world, 3 * 24 * 3_600_000, 0);
    expect(world.festivalGags ?? []).toEqual([]);
  });
});
