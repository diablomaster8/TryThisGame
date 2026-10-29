import { describe, expect, it } from 'vitest';
import { applyCommand } from '../../src/sim/world';
import type { SimEvent } from '../../src/sim/types';
import { c, campaignWorld } from './campaign-driver';

// Round 5 lane A (FUN): the sim halves of R0304 and the items after it.

describe('R0304 line acts', () => {
  it('turning the cup in c1-letter sets the chapter 12 callback flag', () => {
    const { world } = campaignWorld('fern');
    const ev: SimEvent[] = [];
    applyCommand(world, { kind: 'lineAct', scene: 'c1-letter', act: 'cup' }, ev);
    expect(c(world).flags['c1-cup-turned']).toBe(true);
  });

  it('the turned cup comes back in c12-close', async () => {
    const { sceneFor } = await import('../../src/sim/story-scenes');
    const { world } = campaignWorld('fern');
    const before = sceneFor(world, 'c12-close')!.lines.length;
    c(world).flags['c1-cup-turned'] = true;
    const after = sceneFor(world, 'c12-close')!.lines;
    expect(after.length).toBe(before + 1);
    expect(after[4]!.text).toContain('right way up');
  });

  it('an act a scene does not have sets nothing', () => {
    const { world } = campaignWorld('fern');
    applyCommand(world, { kind: 'lineAct', scene: 'c2-feed', act: 'cup' }, []);
    expect(c(world).flags['c1-cup-turned']).toBeUndefined();
  });
});

describe('R0306 first fun quest', () => {
  it('waits for chapter 2 closing, then opens', async () => {
    const { firstOfferOpen, funQuests, funQuestOpens } = await import('../../src/sim/fun-quests');
    const { CHAPTERS } = await import('../../src/config/story');
    const { world } = campaignWorld('fern');
    const camp = c(world);
    camp.chapter = 2;
    camp.stats.hatched = 2;
    expect(firstOfferOpen(camp)).toBe(false);
    expect(funQuests().some((q) => funQuestOpens(world, camp, q))).toBe(false);
    camp.seen.push(CHAPTERS[1]!.closing);
    expect(firstOfferOpen(camp)).toBe(true);
    camp.chapter = 3;
    camp.seen = [];
    expect(firstOfferOpen(camp)).toBe(true);
  });
});

describe('R0307 slip nudges', () => {
  it('warns a minute before the first slip in a new save, and never says "(A slip.)"', async () => {
    const { createWorld } = await import('../../src/sim/world');
    const { stepSlips } = await import('../../src/sim/slips');
    const { slipNudge } = await import('../../src/ui/fun-toasts');
    const world = createWorld(7, 0);
    const n = world.nubbins[0]!;
    n.stage = 'child';
    n.needs.hunger = 0.05;
    const ev: SimEvent[] = [];
    for (let t = 0; t < 130; t++) stepSlips(world, 1000, ev);
    const soon = ev.findIndex((e) => e.kind === 'slipSoon');
    const slip = ev.findIndex((e) => e.kind === 'slip');
    expect(soon).toBeGreaterThanOrEqual(0);
    expect(slip).toBeGreaterThan(soon);
    const text = slipNudge(world, n.id, 'hungry');
    expect(text).not.toContain('(A slip.)');
    expect(text).toContain(n.name);
  });

  it('has no warning once the save is past its first minutes', async () => {
    const { createWorld } = await import('../../src/sim/world');
    const { stepSlips } = await import('../../src/sim/slips');
    const world = createWorld(7, 0);
    const n = world.nubbins[0]!;
    n.stage = 'child';
    n.ageMs = 20 * 60_000;
    n.needs.hunger = 0.05;
    const ev: SimEvent[] = [];
    for (let t = 0; t < 130; t++) stepSlips(world, 1000, ev);
    expect(ev.some((e) => e.kind === 'slipSoon')).toBe(false);
    expect(ev.some((e) => e.kind === 'slip')).toBe(true);
  });
});

describe('R0308 sprout toasts', () => {
  it('turns the load toasts into short, icon-first lines without multipliers', async () => {
    const { sproutToast } = await import('../../src/ui/fun-toasts');
    const { UI_TEXT } = await import('../../src/config/strings');
    expect(sproutToast(UI_TEXT.visitor('Byte', UI_TEXT.giftNames.egg))).toBe(
      '🔔 Ding dong! Byte brought an egg!',
    );
    for (const line of Object.values(UI_TEXT.festival)) {
      const out = sproutToast(line);
      if (out) {
        expect(out.split(/\s+/).length).toBeLessThanOrEqual(8);
        expect(out).not.toMatch(/twice|double|half|×/);
      }
    }
    expect(sproutToast('Fruit is worth 2× today.')).toBeNull();
    expect(sproutToast('Kiki hatched!')).toBe('Kiki hatched!');
  });
});
