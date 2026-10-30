import { describe, expect, it } from 'vitest';
import { aOrAn, ordinal, plural } from '../../src/config/grammar';
import { DUNGEON_TEXT, SPECIES_LABELS, UI_TEXT } from '../../src/config/strings';
import { UI_FX_TEXT } from '../../src/config/strings-ui';

// R0341 (FUN-52): articles, plurals and ordinals in templated strings.

const aVowel = /\ba [aeiouAEIOU]/;

describe('string grammar', () => {
  it('helpers', () => {
    expect(aOrAn('Emberbud')).toBe('an Emberbud');
    expect(aOrAn('Nubbin')).toBe('a Nubbin');
    expect(aOrAn('unicorn')).toBe('a unicorn');
    expect(aOrAn('hour')).toBe('an hour');
    expect(plural(1, 'race')).toBe('1 race');
    expect(plural(0, 'race')).toBe('0 races');
    expect([1, 2, 3, 4, 11, 12, 13, 21, 22, 23, 101].map(ordinal)).toEqual([
      '1st',
      '2nd',
      '3rd',
      '4th',
      '11th',
      '12th',
      '13th',
      '21st',
      '22nd',
      '23rd',
      '101st',
    ]);
  });

  it('no species reads "a [vowel]" in the templates that take a species', () => {
    const t = UI_TEXT as unknown as Record<string, unknown>;
    const q = t.questText as Record<string, (n: number, p: string) => string>;
    for (const label of Object.values(SPECIES_LABELS)) {
      expect(q.photo!(1, label)).not.toMatch(aVowel);
      expect(DUNGEON_TEXT.wildScanned(label)).not.toMatch(aVowel);
      expect((t.speciesGrew as (a: string, b: string) => string)('Kiki', label)).not.toMatch(
        aVowel,
      );
    }
  });

  it('counts other than one take the plural; places read right', () => {
    const q = (UI_TEXT as unknown as { questText: Record<string, (n: number) => string> })
      .questText;
    for (const k of ['race', 'visit', 'craft', 'lesson', 'expedition', 'hollow']) {
      expect(q[k]!(1)).not.toMatch(/\b1 \w+s\b(?! in| the)/);
      expect(q[k]!(2)).toMatch(/s\b/);
    }
    expect(UI_FX_TEXT.ordinal(21)).toBe('21st');
    expect((UI_TEXT as unknown as { place: (n: number) => string }).place(22)).toBe('22nd place');
  });
});
