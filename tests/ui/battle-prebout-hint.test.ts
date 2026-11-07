import { describe, expect, it } from 'vitest';
import { BATTLE_SCREEN_TEXT } from '../../src/config/strings-battle';
import { playBlockedHint } from '../../src/ui/battle-prebout';

/**
 * BS-06 (bug sweep 2026-11-06): with no Nubbin in the party the pre-bout "Let's play!" button
 * was disabled and the reason lived only in a tooltip, which never shows on a phone.
 */
describe('pre-bout play button', () => {
  it('says why it is off when the party is empty, and nothing when it is on', () => {
    expect(playBlockedHint(0)).toBe(BATTLE_SCREEN_TEXT.partyNone);
    expect(playBlockedHint(1)).toBeNull();
    expect(playBlockedHint(3)).toBeNull();
  });
});
