import { describe, expect, it } from 'vitest';
import { countAloud, optionSay, replySpeech, roundSpeech, spoken } from '../../src/ui/edu-voice';
import { makeRound } from '../../src/minigames/edu/games';
import { EDU_GAMES } from '../../src/config/edu';
import { EDU_TEXT } from '../../src/config/strings';
import { Rng } from '../../src/sim/rng';

/** R0674 (KIDS-02): the minigames read aloud in the sprout band, and only on a press for readers. */
describe('Learning Grove minigame voice (R0674)', () => {
  it('says counting emoji as words and drops quote marks and star rows', () => {
    expect(spoken('How many 🍎?')).toBe('How many apples?');
    expect(spoken('Who says "moo"?')).toBe('Who says moo?');
    expect(spoken(`Yes! 2 and 3 make 5. ${EDU_TEXT.stars(3)}`)).toBe('Yes! 2 and 3 make 5.');
  });

  it('a sprout round says its prompt and its reply; a reader round says nothing', () => {
    const rng = Rng.fromSeed(3);
    for (const game of EDU_GAMES) {
      const r = makeRound(game, 4, rng);
      const said = [
        ...roundSpeech(r, 'sprout', true),
        ...replySpeech(EDU_TEXT.tryAgain, 'sprout', true),
      ];
      expect(said.length, game).toBeGreaterThanOrEqual(2);
      expect(said[0], game).not.toMatch(/\p{Extended_Pictographic}/u);
      expect(roundSpeech(r, 'reader', true)).toHaveLength(0);
      expect(replySpeech(EDU_TEXT.tryAgain, 'reader', true)).toHaveLength(0);
      expect(roundSpeech(r, 'sprout', false)).toHaveLength(0);
      for (const o of r.options) expect(optionSay(o), game).toBeTruthy();
    }
  });

  it('counts on fingers', () => {
    expect(countAloud(3)).toBe('one, two, three');
    expect(optionSay({ kind: 'letter', letter: 'B' })).toBe('the letter B');
    expect(optionSay({ kind: 'count', icon: '🍎', n: 2, label: '2' })).toBe('one, two');
  });
});

describe('sprout choices (R0677)', () => {
  it('reads the set out with numbers and falls back to a number icon', async () => {
    const { choicesSpeech, choiceIcon } = await import('../../src/ui/sprout-choices');
    expect(choicesSpeech(['Smile and wave', 'Run away'])).toBe(
      'You can say: one, Smile and wave. two, Run away.',
    );
    expect(choiceIcon('🪨', 0)).toBe('🪨');
    expect(choiceIcon(undefined, 1)).toBe('2️⃣');
  });

  it('chapter 1 sprout choices all carry an icon', async () => {
    const { EDU_CAMPAIGN_1_SPROUT } = await import('../../src/content/edu-campaign-1-sprout');
    for (const s of EDU_CAMPAIGN_1_SPROUT.scenes.filter((x) => x.of.startsWith('c1-')))
      for (const c of s.choices ?? []) expect(c.icon, `${s.id} ${c.id}`).toBeTruthy();
  });
});
