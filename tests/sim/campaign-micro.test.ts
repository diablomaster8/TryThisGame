import { describe, expect, it } from 'vitest';
import { MICRO_SCENES, MICRO_SLOTS } from '../../src/content/campaign-micro';
import { CAMPAIGN_FLAGS } from '../../src/content/campaign';
import { microDue } from '../../src/sim/campaign-micro';
import { c, campaignWorld, drive, playScenes, tick } from './campaign-driver';

// R0367 (FUN-78): the five Keepers' comic micro-scenes, one per window, once each.

function quietWorld(chapter: number) {
  const { world } = campaignWorld();
  const st = c(world);
  st.chapter = chapter;
  st.step = 1;
  st.queue = [];
  st.rest = null;
  return { world, st };
}

describe('Keeper micro-scenes', () => {
  it('has fifteen scenes, three for each of the five Keepers, none in chapters 9 to 11', () => {
    expect(MICRO_SCENES).toHaveLength(15);
    expect(MICRO_SLOTS.map((s) => s.id).sort()).toEqual(MICRO_SCENES.map((s) => s.id).sort());
    for (const k of ['clover', 'luna', 'ember', 'pixel', 'dusty'])
      expect(MICRO_SLOTS.filter((s) => s.keeper === k)).toHaveLength(3);
    for (const s of MICRO_SLOTS)
      for (let ch = 9; ch <= 11; ch++) expect(ch < s.from || ch > s.to).toBe(true);
    for (const s of MICRO_SCENES) {
      expect(s.lines.length).toBeGreaterThanOrEqual(6);
      expect(s.lines.length).toBeLessThanOrEqual(10);
      expect(s.choices).toBeUndefined();
      expect(s.lines.some((l) => l.gag)).toBe(true);
    }
    expect(CAMPAIGN_FLAGS.some((f) => f.startsWith('t-micro'))).toBe(false);
  });

  it('picks the soonest-closing window on a quiet stretch, and nothing otherwise', () => {
    const { world, st } = quietWorld(3);
    expect(microDue(world, st)).toBe('t-micro-clover-1');
    st.seen.push('t-micro-clover-1');
    st.seenMs['t-micro-clover-1'] = world.timeMs;
    expect(microDue(world, st)).toBeNull(); // the gap after the last micro-scene
    world.timeMs += 10 * 60_000;
    expect(microDue(world, st)).toBe('t-micro-luna-1');
    st.rest = { atMs: world.timeMs, owner: 'c3' };
    expect(microDue(world, st)).toBeNull(); // not straight after a scene
    for (const ch of [1, 2, 9, 10, 11])
      expect(microDue(quietWorld(ch).world, quietWorld(ch).st)).toBeNull();
    const opening = quietWorld(5);
    opening.st.step = 0;
    expect(microDue(opening.world, opening.st)).toBeNull();
  });

  it('never plays in the Learning Grove', () => {
    const { world, st } = quietWorld(5);
    world.edu = {} as NonNullable<typeof world.edu>;
    expect(microDue(world, st)).toBeNull();
  });

  it('each plays exactly once in a full run with quiet days', { timeout: 240_000 }, () => {
    const { world, events } = campaignWorld();
    // The player leaves each goal alone for a while, so the chapters have quiet stretches.
    drive(
      world,
      events,
      {},
      {},
      {
        holdGoal: (w) => w.timeMs < (c(w).openedMs ?? 0) + 25 * 60_000,
      },
    );
    for (let i = 0; i < 2000 && !MICRO_SLOTS.every((s) => c(world).seen.includes(s.id)); i++) {
      playScenes(world, events);
      tick(world, events, 5);
    }
    const seen = c(world).seen;
    for (const s of MICRO_SLOTS) expect(seen.filter((id) => id === s.id)).toHaveLength(1);
  });
});
