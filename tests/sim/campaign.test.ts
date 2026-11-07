import { describe, expect, it, vi } from 'vitest';
import { CHAPTERS, SCENES } from '../../src/config/story';
import { STORY, TRUST } from '../../src/config/tuning';
import { sceneById } from '../../src/sim/campaign';
import { hatch } from '../../src/sim/lifecycle';
import { applyCommand } from '../../src/sim/world';
import { c, campaignWorld, moss, playScenes, runCampaign, sable, tick } from './campaign-driver';
import { TIMING_BUDGET } from '../../src/config/tuning-sim';

// HOT-CI: long scripted runs; a timeout here was the runner's load, not a wrong result.
vi.setConfig({ testTimeout: TIMING_BUDGET.slowTestTimeoutMs });

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
  it('starts with Moss on the hill and all ten valley Keepers', () => {
    const { world } = campaignWorld('sparks');
    expect(c(world).chapter).toBe(1);
    expect(c(world).queue[0]).toBe('c1-letter');
    expect(moss(world)?.eternal).toBe('neutral');
    // The player is Hazel's grandchild, so Sparks is in the Grove too (shared decision).
    expect(world.npcs.some((n) => n.trainer === 'sparks')).toBe(true);
    expect(world.npcs.length).toBe(10);
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
    // The goal phase is played, not skipped: the closing waits out its minimum.
    expect(c(world).queue).toEqual([]);
    tick(world, events, STORY.goalMinMs / 1000);
    expect(c(world).queue[0]).toBe('c1-close');
    playScenes(world, events);
    // A breath after the hatch, then chapter 2 begins on a morning ("Morning. Mist...").
    expect(c(world).chapter).toBe(1);
    tick(world, events, (STORY.breatherMs + STORY.dayMs) / 1000);
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
});
