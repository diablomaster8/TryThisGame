import { describe, expect, it } from 'vitest';
import { boutTier, loggedPartyIds } from '../../src/sim/storyline-rules-logged';
import type { SimEvent, World } from '../../src/sim/types';
import { applyCommand } from '../../src/sim/world';
import { c, storylineWorld, toChapter } from './storyline-driver';

/**
 * Settings → Bouts on "Skip story bouts" (recs FIGHT-71): Logged In's bouts all resolve in the
 * sim with no battle screen (the bout is finished the moment it starts), every one counts as
 * won, and the story's `count:partyBout` reaches 10.
 */
function skipBout(world: World, events: SimEvent[]): void {
  const runs = world.battleRuns ?? 0;
  const context = {
    kind: 'story',
    storyline: 'logged',
    tier: boutTier(c(world)),
    ids: loggedPartyIds(c(world)),
    auto: true,
  } as const;
  applyCommand(world, { kind: 'battleStart', context }, events);
  expect(world.battleRuns).toBe(runs + 1);
  // Already settled: there is no live bout for a screen to show.
  expect(world.battle?.result?.winner).toBe(0);
  expect(world.battle?.settled).toBe(true);
}

describe('skipping Logged In’s bouts (recs FIGHT-71)', () => {
  it('moves the story on and counts ten won bouts', () => {
    const { world, events } = storylineWorld('logged');
    world.settings.bouts = 'skip';
    expect(toChapter(world, events, 1)).toBe(true);
    for (const id of loggedPartyIds(c(world)))
      applyCommand(world, { kind: 'debugHatchNow', nubbinId: id }, events);
    expect(toChapter(world, events, 2)).toBe(true);
    skipBout(world, events);
    expect(toChapter(world, events, 3)).toBe(true);
    skipBout(world, events);
    skipBout(world, events);
    expect(toChapter(world, events, 4)).toBe(true);
    for (let i = 0; i < 7; i++) skipBout(world, events);
    expect(Number(c(world).flags['n:partyBout'])).toBeGreaterThanOrEqual(10);
    expect(events.filter((e) => e.kind === 'partyBout' && e.won).length).toBe(10);
    expect(events.some((e) => e.kind === 'partyBout' && !e.won)).toBe(false);
  });
});
