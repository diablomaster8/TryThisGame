import { describe, expect, it } from 'vitest';
import { aloneWarning, childPrompts, coPlayMode, spokenLine } from '../../src/ui/co-play';

const LINE = '(Say the name on the letter. It’s your name!)';

describe('R0697 playing alone', () => {
  it('defaults to alone for ages 3 and 4, together above, and obeys the grown-up', () => {
    expect(coPlayMode({ age: 3 })).toBe('alone');
    expect(coPlayMode({ age: 4 })).toBe('alone');
    expect(coPlayMode({ age: 5 })).toBe('together');
    expect(coPlayMode({ age: 3, coPlay: 'together' })).toBe('together');
    expect(coPlayMode({ age: 6, coPlay: 'alone' })).toBe('alone');
  });

  it('speaks each bracketed prompt alone: childSay first, else the bracket as written', () => {
    expect(childPrompts(LINE)).toEqual(['Say the name on the letter. It’s your name!']);
    expect(spokenLine(LINE, 'alone')).toBe('Say the name on the letter. It’s your name!');
    expect(spokenLine(LINE, 'alone', ['Say your name out loud!'])).toBe('Say your name out loud!');
    expect(spokenLine('Hello. (Wave!) Bye.', 'alone')).toBe('Hello. Wave! Bye.');
    expect(spokenLine('(Count to three)', 'alone')).toBe('Count to three.');
  });

  it('leaves the line for the speaker to strip when together', () => {
    expect(spokenLine(LINE, 'together', ['x'])).toBe(LINE);
  });

  it('warns about prompts aimed at the grown-up unless childSay covers them', () => {
    expect(aloneWarning('(Ask a grown-up to help.)')).toMatch(/grown-up/);
    expect(aloneWarning('(Ask a grown-up to help.)', ['Ask for help!'])).toBeNull();
    expect(aloneWarning('(Wave!)')).toBeNull();
  });
});
