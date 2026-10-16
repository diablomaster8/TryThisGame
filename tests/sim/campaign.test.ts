import { describe, expect, it } from 'vitest';
import { CHAPTERS, SCENES } from '../../src/config/story';
import { TRUST } from '../../src/config/tuning';
import { endingFor, sceneById } from '../../src/sim/campaign';
import { hatch } from '../../src/sim/lifecycle';
import { applyCommand } from '../../src/sim/world';
import { c, campaignWorld, moss, playScenes, runCampaign, sable, tick } from './campaign-driver';

describe('story data', () => {
  it('has twelve chapters whose scenes all exist', () => {
    expect(CHAPTERS.length).toBe(12);
    for (const ch of CHAPTERS) {
      expect(sceneById(ch.opening), ch.opening).toBeDefined();
      expect(sceneById(ch.closing), ch.closing).toBeDefined();
    }
    const ids = SCENES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const s of SCENES) for (const l of s.lines) expect(l.text.length).toBeGreaterThan(0);
  });
});

describe('campaign', () => {
  it('starts with Moss on the hill and the visiting Keepers', () => {
    const { world } = campaignWorld('sparks');
    expect(c(world).chapter).toBe(1);
    expect(c(world).queue[0]).toBe('c1-letter');
    expect(moss(world)?.eternal).toBe('neutral');
    expect(world.npcs.some((n) => n.trainer === 'sparks')).toBe(false);
    expect(world.npcs.length).toBe(9);
  });

  it('advances chapter by chapter as goals are met', () => {
    const { world, events } = campaignWorld();
    playScenes(world, events);
    expect(c(world).step).toBe(1);
    // Hatch and pet: the real way.
    for (const n of world.nubbins) if (n.stage === 'egg') hatch(n, events, world.timeMs);
    const kid = world.nubbins.find((n) => n.id !== c(world).mossId)!;
    c(world).stats.hatched = 1;
    world.keeper.pos = { ...kid.pos };
    applyCommand(world, { kind: 'pet', nubbinId: kid.id }, events);
    tick(world, events, 2);
    expect(c(world).stats.pets).toBeGreaterThanOrEqual(1);
    expect(c(world).queue[0]).toBe('c1-close');
    playScenes(world, events);
    expect(c(world).chapter).toBe(2);
  });

  it('spawns Sable as a wary Shadow stray in chapter 3', () => {
    const { world, events } = campaignWorld();
    applyCommand(world, { kind: 'debugChapter', chapter: 3 }, events);
    const s = sable(world)!;
    expect(s.shadow).toBe(true);
    expect(s.stray).toBe(true);
    expect(s.trust).toBeLessThan(TRUST.wary);
    playScenes(world, events, { 'c3-open': 'slow' });
    expect(s.trust).toBeCloseTo(16, 0);
  });

  it('reaches Hazel’s Grove: bonded Sable, reconciled Corvin, loved Moss', () => {
    const { ending, world } = runCampaign(
      { 'c2-corvin': 'refuse', 'c3-open': 'slow', 'c9-open': 'confront', 'c12-open': 'keep' },
      {
        7: (w) => {
          sable(w)!.trust = 80;
          sable(w)!.bond = true;
        },
        9: (w) => {
          moss(w)!.needs.affection = 80;
        },
      },
    );
    expect(ending).toBe('hazels-grove');
    expect(world.campaign!.seen).toContain('end-hazels-grove');
  });

  it('reaches The Shadow’s Keeper when Corvin is not reconciled', () => {
    const { ending } = runCampaign(
      { 'c2-corvin': 'refuse', 'c3-open': 'slow', 'c9-open': 'force', 'c12-open': 'keep' },
      {
        7: (w) => {
          sable(w)!.trust = 80;
          sable(w)!.bond = true;
        },
        9: (w) => {
          moss(w)!.needs.affection = 80;
        },
      },
    );
    expect(ending).toBe('shadow-keeper');
  });

  it('reaches Moss Sleeps when Moss was left unloved', () => {
    const { ending } = runCampaign(
      { 'c2-corvin': 'refuse', 'c3-open': 'slow', 'c9-open': 'confront', 'c12-open': 'keep' },
      {
        7: (w) => {
          sable(w)!.trust = 80;
          sable(w)!.bond = true;
        },
        9: (w) => {
          moss(w)!.needs.affection = 10;
        },
      },
    );
    expect(ending).toBe('moss-sleeps');
  });

  it('reaches Wild Grove by force and an open gate', () => {
    const { ending } = runCampaign(
      { 'c2-corvin': 'refuse', 'c3-open': 'slow', 'c9-open': 'force', 'c12-open': 'free' },
      { 7: (w) => (sable(w)!.trust = 50) },
    );
    expect(ending).toBe('wild-grove');
  });

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
