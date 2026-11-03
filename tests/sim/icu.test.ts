import { describe, expect, it } from 'vitest';
import { fmt } from '../../src/config/icu';
import { MESSAGES_EN } from '../../src/config/messages-en';
import {
  DUNGEON_TEXT,
  EDU_STORY_TEXT,
  SLOT_TEXT,
  STORYLINE_TEXT,
  TEN_TEXT,
  UI_TEXT,
} from '../../src/config/strings';

describe('ICU messages (R0345)', () => {
  it('formats plurals, select and numbers', () => {
    expect(fmt('{n, plural, one {# cat} other {# cats}}', { n: 1 })).toBe('1 cat');
    expect(fmt('{n, plural, one {# cat} other {# cats}}', { n: 1234 })).toBe('1,234 cats');
    expect(fmt('{g, select, f {She} other {They}} sat', { g: 'f' })).toBe('She sat');
    expect(fmt('{g, select, f {She} other {They}} sat', { g: 'x' })).toBe('They sat');
    expect(() => fmt('{missing}', {})).toThrow();
  });

  it('keeps the strings the old template functions gave', () => {
    expect(UI_TEXT.rebirths(1)).toBe('1 rebirth');
    expect(UI_TEXT.rebirths(3)).toBe('3 rebirths');
    expect(UI_TEXT.called(0)).toBe('Nobody came.');
    expect(UI_TEXT.called(1)).toBe('One came running.');
    expect(UI_TEXT.called(4)).toBe('4 came running.');
    expect(UI_TEXT.memorialRebirths(1)).toBe('Reborn once');
    expect(UI_TEXT.memorialRebirths(2)).toBe('Reborn 2 times');
    expect(EDU_STORY_TEXT.lessonCount(1)).toBe('1 lesson');
    expect(TEN_TEXT.skillCost(2)).toBe('2 pts');
    expect(SLOT_TEXT.nubbins(1)).toBe('1 Nubbin');
    expect(SLOT_TEXT.ago(0)).toBe('today');
    expect(SLOT_TEXT.ago(-2)).toBe('today');
    expect(SLOT_TEXT.ago(1)).toBe('yesterday');
    expect(SLOT_TEXT.ago(5)).toBe('5 days ago');
    expect(STORYLINE_TEXT.pathsHelp(1)).toBe('One ending.');
    expect(STORYLINE_TEXT.pathsHelp(3)).toBe('3 endings. Here is how to reach each one.');
  });

  it('keeps the Hollow best line', () => {
    expect(DUNGEON_TEXT.best(4, 0)).toBe('Never been down.');
    expect(DUNGEON_TEXT.best(4, 1)).toBe('Deepest floor 4 · 1 trip');
    expect(DUNGEON_TEXT.best(4, 3)).toBe('Deepest floor 4 · 3 trips');
  });

  it('every catalogue message formats with plain arguments', () => {
    for (const [k, m] of Object.entries(MESSAGES_EN))
      expect(() => fmt(m, { n: 2, days: 2, runs: 2, best: 3 }), k).not.toThrow();
  });
});
