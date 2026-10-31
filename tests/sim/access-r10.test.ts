/**
 * Lane E round 10: Simple touch's one-tap care (R0710 KIDS-42), the loss-chapter hold
 * (R0694 KIDS-26) and the co-play tips deck (R0740 KIDS-72).
 */
import { describe, expect, it } from 'vitest';
import { STORY } from '../../src/config/tuning';
import { accessOf } from '../../src/sim/access';
import { tipsDeck, weakItems } from '../../src/sim/edu-tips';
import { lossHeld, lossWaiting, upcomingLossChapters } from '../../src/sim/loss-notice';
import type { SimEvent, World } from '../../src/sim/types';
import { applyCommand, createWorld } from '../../src/sim/world';
import { c, tick } from './campaign-driver';

function eduWorld(age: 3 | 4 | 5 | 6): World {
  const w = createWorld(7, Date.UTC(2026, 9, 31, 12));
  applyCommand(w, { kind: 'eduStart', age }, []);
  return w;
}

describe('R0710 (KIDS-42) Simple touch', () => {
  it('is on by default for sprouts only, and a setting overrides it', () => {
    expect(accessOf(createWorld(1, 0)).simpleTouch).toBe(false);
    const w = eduWorld(4);
    expect(w.edu?.band).toBe('sprout');
    expect(accessOf(w).simpleTouch).toBe(true);
    w.settings.access = { simpleTouch: false };
    expect(accessOf(w).simpleTouch).toBe(false);
  });

  it('a single tap on an egg in a sprout save shakes it', () => {
    const w = eduWorld(3);
    const egg = w.nubbins.find((n) => n.stage === 'egg')!;
    expect(egg).toBeDefined();
    const before = egg.hatchRemainingMs;
    const events: SimEvent[] = [];
    w.timeMs += 60_000;
    applyCommand(w, { kind: 'tapCare', nubbinId: egg.id }, events);
    expect(events.some((e) => e.kind === 'eggShaken' && e.nubbinId === egg.id)).toBe(true);
    expect(egg.hatchRemainingMs).toBeLessThan(before);
    // The shake cooldown still holds.
    const again: SimEvent[] = [];
    applyCommand(w, { kind: 'tapCare', nubbinId: egg.id }, again);
    expect(again.some((e) => e.kind === 'eggShaken')).toBe(false);
  });

  it('does nothing with Simple touch off', () => {
    const w = createWorld(3, 0);
    const egg = w.nubbins.find((n) => n.stage === 'egg')!;
    const events: SimEvent[] = [];
    w.timeMs += 60_000;
    applyCommand(w, { kind: 'tapCare', nubbinId: egg.id }, events);
    expect(events).toEqual([]);
  });
});

describe('R0694 (KIDS-26) loss chapters wait for a grown-up', () => {
  it('holds chapters 10 and 11 for ages 3–4, plays them for older children', () => {
    expect(lossHeld(eduWorld(3), 10)).toBe(true);
    expect(lossHeld(eduWorld(4), 11)).toBe(true);
    expect(lossHeld(eduWorld(5), 10)).toBe(false);
    expect(lossHeld(eduWorld(3), 9)).toBe(false);
    expect(lossHeld(createWorld(1, 0), 10)).toBe(false);
  });

  it('in an age-3 save, chapter 10 does not queue its opening until released', () => {
    const w = eduWorld(3);
    const events: SimEvent[] = [];
    if (!w.campaign) applyCommand(w, { kind: 'campaignStart' }, events);
    const camp = c(w);
    camp.chapter = 10;
    camp.step = 0;
    camp.queue = [];
    camp.seen = camp.seen.filter((s) => !s.startsWith('c10-'));
    camp.rest = null;
    expect(upcomingLossChapters(w)).toEqual([10, 11]);
    tick(w, events, (STORY.dayMs + STORY.breatherMs) / 1000);
    expect(camp.queue.some((s) => s.startsWith('c10-'))).toBe(false);
    expect(lossWaiting(w)).toBe(10);
    applyCommand(w, { kind: 'eduLossHold', chapter: 10, hold: 'released' }, events);
    expect(lossWaiting(w)).toBeNull();
    tick(w, events, (STORY.dayMs + STORY.breatherMs) / 1000);
    expect(camp.queue.some((s) => s.startsWith('c10-')) || camp.step > 0).toBe(true);
  });
  it('an age-5 save at the same point queues chapter 10 straight away', () => {
    const w = eduWorld(5);
    const events: SimEvent[] = [];
    if (!w.campaign) applyCommand(w, { kind: 'campaignStart' }, events);
    const camp = c(w);
    camp.chapter = 10;
    camp.step = 0;
    camp.queue = [];
    camp.seen = camp.seen.filter((s) => !s.startsWith('c10-'));
    camp.rest = null;
    tick(w, events, (STORY.dayMs + STORY.breatherMs) / 1000);
    expect(camp.queue.some((s) => s.startsWith('c10-')) || camp.step > 0).toBe(true);
  });
});

describe('R0740 (KIDS-72) Grown-up tips deck', () => {
  it('leads with the items the child is still learning, and changes with them', () => {
    const w = eduWorld(4);
    w.edu!.childName = 'Maya';
    const plain = tipsDeck(w);
    expect(plain.length).toBeGreaterThanOrEqual(3);
    w.edu!.items = {
      'letter:G': { seen: 4, firstTry: 1, lastMs: 0 },
      'letter:H': { seen: 3, firstTry: 1, lastMs: 0 },
    };
    expect(weakItems(w).letter).toEqual(['G', 'H']);
    const deck = tipsDeck(w);
    expect(deck[0]).toContain('Maya');
    expect(deck[0]).toContain('G and H');
    expect(deck.slice(0, 3)).not.toEqual(plain.slice(0, 3));
    w.edu!.items = { 'count:7': { seen: 3, firstTry: 0, lastMs: 0 } };
    expect(tipsDeck(w)[0]).toContain('7');
  });

  it('holds thirty tips with every slot filled', () => {
    const w = eduWorld(5);
    for (const id of Object.keys(w.edu!.games))
      (w.edu!.games as Record<string, boolean>)[id] = true;
    w.edu!.items = {
      'letter:A': { seen: 3, firstTry: 1, lastMs: 0 },
      'count:3': { seen: 3, firstTry: 1, lastMs: 0 },
      'colour:red': { seen: 3, firstTry: 1, lastMs: 0 },
      'shape:circle': { seen: 3, firstTry: 1, lastMs: 0 },
    };
    const deck = tipsDeck(w);
    expect(deck.length).toBe(30);
    for (const t of deck) expect(t).not.toMatch(/\{|\}/);
  });
});
