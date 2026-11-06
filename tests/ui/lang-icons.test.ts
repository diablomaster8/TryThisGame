import { describe, expect, it } from 'vitest';
import { HEBREW_COURSE } from '../../src/content/lang-hebrew';
import { JAPANESE_COURSE } from '../../src/content/lang-japanese';
import { WORD_ICONS } from '../../src/ui/lang-icons';

describe('R0706 picture dictionary', () => {
  it('every band-both word has its own icon', () => {
    for (const c of [HEBREW_COURSE, JAPANESE_COURSE])
      for (const w of c.vocab.filter((v) => v.band === 'both'))
        expect(WORD_ICONS[w.id], w.id).toBeTruthy();
  });
});
