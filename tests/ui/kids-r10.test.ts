import { describe, expect, it } from 'vitest';
import { applyCommand, createWorld } from '../../src/sim/world';
import { serialize } from '../../src/sim/save';
import { summarize } from '../../src/platform/storage';
import { firstNubbinOf } from '../../src/ui/kids-portrait';
import { holdDone } from '../../src/ui/kids-corner';
import { doBeatFor, doUnmapped } from '../../src/ui/do-plan';
import { tutorialShouldStart } from '../../src/ui/sprout-tutorial';

/** Lane E r10, kids UI: the pure parts of R0696, R0735 and R0679. */
describe('first Nubbin on a Learning Grove tile (R0696)', () => {
  it('shows the first hatched Nubbin, else the first egg, else none', () => {
    expect(firstNubbinOf([])).toBeNull();
    const egg = { stage: 'egg' as const, id: 'a' };
    const child = { stage: 'child' as const, id: 'b' };
    expect(firstNubbinOf([egg])).toBe(egg);
    expect(firstNubbinOf([egg, child])).toBe(child);
  });
});

describe('a reader age, 7 to 10 (R0735)', () => {
  it('sets a reader age and shows it on the slot summary', () => {
    const w = createWorld(1, 0);
    applyCommand(w, { kind: 'eduStart', age: 6, band: 'reader' }, []);
    expect(w.edu?.readerAge).toBeUndefined();
    expect(summarize(serialize(w, 0))?.eduReaderAge).toBeUndefined();
    applyCommand(w, { kind: 'eduSetReaderAge', age: 9 }, []);
    expect(w.edu?.readerAge).toBe(9);
    expect(summarize(serialize(w, 0))?.eduReaderAge).toBe(9);
    // The games' age band is untouched.
    expect(w.edu?.age).toBe(6);
    expect(w.edu?.band).toBe('reader');
  });

  it('ignores a sprout save and out-of-range ages', () => {
    const w = createWorld(1, 0);
    applyCommand(w, { kind: 'eduStart', age: 4 }, []);
    applyCommand(w, { kind: 'eduSetReaderAge', age: 8 }, []);
    expect(w.edu?.readerAge).toBeUndefined();
    const r = createWorld(1, 0);
    applyCommand(r, { kind: 'eduStart', age: 6, band: 'reader' }, []);
    applyCommand(r, { kind: 'eduSetReaderAge', age: 11 as 10 }, []);
    expect(r.edu?.readerAge).toBeUndefined();
  });
});

describe('grown-ups corner hold (R0679)', () => {
  it('opens only after the full hold', () => {
    expect(holdDone(null, 5000, 900)).toBe(false);
    expect(holdDone(1000, 1500, 900)).toBe(false);
    expect(holdDone(1000, 1900, 900)).toBe(true);
  });
});

describe('do beats from check strings (R0700)', () => {
  it('opens a 10-plum count in Hebrew for the course check', () => {
    expect(doBeatFor('lang:he:count:plums:10')).toEqual({
      kind: 'count',
      thing: 'plums',
      n: 10,
      lang: 'he',
    });
    expect(doBeatFor('edu:count:he:plums:5')).toEqual({
      kind: 'count',
      thing: 'plums',
      n: 5,
      lang: 'he',
    });
    expect(doBeatFor('edu:count:jars:3')).toMatchObject({ kind: 'count', n: 3, lang: null });
  });

  it('maps the other verbs to real interactions, the body ones to the honour button', () => {
    expect(doBeatFor('edu:sort:crayons:warm-cool')).toEqual({
      kind: 'sort',
      thing: 'crayons',
      groups: ['warm', 'cool'],
    });
    expect(doBeatFor('edu:sort:drawer-things:float-or-sink')).toMatchObject({
      groups: ['float', 'sink'],
    });
    expect(doBeatFor('edu:order:planting:dig-plant-water')).toEqual({
      kind: 'order',
      items: ['dig', 'plant', 'water'],
    });
    expect(doBeatFor('edu:paint:fence:blue')).toEqual({ kind: 'paint', colour: 'blue' });
    expect(doBeatFor('edu:draw:shape:circle')).toEqual({ kind: 'draw', thing: 'shape' });
    expect(doBeatFor('edu:find:colour:blue')).toEqual({
      kind: 'find',
      targets: ['blue'],
      colour: true,
    });
    expect(doBeatFor('edu:say:first-sound:b')).toMatchObject({ kind: 'say' });
    expect(doBeatFor('edu:clap:syllables:3')).toEqual({ kind: 'body', verb: 'clap' });
  });

  it('flags a verb no beat covers', () => {
    expect(doUnmapped('edu:juggle:balls:3')).toBe(true);
    expect(doUnmapped('edu:count:balls:3')).toBe(false);
    expect(doUnmapped('talk:someone')).toBe(false);
  });
});

describe('sprout tutorial (R0679)', () => {
  it('starts once, for a sprout, when nothing else is up and the voice can be heard', () => {
    const e = { band: 'sprout' as const, readAloud: true, tutorialSaid: false };
    expect(tutorialShouldStart(e, false, true)).toBe(true);
    expect(tutorialShouldStart(e, true, true)).toBe(false);
    expect(tutorialShouldStart(e, false, false)).toBe(false);
    expect(tutorialShouldStart({ ...e, tutorialSaid: true }, false, true)).toBe(false);
    expect(tutorialShouldStart({ ...e, band: 'reader' }, false, true)).toBe(false);
    expect(tutorialShouldStart(null, false, true)).toBe(false);
  });

  it('is marked said by its command', () => {
    const w = createWorld(1, 0);
    applyCommand(w, { kind: 'eduStart', age: 4 }, []);
    applyCommand(w, { kind: 'eduTutorialSaid' }, []);
    expect(w.edu?.tutorialSaid).toBe(true);
  });
});

describe("Nova's postcard faces (R0705)", () => {
  it('fills a stamp for each finished quest, and each hello is a course word', async () => {
    const { stampsFor, POSTCARD_FRIENDS } = await import('../../src/ui/postcard-faces');
    const { HEBREW_COURSE } = await import('../../src/content/lang-hebrew');
    const { JAPANESE_COURSE } = await import('../../src/content/lang-japanese');
    expect(stampsFor(['LH1', 'LH2', 'LH3'], (q) => q !== 'LH2')).toEqual([true, false, true]);
    for (const c of [HEBREW_COURSE, JAPANESE_COURSE]) {
      const hello = POSTCARD_FRIENDS[c.id]!.hello;
      expect(
        c.vocab.some((v) => v.audio === hello),
        hello,
      ).toBe(true);
    }
  });
});
