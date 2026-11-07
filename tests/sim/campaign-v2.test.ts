import { describe, expect, it, vi } from 'vitest';
import { endingScenes } from '../../src/sim/campaign-routes';
import { endingFor, mossFaded } from '../../src/sim/campaign';
import { s10FootScene } from '../../src/sim/side-stories';
import { sceneById } from '../../src/sim/story-scenes';
import type { CampaignState, World } from '../../src/sim/types';
import { applyCommand } from '../../src/sim/world';
import { c, campaignWorld, drive, moss, runCampaign, sable } from './campaign-driver';
import { TIMING_BUDGET } from '../../src/config/tuning-sim';

// HOT-CI: long scripted runs; a timeout here was the runner's load, not a wrong result.
vi.setConfig({ testTimeout: TIMING_BUDGET.slowTestTimeoutMs });

/**
 * Campaign v2 (CV1 with CV6's campaign items): the bible's ending order over every flag
 * combination, the ending scene sequence, the Long Night's branches, the side-story holds,
 * S27's buy-back, variant scenes and the line swaps. This half: the endings, their scenes and
 * the full runs; the rest is in campaign-v2-b.test.ts (split, efficiency 2026-11-07).
 */

/** A world in chapter 12 with Sable spawned, for setting flags by hand. */
function lateWorld(): { world: World; st: CampaignState } {
  const { world, events } = campaignWorld();
  applyCommand(world, { kind: 'debugChapter', chapter: 3 }, events);
  applyCommand(world, { kind: 'debugChapter', chapter: 12 }, events);
  return { world, st: c(world) };
}

/** The bible's order, restated from STORY-BIBLE.md and canon 24 as the test's oracle. */
function bibleEnding(f: {
  sold: boolean;
  boughtBack: boolean;
  keptStone: boolean;
  sable: boolean;
  bonded: boolean;
  eternal: boolean;
  forced: boolean;
  open: boolean;
  corvin: string;
  faded: boolean;
}): string {
  if ((f.sold && !f.boughtBack) || f.keptStone) return 'collector';
  if (!f.sable) return 'empty-lantern';
  if (f.eternal && f.bonded) return 'eternal-dawn';
  if (f.forced && f.open) return 'wild-grove';
  if (f.bonded && f.corvin === 'reconciled' && !f.faded) return 'hazels-grove';
  if (f.bonded && f.faded) return 'moss-sleeps';
  if (f.bonded) return 'shadow-keeper';
  return 'long-road';
}

describe('endingFor', () => {
  it('matches the bible over every combination of the flags it reads', () => {
    const { world, st } = lateWorld();
    const s = sable(world)!;
    const bools = [false, true];
    let checked = 0;
    for (const sold of bools)
      for (const boughtBack of bools)
        for (const keptStone of bools)
          for (const present of bools)
            for (const bonded of bools)
              for (const eternal of bools)
                for (const forced of bools)
                  for (const open of bools)
                    for (const faded of bools)
                      for (const corvin of ['reconciled', 'bargained', 'forced']) {
                        if (bonded && !present) continue;
                        st.flags = {
                          soldNubbin: sold,
                          boughtBack,
                          keptStone,
                          eternalRaised: eternal,
                          freedByForce: forced,
                          letThemGo: open,
                          finalChoice: open ? 'free' : 'keep',
                          mossFaded: faded,
                          corvin,
                        };
                        s.bond = bonded;
                        world.nubbins = world.nubbins.filter((n) => n.id !== s.id);
                        if (present) world.nubbins.push(s);
                        const want = bibleEnding({
                          sold,
                          boughtBack,
                          keptStone,
                          sable: present,
                          bonded,
                          eternal,
                          forced,
                          open,
                          corvin,
                          faded,
                        });
                        expect(endingFor(world, st)).toBe(want);
                        checked++;
                      }
    expect(checked).toBeGreaterThan(1000);
  });

  it('Hazel’s Grove ignores the final choice; Open plays its body variant', () => {
    const { world, st } = lateWorld();
    sable(world)!.bond = true;
    st.flags = { corvin: 'reconciled', mossFaded: false, finalChoice: 'keep' };
    expect(endingFor(world, st)).toBe('hazels-grove');
    expect(endingScenes(world, st, 'hazels-grove')[0]).toBe('end-hazels-grove');
    st.flags = { corvin: 'reconciled', mossFaded: false, finalChoice: 'free', letThemGo: true };
    expect(endingFor(world, st)).toBe('hazels-grove');
    const scenes = endingScenes(world, st, 'hazels-grove');
    expect(scenes[0]).toBe('end-hazels-grove-open');
    expect(scenes).not.toContain('end-hazels-grove');
    expect(scenes.at(-1)).toBe('end-hazels-grove-last');
  });

  it('a forced route with Open is still the Wild Grove, even with a bonded Sable', () => {
    const { world, st } = lateWorld();
    sable(world)!.bond = true;
    st.flags = { corvin: 'forced', freedByForce: true, letThemGo: true, mossFaded: false };
    expect(endingFor(world, st)).toBe('wild-grove');
  });

  it('a bonded Sable never reaches the Long Road', () => {
    const { world, st } = lateWorld();
    sable(world)!.bond = true;
    st.flags = { corvin: 'bargained', mossFaded: false };
    expect(endingFor(world, st)).toBe('shadow-keeper');
    st.flags = { corvin: 'bargained', mossFaded: true };
    expect(endingFor(world, st)).toBe('moss-sleeps');
  });

  it('keptStone is the Collector, whatever else is true', () => {
    const { world, st } = lateWorld();
    sable(world)!.bond = true;
    st.flags = { corvin: 'reconciled', keptStone: true, eternalRaised: true };
    expect(endingFor(world, st)).toBe('collector');
    expect(endingScenes(world, st, 'collector').slice(0, 2)).toEqual([
      'end-collector',
      'end-collector-kept',
    ]);
  });

  it('Moss carried the stone in and stayed in: faded', () => {
    const { st } = lateWorld();
    st.flags = { stoneUnmadeBy: 'moss', mossReturned: false };
    expect(mossFaded(st)).toBe(true);
    st.flags = { stoneUnmadeBy: 'moss', mossReturned: true };
    expect(mossFaded(st)).toBe(false);
  });
});

describe('ending scenes', () => {
  it('play the epilogues in the notes’ order', () => {
    const { world, st } = lateWorld();
    st.flags = {
      wisp: 'spared',
      stoneUnmadeBy: 'wisp',
      corvinGate: 'family',
      visitors: true,
      millLetter: 'kept',
      walk: 'corvin',
      cinder: 'forgiven',
      hazel: 'told',
      hushGarden: true,
    };
    expect(endingScenes(world, st, 'long-road')).toEqual([
      'end-long-road',
      'end-epi-wisp-spared',
      'end-epi-gate-family',
      'end-epi-visitors-cinder',
      'end-epi-mill-kept-ungiven',
      'end-epi-walk-corvin',
      'end-epi-cinder-forgiven',
      'end-epi-told',
      'end-epi-garden',
      'end-long-road-last',
    ]);
  });

  it('fall back to the "never met" epilogues with no side stories', () => {
    const { world, st } = lateWorld();
    st.flags = {};
    const scenes = endingScenes(world, st, 'long-road');
    expect(scenes).toEqual([
      'end-long-road',
      'end-epi-wisp-none',
      'end-epi-gate-none',
      'end-epi-walk-alone',
      'end-long-road-last',
    ]);
    for (const id of scenes) expect(sceneById(id), id).toBeDefined();
  });

  it('walk = moss on the keep route stays on the hill', () => {
    const { world, st } = lateWorld();
    st.flags = { keptStone: true, walk: 'moss', wisp: 'sable' };
    const scenes = endingScenes(world, st, 'collector');
    expect(scenes).toContain('end-epi-walk-moss-stayed');
    expect(scenes).toContain('end-epi-wisp-kept');
  });
});

const BONDED = {
  7: (w: World) => {
    sable(w)!.trust = 80;
    sable(w)!.bond = true;
  },
};

describe('a full run', () => {
  it('Hazel’s Grove with Open plays end-hazels-grove-open', () => {
    const { ending, world } = runCampaign(
      { 'c2-corvin': 'refuse', 'c3-open': 'slow', 'c9-open': 'confront', 'c12-open': 'free' },
      { ...BONDED, 9: (w) => (moss(w)!.needs.affection = 80) },
    );
    expect(ending).toBe('hazels-grove');
    const seenIds = c(world).seen;
    expect(seenIds).toContain('end-hazels-grove-open');
    expect(seenIds).not.toContain('end-hazels-grove');
    expect(seenIds.at(-1)).toBe('end-hazels-grove-last');
  });

  it('plays the side stories the campaign waits on, in their places', () => {
    const { world } = runCampaign(
      { 'c2-corvin': 'refuse', 'c3-open': 'slow', 'c9-open': 'confront', 'c12-open': 'keep' },
      BONDED,
      // A thorough player: chapter 8's notebook waits until S27 has walked Nine home.
      { holdGoal: (w) => c(w).chapter === 8 && (c(w).side.s27?.step ?? 0) <= 10 },
    );
    const seenIds = c(world).seen;
    const at = (id: string) => {
      const i = seenIds.indexOf(id);
      expect(i, id).toBeGreaterThanOrEqual(0);
      return i;
    };
    for (const id of ['s5', 's9', 's10', 's27', 's28'])
      expect(c(world).side[id]?.status, id).toBe('done');
    // S5 before c5-close; Fossil is not re-introduced.
    expect(at('s5-home')).toBeLessThan(at('c5-close'));
    expect(seenIds).toContain('c6-open-walked');
    // S27 and S28's autumn steps before c9-open.
    expect(at('s27-complete')).toBeLessThan(at('c9-open'));
    expect(at('s28-cart-stop')).toBeLessThan(at('c9-open'));
    // The eve of chapter 12: s9-ask, s9-word, c11-close, c11-gate, s10-night, then chapter 12.
    expect(at('s9-ask')).toBeLessThan(at('s9-word'));
    expect(at('s9-word')).toBeLessThan(at('c11-close'));
    expect(at('c11-close')).toBeLessThan(at('c11-gate'));
    expect(at('c11-gate')).toBeLessThan(at('s10-night'));
    const gate = seenIds.includes('s9-gate-family') ? 's9-gate-family' : 's9-gate';
    expect(at('s10-night')).toBeLessThan(at(gate));
    expect(at('s9-complete')).toBeLessThan(at('c12-open'));
    // Chapter 12: the foot of the hill, the walk, the close, S10's letter, the ending.
    expect(at('c12-open')).toBeLessThan(at(s10FootScene(world, c(world))));
    expect(at('c12-close')).toBeLessThan(at('s10-letter'));
    expect(c(world).flags.s9Started).toBe(true);
  });

  it('an ignored S9 never holds chapter 11: it jumps to the dawn gate', () => {
    const { world } = runCampaign(
      { 'c2-corvin': 'refuse', 'c3-open': 'slow', 'c9-open': 'confront', 'c12-open': 'keep' },
      BONDED,
      { skip: ['s9'] },
    );
    const seenIds = c(world).seen;
    expect(seenIds).toContain('c11-close');
    expect(seenIds).not.toContain('s9-ask');
    expect(seenIds).not.toContain('c11-gate');
    expect(seenIds.indexOf('s9-gate')).toBeLessThan(seenIds.indexOf('c12-open'));
    expect(c(world).flags.s9Jumped).toBe(true);
  });

  it('S5 holds c5-close until Fossil’s walk is done', () => {
    const { world, events } = campaignWorld();
    drive(
      world,
      events,
      { 'c2-corvin': 'refuse', 'c3-open': 'slow' },
      {},
      {
        skip: ['s5'],
        until: (w) => c(w).side.s5?.stage === 'check',
      },
    );
    // The race is won, but S5 is still open: no c5-close.
    drive(world, events, {}, {}, { skip: ['s5'], until: (w) => c(w).stats.races >= 1 });
    drive(
      world,
      events,
      {},
      {},
      { skip: ['s5'], until: (w) => w.timeMs > 0 && c(w).goalMetMs !== null },
    );
    for (let i = 0; i < 30; i++) drive(world, events, {}, {}, { skip: ['s5'], until: () => true });
    expect(c(world).chapter).toBe(5);
    expect(c(world).queue).not.toContain('c5-close');
    expect(c(world).seen).not.toContain('c5-close');
    drive(world, events, {}, {}, { until: (w) => c(w).chapter === 6 });
    expect(c(world).flags.s5Done).toBe(true);
  });

  it('kept stone: the Collector, Moss on the hill, and no S9', () => {
    const { ending, world } = runCampaign(
      {
        'c2-corvin': 'refuse',
        'c3-open': 'slow',
        'c9-open': 'confront',
        'c10-edge': 'keep',
        'c12-open': 'keep',
      },
      BONDED,
    );
    expect(ending).toBe('collector');
    const seenIds = c(world).seen;
    expect(seenIds).toContain('c10-kept');
    expect(seenIds).toContain('c11-moss-kept');
    expect(seenIds).toContain('c11-cold-hands');
    expect(seenIds).not.toContain('s9-dusk');
    expect(seenIds).toContain('end-collector-kept');
    expect(c(world).side.s9).toBeUndefined();
  });
});
