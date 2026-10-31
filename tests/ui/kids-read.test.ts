import { describe, expect, it } from 'vitest';
import { lineParts, parseGloss } from '../../src/ui/line-parts';
import { shouldAutoAdvance } from '../../src/ui/auto-advance';

/** Lane E r9: stacked language glosses and co-play chips (R0736, R0734), auto-advance (R0730). */
describe('lineParts', () => {
  it('stacks a Hebrew word over its romanisation and keeps the sentence whole', () => {
    const parts = lineParts('שָׁלוֹם (shalom, “hello”)! Your gate is very strong.', true);
    expect(parts[0]).toEqual({
      kind: 'gloss',
      native: 'שָׁלוֹם',
      roman: 'shalom',
      meaning: 'hello',
    });
    expect(parts[1]).toEqual({ kind: 'text', text: '! Your gate is very strong.' });
    expect(parts.some((p) => p.kind === 'prompt')).toBe(false);
  });

  it('keeps a question mark with the Hebrew and allows a gloss with no meaning', () => {
    const parts = lineParts('Ori asks: מַה שְׁלוֹמְךָ? (ma shlomkha?) Say it back.', true);
    const g = parts.find((p) => p.kind === 'gloss');
    expect(g).toMatchObject({ roman: 'ma shlomkha?', meaning: '' });
    expect(g && 'native' in g && g.native.endsWith('?')).toBe(true);
  });

  it('sets other brackets apart as grown-up prompts in the sprout band only', () => {
    const line = 'The fruit floats. (Count the fruit together. One, two, three.)';
    expect(lineParts(line, true)).toEqual([
      { kind: 'text', text: 'The fruit floats. ' },
      { kind: 'prompt', text: 'Count the fruit together. One, two, three.' },
    ]);
    expect(lineParts(line, false)).toEqual([{ kind: 'text', text: line }]);
  });

  it('parses glosses with plain or quoted meanings', () => {
    expect(parseGloss('emet, truth')).toEqual({ roman: 'emet', meaning: 'truth' });
    expect(parseGloss('beseder, “fine”')).toEqual({ roman: 'beseder', meaning: 'fine' });
    expect(parseGloss('ani')).toEqual({ roman: 'ani', meaning: '' });
  });
});

describe('shouldAutoAdvance', () => {
  const base = { enabled: true, open: true, blocked: false, choicesUp: false, sameLine: true };
  it('goes on only with the switch on, the box open and nothing waiting', () => {
    expect(shouldAutoAdvance(base)).toBe(true);
    expect(shouldAutoAdvance({ ...base, enabled: false })).toBe(false);
    expect(shouldAutoAdvance({ ...base, blocked: true })).toBe(false);
    expect(shouldAutoAdvance({ ...base, sameLine: false })).toBe(false);
  });
  it('stops at choices, ask cards and do beats', () => {
    expect(shouldAutoAdvance({ ...base, choicesUp: true })).toBe(false);
  });
});
