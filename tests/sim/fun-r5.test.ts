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
    expect(after.some((l) => l.text.includes('right way up'))).toBe(true);
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

describe('R0310 sound words', () => {
  it('cuts a read-aloud line after "Creak!" and plays the creak there', async () => {
    const { soundChunks } = await import('../../src/ui/lesson');
    const c = soundChunks('Creak! It opens. Splash goes the frog.');
    expect(c[0]).toEqual({ text: 'Creak!', sound: 'creak' });
    expect(c[1]!.sound).toBe('splash');
    expect(c.map((x) => x.text).join('')).toBe('Creak! It opens. Splash goes the frog.');
    expect(soundChunks('No sounds here.')).toEqual([{ text: 'No sounds here.', sound: null }]);
  });
});

describe('R0311 pet lines', () => {
  it('twenty tickles show three texts, none with parentheses; sprout lines are short', async () => {
    const { petVoice } = await import('../../src/ui/fun-toasts');
    const { UI_TEXT } = await import('../../src/config/strings');
    const { PET_LINES } = await import('../../src/config/strings-fun-r5');
    const seen = new Set<string>();
    for (let i = 0; i < 20; i++) seen.add(petVoice(UI_TEXT.interacted('Kiki', 'tickle'), 'main')!);
    expect(seen.size).toBeGreaterThanOrEqual(3);
    for (const s of seen) expect(s).not.toMatch(/[()]/);
    expect(petVoice(UI_TEXT.interacted('Kiki', 'highFive'), 'main', 0)).toContain('Kiki');
    expect(petVoice(UI_TEXT.interactRefused('Kiki'), 'sprout', 0)).toBe('Kiki is shy. Not yet.');
    for (const set of Object.values(PET_LINES))
      for (const l of set.sprout) expect(l.split(/\s+/).length).toBeLessThanOrEqual(6);
  });
});

describe('R0313 Fern stone', () => {
  it('the cairn count is the chapter number, and a tap gives a line and notes the chapter', async () => {
    const { fernStones, fernStoneChapters } = await import('../../src/sim/fern-stone');
    const { world } = campaignWorld('fern');
    for (const ch of [1, 5, 12]) {
      c(world).chapter = ch;
      expect(fernStones(world)).toBe(ch);
    }
    c(world).chapter = 1;
    const ev: SimEvent[] = [];
    applyCommand(world, { kind: 'storyProp', prop: 'fern-stone' }, ev);
    const e = ev.find((x) => x.kind === 'fernStone');
    expect(e && e.kind === 'fernStone' && e.stones).toBe(1);
    expect(fernStoneChapters(world)).toBe(1);
  });

  it('the finale counts the twelve stones', async () => {
    const { sceneFor } = await import('../../src/sim/story-scenes');
    const { world } = campaignWorld('fern');
    const lines = sceneFor(world, 'c12-close')!.lines;
    expect(lines.some((l) => l.text.includes('twelve stones'))).toBe(true);
  });
});

describe('R0314 Byte stopwatches', () => {
  it('starts at four in chapter 5 and reaches seven after nine races', async () => {
    const { byteWatches, noteByteRace } = await import('../../src/sim/byte-watches');
    const { world } = campaignWorld('byte');
    c(world).chapter = 4;
    expect(byteWatches(c(world))).toBeNull();
    c(world).chapter = 5;
    expect(byteWatches(c(world))).toBe(4);
    for (let i = 0; i < 9; i++) noteByteRace(c(world));
    expect(byteWatches(c(world))).toBe(7);
    for (let i = 0; i < 60; i++) noteByteRace(c(world));
    expect(byteWatches(c(world))).toBe(12);
  });
});

describe('R0316 away diary', () => {
  it('a 2-hour capped catch-up gives two or more diary lines that differ by seed', async () => {
    const { createWorld } = await import('../../src/sim/world');
    const { catchUp } = await import('../../src/sim/offline');
    const { awayDiary } = await import('../../src/sim/away-diary');
    const diaries: string[][] = [];
    for (const seed of [11, 12, 13, 14]) {
      const { world } = campaignWorld('fern');
      c(world).chapter = 3;
      for (const n of world.nubbins) n.stage = 'child';
      world.settings.offlineAging = { mode: 'capped', capHours: 8, allowOfflineDepartures: false };
      const report = catchUp(world, 2 * 3_600_000, 0);
      const lines = awayDiary(report, world, 'main', seed);
      expect(lines.length).toBeGreaterThanOrEqual(2);
      for (const l of lines) expect(l).not.toMatch(/depart|gone|left us|\{/i);
      diaries.push(lines);
    }
    expect(new Set(diaries.map((d) => d.join('|'))).size).toBeGreaterThan(1);
    // Nothing to tell: one quiet line instead of "Everyone was quiet."
    const empty = createWorld(3, 0);
    const quiet = awayDiary(
      { elapsedMs: 1, simulatedMs: 0, mode: 'off', events: [] },
      empty,
      'sprout',
      1,
    );
    expect(quiet).toHaveLength(1);
  });
});

describe('R0318 tips', () => {
  it('has 60 tips, a third of each kind, with valid gates', async () => {
    const { TIPS } = await import('../../src/config/tips');
    expect(TIPS).toHaveLength(60);
    for (const k of ['joke', 'howto', 'lore'] as const)
      expect(TIPS.filter((t) => t.kind === k)).toHaveLength(20);
    for (const t of TIPS) {
      expect(t.text.length, t.text).toBeLessThanOrEqual(110);
      if (t.minChapter !== undefined) expect(t.minChapter).toBeGreaterThanOrEqual(1);
      if (t.minChapter !== undefined) expect(t.minChapter).toBeLessThanOrEqual(12);
      for (const b of t.bands ?? []) expect(['main', 'reader', 'sprout']).toContain(b);
      if (t.mature) expect(['teen', 'adult']).toContain(t.mature);
      if (t.bands?.includes('sprout')) expect(t.text.split(/\s+/).length).toBeLessThanOrEqual(12);
    }
  });

  it('never repeats a tip twice running and hides later chapters', async () => {
    const { nextTip, tipsFor } = await import('../../src/ui/tips');
    const { world } = campaignWorld('fern');
    c(world).chapter = 1;
    expect(tipsFor(world).every((t) => (t.minChapter ?? 0) <= 1)).toBe(true);
    let prev = '';
    for (let i = 0; i < 50; i++) {
      const t = nextTip(world, i);
      expect(t).not.toBe(prev);
      prev = t;
    }
  });
});

describe('R0319 goal chip', () => {
  it('ticks chapter 2 how-to steps off live, then falls back to the hint', async () => {
    const { noteHowTo, howToHint } = await import('../../src/ui/objective');
    const { world } = campaignWorld('fern');
    c(world).chapter = 2;
    noteHowTo(world, 'nothing');
    expect(howToHint(c(world))).toBe('Tap a tree to shake it (1/3)');
    noteHowTo(world, 'treeShaken');
    expect(howToHint(c(world))).toBe('✓ Tap the fruit (2/3)');
    noteHowTo(world, 'ate');
    expect(howToHint(c(world))).toBeNull();
    c(world).chapter = 1;
    noteHowTo(world, 'hatched');
    expect(howToHint(c(world))).toBe('✓ ✓ Tap the Nubbin, then Pet (3/3)');
  });
});

describe('R0322 tap toy', () => {
  it('the hiccup and sneeze beats show a face and change nothing else', async () => {
    const { createWorld } = await import('../../src/sim/world');
    const world = createWorld(5, 0);
    const n = world.nubbins[0]!;
    n.stage = 'child';
    const needs = JSON.stringify(n.needs);
    const stats = JSON.stringify(n.stats);
    const ev: SimEvent[] = [];
    applyCommand(world, { kind: 'tapToy', nubbinId: n.id, beat: 'hiccup' }, ev);
    applyCommand(world, { kind: 'tapToy', nubbinId: n.id, beat: 'sneeze' }, ev);
    const faces = ev
      .filter((e) => e.kind === 'reaction')
      .map((e) => e.kind === 'reaction' && e.reaction);
    expect(faces).toEqual(['surprised', 'dizzy']);
    expect(JSON.stringify(n.needs)).toBe(needs);
    expect(JSON.stringify(n.stats)).toBe(stats);
  });
});
