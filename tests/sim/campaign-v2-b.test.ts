import { describe, expect, it, vi } from 'vitest';
import { familyCount, s10FootScene } from '../../src/sim/side-stories';
import { sceneById, sceneFor } from '../../src/sim/story-scenes';
import type { CampaignState, World } from '../../src/sim/types';
import { applyCommand } from '../../src/sim/world';
import { hatch } from '../../src/sim/lifecycle';
import { c, campaignWorld, drive, moss, runCampaign, sable } from './campaign-driver';
import { TIMING_BUDGET } from '../../src/config/tuning-sim';

// HOT-CI: long scripted runs; a timeout here was the runner's load, not a wrong result.
vi.setConfig({ testTimeout: TIMING_BUDGET.slowTestTimeoutMs });

/**
 * Campaign v2 (CV1 with CV6's campaign items): the bible's ending order over every flag
 * combination, the ending scene sequence, the Long Night's branches, the side-story holds,
 * S27's buy-back, variant scenes and the line swaps. This half: the Long Night, S27 and S28,
 * variants and line swaps (split from campaign-v2.test.ts, efficiency 2026-11-07: the whole
 * file ran 58-87 s and set a CI shard's floor).
 */

/** A world in chapter 12 with Sable spawned, for setting flags by hand. */
function lateWorld(): { world: World; st: CampaignState } {
  const { world, events } = campaignWorld();
  applyCommand(world, { kind: 'debugChapter', chapter: 3 }, events);
  applyCommand(world, { kind: 'debugChapter', chapter: 12 }, events);
  return { world, st: c(world) };
}

const BONDED = {
  7: (w: World) => {
    sable(w)!.trust = 80;
    sable(w)!.bond = true;
  },
};

describe('the Long Night', () => {
  const base = {
    'c2-corvin': 'refuse',
    'c3-open': 'slow',
    'c9-open': 'confront',
    'c12-open': 'keep',
  };

  it('runs the vigil: a wave blows a lantern out, the lull plays, then the falls', () => {
    const { world, events } = runCampaign(base, BONDED);
    expect(events.some((e) => e.kind === 'lanternOut')).toBe(true);
    const seenIds = c(world).seen;
    expect(seenIds.indexOf('c10-vigil')).toBeLessThan(seenIds.indexOf('c10-lull'));
    expect(seenIds.indexOf('c10-lull')).toBeLessThan(seenIds.indexOf('c10-falls'));
    expect(seenIds).toContain('c10-bearer-sable');
    expect(c(world).flags.stoneBearer).toBe('sable');
  });

  it('Wisp unmakes the stone when S2 spared him', () => {
    const { world } = runCampaign(base, {
      ...BONDED,
      9: (w) => {
        c(w).flags.wisp = 'spared';
        moss(w)!.needs.affection = 80;
      },
    });
    const seenIds = c(world).seen;
    expect(seenIds).toContain('c10-vigil-wisp');
    expect(seenIds).toContain('c10-wisp');
    expect(seenIds).toContain('c10-bank-wisp');
    expect(seenIds).toContain('c10-moss-stays');
    expect(c(world).flags.stoneUnmadeBy).toBe('wisp');
    expect(seenIds).toContain('end-epi-wisp-spared');
  });

  it('Moss walks in and comes back when he was loved', () => {
    // Wisp is not spared here (S2 left alone), so the stone is Moss's to carry.
    const { world } = runCampaign(
      base,
      { ...BONDED, 9: (w) => (moss(w)!.needs.affection = 80) },
      { skip: ['s2'] },
    );
    const seenIds = c(world).seen;
    expect(seenIds).toContain('c10-moss-walks');
    expect(seenIds).toContain('c10-bank-moss-returned');
    expect(seenIds).toContain('c11-moss-here');
    expect(c(world).flags.mossReturned).toBe(true);
    expect(moss(world)).toBeDefined();
  });

  it('Moss does not come back when he had faded', () => {
    const { world, ending } = runCampaign(
      base,
      { ...BONDED, 9: (w) => (moss(w)!.needs.affection = 10) },
      { skip: ['s2'] },
    );
    const seenIds = c(world).seen;
    expect(seenIds).toContain('c10-bank-moss-gone');
    expect(seenIds).toContain('c10-moss-mourned');
    expect(seenIds).toContain('c10-moss-light');
    expect(seenIds).toContain('c11-moss-gone');
    expect(moss(world)).toBeUndefined();
    expect(world.memorials.some((m) => m.id === 'memorial-moss')).toBe(true);
    expect(ending).toBe('moss-sleeps');
  });
});

describe('S27 and S28', () => {
  it('S27’s buy-back brings the sold Nubbin home before chapter 9', () => {
    const { world, events } = campaignWorld();
    let soldShells = 0;
    drive(
      world,
      events,
      { 'c2-corvin': 'sell', 'c3-open': 'slow', 's27-home': 'pay' },
      {
        1: (w, e) => {
          for (const n of w.nubbins) if (n.stage === 'egg') hatch(n, e, 0);
        },
      },
      {
        // Leave chapter 8's notebook until S27 has walked the runner home.
        holdGoal: (w) => c(w).chapter === 8 && (c(w).side.s27?.step ?? 0) <= 10,
        until: (w) => {
          if (c(w).queue[0] === 's27-home') soldShells = w.inventory.shells;
          return c(w).chapter === 9;
        },
      },
    );
    const st = c(world);
    expect(st.flags['s27-sold']).toBe(true);
    expect(st.seen).toContain('s27-home');
    expect(st.flags.boughtBack).toBe(true);
    expect(world.nubbins.some((n) => n.id === st.flags.soldId)).toBe(true);
    expect(world.strays.some((s) => s.nubbin.id === st.flags.soldId)).toBe(false);
    expect(world.inventory.shells).toBeLessThanOrEqual(soldShells - 200 + 1000);
    // Chapter 9 opens plainly: the Collector route is over.
    drive(world, events, {}, {}, { until: (w) => c(w).queue.length > 0 });
    expect(st.queue[0]).toBe('c9-open');
    expect(st.seen).not.toContain('c9-partner');
  });

  it('the hat buys it back for nothing, and only on the sold path', () => {
    const { world } = campaignWorld();
    const st = c(world);
    const sold =
      world.nubbins.find((n) => n.stage !== 'egg' && n.id !== st.mossId) ?? world.nubbins[0]!;
    world.nubbins = world.nubbins.filter((n) => n !== sold);
    world.strays.push({ nubbin: sold, leftAtMs: 0, returnsAtMs: Infinity });
    st.flags.soldNubbin = true;
    st.flags.soldId = sold.id;
    const shells = world.inventory.shells;
    applyCommand(world, { kind: 'sceneDone', scene: 's27-home', choice: 'hat' }, []);
    expect(st.flags.boughtBack).toBe(true);
    expect(world.inventory.shells).toBe(shells);
    expect(world.nubbins).toContain(sold);
    // A second buy-back does nothing: boughtBack is already set.
    applyCommand(world, { kind: 'sceneDone', scene: 's27-home', choice: 'pay' }, []);
    expect(world.inventory.shells).toBe(shells);
  });

  it('S28 holds chapter 9 until its autumn steps are done', () => {
    const { world, events } = campaignWorld();
    drive(
      world,
      events,
      { 'c2-corvin': 'refuse', 'c3-open': 'slow' },
      {},
      {
        skip: ['s28'],
        until: (w) => c(w).seen.includes('c8-nova') && c(w).side.s28?.stage === 'check',
      },
    );
    for (let i = 0; i < 40; i++) drive(world, events, {}, {}, { skip: ['s28'], until: () => true });
    expect(c(world).chapter).toBe(8);
    drive(world, events, {}, {}, { until: (w) => c(w).chapter === 9 });
    expect(c(world).side.s28!.step).toBeGreaterThanOrEqual(10);
  });
});

describe('variants and line swaps', () => {
  it('S9’s family gate needs two of the six ties', () => {
    const { st } = lateWorld();
    st.flags = { corvin: 'reconciled' };
    expect(familyCount(st)).toBe(1);
    st.flags = { corvin: 'reconciled', visitors: true };
    expect(familyCount(st)).toBe(2);
    st.flags = { s3Done: true, s6Done: true, s8Done: true, millLetter: 'kept' };
    expect(familyCount(st)).toBe(4);
  });

  it('S10’s foot-of-the-hill scene names who can walk', () => {
    const { world, st } = lateWorld();
    st.flags = {};
    expect(s10FootScene(world, st)).toBe('s10-foot');
    sable(world)!.bond = true;
    st.flags = { mossReturned: true, corvinGate: 'family' };
    expect(s10FootScene(world, st)).toBe('s10-foot-msc');
    st.flags = { keptStone: true, mossFaded: true };
    expect(s10FootScene(world, st)).toBe('s10-foot-ms');
    for (const id of [
      's10-foot',
      's10-foot-m',
      's10-foot-s',
      's10-foot-c',
      's10-foot-ms',
      's10-foot-msc',
    ])
      expect(sceneById(id), id).toBeDefined();
  });

  it('c11-close swaps the grey Nubbin line after S8 and notes the evening Corvin asks', () => {
    const { world, st } = lateWorld();
    const plain = sceneFor(world, 'c11-close')!.lines.map((l) => l.text);
    expect(plain.some((t) => t.startsWith('The thin grey Nubbin wakes'))).toBe(true);
    st.flags.s8Done = true;
    st.seen.push('s9-ask');
    const lines = sceneFor(world, 'c11-close')!.lines.map((l) => l.text);
    expect(lines.some((t) => t.startsWith('The thin grey Nubbin wakes'))).toBe(false);
    expect(lines).toContain('Hazel’s arm is empty now. She keeps it crooked anyway, out of habit.');
    expect(lines[1]).toBe('Then comes the evening Corvin asks at the gate.');
    expect(lines.length).toBe(plain.length + 1);
  });

  it('the letter loses its gate with Open; S26’s garden splices into c12-open', () => {
    const { world, st } = lateWorld();
    st.flags.letThemGo = true;
    st.flags.hushGarden = true;
    expect(sceneFor(world, 's10-letter')!.lines[0]!.text).toContain('There is no gate to stick.');
    const told = sceneFor(world, 's10-letter-told')!.lines.map((l) => l.text);
    expect(told.some((t) => t.startsWith('The Keepers are already at the gateposts.'))).toBe(true);
    const open = sceneFor(world, 'c12-open')!.lines.length;
    expect(open).toBe(
      sceneById('c12-open')!.lines.length + sceneById('c12-wall-garden')!.lines.length,
    );
  });
});
