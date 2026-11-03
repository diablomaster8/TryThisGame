import { describe, expect, it } from 'vitest';
import { EDU_TEXT } from '../../src/config/strings';
import { EDU_TEXT_HE } from '../../src/config/strings-edu-he';
import { applyEduUiLanguage, uiDir } from '../../src/ui/edu-lang';

describe('R0739 Learning Grove interface language', () => {
  it('lays Hebrew over the child-facing text, right to left, and restores English', () => {
    const en = EDU_TEXT.play;
    const enReady = EDU_TEXT.recommended(5);
    applyEduUiLanguage('he');
    expect(EDU_TEXT.play).toBe(EDU_TEXT_HE.play);
    expect(EDU_TEXT.gameNames.colours).toBe(EDU_TEXT_HE.gameNames.colours);
    expect(EDU_TEXT.roundOf(2, 5)).toContain('2');
    expect(uiDir('he')).toBe('rtl');
    expect(EDU_TEXT.recommended(5)).toBe(enReady);
    applyEduUiLanguage('en');
    expect(EDU_TEXT.play).toBe(en);
    expect(EDU_TEXT.gameNames.colours).toBe('Colours');
    expect(uiDir('en')).toBe('ltr');
  });
  it('has Hebrew for every game the picker names, with no Latin letters', () => {
    for (const v of Object.values(EDU_TEXT_HE.gameNames)) expect(v).not.toMatch(/[A-Za-z]/);
    expect(Object.keys(EDU_TEXT_HE.gameNames)).toEqual(Object.keys(EDU_TEXT.gameNames));
  });
});
