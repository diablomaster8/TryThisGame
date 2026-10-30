import { describe, expect, it } from 'vitest';
import { SILLY_NAME_PARTS } from '../../src/config/strings-fun-r7';
import { sillyName } from '../../src/ui/rename-dialog';

// R0357 (FUN-68): the silly-name lists are safe for children and fit the rename limit.
const NEVER =
  /\b(ass|butt|poo+p?|wee|fart|bum|stupid|dumb|idiot|ugly|fat|kill|dead|die|hate|sex|drunk|beer|wine|gun|bomb|devil|hell|damn|crap|pee|snot|booger|loser|freak)\b/i;

describe('R0357 silly names', () => {
  it('holds no unsafe words', () => {
    const words = [
      ...SILLY_NAME_PARTS.titles,
      ...SILLY_NAME_PARTS.names,
      ...SILLY_NAME_PARTS.pictureTitles.map(([, w]) => w),
      ...SILLY_NAME_PARTS.pictureNames.map(([, w]) => w),
    ];
    for (const w of words) {
      expect(w).not.toMatch(NEVER);
      expect(w).toMatch(/^[A-Z][a-z]+$/);
    }
  });

  it('makes a two-word name of at most 16 letters', () => {
    let i = 0;
    for (let k = 0; k < 200; k++) {
      const name = sillyName((n) => (i++ * 7) % n);
      expect(name.length).toBeLessThanOrEqual(16);
      expect(name.split(' ').length).toBeLessThanOrEqual(2);
    }
    expect(sillyName(() => 0)).toBe('Sir Wobbles');
  });
});
