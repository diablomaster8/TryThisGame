import { describe, expect, it, vi } from 'vitest';
import { endingFor } from '../../src/sim/campaign';
import { hatch } from '../../src/sim/lifecycle';
import { applyCommand } from '../../src/sim/world';
import { c, campaignWorld, runCampaign, sable } from './campaign-driver';
import { TIMING_BUDGET } from '../../src/config/tuning-sim';

// HOT-CI: long scripted runs; a timeout here was the runner's load, not a wrong result.
vi.setConfig({ testTimeout: TIMING_BUDGET.slowTestTimeoutMs });

/** Endings from The Empty Lantern on (split from campaign.test.ts, efficiency 2026-11-07). */
describe('campaign, later endings', () => {
  it('reaches The Empty Lantern when Sable is gone', () => {
    const { ending } = runCampaign(
      { 'c2-corvin': 'refuse', 'c3-open': 'slow', 'c9-open': 'confront', 'c12-open': 'keep' },
      {
        11: (w) => {
          // She ran away and never came back.
          w.nubbins = w.nubbins.filter((n) => n.id !== c(w).sableId);
        },
      },
    );
    expect(ending).toBe('empty-lantern');
  });

  it('reaches The Collector after selling a Nubbin', () => {
    const { ending, world } = runCampaign(
      { 'c2-corvin': 'sell', 'c3-open': 'slow', 'c9-open': 'confront', 'c12-open': 'keep' },
      {
        1: (w, e) => {
          for (const n of w.nubbins) if (n.stage === 'egg') hatch(n, e, 0);
        },
      },
      // S27's buy-back would bring the Nubbin home: leave its steps alone.
      { skip: ['s27'] },
    );
    expect(ending).toBe('collector');
    expect(world.inventory.shells).toBeGreaterThanOrEqual(200);
    expect(world.strays.length).toBe(1);
  });

  it('buying back in chapter 9 escapes The Collector', () => {
    const { ending, world } = runCampaign(
      {
        'c2-corvin': 'sell',
        'c3-open': 'slow',
        'c9-open': 'bargain',
        'c9-open-sold': 'bargain',
        'c12-open': 'keep',
      },
      {
        1: (w, e) => {
          for (const n of w.nubbins) if (n.stage === 'egg') hatch(n, e, 0);
        },
        7: (w) => (sable(w)!.trust = 50),
      },
    );
    expect(ending).toBe('long-road');
    expect(world.strays.length).toBe(0);
  });

  it('reaches Eternal Dawn when one of yours becomes Eternal', () => {
    const { ending } = runCampaign(
      { 'c2-corvin': 'refuse', 'c3-open': 'slow', 'c9-open': 'confront', 'c12-open': 'keep' },
      {
        7: (w) => {
          sable(w)!.trust = 80;
          sable(w)!.bond = true;
          c(w).flags.eternalRaised = true;
        },
      },
    );
    expect(ending).toBe('eternal-dawn');
  });

  it('reaches The Long Road by default', () => {
    const { ending } = runCampaign({
      'c2-corvin': 'refuse',
      'c3-open': 'slow',
      'c9-open': 'confront',
      'c12-open': 'keep',
    });
    expect(ending).toBe('long-road');
  });

  it('decides endings from flags in priority order', () => {
    const { world } = campaignWorld();
    applyCommand(world, { kind: 'debugChapter', chapter: 3 }, []);
    const st = c(world);
    st.flags.soldNubbin = true;
    expect(endingFor(world, st)).toBe('collector');
    st.flags.boughtBack = true;
    expect(endingFor(world, st)).toBe('long-road');
  });

  it('survives a save round-trip mid-story', async () => {
    const { deserialize, serialize } = await import('../../src/sim/save');
    const { world, events } = campaignWorld();
    applyCommand(world, { kind: 'debugChapter', chapter: 3 }, events);
    const copy = deserialize(serialize(world, 0)).world;
    expect(copy.campaign?.chapter).toBe(3);
    expect(copy.npcs.length).toBe(world.npcs.length);
    expect(copy.nubbins.find((n) => n.id === copy.campaign?.sableId)?.shadow).toBe(true);
  });
});
