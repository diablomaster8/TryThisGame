import { describe, expect, it } from 'vitest';
import * as EDU from '../../src/content/edu';
import { HEBREW_COURSE } from '../../src/content/lang-hebrew';
import { JAPANESE_COURSE } from '../../src/content/lang-japanese';
import { clipFor, RECORDED } from '../../src/platform/lang-audio';
import {
  gestureFor,
  isLangQuestCode,
  langQuestIds,
  langWordsIn,
  TRACE_TARGETS,
  wordLearned,
} from '../../src/sim/lang';
import { hasScript, japaneseWords, scriptRuns } from '../../src/sim/lang-text';
import { deserialize, serialize } from '../../src/sim/save';
import { sideActable } from '../../src/sim/side-stories';
import { registerEduContent, sceneById, sideStory } from '../../src/sim/story-scenes';
import type { SimEvent, World } from '../../src/sim/types';
import { applyCommand } from '../../src/sim/world';
import { KANA_STROKES } from '../../src/ui/kana-strokes';
import { withoutScript } from '../../src/ui/lang-dom';
import { inkCovered, resample, rightStart, strokeMet } from '../../src/ui/trace-check';
import { c, campaignWorld, playScenes, tick } from './campaign-driver';

/**
 * CV3, the language questlines: script runs for bidi and Japanese line breaking, words
 * found as whole words, Learning Grove-only gating, a full course played through, word
 * tracking and reactions, clips for every word, the tracing checks, and the save.
 */
registerEduContent(EDU);

function eduWorld(): { world: World; events: SimEvent[] } {
  const r = campaignWorld();
  applyCommand(r.world, { kind: 'eduStart', age: 4, band: 'sprout' }, r.events);
  return r;
}

/** Play scenes and meet every language step until `until` holds or time runs out. */
function playCourse(world: World, events: SimEvent[], until: () => boolean): void {
  for (let i = 0; i < 4000 && !until(); i++) {
    playScenes(world, events);
    for (const id of langQuestIds()) {
      const st = c(world).fun[id];
      if (!st || !sideActable(world, c(world), id)) continue;
      const check = sideStory(id)!.steps[st.step]!.check;
      applyCommand(
        world,
        TRACE_TARGETS[check] ? { kind: 'langTraced', quest: id } : { kind: 'sideAct', story: id },
        events,
      );
    }
    tick(world, events, 5);
  }
}

describe('script runs (CV3)', () => {
  it('isolates Hebrew with the punctuation that belongs to it', () => {
    const line = 'To ask, I say מָה שְׁלוֹמְךָ? (ma shlomkha?) to a boy.';
    const runs = scriptRuns(line);
    expect(runs.map((r) => r.text).join('')).toBe(line);
    const he = runs.filter((r) => r.kind === 'he');
    expect(he).toEqual([{ kind: 'he', text: 'מָה שְׁלוֹמְךָ?' }]);
  });

  it('keeps a line that opens with Hebrew as separate runs', () => {
    const runs = scriptRuns('שָׁלוֹם (shalom, “hello”)! Sorry.');
    expect(runs[0]).toEqual({ kind: 'he', text: 'שָׁלוֹם' });
    expect(runs[1]!.kind).toBe('latin');
  });

  it('splits Japanese runs into whole words at the learner spaces', () => {
    const runs = scriptRuns('She says わたしは はな です, slowly.');
    const ja = runs.find((r) => r.kind === 'ja')!;
    expect(ja.text).toBe('わたしは はな です');
    expect(japaneseWords(ja.text).filter((w) => w.trim())).toEqual(['わたしは', 'はな', 'です']);
  });

  it('finds course words only as whole words, phrases included', () => {
    expect(langWordsIn('Ori: בֹּקֶר טוֹב!')).toContain('he-boker-tov');
    expect(langWordsIn('Hana says はな.')).toContain('ja-hana');
    // は inside こんにちは is not a word of its own.
    expect(langWordsIn('こんにちは')).not.toContain('ja-hana');
    expect(langWordsIn('No script here.')).toEqual([]);
    expect(hasScript('plain')).toBe(false);
  });

  it('never hands Hebrew or Japanese to the synthetic voice', () => {
    const said = withoutScript('Say שָׁלוֹם to Ori, and こんにちは to Hana.');
    expect(hasScript(said)).toBe(false);
    expect(said).toContain('Say');
  });
});

describe('course words and clips (CV3)', () => {
  const vocab = [...HEBREW_COURSE.vocab, ...JAPANESE_COURSE.vocab];

  it('every word has a clip id and a clip to play', () => {
    for (const w of vocab) {
      expect(w.audio, w.id).toBe(`${w.lang}/${w.id.slice(3)}`);
      expect(clipFor(w.audio).url, w.id).toMatch(/audio\/lang\//);
    }
    const ids = new Set(vocab.map((w) => w.audio));
    for (const r of RECORDED) expect(ids.has(r), r).toBe(true);
  });

  it('every word is findable in its own native spelling', () => {
    for (const w of vocab) {
      const native = w.native.replace('___', 'はな').split(' / ')[0]!;
      expect(langWordsIn(native), w.id).toContain(w.id);
    }
  });

  it('shalom waves and konnichiwa bows', () => {
    expect(gestureFor('he-shalom')).toBe('wave');
    expect(gestureFor('ja-konnichiwa')).toBe('bow');
  });
});

describe('language quests (CV3)', () => {
  it('are registered from the edu chunk with their scenes', () => {
    expect(langQuestIds()).toEqual([
      ...['lh1', 'lh2', 'lh3', 'lh4', 'lh5', 'lh6'],
      ...['lj1', 'lj2', 'lj3', 'lj4', 'lj5', 'lj6'],
    ]);
    for (const id of langQuestIds()) {
      expect(isLangQuestCode(sideStory(id)!.code)).toBe(true);
      expect(sceneById(sideStory(id)!.steps[0]!.scene.id), id).toBeDefined();
    }
  });

  it('never open in the main game, even with a course switched on', () => {
    const { world, events } = campaignWorld();
    applyCommand(world, { kind: 'langStart', course: 'hebrew' }, events);
    tick(world, events, 600);
    for (const id of langQuestIds()) expect(c(world).fun[id], id).toBeUndefined();
  });

  it('wait for Nova’s postcard in the Learning Grove', () => {
    const { world, events } = eduWorld();
    tick(world, events, 600);
    for (const id of langQuestIds()) expect(c(world).fun[id], id).toBeUndefined();
    applyCommand(world, { kind: 'langStart', course: 'japanese' }, events);
    playCourse(world, events, () => c(world).fun.lj1 !== undefined);
    // Its steps are met by its own scenes, so it may already be through (bug 8).
    expect(c(world).fun.lj1?.status).toMatch(/open|done/);
    expect(c(world).fun.lh1).toBeUndefined();
  });

  it('a fresh Learning Grove meets Hana before Chapter 1, and her scenes meet their steps', () => {
    const { world, events } = eduWorld();
    applyCommand(world, { kind: 'langStart', course: 'japanese' }, events);
    const first = sideStory('lj1')!.steps[0]!;
    expect(c(world).queue.slice(0, 2)).toEqual([first.scene.id, first.done!.id]);
    // Chapter 1's opening is out of the way, not behind her: it comes back afterwards
    // (review 2026-10-24, item 5: "Meet Ori" replayed the whole opening first).
    expect(c(world).queue).not.toContain('c1-letter');
    // No Journal "Do it": playing the scenes alone carries LJ1 to its end.
    for (let i = 0; i < 200 && c(world).fun.lj1?.status !== 'done'; i++) {
      playScenes(world, events);
      tick(world, events, 2);
    }
    expect(c(world).fun.lj1?.status).toBe('done');
    expect(c(world).seen).toContain(first.scene.id);
    expect(c(world).seen.indexOf(first.scene.id)).toBeLessThan(
      c(world).seen.indexOf('c1-letter') === -1 ? Infinity : c(world).seen.indexOf('c1-letter'),
    );
    // The opening is queued again once she has gone.
    for (let i = 0; i < 100 && !c(world).seen.includes('c1-letter'); i++) {
      playScenes(world, events);
      tick(world, events, 2);
    }
    expect(c(world).seen).toContain('c1-letter');
  });

  it('a tracing step still waits for the tracing game', () => {
    const { world, events } = eduWorld();
    applyCommand(world, { kind: 'langStart', course: 'japanese' }, events);
    const lj2 = sideStory('lj2')!;
    const traceStep = lj2.steps.findIndex((s) => TRACE_TARGETS[s.check]);
    expect(traceStep).toBeGreaterThanOrEqual(0);
    // Scenes only, never the tracing game or a Journal "Do it".
    const atTrace = () => c(world).fun.lj2?.step === traceStep;
    for (let i = 0; i < 3000 && !(atTrace() && c(world).fun.lj2?.stage === 'check'); i++) {
      playScenes(world, events);
      tick(world, events, 30);
    }
    tick(world, events, 30);
    playScenes(world, events);
    expect(c(world).fun.lj2?.step).toBe(traceStep);
    expect(c(world).fun.lj2?.stage).toBe('check');
  });

  it('play a whole course in order, with words heard and the tracing words used', () => {
    const { world, events } = eduWorld();
    applyCommand(world, { kind: 'langStart', course: 'hebrew' }, events);
    playCourse(world, events, () => c(world).fun.lh6?.status === 'done');
    for (const q of HEBREW_COURSE.quests) {
      const id = q.toLowerCase();
      expect(c(world).fun[id]?.status, id).toBe('done');
      expect(c(world).flags[`${id}Done`], id).toBe(true);
    }
    const words = world.edu!.words;
    expect(words['he-shalom']!.heard).toBeGreaterThan(0);
    expect(words['he-ori']!.used).toBeGreaterThan(0);
    expect(wordLearned(world, 'he-shalom')).toBe(true);
  });

  it('a learned word makes nearby Nubbins react', () => {
    const { world, events } = eduWorld();
    tick(world, events, 400);
    const n = world.nubbins.find((x) => x.stage === 'child' || x.stage === 'adult');
    expect(n, 'a hatched Nubbin').toBeDefined();
    n!.pos = { ...world.keeper.pos };
    const out: SimEvent[] = [];
    applyCommand(world, { kind: 'langWord', word: 'he-shalom', how: 'used' }, out);
    applyCommand(world, { kind: 'langWord', word: 'he-shalom', how: 'heard' }, out);
    expect(out.some((e) => e.kind === 'langReact' && e.gesture === 'wave')).toBe(true);
  });

  it('word counts and started courses survive a save', () => {
    const { world, events } = eduWorld();
    applyCommand(world, { kind: 'langStart', course: 'hebrew' }, events);
    applyCommand(world, { kind: 'langWord', word: 'he-toda', how: 'heard' }, events);
    const back = deserialize(serialize(world, 0)).world;
    expect(back.edu!.courses.hebrew).toBe(true);
    expect(back.edu!.words['he-toda']).toEqual({ heard: 1, used: 0 });
  });

  it('fills the language fields into an older edu save', () => {
    const { world } = eduWorld();
    const old = JSON.parse(serialize(world, 0)) as { world: { edu: Record<string, unknown> } };
    delete old.world.edu.words;
    delete old.world.edu.courses;
    const back = deserialize(JSON.stringify(old)).world;
    expect(back.edu!.words).toEqual({});
    expect(back.edu!.courses).toEqual({ hebrew: false, japanese: false });
  });
});

describe('tracing (CV3)', () => {
  it('every traced kana has its strokes, in school counts', () => {
    const counts: Record<string, number> = { か: 3, き: 4, く: 1, け: 3, こ: 2, は: 3, な: 4 };
    for (const t of Object.values(TRACE_TARGETS).filter((t) => t.lang === 'ja'))
      for (const g of t.glyphs) expect(KANA_STROKES[g]?.length, g).toBe(counts[g]);
  });

  it('a stroke counts only in its own direction', () => {
    const stroke = KANA_STROKES['く']![0]!;
    expect(strokeMet(stroke, resample(stroke, 2), 14, 0.7)).toBe(true);
    expect(strokeMet(stroke, resample([...stroke].reverse(), 2), 14, 0.7)).toBe(false);
    expect(
      strokeMet(
        stroke,
        [
          { x: 0, y: 0 },
          { x: 5, y: 5 },
        ],
        14,
        0.7,
      ),
    ).toBe(false);
  });

  it('a Hebrew letter counts once enough ink is covered, and starts on the right', () => {
    const ink = Array.from({ length: 20 }, (_, i) => ({ x: 20 + i * 3, y: 50 }));
    expect(rightStart(ink)).toEqual({ x: 77, y: 50 });
    expect(
      inkCovered(
        ink,
        [
          [
            { x: 80, y: 50 },
            { x: 50, y: 50 },
          ],
        ],
        4,
      ),
    ).toBeGreaterThan(0.4);
    expect(
      inkCovered(
        ink,
        [
          [
            { x: 80, y: 50 },
            { x: 15, y: 50 },
          ],
        ],
        4,
      ),
    ).toBe(1);
  });
});
